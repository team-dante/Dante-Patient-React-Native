import React, { Component } from 'react';
import { View, Text, StyleSheet, Dimensions, TextInput, TouchableOpacity, Keyboard } from 'react-native'
import firebase from 'firebase'
import { Actions } from 'react-native-router-flux';
import { TouchableWithoutFeedback } from 'react-native-gesture-handler';

export default class Feedback extends Component {

    constructor(props) {
        super(props);
        this.state = { rating: '', comments: '' };
    }


    render() {
        return (

            <View style={styles.container}>
                <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false} >
                    <View style={styles.container}>
                        <Text styles={styles.topText}>1. On a scale of 1 to 5, what do you rate this visit?</Text>
                        <TextInput
                            style={styles.ratingInput}
                            placeholder="Please enter your rating..."
                            placeholderTextColor="grey"
                            onChangeText={rating => { this.setState({ rating }) }}
                            value={this.state.rating} />
                        <Text styles={styles.topText}>2. Any comments that we can improve?</Text>
                        <TextInput
                            style={styles.textarea}
                            multiline={true}
                            numberOfLines={10}
                            placeholder="Please enter your comments..."
                            placeholderTextColor="grey"
                            onChangeText={(value) => this.setState({ comments: value })}
                            value={this.state.comments}
                        />
                    </View>
                </TouchableWithoutFeedback>
                <TouchableOpacity style={styles.buttonContainer} onPress={() => { Actions.map() }}>
                    <Text style={styles.buttonText} >Submit</Text>
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
        backgroundColor: '#ffffff'
    },
    topText: {
        fontSize: 18,
        margin: 5,
    },
    buttonContainer: {
        backgroundColor: "#428AF8",
        paddingVertical: 12,
        width: 300,
        borderRadius: 4,
        borderColor: "rgba(255,255,255,0.7)",
        margin: 10,
        position: "absolute",
        top: 570
    },
    buttonText: {
        color: "#FFF",
        textAlign: "center",
        fontWeight: 'bold',
        fontSize: 18
    },
    textarea: {
        height: 150,
        width: 250,
        borderWidth: 0.5,
        borderRadius: 4,
        backgroundColor: "#f1f1f1",
        marginVertical: 10,
    },
    ratingInput: {
        width: 250,
        borderWidth: 0.5,
        borderRadius: 4,
        backgroundColor: "#f1f1f1",
        marginVertical: 10,
    },
}); 