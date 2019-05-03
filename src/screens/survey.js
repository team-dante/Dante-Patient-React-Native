import React, { Component } from 'react';
import { View, Text, StyleSheet, Picker, TextInput, TouchableOpacity } from 'react-native'
import firebase from 'firebase'
import { Actions } from 'react-native-router-flux';

export default class Feedback extends Component {

    constructor(props) {
        super(props);
        this.state = { rating: '', comments: '' };
    }


    render() {
        return (
            <View style={styles.container}>
                <Text>1. How do you feel about this visit?</Text>
                <Picker
                    selectedValue={this.state.rating}
                    // style={{ height: 10, width: 100 }}
                    onValueChange={(itemValue, itemIndex) =>
                        this.setState({ rating: itemValue })
                    }>
                    <Picker.Item label="5" value="5" />
                    <Picker.Item label="4" value="4" />
                    <Picker.Item label="3" value="3" />
                    <Picker.Item label="2" value="2" />
                    <Picker.Item label="1" value="1" />
                </Picker>
                <Text>2. Any comments that we can improve?</Text>
                <TextInput
                    style={styles.textarea}
                    multiline={true}
                    numberOfLines={10}
                    placeholder="Type something"
                    placeholderTextColor="grey"
                    onChangeText={(value) => this.setState({ comments : value })}
                    value={this.state.comments}
                />
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
        backgroundColor: '#fcfcfc'
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
        fontWeight: 'bold',
        fontSize: 18
    },
    textarea: {
        height: 150,
        width: 250,
        borderColor: 'gray',
        borderWidth: 1,
    }
});