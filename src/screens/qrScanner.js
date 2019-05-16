import React, { Component } from 'react';
import { Alert, StyleSheet, Dimensions } from 'react-native'
import QRCodeScanner from 'react-native-qrcode-scanner';
import firebase from 'firebase'
import { Actions } from 'react-native-router-flux';

class QrScanner extends Component {

    constructor(props) {
        super(props);
    }

    componentWillMount() {
        console.log("im in componentWillmount");
    }

    formattedDate(now) {
        var month = now.getMonth() + 1;
        var formattedMonth = month < 10 ? '0' + month : month;
        var date = now.getDate();
        var formattedDate = date < 10 ? '0' + date : date;
        // outputs "2019-05-10"
        return now.getFullYear() + '-' + formattedMonth + '-' + formattedDate;
    }

    updateStartTime(keyMonthDateYear, phoneNumber, location, message) {
        // ADD users' phoneNumber to the WaitingQueue
        firebase.database().ref('/WaitingQueue').once('value', function (snapshot) {
            let queueNumber = snapshot.numChildren();
            let duplicatedFound = false;
            snapshot.forEach((child) => {
                if (child.key == phoneNumber.toString())
                    duplicatedFound = true;
            })
            if (!duplicatedFound)
                firebase.database().ref('/WaitingQueue').child(phoneNumber).set(queueNumber);
        })
        console.log("ADD users' phoneNumber to the WaitingQueue");

        // updating patient startTime for multiple visits (assuming no users visit each room once)
        firebase.database().ref('/PatientVisitsByDates/' + phoneNumber + '/' + keyMonthDateYear + '/' + location).update({
            startTime: Date.now()
        }).then(() => {
            console.log("Successfully updating" + location + "for patient " + phoneNumber)
            Actions.notice({text: message})
        }).catch((error) => {
            console.log("error updating" + location + "for patient " + phoneNumber);
            console.log("error = " + error);
        })
    }

    updateEndTimeAndDiffTime(keyMonthDateYear, phoneNumber, location, message) {
        // REMOVE users' phoneNumber from WaitingQueue if they finish the overall visit
        if (location == 'OverallDuration') {
            firebase.database().ref('/WaitingQueue').once('value', function (snapshot) {
                let updateValFromHere = false;
                snapshot.forEach((child) => {
                    console.log(child.key + ', ' + child.val())
    
                    if (child.key == phoneNumber.toString())
                        updateValFromHere = true
    
                    //child().update() won't work
                    if (updateValFromHere && child.val() != 0)
                        firebase.database().ref('/WaitingQueue').child(child.key).set(child.val() - 1);
                })
            })
            // one way to trick the system. update value to -1, firebase triggers when child.key updates to -1, which calls setState when -1 is updated
            firebase.database().ref('/WaitingQueue').child(phoneNumber).set(-1);
            firebase.database().ref('/WaitingQueue').child(phoneNumber).remove();
            console.log("REMOVE users' phoneNumber to the WaitingQueue");
        }

        // updating patient endTime for multiple visits (assuming no users visit each room once)
        firebase.database().ref('/PatientVisitsByDates/' + phoneNumber + '/' + keyMonthDateYear + '/' + location).update({
            endTime: Date.now()
        }).then((data) => {
            console.log("Successfully updating " + location + "/endTime for patient " + phoneNumber)

            firebase.database().ref('/PatientVisitsByDates/' + phoneNumber + '/' + keyMonthDateYear + '/' + location).once('value', function (snapshot) {

                let startTimeLocal = 0;
                let endTimeLocal = 0;

                startTimeLocal = snapshot.val().startTime;
                endTimeLocal = snapshot.val().endTime;

                let durationEpoch = endTimeLocal - startTimeLocal;

                snapshot.ref.update({
                    diffTime: durationEpoch
                }).then((data => {

                    let seconds = Math.floor((durationEpoch / 1000) % 60),
                    minutes = Math.floor((durationEpoch / (1000 * 60)) % 60),
                    hours = Math.floor((durationEpoch / (1000 * 60 * 60)) % 24);

                    hours = (hours < 10) ? "0" + hours : hours;
                    minutes = (minutes < 10) ? "0" + minutes : minutes;
                    seconds = (seconds < 10) ? "0" + seconds : seconds;

                    Actions.notice({text: "You spent " + hours + " hours, " + minutes 
                        + " minutes, " + seconds + " seconds." + "\n" + message})

                })).catch((error) => {
                    console.log("error updating " + location + "/diffTime for patient " + phoneNumber);
                    console.log("error = " + error);
                })
            })
        }).catch((error) => {
            console.log("error updating overallDuration for patient " + phoneNumber);
            console.log("error = " + error);
        })
    }

    onSuccess(e) {

        console.log(e);
        console.log("phoneNumber = " + phoneNumber);

        // addDays for testing purposes
        Date.prototype.addDays = function(days) {
            var date = new Date(this.valueOf());
            date.setDate(date.getDate() + days);
            return date;
        }
        // get first part before @email.com
        let user = firebase.auth().currentUser;
        console.log(user);
        let phoneNumber = user.email.split('@')[0];

        // get today's date
        let now = (new Date()).addDays(1);
        let keyMonthDateYear = this.formattedDate(now);

        if (e.data == 'overall-start') {
            this.updateStartTime(keyMonthDateYear, phoneNumber, "OverallDuration", "You are checked in at the front door!")
        }
        else if (e.data == 'overall-end') {
            this.updateEndTimeAndDiffTime(keyMonthDateYear, phoneNumber, "OverallDuration", "You are checked out at the front door!")
        }
        else if (e.data == 'roomA-start'){
            this.updateStartTime(keyMonthDateYear, phoneNumber, "RoomA", "You are checked in at Room A!")
        }
        else if (e.data == 'roomA-end'){
            this.updateEndTimeAndDiffTime(keyMonthDateYear, phoneNumber, "RoomA", "You are checked out at Room A!")
        }
        else if (e.data == 'roomB-start'){
            this.updateStartTime(keyMonthDateYear, phoneNumber, "RoomB", "You are checked in at Room B!")
        }
        else if (e.data == 'roomB-end'){
            this.updateEndTimeAndDiffTime(keyMonthDateYear, phoneNumber, "RoomB", "You are checked out at Room B!")
        }
        else {
            Alert.alert(
                'Error',
                'Unrecognized QR code',
                [
                    { text: 'Close', onPress: () => { Actions.map(); } }
                ]
            )
        }
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

const styles = StyleSheet.create({

});

export default QrScanner;