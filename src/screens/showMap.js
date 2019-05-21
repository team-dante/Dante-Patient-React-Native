'use strict';
import React, { Component } from 'react';
import {StyleSheet, Image, ScrollView, Text, Dimensions} from 'react-native';
import firebase from 'firebase';
import Canvas, {Image as CanvasImage, Path2D, ImageData} from 'react-native-canvas';

class ShowMap extends Component {

    constructor(props) {
        super(props);
        // email = phoneNumber + @email.com
        this.state = { patientName: '', queueNum: '', queueNotFound: true, data: [] };
        this.realTimeInterval = 0;
    }

    componentWillMount() {
        // locate current user's phone num
        let user = firebase.auth().currentUser;
        let phoneNum = user.email.split("@")[0];
        // this keyword would not work under callback fxn
        var self = this;

        firebase.database().ref('/WaitingQueue').on("value", function(snapshot){
            snapshot.forEach( (data) => {
                if (data.key == phoneNum.toString()){
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
        this.realTimeInterval = setInterval(()=> {
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
            .once('value', function(snapshot) {
                let firstNameVal = '';
                snapshot.forEach(function (data) {
                    firstNameVal = data.val().firstName;
                });
                console.log("line 27=" + firstNameVal)
                self.setState( { patientName : firstNameVal } );
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
                <Text style={styles.topText}>Number of people ahead of you: {queueNum}</Text>
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

    handleCanvas = (canvas) => {
        const context = canvas.getContext('2d');
        canvas.height = Dimensions.get('window').height;
        canvas.width = Dimensions.get('window').width;
        context.fillStyle = '#fff';
        context.fillRect(0, 0, canvas.width, canvas.height);
        context.fill()

        let shapeArr = [];
        let rectWidth = 200;
        let rectHeight = 200;

        let verticalOffset = canvas.width - rectWidth - rectWidth;
        let horizontalOffset = canvas.width - rectWidth;
        let textOffset = 20;

        shapeArr.push(new this.Shape(0, 0, rectWidth, rectHeight, '#4B77BE', 'Room A', 0, textOffset))
        shapeArr.push(new this.Shape(horizontalOffset, 0, rectWidth, rectHeight, '#4B77BE', 'Room B', horizontalOffset, textOffset))
        shapeArr.push(new this.Shape(0, rectHeight + verticalOffset , rectWidth, rectHeight, '#4B77BE', 'Room C', 0, rectHeight + verticalOffset + textOffset))
        shapeArr.push(new this.Shape(horizontalOffset, rectHeight + verticalOffset, rectWidth, rectHeight, '#4B77BE', 'Room D', horizontalOffset, rectHeight + verticalOffset + textOffset))

        for (let i in shapeArr) {
            context.fillStyle = shapeArr[i].fillColor
            context.fillRect(shapeArr[i].x, shapeArr[i].y, shapeArr[i].width, shapeArr[i].height)
            context.font = "20px San Francisco";
            context.fillStyle = "white";
            context.fillText(shapeArr[i].text, shapeArr[i].textX, shapeArr[i].textY)
        }

        let self = this;

        // find out where room A is 
        firebase.database().ref('/DoctorLocation/').on('value', function(snapshot){
            self.setState({ data : snapshot})
        })
      }

    render() {
        return (
            <ScrollView minimumZoomScale={1} maximumZoomScale={3} contentContainerStyle={styles.container}>
                { this.renderPositionText() }
                {/* <Image source={require("../assets/radOncMap.png")} 
                style={styles.image}
                resizeMode="contain">
                </Image> */}
                <Canvas ref={this.handleCanvas} />
            </ScrollView>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
    },
    image: {
        flex:1, 
        height: undefined, 
        width: undefined
    },
    topText: {
        color: '#ffffff',
        textAlign: 'center',
        margin: 20,
        paddingVertical: 20,
        paddingHorizontal: 5,
        fontSize: 23,
        borderWidth: 1,
        borderRadius: 10,
        backgroundColor: "#3DCEBF",
        borderColor: '#ffffff',
        overflow: 'hidden'
    },
});

export default ShowMap;