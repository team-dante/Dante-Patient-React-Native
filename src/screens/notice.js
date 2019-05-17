import React, { Component } from 'react';
import { Alert, View, Text, StyleSheet, Dimensions, TextInput, TouchableOpacity, Keyboard } from 'react-native'
import { Actions } from 'react-native-router-flux';

class Notice extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <View style={styles.container}>
                <Text style={styles.text}>{this.props.text}</Text>
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
    text: {
        textAlign: 'center',
        fontSize: 20,
    },
    buttonContainer: {
        backgroundColor: "#0074D9",
        paddingVertical: 12,
        width: 300,
        borderRadius: 4,
        margin: 10,
        position: "absolute",
        top: 570
    },
    buttonText: {
        color: "#FFF",
        textAlign: "center",
        fontWeight: 'bold',
        fontSize: 18
    }
});

export default Notice;