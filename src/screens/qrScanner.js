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

        // let phoneNumber = 0;
        // user = firebase.auth().currentUser;
        // console.log(user);
        // phoneNumber = user.email.split('@')[0];

        // console.log("im in componentWillMount");
        // console.log("phoneNumber = " + phoneNumber);

        // let recordFound = false;
        // firebase.database().ref('/PatientVisits/').once('value', function (snapshot) {
        //     if (snapshot.exists()) {
        //         snapshot.forEach((data) => {
        //             if (data.key == phoneNumber)
        //                 recordFound = true;
        //         });

        //     }

        //     if (recordFound) {
        //         console.log('Patient\'s phone number IS found in PatientVisits table');
        //     }
        //     else {
        //         console.log('Patient\'s phone number IS NOT found in PatientVisits table');

        //         firebase.database().ref('/PatientVisits/').child(phoneNumber).child('OverallDuration').set({
        //             startTime: '',
        //             endTime: '',
        //         }).then((data) => {
        //             console.log("Pushing a new overall duration for this patient")
        //             console.log("data = " + data);
        //         }).catch((error) => {
        //             console.log("error pushing new overall duration to the server = " + error);
        //         })

        //         firebase.database().ref('/PatientVisits/').child(phoneNumber).child('RoomA').set({
        //             startTime: '',
        //             endTime: '',
        //         }).then((data) => {
        //             console.log("Pushing a new roomA for this patient")
        //             console.log("data = " + data);
        //         }).catch((error) => {
        //             console.log("error pushing new roomA to the server = " + error);
        //         })
        //     }

        // })
    }

    onSuccess(e) {

        let self = this;

        console.log(e);
        console.log("phoneNumber = " + phoneNumber);

        let phoneNumber = 0;
        user = firebase.auth().currentUser;
        phoneNumber = user.email.split('@')[0];

        if (e.data == 'overall-start') {
            // ADD users' phoneNumber to the WaitingQueue
            firebase.database().ref('/WaitingQueue').once('value', function(snapshot){
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

            firebase.database().ref('/PatientVisits/' + phoneNumber).child('/OverallDuration').update({
                startTime: Date.now()
            }).then((data) => {
                console.log("Successfully updating overallDuration for patient " + phoneNumber)

                Alert.alert(
                    'Confirm',
                    'Successfully scanned QR code.',
                    [
                        { text: 'Close', onPress: () => { Actions.map(); } }
                    ]
                )
            }).catch((error) => {
                console.log("error updating overallDuration for patient " + phoneNumber);
                console.log("error = " + error);
            })
        }
        else if (e.data == 'overall-end') {
            // REMOVE users' phoneNumber to the WaitingQueue
            firebase.database().ref('/WaitingQueue').once('value', function(snapshot){
                let updateValFromHere = false;
                snapshot.forEach( (child) => {
                    console.log(child.key + ', ' + child.val())
                    
                    if (child.key == phoneNumber.toString())
                        updateValFromHere = true

                    //child().update() won't work
                    if (updateValFromHere && child.val() != 0)
                        firebase.database().ref('/WaitingQueue').child(child.key).set(child.val() - 1);
                })
            })
            firebase.database().ref('/WaitingQueue').child(phoneNumber).remove();
            console.log("REMOVE users' phoneNumber to the WaitingQueue")

            firebase.database().ref('/PatientVisits/' + phoneNumber).child('/OverallDuration').update({
                endTime: Date.now()
            }).then((data) => {
                console.log("Successfully updating overallDuration for patient " + phoneNumber)

                firebase.database().ref('PatientVisits').child(phoneNumber).child('OverallDuration').once('value', function (data) {
                    if (data.exists()) {
                        let startTimeLocal = 0;
                        let endTimeLocal = 0;

                        startTimeLocal = data.val().startTime;
                        endTimeLocal = data.val().endTime;

                        let durationEpoch = endTimeLocal - startTimeLocal;
                        let d = new Date(endTimeLocal);

                        let seconds = Math.floor((durationEpoch / 1000) % 60),
                            minutes = Math.floor((durationEpoch / (1000 * 60)) % 60),
                            hours = Math.floor((durationEpoch / (1000 * 60 * 60)) % 24);

                        hours = (hours < 10) ? "0" + hours : hours;
                        minutes = (minutes < 10) ? "0" + minutes : minutes;
                        seconds = (seconds < 10) ? "0" + seconds : seconds;
                        
                        Alert.alert(
                            'Confirm',
                            'On ' + d.toDateString() + ', you spent ' + hours + " hours, " + minutes + " minutes, " + seconds + " seconds" +' at the clinic.',
                            [
                                { text: 'Close', onPress: () => { Actions.feedback(); } }
                            ]
                        )
                    }
                })
            })
                .catch((error) => {
                    console.log("error updating overallDuration for patient " + phoneNumber);
                    console.log("error = " + error);
                })
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
    Í
    componentDidMount() {
        console.log("ENTERING componentDidMount")

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