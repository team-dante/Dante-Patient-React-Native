'use strict';
import React, { Component } from 'react';
import { StyleSheet, Image, ScrollView, Text, Dimensions } from 'react-native';
import firebase from 'firebase';
import Canvas, { Image as CanvasImage, Path2D, ImageData } from 'react-native-canvas';

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
        canvas.height = Dimensions.get('window').height;
        canvas.width = Dimensions.get('window').width;
        context.fillStyle = '#3DCEBF';
        context.fillRect(0, 0, canvas.width, canvas.height);

        // render 4 rooms
        let shapeArr = [];

        let rectWidth = 200;
        let rectHeight = 200;

        let verticalOffset = canvas.width - rectWidth - rectWidth;
        let horizontalOffset = canvas.width - rectWidth;
        let textOffset = 20;

        let paddingRoomText = 10;

        shapeArr.push(new this.Shape(0, 0, rectWidth, rectHeight, '#4B77BE', 'Room A', paddingRoomText, textOffset))
        shapeArr.push(new this.Shape(horizontalOffset, 0, rectWidth, rectHeight, '#4B77BE', 'Room B', horizontalOffset + paddingRoomText, textOffset))
        shapeArr.push(new this.Shape(0, rectHeight + verticalOffset, rectWidth, rectHeight, '#4B77BE', 'Room C', paddingRoomText, rectHeight + verticalOffset + textOffset))
        shapeArr.push(new this.Shape(horizontalOffset, rectHeight + verticalOffset, rectWidth, rectHeight, '#4B77BE', 'Room D', horizontalOffset + paddingRoomText, rectHeight + verticalOffset + textOffset))

        for (let i in shapeArr) {
            context.fillStyle = shapeArr[i].fillColor
            context.fillRect(shapeArr[i].x, shapeArr[i].y, shapeArr[i].width, shapeArr[i].height)
            context.font = "20px San Francisco";
            context.fillStyle = "white";
            context.fillText(shapeArr[i].text, shapeArr[i].textX, shapeArr[i].textY)
        }

        // render doctors' small circles
        let paddingNoteCircle = 30;
        let paddingRoomTextCircle = 20;
        let noteCircleVerticalOffset = canvas.width + paddingNoteCircle;
        let doctorArr = [];
        doctorArr.push(new this.Doctor(paddingNoteCircle, noteCircleVerticalOffset, 15, 0, 2 * Math.PI,
            "Dr. Roa", paddingNoteCircle + paddingRoomTextCircle, noteCircleVerticalOffset + 5, "yellow"));
        doctorArr.push(new this.Doctor(paddingNoteCircle, noteCircleVerticalOffset + paddingNoteCircle + 5, 15, 0, 2 * Math.PI,
            "Dr. Kuo", paddingNoteCircle + paddingRoomTextCircle,
            noteCircleVerticalOffset + paddingNoteCircle + 10, "red"));

        for (let i in doctorArr) {
            context.fillStyle = doctorArr[i].color;
            context.beginPath()
            context.arc(doctorArr[i].x, doctorArr[i].y, doctorArr[i].radius, doctorArr[i].sAngle, doctorArr[i].eAngle, false);
            context.closePath();
            // only arc needs to call function fill()
            context.fill()

            context.fillStyle = "white";
            context.fillText(doctorArr[i].name, doctorArr[i].textX, doctorArr[i].textY)
        }

        // extract doctor's location
        firebase.database().ref('/DoctorLocation/').on('value', function (snapshot) {
            let doctorJson = []
            snapshot.forEach((eachDoctor) => {
                doctorJson.push(eachDoctor.val())
            })

            // reset all small circles
            for (let i in shapeArr){
                context.fillStyle = "#4B77BE"
                context.beginPath()
                context.arc(shapeArr[i].x + 100, shapeArr[i].y + 100, 15, 0, 2 * Math.PI);
                context.closePath();
                // only arc needs to call function fill()
                context.fill()
            }

            // render each dot onto the map
            for (let eachDoctor in doctorJson) {
                if (doctorJson[eachDoctor]["room"] == "Room A") {
                    console.log(doctorJson[eachDoctor]["docName"] + " is in in room A")
                    for (let i in shapeArr) {
                        if (shapeArr[i].text == "Room A") {
                            context.fillStyle = doctorJson[eachDoctor]["docColor"];
                            context.beginPath()
                            context.arc(shapeArr[i].x + 100, shapeArr[i].y + 100, 15, 0, 2 * Math.PI);
                            context.closePath();
                            // only arc needs to call function fill()
                            context.fill()
                        }
                    }
                }
                if (doctorJson[eachDoctor]["room"] == "Room B") {
                    console.log(doctorJson[eachDoctor]["docName"] + " is in in room B")
                    for (let i in shapeArr) {
                        if (shapeArr[i].text == "Room B") {
                            context.fillStyle = doctorJson[eachDoctor]["docColor"];
                            context.beginPath()
                            context.arc(shapeArr[i].x + 100, shapeArr[i].y + 100, 15, 0, 2 * Math.PI);
                            context.closePath();
                            // only arc needs to call function fill()
                            context.fill()
                        }
                    }
                }
                if (doctorJson[eachDoctor]["room"] == "Room C") {
                    console.log(doctorJson[eachDoctor]["docName"] + " is in in room C")
                    for (let i in shapeArr) {
                        if (shapeArr[i].text == "Room C") {
                            context.fillStyle = doctorJson[eachDoctor]["docColor"];
                            context.beginPath()
                            context.arc(shapeArr[i].x + 100, shapeArr[i].y + 100, 15, 0, 2 * Math.PI);
                            context.closePath();
                            // only arc needs to call function fill()
                            context.fill()
                        }
                    }
                }
                if (doctorJson[eachDoctor]["room"] == "Room D") {
                    console.log(doctorJson[eachDoctor]["docName"] + " is in in room D")
                    for (let i in shapeArr) {
                        if (shapeArr[i].text == "Room D") {
                            context.fillStyle = doctorJson[eachDoctor]["docColor"];
                            context.beginPath()
                            context.arc(shapeArr[i].x + 100, shapeArr[i].y + 100, 15, 0, 2 * Math.PI);
                            context.closePath();
                            // only arc needs to call function fill()
                            context.fill()
                        }
                    }
                }
            }
        })
    }


    render() {
        return (
            <ScrollView minimumZoomScale={1} maximumZoomScale={3} contentContainerStyle={styles.container}>
                {this.renderPositionText()}
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
        backgroundColor: "#3DCEBF",
    },
    image: {
        flex: 1,
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