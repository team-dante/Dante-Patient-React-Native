import React, { Component } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Platform, SafeAreaView, Keyboard } from 'react-native'
import firebase from 'firebase'
import { Actions } from 'react-native-router-flux';
import { TouchableWithoutFeedback, ScrollView } from 'react-native-gesture-handler';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import StarRating from 'react-native-star-rating';
import { KeyboardAvoidingView } from 'react-native';

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
        const shouldSetResponse = () => true;
        const onRelease = () => (
            Keyboard.dismiss()
        );
        
        return (
            <KeyboardAvoidingView
                behavior={Platform.OS === "ios" ? "padding" : null}
                style={{ flex: 1 }}
            >
                <SafeAreaView style={styles.container}>
                    <View onResponderRelease={onRelease}
                        onStartShouldSetResponder={shouldSetResponse}
                        style={{ height: hp('100%') }}
                        style={styles.inner}>
                        <View style={styles.card}>
                            <Text style={styles.questionNum}>Question 1.</Text>
                            <Text style={styles.questionText}>On a scale of 1 to 5, how would you rate your visit today?</Text>
                            <View style={styles.startRating}>
                                <StarRating
                                    fullStarColor={'#53ACE6'}
                                    rating={this.state.starCount1}
                                    selectedStar={(rating1) => this.onStarRatingPress1(rating1)}
                                />
                            </View>
                        </View>
                        <View style={styles.card}>
                            <Text style={styles.questionNum}>Question 2.</Text>
                            <Text style={styles.questionText}>On a scale of 1 to 5, how would rate our staff’s working attittude?</Text>
                            <View style={styles.startRating}>
                                <StarRating
                                    fullStarColor={'#53ACE6'}
                                    rating={this.state.starCount2}
                                    selectedStar={(rating2) => this.onStarRatingPress2(rating2)}
                                />
                            </View>
                        </View>
                        <View style={styles.card}>
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
                </SafeAreaView>
            </KeyboardAvoidingView >
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#E5E5E5',
    },
    inner: {
        paddingBottom: hp('10%'),
        flex: 1,
        justifyContent: "flex-end",
    },
    card: {
        height: hp('23%'),
        backgroundColor: '#FFFFFF',
        marginVertical: hp('1%'),
        padding: hp('2%')
    },
    questionNum: {
        fontSize: wp('3.6%'),
        fontFamily: 'Rubik-Medium',
        padding: hp('1%')
    },
    questionText: {
        fontSize: wp('3.8%'),
        fontFamily: 'Poppins-Regular',
        padding: hp('1%')
    },
    startRating: {
        paddingLeft: wp('10%'),
        paddingRight: wp('10%'),
        marginTop: hp('1%'),
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
        fontSize: wp('5%'),
        fontFamily: 'Poppins-Bold'
    },
    textarea: {
        height: hp('10%'),
        borderColor: '#53ACE6',
        borderWidth: 1,
        borderRadius: 15,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.36,
        shadowRadius: 3,
        elevation: 11,
        backgroundColor: '#fff',
        marginBottom: hp('2%'),
        borderColor: "#53ACE6",
        padding: wp('3%')
    },
    footer: {
        flex: 1,
        alignItems: 'center',
    }
}); 