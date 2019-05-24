import React, { Component } from 'react';
import { Alert, Image, Dimensions, View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator, ScrollView } from 'react-native';
import TouchID from 'react-native-touch-id';
import firebase from 'firebase';
import { Actions } from 'react-native-router-flux';

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
                    <Text style={styles.buttonText}>Login</Text>
                </TouchableOpacity>
            )
        }
    }

    render() {
        return (
            <View style={styles.container}>
                <Image
                    style={{ width: 110, height: 110, borderRadius: 20 }}
                    source={require('../../appIcon/dante-patient.png')} />
                <Text style={styles.header}>Dante Patient</Text>
                <Text style={styles.text}>Your Phone Number</Text>
                <TextInput
                    style={styles.input}
                    secureTextEntry={false}
                    autoCapitalize="none"
                    onChangeText={email => { this.setState({ email }) }}
                    value={this.state.email} />
                <Text style={styles.text}>PIN</Text>
                <TextInput
                    style={styles.input}
                    secureTextEntry={true}
                    autoCapitalize="none"
                    onChangeText={password => this.setState({ password })}
                    value={this.state.password} />
                {this.renderButton()}
                <Text
                    style={[styles.text, { fontSize: 14, alignItems: 'center' }]}>
                    Face ID/Touch ID will be auto-triggered once you have signed in
                </Text>
                <View style={styles.footer}>
                    <Text style={[styles.text, { alignSelf: 'center' }]}>New User?</Text>
                    <TouchableOpacity style={styles.buttonContainer}
                        // onPress will auto trigger if not including { () => { .... } }
                        onPress={() => { Actions.signUp(); }}>
                        <Text style={styles.buttonText}>Activate Your Account</Text>
                    </TouchableOpacity>
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    header: {
        paddingVertical: 40,
        fontSize: 30,
        fontFamily: 'Futura',
        fontWeight: 'bold',
        textShadowColor: '#c4c4c4',
        textShadowOffset: { width: 1, height: 0 },
        textShadowRadius: 2
    },
    container: {
        flex: 1,
        alignItems: 'center',
        paddingTop: 80,
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
    buttonContainer: {
        backgroundColor: "#0074D9",
        paddingVertical: 12,
        width: 300,
        borderRadius: 4,
        margin: 10,
    },
    buttonText: {
        color: "#FFF",
        textAlign: "center",
        fontWeight: 'bold',
        fontSize: 18
    },
    footer: {
        height: 120,
        position: 'absolute',
        bottom: 20,
        borderColor: '#96A0AF'
    }
});

export default PatientLogin;
