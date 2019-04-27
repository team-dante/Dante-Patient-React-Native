import React, { Component } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, Button, StyleSheet, StatusBar, ActivityIndicator } from 'react-native';
import firebase from 'firebase';

export default class PatientSignUp extends Component {
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

        firebase.database().ref('PatientAccounts/')
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
                            this_props.navigation.navigate('PatientWelcome');
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
                                {text: 'Return to Login Page', onPress: () => this_props.navigation.navigate('PatientLogin') }
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
                            {text: 'Return to Login Page', onPress: () => this_props.navigation.navigate('PatientLogin') }
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
                <Text style={styles.errorTextStyle}>
                    {this.state.error}
                </Text>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F5FCFF',
    },
    text: {
        alignSelf: 'flex-start',
        paddingLeft: 60
    },
    input: {
        width: 300,
        height: 40,
        borderColor: "#BEBEBE",
        borderBottomWidth: StyleSheet.hairlineWidth,
        marginBottom: 20
    },
    buttonContainer: {
        backgroundColor: "#428AF8",
        paddingVertical: 12,
        width: 300,
        borderRadius: 4,
        borderColor: "rgba(255,255,255,0.7)",
        margin: 10,
    },
    buttonText: {
        color: "#FFF",
        textAlign: "center",
        height: 20
    },
    errorTextStyle: {
        fontSize: 16,
        textAlign: 'center',
        color: 'red'
    },
});
