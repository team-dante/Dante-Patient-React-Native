import React, { Component } from 'react';
import { View, Text, StyleSheet, SectionList } from 'react-native';
import firebase from 'firebase';

class SectionListItem extends Component {

    dateToStr(durationEpoch) {
        let seconds = Math.floor((durationEpoch / 1000) % 60),
            minutes = Math.floor((durationEpoch / (1000 * 60)) % 60),
            hours = Math.floor((durationEpoch / (1000 * 60 * 60)) % 24);

        hours = (hours < 10) ? "0" + hours : hours;
        minutes = (minutes < 10) ? "0" + minutes : minutes;
        seconds = (seconds < 10) ? "0" + seconds : seconds;
        return hours + " hours, " + minutes + " minutes, " + seconds + " seconds";
    }
    dateBeautify(epochTime) {
        let days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

        let date = new Date(epochTime)
        let day = days[date.getDay()];
        let suffix = hours >= 12 ? "PM" : "AM";
        let hours = ((date.getHours() + 11) % 12 + 1);
        return day + " " + hours + ":" + date.getMinutes() + " " + suffix
    }

    getTimeSpent(data) {
        if (data.includes("NaN"))
            return (
                <Text style={styles.textBody}>Time Spent: None</Text>
            );
        else {
            return (
                <Text style={styles.textBody}>Time Spent: {data}</Text>
            );
        }
    }

    getEndTime(data) {
        if (data.includes("NaN"))
            return (
                <Text style={styles.textBody}>End Time: None</Text>
            );
        else {
            return (
                <Text style={styles.textBody}>End Time: {data}</Text>
            );
        }
    }

    render() {
        return (
            <View style={styles.sectionListItemView}>
                <Text style={styles.textHeader}>{this.props.item.location}</Text>
                <Text style={styles.textBody}>Start Time: {this.dateBeautify(this.props.item.startTime)}</Text>
                {this.getEndTime(this.dateBeautify(this.props.item.endTime))}
                {this.getTimeSpent(this.dateToStr(this.props.item.diffTime))}
            </View>
        );
    };
}
class SectionHeader extends Component {
    render() {
        return (
            <View style={{ flex: 1 }}>
                <Text style={styles.sectionHeader}>{this.props.section.date}</Text>
            </View>
        );
    }
}
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

        firebase.database().ref('/PatientVisitsByDates/' + phoneNumber).on(
            'value', function (snapshot) {
                self.setState({ data: self.convertToSectionList(snapshot.val()) })
            })
    }
    // [{data: [{...},{...}], date: <some Date>}, {data: [{...},{...}], date: <some Date>}]
    convertToSectionList(data) {
        sectionList = []
        for (let i in data) {
            obj_lst = []
            for (let j in data[i]) {
                let inner_dict = {
                    location: j,
                    diffTime: data[i][j]["diffTime"],
                    startTime: data[i][j]["startTime"],
                    endTime: data[i][j]["endTime"]
                }
                obj_lst.push(inner_dict)
            }
            let outer_dict = { data: obj_lst, date: i }
            sectionList.push(outer_dict)
        }
        return sectionList
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
                <SectionList
                    renderItem={({ item, index }) => {
                        return (
                            <SectionListItem item={item} index={index} >
                            </SectionListItem>
                        );
                    }}
                    renderSectionHeader={({ section }) => {
                        return (
                            <SectionHeader section={section} />
                        );
                    }}
                    sections={this.state.data}
                    keyExtractor={(item, index) => { item.startTime }}
                >
                </SectionList>
            </View>
        );
    }
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFF',
    },
    sectionListItemView: {
        flex: 1,
        flexDirection: 'column',
        backgroundColor: 'white',
        borderRadius: 10,
        margin: 7,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 5,
        },
        shadowOpacity: 0.36,
        shadowRadius: 6.68,

        elevation: 11,
    },
    textHeader: {
        fontSize: 17,
        fontWeight: 'bold',
        marginLeft: 20,
        marginRight: 10,
        marginTop: 20,
        paddingBottom: 5,
        color: 'hsla(197, 100%, 20%, 1.0)'
    },
    textBody: {
        color: 'hsla(197, 100%, 20%, 1.0)',
        fontSize: 16,
        marginLeft: 20,
        marginRight: 10,
        marginBottom: 7
    },
    sectionHeader: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#ADADAD',
        margin: 20
    }
});

export default VisitHistory;