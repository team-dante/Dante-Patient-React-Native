import React, { Component } from 'react';
import {
    createStackNavigator,
    createAppContainer,
    createBottomTabNavigator,
    createSwitchNavigator,
} from 'react-navigation'

import PatientLogin from './src/screens/patientLogin';
import PatientSignUp from './src/screens/patientSignUp';
import PatientProfile from './src/screens/patientProfile';
import ShowMap from './src/screens/showMap';
import QrScanner from './src/screens/qrScanner';
import Feedback from './src/screens/feedback';

const MainNavigator = createSwitchNavigator({
    authenticationFlow: {
        screen: createStackNavigator({
            login: {
                screen: PatientLogin,
                // hide login header 
                navigationOptions: {
                    header: null
                }
            },
            signup: {
                screen: PatientSignUp,
                navigationOptions: {
                    title: 'Sign Up',
                }
            }
        },
            {
                // do not disable header of authenticationFlow 
                initialRouteName: 'login',
            }),
    },
    tabBar: {
        screen: createStackNavigator({
            screen: createBottomTabNavigator({
                showMap: {
                    screen: ShowMap,
                    navigationOptions: {
                        title: 'Oncology Map',
                    },
                },
                qrScanner: {
                    screen: QrScanner,
                    navigationOptions: {
                        title: 'QR Scanner'
                    },
                },
                profile: {
                    screen: PatientProfile,
                    navigationOptions: {
                        title: 'My Profile'
                    }
                }
            },
                {
                    navigationOptions: ({navigation}) => {
                        const { title } = navigation.state.routes[navigation.state.index];
                        return {
                            headerTitle: title
                        }
                    },
                    tabBarOptions: {
                        labelStyle: {
                            fontSize: 13,
                        },
                    }
                }),
        })
    }
},
    // disable the header of the MainNavigator's header
    {
        initialRouteName: 'authenticationFlow',
        headerMode: 'none',
        navigationOptions: {
            header: null
        }
    });
const AppNavigator = createAppContainer(MainNavigator);

export default AppNavigator;

// const AppStackNavigator = createStackNavigator({
//   mainFlow: {
//     screen: StackNavigator({
//       main: { screen: MainScreen },
//       settings: { screen: SettingsScreen },
//       someTab: { 
//         screen: TabNavigator({
//           firstTab: { screen: FirstTabScreen },
//           secondTab: { screen: SecondTabScreen },
//           thirdTab: { screen: ThirdTabScreen }
//         })
//       }
//     })
//   }
// });

