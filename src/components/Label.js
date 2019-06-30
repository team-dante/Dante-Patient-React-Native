import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

// Draw each room label; simplify code
const Label = ({obj, color}) => {
    return (
        <View style={[styles.labelCard, {borderLeftColor: color}]}>
            <Text style={styles.objLabel}>{obj}</Text>
        </View>  
    );
};

const styles = StyleSheet.create({
    labelCard: {
        borderColor: '#fff',
        borderBottomColor: '#dddddd',
        borderTopColor: '#dddddd',
        borderWidth: 0.5,
        borderLeftWidth: wp('3%'),
        borderLeftColor: '#0060a4',
        fontFamily: 'Poppins-Regular',
        paddingVertical: hp('1%')
    },
    objLabel: {
        fontSize: hp('1.6%'),
        paddingLeft: wp('4%')
    }
});

export default Label;