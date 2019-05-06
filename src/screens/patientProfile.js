'use strict';
import React, { Component } from 'react';
import {StyleSheet, View, Text, TouchableOpacity, Alert, Dimensions} from 'react-native';
import firebase from 'firebase';
import { Actions } from 'react-native-router-flux';

class PatientProfile extends Component {
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

    logOut() {
        Alert.alert(
            'Warning',
            'Signing out will disable Face/Touch ID for future login. You will have to type credentials manually to sign in.',
            [
                {text: "Sign me out", onPress: () => {
                    firebase.auth().signOut()
                    .then( () => { console.log("sign out successfully."); } )
                    .catch( (error) => {
                        console.log(error);
                    })
                    Actions.auth();
                } },
                {text: "Don't sign me out", onDismiss: () => {} }
            ]
        );
    }

    render() {
        const { patientName } = this.state;
        return (
            <View style={styles.container}>
                <Text style={styles.topText}>Greetings, Patient {patientName}</Text>
                <Text style={styles.header}>What would you like to do?</Text>
                {/* <TouchableOpacity style={styles.buttonContainer} 
                     onPress={() => {this.props.navigation.navigate('ShowMap')}}>
                    <Text style={styles.buttonText}>See Staff's Location in Real Time</Text>
                </TouchableOpacity>   */}
                <TouchableOpacity style={styles.buttonContainer} 
                     onPress={() => { Actions.feedback() }}>
                    <Text style={styles.buttonText}>Give Feedback</Text>
                </TouchableOpacity> 
                <TouchableOpacity style={styles.buttonContainer} 
                     onPress={ this.logOut.bind(this) }>
                    <Text style={styles.buttonText}>Log out</Text>
                </TouchableOpacity> 
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    topText: {
        fontSize: 18,
        margin: 5
    },
    header: {
        paddingBottom: 30,
        fontSize: 30,
        fontWeight: 'bold',
        textShadowColor: '#c4c4c4',
        textShadowOffset: { width: 1, height: 0 },
        textShadowRadius: 2
    },
    buttonContainer : {
        backgroundColor: "#428AF8",
        paddingVertical: 12,
        width: Dimensions.get('window').width - 80,
        borderRadius: 8,
        borderColor: "rgba(255,255,255,0.7)",
        margin: 10,
    },
    buttonText: {
        color: "#FFF",
        textAlign: "center",
        height: 20,
        fontWeight: 'bold'
    }
});


export default PatientProfile;