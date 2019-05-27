import React, { Component } from 'react';
import { Alert, View, Text, StyleSheet, Dimensions, TextInput, TouchableOpacity, Keyboard } from 'react-native'
import firebase from 'firebase'
import { Actions } from 'react-native-router-flux';
import { TouchableWithoutFeedback } from 'react-native-gesture-handler';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import StarRating from 'react-native-star-rating';

export default class Feedback extends Component {

    constructor(props) {
        super(props);
        this.state = { rating: '', comments: '', starCount1: 0, starCount2: 0 };
    }

    onStarRatingPress1(rating1) {
        this.setState({
            starCount1: rating1
        });
    }
    onStarRatingPress2(rating2) {
        this.setState({
            starCount2: rating2
        });
    }

    render() {
        return (
            <View>
                <View style={styles.firstCard}>
                    <Text style={styles.questionNum}>Question 1.</Text>
                    <Text style={styles.questionText}>On a scale of 1 to 5, how would you rate your visit today?</Text>
                    <StarRating
                        rating={this.state.starCount1}
                        selectedStar={(rating1) => this.onStarRatingPress1(rating1)}
                    />
                </View>
                <View style={styles.secondCard}>
                    <Text style={styles.questionNum}>Question 2.</Text>
                    <Text style={styles.questionText}>On a scale of 1 to 5, how would rate our staff’s working attittude?</Text>
                    <StarRating
                        rating={this.state.starCount2}
                        selectedStar={(rating2) => this.onStarRatingPress2(rating2)}
                    />
                </View>
                <View style={styles.thirdCard}>
                    <Text style={styles.questionNum}>Question 3.</Text>
                    <Text style={styles.questionText}>Any comments for us to improve?</Text>
                    <TextInput
                        style={styles.textarea}
                        multiline={true}
                        numberOfLines={10}
                        onChangeText={(value) => this.setState({ comments: value })}
                        value={this.state.comments}
                    />
                </View>
                <View style={styles.footer}>
                    <TouchableOpacity style={styles.buttonContainer}
                        onPress={() => { Actions.map() }}>
                        <Text style={styles.buttonText}>Finish</Text>
                    </TouchableOpacity>
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#E5E5E5',
    },
    firstCard: {
        height: hp('23%'),
        backgroundColor: '#FFFFFF',
        marginVertical: hp('2%'),
        padding: hp('3%')
    },
    secondCard: {
        height: hp('23%'),
        backgroundColor: '#FFFFFF',
        marginVertical: hp('2%'),
        padding: hp('3%')
    },
    thirdCard: {
        height: hp('23%'),
        backgroundColor: '#FFFFFF',
        marginVertical: hp('2%'),
        padding: hp('3%')
    },
    questionNum: {
        fontSize: wp('5%'),
        fontFamily: 'Rubik-Medium',
        padding: hp('0.5%')
    },
    questionText: {
        fontSize: wp('3.5%'),
        fontFamily: 'Rubik-Regular',
        padding: hp('1%')
    },
    buttonContainer: {
        width: wp('50%'),
        marginTop: hp('1.8%'),
        backgroundColor: "#53ACE6",
        paddingVertical: hp('1%'),
        height: hp('5.5%'),
        borderRadius: 25,
        justifyContent: 'center',
    },
    buttonText: {
        color: "#FFF",
        textAlign: "center",
        fontWeight: 'bold',
        fontSize: wp('5%'),
        fontFamily: 'Rubik-Medium'
    },
    textarea: {
        height: hp('10%'),
        borderColor: '#53ACE6',
        borderRadius: 20,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 5,
        },
        shadowOpacity: 0.36,
        shadowRadius: 6.68,
        elevation: 11,
        backgroundColor: '#fff',
        marginBottom: hp('2%'),
        borderColor: "#53ACE6",
        paddingLeft: hp('1%')
    },
    footer: {
        flex: 1,
        alignItems: 'center',
    }
}); 