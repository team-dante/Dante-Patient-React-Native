import React, {Component} from 'react';
import { Text } from 'react-native-router-flux';
import { Scene, Router, Actions } from 'react-native-router-flux';
import PatientLogin from './src/screens/patientLogin';
import PatientSignUp from './src/screens/patientSignUp';
import PatientProfile from './src/screens/patientProfile';
import ShowMap from './src/screens/showMap';


const TabIcon = ({selected, title}) => {
    return (
        <Text style={{color: selected ? 'red':'black'}}>{title}</Text>
    );
};
const RouterComponent = () => {
    return (
        <Router>
            <Scene key="root" hideNavBar>
                <Scene key="auth">
                    <Scene hideNavBar key="login" component={PatientLogin} title="Please Login" initial/>
                    <Scene key="signUp" component={PatientSignUp} title="Sign Up" />
                </Scene>
                <Scene key="tabbar" tabs tabBarStyle={{backgroundColor: '#ffffff'}}>
                    <Scene key="map" component={ShowMap} 
                        title="Oncology Map"
                    />
                    <Scene key="PatientProfile" component={PatientProfile} 
                        title="Profile" 
                    />
                </Scene>
            </Scene>
        </Router>
    );
};

export default RouterComponent;