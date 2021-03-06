import React, { Component } from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native'
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { PieChart } from 'react-native-svg-charts';
import { Text as SvgText } from 'react-native-svg';
import Label from '../components/Label';

// FlatListItem = one graph per visit day for patients
class FlatListItem extends Component {

    constructor(props) {
        super(props);
        // hard-coded colors assigned to each room
        this.colors = {'Waiting Room': '#B8E653', 'Treatment Room 1': '#53ACE6', 'ZTransition': '#53E681'}
    }

    drawGraphs(data_points, room_lst) {

        // API from pieChart example of react-native-svg-charts to draw labels
        const Labels = ({ slices }) => {
            return slices.map((slice, index) => {
                const { pieCentroid } = slice;
                return (
                    <SvgText
                        key={index}
                        x={pieCentroid[ 0 ]}
                        y={pieCentroid[ 1 ]}
                        fill={'white'}
                        textAnchor={'middle'}
                        alignmentBaseline={'middle'}
                        fontSize={18}
                    >
                        {data_points[index]}
                    </SvgText>
                )
            })
        }

        // map the data to graph
        const pieData = data_points
            .filter(value => value > 0)
            .map((value, index) => ({
                value,
                svg: {
                    fill: this.colors[room_lst[index]], // get the corresponding color from history
                    onPress: () => console.log('press', index),
                },
                key: `pie-${index}`,
            }))

        return (
            <PieChart
                style={ { height: 200 } }
                data={ pieData }
            >
            <Labels />
            </PieChart>
        );
    }

    render() {
        return (
            <View style={styles.card}>
                <Text style={styles.dates}>{this.props.item.date}</Text>
                {this.drawGraphs(this.props.item.data_points, this.props.item.room_lst)}
            </View>
        );
    }
}

// Charts is an extension of VisitHistory.js; if segmentedControl index = 1, then render this component
class Charts extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <View style={styles.container}>
                <FlatList
                    data={this.props.graphData}
                    renderItem={({item, index}) => {
                        return (
                            <FlatListItem item={item} index={index}></FlatListItem>
                        );
                    }}
                >
                </FlatList>
                <View style={styles.labelRow}>
                    <View style={styles.labelColumn}>
                        <Label obj={'Waiting Rm'} color={'#B8E653'}/>
                        <Label obj={'Treatment Rm 1'} color={'#53ACE6'}/>
                        <Label obj={'Treatment Rm 2'} color={'#E653B8'}/>
                    </View>
                    <View style={styles.labelColumn}>
                        <Label obj={'Exam Rm'} color={'#E68153'}/>
                        <Label obj={'CT Rm'} color={'#536FE6'}/>
                        <Label obj={'Transition Time'} color={'#53E681'}/>
                    </View>
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fcfcfc",
        padding: hp('1%')
    },
    dates: {
        fontSize: wp('5%'),
        fontFamily: 'Poppins-Bold',
    },
    card: {
        backgroundColor: 'white',
        borderRadius: 15,
        margin: wp('3%'),
        padding: wp('3%'),
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.36,
        shadowRadius: 3,
        elevation: 11,
    },
    labelRow: {
        bottom: 0,
        height: hp('12%'),
        width: wp('100%'),
        backgroundColor: '#fff',
        position: 'absolute',
        flexDirection: 'row',
    },
    labelColumn: {
        flexDirection: 'column',
        width: wp('50%')
    }
});

export default Charts;