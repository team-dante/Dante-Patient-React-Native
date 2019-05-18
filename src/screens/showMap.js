'use strict';
import React, { Component } from 'react';
import {StyleSheet, Image, ScrollView, Text } from 'react-native';
import firebase from 'firebase';

class ShowMap extends Component {

    constructor(props) {
        super(props);
        // email = phoneNumber + @email.com
        this.state = { patientName: '', queueNum: '', queueNotFound: true };
        this.realTimeInterval = 0;
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

        // get today's date
        let now = new Date();
        let keyMonthDateYear = this.formattedDate(now);

        // if the patient is still inside a room, or the whole visit is not over, clock ticking
        // even if patient closes the app and reopens again, clock will work correctly
        this.realTimeInterval = setInterval(()=> {
            firebase.database().ref('/PatientVisitsByDates/' + phoneNum + '/' + keyMonthDateYear)
            .once('value', function (snapshot) {
                snapshot.forEach((data) => {
                    if (data.val().inSession == true) {
                        let start = data.val().startTime;
                        let now = Date.now();
                        data.ref.update({
                            endTime: now,
                            diffTime: now - start
                        })
                    }
                });
            });
        }, 1000);

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

    formattedDate(now) {
        var month = now.getMonth() + 1;
        var formattedMonth = month < 10 ? '0' + month : month;
        var date = now.getDate();
        var formattedDate = date < 10 ? '0' + date : date;
        // outputs "2019-05-10"
        return now.getFullYear() + '-' + formattedMonth + '-' + formattedDate;
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
                <Text style={styles.topText}>Number of people ahead of you: {queueNum}</Text>
            )
        }
    }
    
    componentWillUnmount() {
        clearInterval(this.realTimeInterval);
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
        paddingVertical: 20,
        paddingHorizontal: 5,
        fontSize: 23,
        borderWidth: 1,
        borderRadius: 10,
        backgroundColor: "#3DCEBF",
        borderColor: '#ffffff',
        overflow: 'hidden'
    },
});

export default ShowMap;