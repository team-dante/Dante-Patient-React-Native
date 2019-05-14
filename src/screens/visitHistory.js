import React, { Component } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import firebase from 'firebase';

class VisitHistory extends Component {
    constructor(props) {
        super(props);
        this.state = { records: [], dateToday: '' };
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
        this.setState({dateToday: today});

        firebase.database().ref('/PatientVisits/' + phoneNumber).on(
            'value', function(snapshot) {
                self.setState({records: snapshot.val()})
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

    getKeyValues(time) {
        time_lst = []
        for (let i in time) {
            time_lst.push(
                <Text key={i}>{i}: {time[i]}</Text>
            );
        }
        return time_lst;
    }

    getTime(record) {
        var dates = []
        for (let i in record) {
            dates.push(
                <View>
                    <Text key={i}>{i}</Text>
                    {this.getKeyValues(record[i])}
                </View>
            );
        }
        return dates;
    }

    getCategories(records) {
        var cateogories = []
        for (let cat in records) {
            cateogories.push(
                <View>
                    <Text key={cat}>{cat}</Text>
                    {this.getTime(records[cat])}
                </View>
            );
        }
        return cateogories;
    }

    render() {
        return (
            <View>
                {this.getCategories(this.state.records)}
            </View>
        );
    }
}
const styles = StyleSheet.create({

});

export default VisitHistory;