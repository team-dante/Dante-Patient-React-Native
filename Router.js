import React, { Component } from 'react';
import { Text } from 'react-native-router-flux';
import { Scene, Router, ActionConst } from 'react-native-router-flux';
import PatientLogin from './src/screens/patientLogin';
import PatientSignUp from './src/screens/patientSignUp';
import PatientProfile from './src/screens/patientProfile';
import ShowMap from './src/screens/showMap';
import QrScanner from './src/screens/qrScanner';


const TabIcon = ({ selected, title }) => {
    return (
        <Text style={{ color: selected ? 'red' : 'black' }}>{title}</Text>
    );
};
const RouterComponent = () => {
    return (
        <Router>
            <Scene key="root" hideNavBar>
                {/* ActionConst.RESET disables moving back feature */}
                <Scene key="auth" type={ActionConst.RESET}>
                    <Scene hideNavBar key="login" component={PatientLogin}
                        title="Please Login" initial />
                    <Scene key="signUp" component={PatientSignUp} title="Sign Up" />
                </Scene>
                <Scene key="tabbar" tabs tabBarStyle={{ fontSize: 100, backgroundColor: '#ffffff' }}
                    type={ActionConst.RESET} >
                    <Scene key="map" component={ShowMap}
                        title="Oncology Map"
                    />
                    <Scene key="qrScanner" component={QrScanner}
                        title="QR Scanner"
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