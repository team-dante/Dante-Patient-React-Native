import React, { Component } from 'react';
import { Alert, Dimensions } from 'react-native'
import QRCodeScanner from 'react-native-qrcode-scanner';
import firebase from 'firebase'
import { Actions } from 'react-native-router-flux';

class QrScanner extends Component {

    constructor(props) {
        super(props);
    }

    // return YYYY-MM-DD format
    formattedDate(now) {
        var month = now.getMonth() + 1;
        var formattedMonth = month < 10 ? '0' + month : month;
        var date = now.getDate();
        var formattedDate = date < 10 ? '0' + date : date;
        // outputs "2019-05-10"
        return now.getFullYear() + '-' + formattedMonth + '-' + formattedDate;
    }
    // Update start time when patient scans in
    updateStartTime(keyMonthDateYear, phoneNumber, location, message) {
        // ADD users' phoneNumber to the WaitingQueue
        if (location == 'Waiting Room') {
            firebase.database().ref('/WaitingQueue').once('value', function (snapshot) {
                let queueNumber = snapshot.numChildren();
                firebase.database().ref('/WaitingQueue').child(Date.now() + '-' + phoneNumber).set(queueNumber);
            })
            console.log("ADD users' phoneNumber to the WaitingQueue");
        }

        // updating patient startTime for multiple visits (assuming no users visit each room once)
        // in session, clock ticking
        let path = '/PatientVisitsByDates/' + phoneNumber + '/' + keyMonthDateYear + '/' + location;
        firebase.database().ref(path).update({
            startTime: Date.now(),
            inSession: true
        }).then(() => {
            console.log("Successfully updating" + location + "for patient " + phoneNumber)
            Actions.notice({ text: message })
        }).catch((error) => {
            console.log("error updating" + location + "for patient " + phoneNumber);
            console.log("error = " + error);
        })
    }
    // Update end time and time spent in a particular room (or for overall visit) when patient scans out
    // out of session, clock stops
    updateEndTimeAndDiffTime(keyMonthDateYear, phoneNumber, location, message) {

        let self = this

        // REMOVE users' phoneNumber from WaitingQueue if they leave the waiting room
        if (location == 'Waiting Room') {
            firebase.database().ref('/WaitingQueue').once('value', function (snapshot) {
                let updateValFromHere = false;
                let phoneNumExtract = '';
                snapshot.forEach((child) => {
                    console.log(child.key + ', ' + child.val())
                    phoneNumExtract = child.key.split('-')[1]
                    let stop = false;
                    if (phoneNumExtract == phoneNumber.toString()){
                        updateValFromHere = true
                        firebase.database().ref('/WaitingQueue').child(child.key).set(-1).then(
                            () => {
                                firebase.database().ref('/WaitingQueue').child(child.key).remove();
                            }
                        )
                    }

                    //child().update() won't work
                    if (updateValFromHere && child.val() != 0)
                        firebase.database().ref('/WaitingQueue').child(child.key).set(child.val() - 1);
                })
                console.log("REMOVE users' phoneNumber to the WaitingQueue");
            })
        }

        // updating patient endTime for multiple visits (assuming no users visit each room once)
        firebase.database().ref('/PatientVisitsByDates/' + phoneNumber + '/' + keyMonthDateYear + '/' + location).update({
            inSession: false
        }).then((data) => {
            firebase.database().ref('/PatientVisitsByDates/' + phoneNumber + '/' + keyMonthDateYear + '/' + location).once('value', function (snapshot) {
                let durationEpoch = snapshot.val().diffTime;

                let seconds = Math.floor((durationEpoch / 1000) % 60),
                    minutes = Math.floor((durationEpoch / (1000 * 60)) % 60),
                    hours = Math.floor((durationEpoch / (1000 * 60 * 60)) % 24);

                hours = (hours < 10) ? "0" + hours : hours;
                minutes = (minutes < 10) ? "0" + minutes : minutes;
                seconds = (seconds < 10) ? "0" + seconds : seconds;

                Actions.notice({
                    text: "You spent " + hours + " hours, " + minutes
                        + " minutes, " + seconds + " seconds." + "\n\n" + message
                })
            }).catch((error) => {
                console.log("error updating overallDuration for patient " + phoneNumber);
                console.log("error = " + error);
            })

            // When patient leaves the clinic, calculate the buffer time
            if (location == 'OverallDuration') {
                firebase.database().ref('/PatientVisitsByDates/' + phoneNumber + '/' + keyMonthDateYear).once('value', function (snapshot) {
                    let timeSpentInRooms = 0;
                    let timeSpentOverall = 0;
                    snapshot.forEach((data) => {
                        if (data.key != 'OverallDuration') {
                            timeSpentInRooms += data.val().diffTime;
                        }
                        else {
                            timeSpentOverall = data.val().diffTime;
                        }
                    });
                    // Z is to trick the Firebase system so that the Transition Time item is always listed at the bottom
                    snapshot.ref.child("ZTransition").update({
                        diffTime: timeSpentOverall - timeSpentInRooms
                    });
                })
            }
        });

    }

    onSuccess(e) {

        console.log(e);
        console.log("phoneNumber = " + phoneNumber);

        // addDays for testing purposes
        Date.prototype.addDays = function (days) {
            var date = new Date(this.valueOf());
            date.setDate(date.getDate() + days);
            return date;
        }
        // get first part before @email.com
        let user = firebase.auth().currentUser;
        console.log(user);
        let phoneNumber = user.email.split('@')[0];

        // get today's date
        let now = new Date();
        let keyMonthDateYear = this.formattedDate(now);

        if (e.data == 'overall-start') {
            this.updateStartTime(keyMonthDateYear, phoneNumber, "OverallDuration", "You are checked in at the front door!")
        }
        else if (e.data == 'overall-end') {
            this.updateEndTimeAndDiffTime(keyMonthDateYear, phoneNumber, "OverallDuration", "You are checked out at the front door!")
        }
        else if (e.data == 'wr-start') {
            this.updateStartTime(keyMonthDateYear, phoneNumber, "Waiting Room", "You are checked in at Waiting Room!")
        }
        else if (e.data == 'wr-end') {
            this.updateEndTimeAndDiffTime(keyMonthDateYear, phoneNumber, "Waiting Room", "You are checked out at Waiting Room!")
        }
        else if (e.data == 'er-start') {
            this.updateStartTime(keyMonthDateYear, phoneNumber, "Exam Room", "You are checked in at Exam Room!")
        }
        else if (e.data == 'er-end') {
            this.updateEndTimeAndDiffTime(keyMonthDateYear, phoneNumber, "Exam Room", "You are checked out at Exam Room!")
        }
        else if (e.data == 'tr1-start') {
            this.updateStartTime(keyMonthDateYear, phoneNumber, "Treatment Room 1", "You are checked in at Treatment Room 1!")
        }
        else if (e.data == 'tr1-end') {
            this.updateEndTimeAndDiffTime(keyMonthDateYear, phoneNumber, "Treatment Room 1", "You are checked out at Treatment Room 1!")
        }
        else if (e.data == 'tr2-start') {
            this.updateStartTime(keyMonthDateYear, phoneNumber, "Treatment Room 2", "You are checked in at Treatment Room 2!")
        }
        else if (e.data == 'tr2-end') {
            this.updateEndTimeAndDiffTime(keyMonthDateYear, phoneNumber, "Treatment Room 2", "You are checked out at Treatment Room 2!")
        }
        else if (e.data == 'ct-start') {
            this.updateStartTime(keyMonthDateYear, phoneNumber, "CT Room", "You are checked in at CT Room!")
        }
        else if (e.data == 'ct-end') {
            this.updateEndTimeAndDiffTime(keyMonthDateYear, phoneNumber, "CT Room", "You are checked out at CT Room!")
        }
        else {
            this.invalidQrCode();
        }
    }

    invalidQrCode() {
        Alert.alert(
            'Error',
            'Unrecognized QR code',
            [
                { text: 'Close', onPress: () => { Actions.map(); } }
            ]
        )
    }

    render() {
        return (
            <QRCodeScanner
                ref={(node) => { this.scanner = node }}
                onRead={this.onSuccess.bind(this)}
                cameraStyle={{ height: Dimensions.get("window").height }}
            />
        );
    }
}

export default QrScanner;