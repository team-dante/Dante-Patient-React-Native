import React, { Component } from 'react';
import { Text, StyleSheet, View } from 'react-native';
import firebase from 'firebase';

export default class VisitHistory extends Component {
    constructor(props) {
        super(props);
        // email = phoneNumber + @email.com
        this.state = { patientName: '' };
    }
    componentDidMount() {
        // locate current user's phone num
        let user = firebase.auth().currentUser;
        let phoneNum = user.email.split("@")[0];
        // this keyword would not work under callback fxn
        var self = this;

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
            console.log("im in componenDidMount")
    }
    loadingHistory() {
        let phoneNumber = 0;
        user = firebase.auth().currentUser;
        phoneNumber = user.email.split('@')[0];

        console.log("hi");

        firebase.database().ref('/Patients').child(phoneNumber).child('OverallDuration').child('diffTime')
        .on('value', function (snapshot) {
            console.log("hi2")

            let todayDate;
            let durationEpoch;
            snapshot.forEach( (data) => {
                console.log("data.key=" + data.key)
                console.log("data.val()=" + data.val())
                todayDate = data.key;
                durationEpoch = data.val();
            })

            console.log("todayDate=" + todayDate);
            console.log("durationEpoch=" + durationEpoch);

            let seconds = Math.floor((durationEpoch / 1000) % 60),
                minutes = Math.floor((durationEpoch / (1000 * 60)) % 60),
                hours = Math.floor((durationEpoch / (1000 * 60 * 60)) % 24);

            hours = (hours < 10) ? "0" + hours : hours;
            minutes = (minutes < 10) ? "0" + minutes : minutes;
            seconds = (seconds < 10) ? "0" + seconds : seconds;

            // return (
            //     <Text>
            //         On {todayDate}, you spent {hours} hours {minutes} minutes {seconds} seconds
            //                 </Text>
            // );
        })
    }

    render() {
        const { patientName } = this.state;
        return (
            <View style={styles.container}>
                {/* <Text style={styles.topText}>Hi {patientName}, you are in line for queue #2</Text> */}
                {this.loadingHistory()}
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#ffffff',
    },
    topText: {
        fontSize: 18,
        margin: 5,
    },
});