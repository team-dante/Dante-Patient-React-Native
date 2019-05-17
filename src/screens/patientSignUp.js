import React, { Component } from 'react';
import { Dimensions, View, Text, TextInput, TouchableOpacity, Alert, StyleSheet, ActivityIndicator } from 'react-native';
import firebase from 'firebase';
import { Actions } from 'react-native-router-flux';

class PatientSignUp extends Component {
    constructor(props) {
        super(props);
        this.state = { patientPhoneNumber: '', error: '', loading: '' };
    }

    activateAccount() {
        const { patientPhoneNumber } = this.state;

        // prevent this.props loses values
        let this_props = this.props;
        let this_var = this;

        this.setState({ loading: true });

        firebase.database().ref('Patients/')
            .orderByChild('patientPhoneNumber').equalTo(patientPhoneNumber)
            .once("value", function (snapshot) {
                if (snapshot.exists()) {
                    let email = patientPhoneNumber + "@email.com";
                    let patientPin = '';
                    snapshot.forEach((data) => {
                        patientPin = data.val().patientPin;
                    });
                    console.log("email=" + email);
                    console.log("pin=" + patientPin);

                    // PatientPin = 4 digit PIN + "ABCDEFG"
                    patientPin += "ABCDEFG"
                    firebase.auth().createUserWithEmailAndPassword(email, patientPin)
                    .then( () => {
                        console.log("success in SIGN UP")
                        // sign in if creating a new account succesfully
                        firebase.auth().signInWithEmailAndPassword(email, patientPin)
                        .then( (user) => {
                            console.log("success in SIGN IN");
                            console.log(user)
                            this_var.setState({
                                loading: false
                            });
                            Actions.map();
                        })
                        .catch( (error) => {
                            console.log("failure in SIGN IN");

                            let errorCode = error.code;
                            let errorMessage = error.message;
                    
                            console.log("errorCode = " + errorCode);
                            console.log("errorMessage = " + errorMessage);
                    
                            this_var.setState({ error: errorMessage, loading: false });
                        })
                    })
                    .catch( (errorParam) => {
                        console.log("failure in SIGN UP")
                        console.log(errorParam);

                        // errorParam is an object, but errorParam.message is a string. error only accepts string
                        this_var.setState({ error: errorParam.message, loading: false });

                        Alert.alert(
                            'Error',
                            'Your phone number cannot be activated. Please contact the staff.',
                            [
                                {text: 'Return to Login Page', onPress: () => Actions.auth() }
                            ]
                        )
                    })
                }
                else {
                    console.log("There is no account associated with '" + patientPhoneNumber + "'.")
                    Alert.alert(
                        'Error',
                        'Your phone number cannot be found in our database. Please contact the staff.',
                        [
                            {text: 'Return to Login Page', onPress: () => Actions.auth() }
                        ]
                    )
                }
            }, function (error) {
                console.log("firebase.database().ref('PatientAccounts/').orderByChild('patientPhoneNumber').equalTo(patientPhoneNumber).once(\"value\", function (snapshot) {....} FAILED")
                console.log(error);
            });
    }


    renderButton() {
        if (this.state.loading) {
            return (
                <View>
                    <ActivityIndicator size={"small"} />
                </View>
            )
        } else {
            return (
                <TouchableOpacity style={styles.buttonContainer}
                    onPress={this.activateAccount.bind(this)}>
                    <Text style={styles.buttonText}>Activate my account</Text>
                </TouchableOpacity>
            )
        }
    }

    render() {
        return (
            <View style={styles.container}>
                <Text style={styles.text}>Please enter your phone number</Text>
                <TextInput
                    style={styles.input}
                    secureTextEntry={false}
                    autoCapitalize="none"
                    onChangeText={patientPhoneNumber => this.setState({ patientPhoneNumber })}
                    value={this.state.patientPhoneNumber} />
                {this.renderButton()}
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#ffffff',
    },
    text: {
        alignSelf: 'flex-start',
        paddingLeft: 40,
        paddingRight: 40,
        fontSize: 16,
        textShadowColor: '#c4c4c4',
        textShadowOffset: { width: 0.5, height: 0 },
        textShadowRadius: 1,
    },
    input: {
        width: Dimensions.get('window').width - 80,
        height: 46,
        borderColor: "#96A0AF",
        borderBottomWidth: StyleSheet.hairlineWidth,
        marginBottom: 20,
        fontSize: 18
    },
    buttonContainer : {
        backgroundColor: "#0074D9",
        paddingVertical: 12,
        width: Dimensions.get('window').width - 80,
        borderRadius: 8,
        margin: 10,
    },
    buttonText: {
        color: "#FFF",
        textAlign: "center",
        height: 20,
        fontWeight: 'bold'
    }
});

export default PatientSignUp;