'use strict';
import React, { Component } from 'react';
import { StyleSheet, Image, ScrollView, Text, View, Dimensions } from 'react-native';
import firebase from 'firebase';
import Canvas, { Image as CanvasImage, Path2D, ImageData } from 'react-native-canvas';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

// Draw each room label; simplify code
const DoctorLabels = ({doc, color}) => {
    return (
        <View style={[styles.labelCard, {borderLeftColor: color}]}>
            <Text style={styles.docLabel}>{doc}</Text>
        </View>  
    );
}

class ShowMap extends Component {

    constructor(props) {
        super(props);
        // email = phoneNumber + @email.com
        this.state = {
            patientName: '', queueNum: '', queueNotFound: true,
        };
        this.realTimeInterval = 0;
    }

    componentWillMount() {
        // locate current user's phone num
        let user = firebase.auth().currentUser;
        let phoneNum = user.email.split("@")[0];
        // this keyword would not work under callback fxn
        var self = this;

        firebase.database().ref('/WaitingQueue').on("value", function (snapshot) {
            let phoneNumExtract = '';
            let found = false;
            snapshot.forEach((data) => {
                phoneNumExtract = data.key.split('-')[1]
                if (phoneNumExtract == phoneNum.toString()) {
                    found = true;
                    console.log(data.key + ': ' + data.val())
                    self.setState({ queueNum: data.val(), queueNotFound: false })
                }
            })
            if (!found) {
                self.setState({ queueNotFound: true })
            }
        })

        // get today's date
        let now = new Date();
        let keyMonthDateYear = this.formattedDate(now);

        // if the patient is still inside a room, or the whole visit is not over, clock ticking
        // even if patient closes the app and reopens again, clock will work correctly
        this.realTimeInterval = setInterval(() => {
            firebase.database().ref('/PatientVisitsByDates/' + phoneNum + '/' + keyMonthDateYear)
                .once('value', function (snapshot) {
                    snapshot.forEach((data) => {
                        if (data.val().inSession == true) {
                            let start = data.val().startTime;
                            let now = Date.now();
                            data.ref.update({
                                endTime: now,
                                diffTime: now - start
                            })
                        }
                    });
                });
        }, 1000);

        // search for the staff obj that has the same phoneNum as currentUser has
        firebase.database().ref(`/Patients`).orderByChild("patientPhoneNumber").equalTo(phoneNum)
            .once('value', function (snapshot) {
                let firstNameVal = '';
                snapshot.forEach(function (data) {
                    firstNameVal = data.val().firstName;
                });
                console.log("line 27=" + firstNameVal)
                self.setState({ patientName: firstNameVal });
                // running console.log(patientName) here would cause crash
            });

    }

    formattedDate(now) {
        var month = now.getMonth() + 1;
        var formattedMonth = month < 10 ? '0' + month : month;
        var date = now.getDate();
        var formattedDate = date < 10 ? '0' + date : date;
        // outputs "2019-05-10"
        return now.getFullYear() + '-' + formattedMonth + '-' + formattedDate;
    }

    renderPositionText() {
        const { queueNum } = this.state;
        if (this.state.queueNotFound) {
            return (
                <Text style={styles.topText}>You are not registered in the waiting list.</Text>
            )
        }
        else {
            return (
                <Text style={styles.topText}>Number of people ahead of you:
                <Text style={{ fontSize: wp('5%') }}>{queueNum}</Text></Text>
            )
        }
    }

    componentWillUnmount() {
        clearInterval(this.realTimeInterval);
    }


    handleCanvasMap = canvas => {
        let mapDict = {
            femaleWaitingRoom: [[wp('41%'), hp('20%')],[wp('44%'), hp('22%')]],
            CTRoom: [[wp('3%'), hp('41%')], [wp('12%'), hp('40%')]],
            exam1: [[wp('57%'), hp('31%')], [wp('59%'), hp('31%')]]
        };
        let doctorPinUrl = {
            "111" : "https://i.imgur.com/sn2hdaf.png",
            "222" : "https://i.imgur.com/WZVGjfM.png"
        }

        const context = canvas.getContext('2d');
        canvas.height = hp('50%');
        canvas.width = Dimensions.get('window').width - wp('4%');
        context.fillStyle = "white";

        let background = new CanvasImage(canvas);
        background.src = "https://i.imgur.com/1FpcLGF.png";
        background.addEventListener('load', () => {
            context.drawImage(background, 0, 0, canvas.width, canvas.height);
        });

        let self = this;
        firebase.database().ref('/DoctorLocation/').on('value', function (snapshot) {
            context.clearRect(0, 0, canvas.width, canvas.height);
            snapshot.forEach( (eachDoctor) => {
                let room = eachDoctor.val().room;
                self.drawPin(canvas, context, doctorPinUrl[eachDoctor.key], mapDict[room][0][0], mapDict[room][0][1], wp('5%'), hp('5%'));

                let firstElement = mapDict[room].shift();
                mapDict[room].push(firstElement);
            });
            context.drawImage(background, 0, 0, canvas.width, canvas.height); 
        });
    };

    drawPin(canvas, context, url, x, y, w, h) {
        let pin = new CanvasImage(canvas);
        pin.src = url;
        pin.addEventListener('load', () => {
            context.drawImage(pin, x, y, w, h);
        });
    };

    render() {
        return (
            <ScrollView minimumZoomScale={1} maximumZoomScale={3} bouncesZoom={false} contentContainerStyle={styles.container} scrollEnabled={false}> 
                <View style={styles.queue}>
                    {this.renderPositionText()}
                </View>
                {/* <Image source={require("../assets/Component.png")} 
                style={styles.image}
                resizeMode="contain">
                </Image> */}
                <View style={{paddingHorizontal: wp('2%')}}>
                    <Canvas ref={this.handleCanvasMap} />
                </View>
                <View style={styles.labelRow}>
                    <View style={styles.labelColumn}>
                        <DoctorLabels doc={'Dr. Roa'} color={'#30d158'}/>
                        <DoctorLabels doc={'Dr. Kuo'} color={'#bf58f2'}/>
                        <DoctorLabels />
                    </View>
                </View>
            </ScrollView>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#ffffff'
    },
    image: {
        flex: 1,
        width: Dimensions.get('window').width,
        height: undefined,
    },
    queue: {
        color: '#3DCEBF',
        backgroundColor: '#fcfcfc',
        borderRadius: 20,
        borderColor: '#3DCEBF',
        borderWidth: 1,
        margin: wp('6%'),
        padding: wp('4.0%'),
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 5,
        },
        shadowOpacity: 0.36,
        shadowRadius: 3,
        elevation: 7,
    },
    topText: {
        color: '#3DCEBF',
        textAlign: 'center',
        fontSize: wp('5%'),
        letterSpacing: 0.2,
        fontFamily: 'Rubik-Medium'
    },
    labelRow: {
        bottom: 0,
        height: hp('12%'),
        width: wp('100%'),
        backgroundColor: '#fff',
        position: 'absolute',
        flexDirection: 'row',
    },
    labelColumn: {
        flexDirection: 'column',
        width: wp('80%')
    },
    labelCard: {
        borderColor: '#fff',
        borderBottomColor: '#dddddd',
        borderTopColor: '#dddddd',
        borderWidth: 0.5,
        borderLeftWidth: wp('3%'),
        borderLeftColor: '#0060a4',
        fontFamily: 'Poppins-Regular',
        paddingVertical: hp('1%')
    },
    docLabel: {
        fontSize: hp('1.6%'),
        paddingLeft: wp('4%')
    }
});

export default ShowMap;