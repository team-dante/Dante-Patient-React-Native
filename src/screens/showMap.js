'use strict';
import React, { Component } from 'react';
import { StyleSheet, Image, ScrollView, Text, View, Dimensions } from 'react-native';
import firebase from 'firebase';
import Canvas, { Image as CanvasImage, Path2D, ImageData } from 'react-native-canvas';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';

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
            snapshot.forEach((data) => {
                if (data.key == phoneNum.toString()) {
                    console.log(data.key + ': ' + data.val())
                    self.setState({ queueNum: data.val(), queueNotFound: false })
                    if (data.val() == -1)
                        self.setState({ queueNotFound: true })
                }
            })
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
                <Text style={{fontSize: wp('5%')}}>{queueNum}</Text></Text>
            )
        }
    }

    componentWillUnmount() {
        clearInterval(this.realTimeInterval);
    }

    Shape(x, y, width, height, fillColor, text, textX, textY) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.fillColor = fillColor;
        this.text = text;
        this.textX = textX;
        this.textY = textY;
    }

    Doctor(x, y, radius, sAngle, eAngle, name, textX, textY, color) {
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.sAngle = sAngle;
        this.eAngle = eAngle;
        this.name = name;
        this.textX = textX;
        this.textY = textY;
        this.color = color;
    }

    handleCanvas = (canvas) => {
        // render the entire canvas with the width of the device and the height of the device 
        // fill with white color
        const context = canvas.getContext('2d');
        canvas.height = hp('50%');
        canvas.width = Dimensions.get('window').width;
        context.fillStyle = '#f1f1f1';
        context.fillRect(0, 0, canvas.width, canvas.height);

        // render 4 rooms
        let shapeArr = [];
        let roomColors = ['#4B77BE', '#48929B', '#317589', '#1F4788', '#89C4F4', '#4B77BE', '#19B5FE', '#5D8CAE', '#044F67']
        shapeArr.push(new this.Shape(0, 0, wp('20%'), wp('30%'), roomColors[0], '', wp('1.5%'), wp('5%')))
        shapeArr.push(new this.Shape(wp('20%'), 0, wp('30%'), wp('30%'), roomColors[1], 'Exam Room', wp('21.5%'), wp('5%')))
        shapeArr.push(new this.Shape(wp('50%'), 0, wp('15%'), wp('30%'), roomColors[2], '', wp('51.5%'), wp('5%')))
        shapeArr.push(new this.Shape(wp('65%'), 0, wp('35%'), wp('40%'), roomColors[3], 'Treatment Room 1', wp('66.5%'), wp('5%')))
        shapeArr.push(new this.Shape(wp('65%'), wp('40%'), wp('35%'), wp('40%'), roomColors[4], 'Treatment Room 2', wp('66.5%'), wp('45%')))
        shapeArr.push(new this.Shape(wp('65%'), wp('80%'), wp('35%'), wp('28%'), roomColors[5], 'CT Room', wp('66.5%'), wp('85%')))
        
        shapeArr.push(new this.Shape(0, wp('90%'), wp('60%'), wp('18%'), roomColors[6], '', wp('0.5%'), wp('95%')))
        shapeArr.push(new this.Shape(0, wp('40%'), wp('15%'), wp('50%'), roomColors[7], '', wp('0.5%'), wp('45%')))

        // render room A (render shorter height rect and then render larger height rect)
        shapeArr.push(new this.Shape(wp('35%'), wp('40%'), wp('20%'), wp('35%'), roomColors[8], '', wp('35.5%'), wp('45%')))
        shapeArr.push(new this.Shape(wp('25%'), wp('40%'), wp('10%'), wp('40%'), roomColors[8], 'Waiting Room', wp('25.5%'), wp('45%')))
        

        for (let i in shapeArr) {
            context.fillStyle = shapeArr[i].fillColor
            context.fillRect(shapeArr[i].x, shapeArr[i].y, shapeArr[i].width, shapeArr[i].height)
            context.font = '16px Helvetica';
            context.fillStyle = "white";
            context.fillText(shapeArr[i].text, shapeArr[i].textX, shapeArr[i].textY)
        }

        // extract doctor's location
        firebase.database().ref('/DoctorLocation/').on('value', function (snapshot) {
            let doctorJson = []
            snapshot.forEach((eachDoctor) => {
                doctorJson.push(eachDoctor.val())
            })
            let randomizedPosition = [[wp('12%'), wp('15%')], [wp('18%'), wp('22%')], [wp('22%'), wp('22%')]]
            // reset all small circles
            for (let i in shapeArr) {
                context.fillStyle = shapeArr[i].fillColor
                context.fillRect(shapeArr[i].x, shapeArr[i].y, shapeArr[i].width, shapeArr[i].height)
                context.font = '16px Helvetica';
                context.fillStyle = "white";
                context.fillText(shapeArr[i].text, shapeArr[i].textX, shapeArr[i].textY)
            }

            // render each dot onto the map
            for (let eachDoctor in doctorJson) {
                for (let i in shapeArr) {
                    if (doctorJson[eachDoctor]["room"] == shapeArr[i].text) {
                        context.fillStyle = doctorJson[eachDoctor]["docColor"];
                        context.beginPath()
                        context.arc(shapeArr[i].x + randomizedPosition[0][0], shapeArr[i].y + randomizedPosition[0][1], wp('3%'), 0, 2 * Math.PI);
                        context.closePath();
                        // only arc needs to call function fill()
                        context.fill()

                        let firstElement = randomizedPosition.shift()
                        randomizedPosition.push(firstElement)
                    }
                }
            }
        });
    }

    handleCanvas2 = (canvas) => {
        const context = canvas.getContext('2d');
        canvas.height = hp('20%');
        canvas.width = Dimensions.get('window').width;
        context.fillStyle = '#fafafa';
        context.fillRect(0, 0, canvas.width, canvas.height);

        let doctorArr = [];
        doctorArr.push(new this.Doctor(wp('6%'), hp('3.8%'), wp('3%'), 0, 2*Math.PI, "Dr. Kuo", wp('12%'), hp('4.6%'), 'red'));
        doctorArr.push(new this.Doctor(wp('6%'), hp('8.2%'), wp('3%'), 0, 2*Math.PI, "Dr. Roa", wp('12%'), hp('9.2%'), 'yellow'));

        for (let i in doctorArr) {
            context.fillStyle = doctorArr[i].color;
            context.beginPath()
            context.arc(doctorArr[i].x, doctorArr[i].y, doctorArr[i].radius, doctorArr[i].sAngle, doctorArr[i].eAngle, false);
            context.closePath();
            // only arc needs to call function fill()
            context.fill()
            context.fillStyle = 'black';
            context.font = '18px Helvetica';
            context.fillText(doctorArr[i].name, doctorArr[i].textX, doctorArr[i].textY)
        }
    }

    render() {
        return (
            <ScrollView minimumZoomScale={1} maximumZoomScale={3} contentContainerStyle={styles.container}>
                <View style={styles.queue}>
                    {this.renderPositionText()}
                </View>
                {/* <Image source={require("../assets/radOncMap.png")} 
                style={styles.image}
                resizeMode="contain">
                </Image> */}
                <View>
                    <Canvas ref={this.handleCanvas} />
                </View>
                <View>
                    <Canvas ref={this.handleCanvas2} />
                </View>
            </ScrollView>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F2F2F2'
    },
    image: {
        flex: 1,
        height: undefined,
        width: undefined
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
});

export default ShowMap;