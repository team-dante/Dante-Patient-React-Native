'use strict';
import React, { Component } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Alert, Dimensions } from 'react-native';
import firebase from 'firebase';
import { Actions } from 'react-native-router-flux';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

class PatientProfile extends Component {
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
    }

    logOut() {
        Alert.alert(
            'Warning',
            'Signing out will disable Face/Touch ID for future login. You will have to type credentials manually to sign in.',
            [
                {
                    text: "Sign me out", onPress: () => {
                        firebase.auth().signOut()
                            .then(() => { console.log("sign out successfully."); })
                            .catch((error) => {
                                console.log(error);
                            })
                        Actions.auth();
                    }
                },
                { text: "Don't sign me out", onDismiss: () => { } }
            ]
        );
    }

    render() {
        const { patientName } = this.state;
        return (
            <View style={styles.container}>
                <Text style={styles.topText}>Hi, Patient {patientName}</Text>
                <View style={styles.card}>
                    <Text style={styles.boldText}>Share Your Thoughts</Text>
                    <Text style={styles.lightText}>Please fill out our little survey to help us improve your visit experience</Text>
                    <TouchableOpacity style={[styles.buttonContainer, { backgroundColor: '#3DCEBF' }]}
                        onPress={() => { Actions.feedback() }}>
                        <Text style={styles.buttonText}>Take Survey</Text>
                    </TouchableOpacity>
                </View>
                <TouchableOpacity style={styles.buttonContainer}
                    onPress={this.logOut.bind(this)}>
                    <Text style={styles.buttonText}>Log Out</Text>
                </TouchableOpacity>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        backgroundColor: '#f9f9f9'
    },
    topText: {
        fontSize: 18,
        margin: 5,
        alignSelf: 'flex-start',
        paddingLeft: wp('8.5%'),
        paddingVertical: hp('1.5%'),
        fontFamily: 'Poppins-Bold',
    },
    card: {
        alignItems: 'center',
        width: wp('80%'),
        height: hp('25%'),
        borderRadius: 20,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 5,
        },
        shadowOpacity: 0.36,
        shadowRadius: 6.68,
        elevation: 11,
        backgroundColor: '#fff',
        marginBottom: hp('2%'),
        borderColor: "#53ACE6",
    },
    boldText: {
        paddingTop: wp('1.5%'),
        fontSize: wp('6%'),
        fontFamily: 'Poppins-Bold',
        marginBottom: hp('2.6%'),
    },
    lightText: {
        color: '#3D3D3D',
        fontSize: wp('4%'),
        fontFamily: 'Rubik-Regular',
        marginBottom: hp('2%')
    },
    buttonContainer: {
        width: wp('50%'),
        marginTop: hp('1.8%'),
        backgroundColor: "#53ACE6",
        paddingVertical: hp('1%'),
        height: hp('5.5%'),
        borderRadius: 40,
        justifyContent: 'center',
    },
    buttonText: {
        color: "#FFF",
        textAlign: "center",
        fontWeight: 'bold',
        fontSize: wp('5%'),
        fontFamily: 'Rubik-Medium'
    }
});


export default PatientProfile;