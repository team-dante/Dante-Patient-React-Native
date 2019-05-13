import React, { Component } from 'react';
import { Text, Actions } from 'react-native-router-flux';
import { Scene, Router, ActionConst } from 'react-native-router-flux';
import PatientLogin from './src/screens/patientLogin';
import PatientSignUp from './src/screens/patientSignUp';
import PatientProfile from './src/screens/patientProfile';
import ShowMap from './src/screens/showMap';
import QrScanner from './src/screens/qrScanner';
import Feedback from './src/screens/feedback';
import VisitHistory from './src/screens/visitHistory';


const TabIcon = ({ selected, title }) => {
    return (
        <Text style={{ color: selected ? 'red' : 'black' }}>{title}</Text>
    );
};
const RouterComponent = () => {
    return (
        <Router>
            <Scene key="root" hideNavBar>
                {/* ActionConst.RESET disables the back arrow */}
                <Scene key="auth" type={ActionConst.RESET}>
                    <Scene hideNavBar key="login" component={PatientLogin}
                        title="Please Login" initial />
                    <Scene key="signUp" component={PatientSignUp} title="Sign Up" />
                </Scene>
                {/* ActionConst.RESET disables the back arrow */}
                <Scene key="tabbar" tabs type={ActionConst.RESET} >
                    <Scene key="map" component={ShowMap}
                        title="Oncology Map"
                        onRight={() => { Actions.qrScanner() }}
                        rightTitle={'Scan QR code'}
                    />
                    <Scene key="visitHistory" component={VisitHistory}
                    title="Your Visit History"
                    onRight={() => { Actions.qrScanner() }}
                    rightTitle={'Scan QR code'}
                    />
                    <Scene key="PatientProfile" component={PatientProfile}
                        title="Profile"
                        onRight={() => { Actions.qrScanner() }}
                        rightTitle={'Scan QR code'}
                    />
                </Scene>
                <Scene key="feedback" type={ActionConst.RESET} >
                    <Scene key="feedback" component={Feedback}
                        title="Feedback"/>
                </Scene>
                <Scene key="qrScanner" >
                        <Scene key="qrScanner" component={QrScanner} title="QR Scanner" back={true} backTitle={'Back'}/>
                </Scene>
            </Scene>
        </Router>
    );
};

export default RouterComponent;