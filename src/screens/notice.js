import React, { Component } from 'react';
import { Alert, View, Text, StyleSheet, Dimensions, TextInput, TouchableOpacity, Keyboard } from 'react-native'
import { Actions } from 'react-native-router-flux';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';

class Notice extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <View style={styles.container}>
                <View style={styles.messageBox}>
                    <Text style={styles.text}>{this.props.text}</Text>
                </View>
                <TouchableOpacity style={styles.buttonContainer} onPress={() => {
                    Actions.map();
                }}>
                    <Text style={styles.buttonText}>Back to Map</Text>
                </TouchableOpacity>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: "#FFF",
    },
    messageBox: {
        backgroundColor: 'white',
        borderRadius: 25,
        borderWidth: 2,
        borderColor: '#3D95CE',
        margin: wp('5%'),
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 5,
        },
        shadowOpacity: 0.36,
        shadowRadius: 6.68,
        elevation: 11,
    },
    text: {
        textAlign: 'center',
        fontSize: 22,
        fontFamily: 'Poppins-Regular',
        padding: wp('7%')
    },
    buttonContainer: {
        backgroundColor: "#3D95CE",
        paddingVertical: hp('2%'),
        width: wp('60%'),
        borderRadius: 25,
        justifyContent: 'center'
    },
    buttonText: {
        color: "#FFF",
        textAlign: "center",
        fontWeight: 'bold',
        fontSize: wp('5%')
    }
});

export default Notice;