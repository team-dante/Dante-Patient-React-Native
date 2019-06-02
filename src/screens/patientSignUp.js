import React, { Component } from 'react';
import { Dimensions, View, Text, TextInput, TouchableOpacity, Alert, StyleSheet, ActivityIndicator, Keyboard, SafeAreaView, Platform, KeyboardAvoidingView } from 'react-native';
import firebase from 'firebase';
import { Actions } from 'react-native-router-flux';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

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
                        .then(() => {
                            console.log("success in SIGN UP")
                            // sign in if creating a new account succesfully
                            firebase.auth().signInWithEmailAndPassword(email, patientPin)
                                .then((user) => {
                                    console.log("success in SIGN IN");
                                    console.log(user)
                                    this_var.setState({
                                        loading: false
                                    });
                                    Actions.map();
                                })
                                .catch((error) => {
                                    console.log("failure in SIGN IN");

                                    let errorCode = error.code;
                                    let errorMessage = error.message;

                                    console.log("errorCode = " + errorCode);
                                    console.log("errorMessage = " + errorMessage);

                                    this_var.setState({ error: errorMessage, loading: false });
                                })
                        })
                        .catch((errorParam) => {
                            console.log("failure in SIGN UP")
                            console.log(errorParam);

                            // errorParam is an object, but errorParam.message is a string. error only accepts string
                            this_var.setState({ error: errorParam.message, loading: false });

                            Alert.alert(
                                'Error',
                                'Your phone number cannot be activated. Please contact the staff.',
                                [
                                    { text: 'Return to Login Page', onPress: () => Actions.auth() }
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
                            { text: 'Return to Login Page', onPress: () => Actions.auth() }
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
                    <Text style={styles.buttonText}>ACTIVATE</Text>
                </TouchableOpacity>
            )
        }
    }

    render() {
        const shouldSetResponse = () => true;
        const onRelease = () => (
            Keyboard.dismiss()
        );
        return (
            <KeyboardAvoidingView
                behavior={Platform.OS === "ios" ? "padding" : null}
                style={{ flex: 1 }} >
                <SafeAreaView style={styles.container}>
                    <View
                        onResponderRelease={onRelease}
                        onStartShouldSetResponder={shouldSetResponse}
                        style={{ height: hp('100%') }} style={styles.inner}>
                        <View style={styles.container}>
                            <Text style={styles.fieldTitle}>Please enter your phone number</Text>
                            <TextInput
                                style={styles.input}
                                secureTextEntry={false}
                                autoCapitalize="none"
                                onChangeText={patientPhoneNumber => this.setState({ patientPhoneNumber })}
                                value={this.state.patientPhoneNumber} />
                            {this.renderButton()}
                        </View>
                    </View>
                </SafeAreaView>
            </KeyboardAvoidingView>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#f9f9f9'
    },
    inner: {
        paddingBottom: hp('1%'),
        flex: 1,
        justifyContent: "flex-end",
    },
    fieldTitle: {
        color: '#53ACE6',
        fontSize: wp('4.5%'),
        fontFamily: 'Rubik-Medium'
    },
    input: {
        width: wp('80%'),
        height: hp('5.2%'),
        borderColor: "#53ACE6",
        borderWidth: 1,
        borderRadius: 50,
        marginTop: hp('1.3%'),
        marginLeft: -wp('2%'),
        marginRight: -wp('2%'),
        marginBottom: hp('3.2%'),
        paddingLeft: wp('4%'),
        fontSize: wp('4.5%'),
        backgroundColor: '#f9f9f9',
        shadowColor: "#3d3d3d",
        shadowOffset: {
            width: 0,
            height: 3,
        },
        shadowOpacity: 0.36,
        shadowRadius: 1,
        elevation: 11,
        color: '#3d3d3d'
    },
    buttonContainer: {
        marginTop: hp('1.8%'),
        width: wp('78%'),
        backgroundColor: "#53ACE6",
        paddingVertical: hp('1%'),
        height: hp('5.5%'),
        borderRadius: 40,
        justifyContent: 'center',
        alignSelf: 'center'
    },
    buttonText: {
        color: "#FFF",
        textAlign: "center",
        fontWeight: 'bold',
        fontSize: wp('5%'),
        fontFamily: 'Rubik-Medium'
    }
});

export default PatientSignUp;