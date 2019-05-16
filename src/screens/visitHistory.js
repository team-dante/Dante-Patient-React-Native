import React, { Component } from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import firebase from 'firebase';

class VisitHistory extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: [],
        };
    }

    componentDidMount() {
        console.log("im in componentWillmount");
        let user = firebase.auth().currentUser;
        console.log(user);

        let phoneNumber = user.email.split('@')[0];
        console.log("phoneNumber = " + phoneNumber);

        var self = this;
        let now = new Date();
        let today = this.formattedDate(now);
        this.setState({ dateToday: today });

        firebase.database().ref('/PatientVisits/' + phoneNumber).on(
            'value', function (snapshot) {
                // console.dir(snapshot.val())
                let dataArr = new Array();
                let innerDataJson = {}
                let innerTimeCatJson = {}
                let innerTimeKeyTimeValJson = {}
                snapshot.forEach((roomCat) => {
                    innerDataJson["roomCat"] = roomCat.key
                    innerDataJson["innerTimeCatJson"] = innerTimeCatJson

                    snapshot.ref.child(roomCat.key).on('value', function (timeCatSnapshot) {
                        timeCatSnapshot.forEach( (timeCat) => {
                            innerTimeCatJson["timeCat"] = timeCat.key
                            innerTimeCatJson["innerTimeKeyTimeValJson"] = innerTimeKeyTimeValJson

                            timeCatSnapshot.ref.child(timeCat.key).on('value', function (dataSnapshot) {
                                dataSnapshot.forEach( (data) => {
                                    innerTimeKeyTimeValJson["timeKey"] = data.key
                                    innerTimeKeyTimeValJson["timeVal"] = data.val()
                                })
                            })
                        })
                    })
                    console.log(innerDataJson)
                });
                
                self.setState({data : dataArr})
            })

    }

    formattedDate(now) {
        var month = now.getMonth() + 1;
        var formattedMonth = month < 10 ? '0' + month : month;
        var date = now.getDate();
        var formattedDate = date < 10 ? '0' + date : date;
        // outputs "2019-05-10"
        return now.getFullYear() + '-' + formattedMonth + '-' + formattedDate;
    }

    render() {
        console.log(this.state.data)
        return (
            <View style={styles.container}>
                <FlatList
                    data={this.state.data}
                    renderItem={({ item }) =>
                        <View style={styles.flatview}>
                            <Text style={styles.text}>{item.roomCat}</Text>
                            <Text style={styles.text}>{item.timeCat}</Text>
                            <Text style={styles.text}>{item.timeKey}</Text>
                            <Text style={styles.text}>{item.timeVal}</Text>
                        </View>
                    }
                />
            </View>
        );
    }
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFF',
    },
    flatview: {
        justifyContent: 'center',
        paddingVertical: 20,
        paddingHorizontal: 20,
        borderWidth: 1,
        borderRadius: 10,
        backgroundColor: '#428AF8',
        borderColor: '#ffffff',
        margin: 10
    },
    text: {
        color: 'white',
        fontSize: 15
    }
});

export default VisitHistory;