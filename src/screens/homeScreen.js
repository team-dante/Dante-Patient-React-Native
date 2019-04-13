'use strict';
import React, { Component } from 'react';
import {StyleSheet, View, Text, TouchableOpacity} from 'react-native';

export default class HomeScreen extends React.Component {
    render() {
        return (
            <View style={styles.container}>
                <Text style={styles.bigText}>Welcome to Dante App!</Text>
                <Text style={styles.smallText}>To get started, please choose approriate role.</Text>
                <TouchableOpacity style={styles.buttonContainer} onPress={() => this.props.navigation.navigate('StaffLogin')}>
                    <Text style={styles.buttonText}>Staff</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.buttonContainer} onPress={() => {} }>
                    <Text style={styles.buttonText}>Patient</Text>
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
        backgroundColor: '#F5FCFF',
    },
    bigText: {
        fontSize: 30,
        textAlign: 'center',
        margin: 10,
    },
    smallText: {
        fontSize: 15,
        textAlign: 'center',
        color: '#333333',
        margin: 10,
    },
    buttonContainer : {
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
    }
});
