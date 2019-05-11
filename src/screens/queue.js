import React, { Component } from 'react';
import {Text, StyleSheet, View} from 'react-native';
import firebase from 'firebase';

export default class Queue extends Component{
    constructor(props) {
        super(props);
        // email = phoneNumber + @email.com
        this.state = { patientName: ''};
    }
    componentDidMount() {
        // locate current user's phone num
        let user = firebase.auth().currentUser;
        let phoneNum = user.email.split("@")[0];
        // this keyword would not work under callback fxn
        var self = this;

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
    render(){
        const {patientName} = this.state;
        return(
            <View style={styles.container}>
                <Text style={styles.topText}>Hi {patientName}, you are in line for queue #2</Text>
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