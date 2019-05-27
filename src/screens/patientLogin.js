import React, { Component } from 'react';
import { Alert, Image, Dimensions, View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator, Keyboard, SafeAreaView, Platform } from 'react-native';
import TouchID from 'react-native-touch-id';
import firebase from 'firebase';
import { Actions } from 'react-native-router-flux';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { KeyboardAvoidingView } from 'react-native';

class PatientLogin extends Component {
    constructor(props) {
        super(props);
        // email = phoneNumber + @emai.com
        // password = 6-digit PIN
        this.state = { email: '', password: '', error: '', loading: '' };
    }

    componentWillMount() {
        console.log("im in componentWillMount");

        let firstTrigger = true;

        // this will check if the user is logged in or not
        firebase.auth().onAuthStateChanged((user) => {
            console.log("firebase.auth().onAuthStateChanged is called...");
            if (user && firstTrigger) {
                const optionalConfigObject = {
                    fallbackLabel: 'Show Passcode',
                    unifiedErrors: false,
                    passcodeFallback: false,
                };
                console.log("user is logged in")
                console.log("starting authentication");
                TouchID.authenticate('to demo this react-native component', optionalConfigObject)
                    .then(success => {
                        console.log('Authenticated Successfully');
                        console.log("success = " + success);
                        Actions.map()
                    })
                    .catch(error => {
                        console.log('Authentication Failed');
                        console.log("error = " + error);
                    });
            }
            else {
                firstTrigger = false;
                console.log("firstTrigger=" + firstTrigger);
                console.log("user is not logged in");
            }
        });
    }

    onButtonPress() {
        this.setState({ error: '', loading: true })
        let { email, password } = this.state;

        email += "@email.com";
        password += "ABCDEFG";
        console.log('email = ' + email);
        console.log('password = ' + password);

        firebase.auth().signInWithEmailAndPassword(email, password)
            .then((user) => { this.onLoginSuccess.bind(this)(user); })
            .catch((error) => { this.onLoginFailure.bind(this)(error); });
    }

    onLoginSuccess(user) {
        console.log("SUCCESS");
        console.log(user);
        this.setState({
            email: '', password: '', error: '', loading: false
        });
        Actions.map();
    }

    onLoginFailure(errorParam) {
        console.log("FAILURE");

        let errorCode = errorParam.code;
        let errorMessage = errorParam.message;

        console.log("errorCode = " + errorCode);
        console.log("errorMessage = " + errorMessage);

        this.setState({ error: errorMessage, loading: false, email: '', password: '' });
        Alert.alert(
            'Error',
            'This is no user record associated with this identifier. The user may have been deleted.',
            [
                { text: 'Close' }
            ]
        )
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
                    onPress={this.onButtonPress.bind(this)}>
                    <Text style={styles.buttonText}>SIGN IN</Text>
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
                style={{ flex: 1 }}
            >
                <SafeAreaView style={styles.container}>
                    <View
                        onResponderRelease={onRelease}
                        onStartShouldSetResponder={shouldSetResponse}
                        style={{ height: hp('100%') }} style={styles.inner}>
                        <View style={styles.headingBackground}></View>
                        <View style={styles.header}>
                            <View style={styles.thumbnailContainer}>
                                <Image
                                    style={{ width: 100, height: 100, borderRadius: 20 }}
                                    source={require('../../appIcon/dante-patient.png')} />
                            </View>
                            <View style={styles.headerContent}>
                                <Text style={styles.headerText}>Dante</Text>
                                <Text style={styles.headerText}>Patient</Text>
                            </View>
                        </View>
                        <View style={styles.card}>
                            <Text style={styles.cardTitle}>Welcome Back</Text>

                            <Text style={styles.fieldTitle}>Phone Number</Text>
                            <TextInput
                                style={styles.input}
                                secureTextEntry={false}
                                autoCapitalize="none"
                                keyboardType='numeric'
                                onChangeText={email => { this.setState({ email }) }}
                                value={this.state.email} />

                            <Text style={styles.fieldTitle}>PIN</Text>
                            <TextInput
                                style={styles.input}
                                secureTextEntry={true}
                                autoCapitalize="none"
                                keyboardType='numeric'
                                onChangeText={password => this.setState({ password })}
                                value={this.state.password} />
                            {this.renderButton()}
                            <Text
                                style={styles.captions}>
                                Face ID/Touch ID will be auto-triggered once you have signed in
                            </Text>
                            <View style={styles.divider}></View>
                            <View style={styles.footer}>
                                <Text style={styles.footerText}>New Patient?</Text>
                                <TouchableOpacity style={styles.buttonContainer}
                                    // onPress will auto trigger if not including { () => { .... } }
                                    onPress={() => { Actions.signUp(); }}>
                                    <Text style={styles.buttonText}>ACTIVATE ACCOUNT</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                </SafeAreaView>
            </KeyboardAvoidingView >
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f9f9f9'
    },
    inner: {
        paddingBottom: hp('1%'),
        flex: 1,
        justifyContent: "flex-end",
    },
    headingBackground: {
        top: 0,
        height: hp('35%'),
        width: wp('100%'),
        backgroundColor: '#53ACE6',
        position: 'absolute'
    },
    header: {
        marginTop: hp('7.5%'),
        flexDirection: 'row',
        paddingLeft: wp('14%'),
        paddingRight: wp('12%'),
    },
    thumbnailContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: wp('6%')
    },
    headerContent: {
        flexDirection: 'column',
        justifyContent: 'space-around'
    },
    headerText: {
        fontSize: wp('8%'),
        fontFamily: 'Poppins-Bold',
        color: '#fcfcfc',
    },
    card: {
        marginLeft: wp('8%'),
        marginRight: wp('8%'),
        marginTop: hp('4%'),
        padding: wp('7%'),
        borderRadius: 20,
        height: hp('70%'),
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 5,
        },
        shadowOpacity: 0.36,
        shadowRadius: 6.68,
        elevation: 11,
        backgroundColor: '#fff'
    },
    cardTitle: {
        color: '#3d3d3d',
        fontSize: wp('6%'),
        fontFamily: 'Poppins-Bold',
        marginBottom: hp('3.6%'),
        letterSpacing: 0.5
    },
    fieldTitle: {
        color: '#53ACE6',
        fontSize: wp('4.5%'),
        fontFamily: 'Rubik-Medium'
    },
    input: {
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
        backgroundColor: "#53ACE6",
        paddingVertical: hp('1%'),
        height: hp('5.5%'),
        borderRadius: 40,
        justifyContent: 'center',
        alignSelf: 'stretch'
    },
    buttonText: {
        color: "#FFF",
        textAlign: "center",
        fontWeight: 'bold',
        fontSize: wp('5%'),
        fontFamily: 'Rubik-Medium'
    },
    captions: {
        alignSelf: 'center',
        color: '#767777',
        fontSize: wp('3.5%'),
        marginTop: hp('1.5%'),
        fontFamily: 'Rubik-Regular'
    },
    divider: {
        borderTopColor: '#ececec',
        borderTopWidth: 1.5,
        marginTop: hp('3%')
    },
    footer: {
        marginTop: hp('2%')
    },
    footerText: {
        fontSize: wp('4%'),
        color: '#3d3d3d',
        alignSelf: 'center',
        fontFamily: 'Poppins-Regular'
    }
});

export default PatientLogin;
