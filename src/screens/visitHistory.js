import React, { Component } from 'react';
import { View, Text, StyleSheet, SectionList } from 'react-native';
import firebase from 'firebase';

class SectionListItem extends Component {

    // @params(epoch time)
    // return [hour, minutes, seconds]
    dateToStr(durationEpoch) {
        let seconds = Math.floor((durationEpoch / 1000) % 60),
            minutes = Math.floor((durationEpoch / (1000 * 60)) % 60),
            hours = Math.floor((durationEpoch / (1000 * 60 * 60)) % 24);
        hours = (hours < 10) ? "0" + hours : hours;
        minutes = (minutes < 10) ? "0" + minutes : minutes;
        seconds = (seconds < 10) ? "0" + seconds : seconds;
        return [hours, minutes, seconds];
    }

    // beautify location strings
    locBeautify(location) {
        if (location == 'OverallDuration')
            return <Text style={styles.textHeader}>Overall Visit</Text>
        else if (location == 'Waiting Room')
            return <Text style={styles.textHeader}>Waiting Room</Text>
        else if (location == 'Exam Room')
            return <Text style={styles.textHeader}>Exam Room</Text>
        else if (location == 'Treatment Room 1')
            return <Text style={styles.textHeader}>Treatment Room 1</Text>
        else if (location == 'Treatment Room 2')
            return <Text style={styles.textHeader}>Treatment Room 2</Text>
        else if (location == 'CT Room')
            return <Text style={styles.textHeader}>CT Room</Text>
        else if (location == 'ZTransition')
            return <Text style={styles.textHeader}>Transition Time</Text>
        else {
            return <Text style={styles.textHeader}>{location}</Text>
        }
    }

    // beautify date to HH:MM (AM/PM) format
    dateBeautify(epochTime) {
        let date = new Date(epochTime)
        let hours = ((date.getHours() + 11) % 12 + 1);
        let minutes = date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes();
        let suffix = date.getHours() > 12 ? "PM" : "AM";
        return hours + ":" + minutes + " " + suffix;
    }

    // HH hrs MM mins SS secs spent
    getTimeSpent(data) {
        if (data.includes("NaN"))
            return <Text style={styles.cardContents}>Time Spent: None</Text>
        else {
            return (
                <Text style={styles.cardContents}>
                    <Text style={{ fontSize: 28 }}>{data[0]}</Text> hrs
                    <Text style={{ fontSize: 28 }}> {data[1]}</Text> mins
                    <Text style={{ fontSize: 28 }}> {data[2]}</Text> secs spent
                </Text>
            );
        }
    }

    // format Start
    getStartTime(data) {
        if (data.includes("NaN"))
            return <Text style={styles.textSubtitle}></Text>
        else {
            return <Text style={styles.textSubtitle}>Start: {data}</Text>
        }
    }

    // format End
    getEndTime(data) {
        if (data.includes("NaN"))
            return <Text style={styles.textSubtitle}></Text>
        else {
            return <Text style={styles.textSubtitle}>End: {data}</Text>
        }
    }

    render() {
        return (
            <View style={styles.sectionListItemView}>
                <View style={styles.cardHeader}>
                    <View style={styles.textHeaderWrapper}>
                        {this.locBeautify(this.props.item.location)}
                    </View>
                    <View style={styles.cardSubtitles}>
                        <Text style={styles.textSubtitle}>{this.getStartTime(this.dateBeautify(this.props.item.startTime))}</Text>
                        {this.getEndTime(this.dateBeautify(this.props.item.endTime))}
                    </View>
                </View>
                <View style={styles.content}>
                    {this.getTimeSpent(this.dateToStr(this.props.item.diffTime))}
                </View>
            </View>
        );
    };
}

class SectionHeader extends Component {
    render() {
        return (
            <View style={{ flex: 1, backgroundColor: '#f9fcfd' }}>
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
        backgroundColor: '#f2f6f7'
    },
    cardHeader: {
        flex: 1,
        paddingTop: 5,
        backgroundColor: '#3DCEBF',
        justifyContent: 'flex-start',
        flexDirection: 'row',
        borderColor: '#ddd',
        borderTopLeftRadius: 10,
        borderTopRightRadius: 10,
        flexWrap: 'wrap'
    },
    textHeaderWrapper: {
        flex: 1
    },
    cardSubtitles: {
        flexDirection: 'column',
        flex: 1,
        justifyContent: 'flex-end',
        marginRight: 10,
        fontFamily: 'Rubik-Regular'
    },
    sectionListItemView: {
        flex: 1,
        flexDirection: 'column',
        backgroundColor: 'white',
        borderRadius: 10,
        margin: 10,
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
        marginTop: 13,
        paddingBottom: 5,
        color: 'white',
        fontFamily: 'Poppins-Bold'
    },
    textSubtitle: {
        fontSize: 16,
        marginLeft: 20,
        marginRight: 10,
        marginBottom: 7,
        textAlign: 'right',
        color: 'white'
    },
    content: {
        padding: 20,
        color: '#f1f1f1'
    },
    cardContents: {
        fontSize: 16,
        fontFamily: 'Rubik-Regular'
    },
    sectionHeader: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#a4a4a4',
        margin: 20,
        marginBottom: 10
    }
});

export default VisitHistory;