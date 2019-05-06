import React, { Component } from 'react';
import { Alert, StyleSheet, Dimensions } from 'react-native'
import QRCodeScanner from 'react-native-qrcode-scanner';
import firebase from 'firebase'
import { Actions } from 'react-native-router-flux';

class QrScanner extends Component {

    constructor(props){
        super(props);
        this.user = '';
        this.phoneNumber = '';
        this.start = 0;
        this.end = 0;
        this.timeVisited = 0;
    }


    componentWillMount(){

        console.log("im in componentWillmount");

        var self = this;
        user = firebase.auth().currentUser;
        console.log(user);
        phoneNumber = user.email.split('@')[0];

        console.log("im in componentWillMount");
        console.log("phoneNumber = " + phoneNumber);

        firebase.database().ref('/Durations/').orderByChild('phoneNum').equalTo(phoneNumber)
        .once('value', function(snapshot){
            if (snapshot.exists())
            {
                console.log("Patient's duration is found in duration table. No need to push another duration for this patient");
            }
            else {
                console.log("Patient's duration is NOT FOUND in duration table.");
                firebase.database().ref(`/Durations`).push({
                    phoneNum: phoneNumber,
                    startTime: '',
                    endTime: '',
                }).then((data) => {
                    console.log("Pushing a new duration for this patient")
                    console.log("data = " + data);
                }).catch((error) => {
                    console.log("error pushing new duration to the server = " + error);
                })
            }
        })
    }

    onSuccess(e) {

        let self = this;

        console.log(e);
        console.log("phoneNumber = " + phoneNumber);

        let durationObjectId = '';

        if (e.data == 'start') {

            firebase.database().ref('/Durations/').orderByChild('phoneNum').equalTo(phoneNumber)
            .once('value', function(snapshot){
                snapshot.forEach((data) => {
                    durationObjectId = data.key
                })
                // self.start data is only shown in firebase function
                self.start = Date.now();
                firebase.database().ref().child('/Durations/' + durationObjectId)
                .update({
                    startTime : self.start
                })
                Alert.alert(
                    'Confirm',
                    'Successfully scanned QR code.',
                    [
                        {text: 'Close', onPress: () => { self.scanner.reactivate(); }}
                    ]
                )
            })
        }
        else if (e.data == 'end') {

            firebase.database().ref('/Durations/').orderByChild('phoneNum').equalTo(phoneNumber)
            .once('value', function(snapshot){
                snapshot.forEach((data) => {
                    durationObjectId = data.key
                })
                // self.end data is only shown in firebase function
                self.end = Date.now();
                firebase.database().ref().child('/Durations/' + durationObjectId)
                .update({
                    endTime : self.end
                })
                console.log("start = " + self.start);
                console.log("end = " + self.end);
                self.timeVisited = self.end - self.start;
                console.log("timeVisited = " + self.timeVisited);
    
                Alert.alert(
                    'Confirm',
                    'You spent ' + (self.timeVisited / 1000) + ' seconds',
                    [
                        {text: 'Close', onPress: () => { self.scanner.reactivate(); } }
                    ]
                )
            })
        }
        else {
            console.log("unrecognized qr code");
        }
    }

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