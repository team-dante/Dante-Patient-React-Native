'use strict';
import React, { Component } from 'react';
import {StyleSheet, Image, ScrollView, Text } from 'react-native';
import firebase from 'firebase';

export default class ShowMap extends Component {
    constructor(props) {
        super(props);
        // email = phoneNumber + @email.com
        this.state = { patientName: '', queueNum: '', queueNotFound: true };
    }
    componentWillMount() {
        // locate current user's phone num
        let user = firebase.auth().currentUser;
        let phoneNum = user.email.split("@")[0];
        // this keyword would not work under callback fxn
        var self = this;

        
        firebase.database().ref('/WaitingQueue').on("value", function(snapshot){
            snapshot.forEach( (data) => {
                if (data.key == phoneNum.toString()){
                    console.log(data.key + ': ' + data.val())
                    self.setState({ queueNum: data.val(), queueNotFound: false })
                    if (data.val() == -1)
                        self.setState({ queueNotFound: true })
                }
            })
        })


        // search for the staff obj that has the same phoneNum as currentUser has
        firebase.database().ref(`/Patients`).orderByChild("patientPhoneNumber").equalTo(phoneNum)
            .once('value', function(snapshot) {
                let firstNameVal = '';
                snapshot.forEach(function (data) {
                    firstNameVal = data.val().firstName;
                });
                console.log("line 27=" + firstNameVal)
                self.setState( { patientName : firstNameVal } );
                // running console.log(patientName) here would cause crash
            });
    }
    renderPositionText(){
        const { queueNum } = this.state;

        if (this.state.queueNotFound) {
            return (
                <Text style={styles.topText}>You are not registered in the waiting list.</Text>
            )
        }
        else {
            return (
                <Text style={styles.topText}>There are #{queueNum} people ahead of you.</Text>
            )
        }
    }
    render() {
        return (
            <ScrollView minimumZoomScale={1} maximumZoomScale={3} contentContainerStyle={styles.container}>
                { this.renderPositionText() }
                <Image source={require("../assets/radOncMap.png")} 
                style={styles.image}
                resizeMode="contain">
                </Image>
            </ScrollView>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#ffffff'
    },
    image: {
        flex:1, 
        height: undefined, 
        width: undefined
    },
    topText: {
        color: '#ffffff',
        textAlign: 'center',
        margin: 20,
        fontSize: 30,
        borderWidth: 1,
        borderRadius: 10,
        backgroundColor: '#428AF8',
        borderColor: '#ffffff',
        overflow: 'hidden'
    },
});