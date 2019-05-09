'use strict';
import React, { Component } from 'react';
import {StyleSheet, Image, ScrollView } from 'react-native';

export default class ShowMap extends Component {
    static navigationOptions = ({ navigation }) => ({
        title: "Oncology Map",
        // headerLeft: (
        //     <TouchableOpacity
        //         style={Styles.headerButton}
        //         onPress={() => navigation.openDrawer()}>
        //         <Icon name="bars" size={20} />
        //     </TouchableOpacity>
        // ),
    })

    render() {
        return (
            <ScrollView minimumZoomScale={1} maximumZoomScale={3} contentContainerStyle={styles.container}>
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
    },
    image: {
        flex:1, 
        height: undefined, 
        width: undefined
    }
});