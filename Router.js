import React, { Component } from 'react';
import { Actions } from 'react-native-router-flux';
import { StyleSheet,PixelRatio, View } from 'react-native';
import { Scene, Router, ActionConst } from 'react-native-router-flux';
import Icon from 'react-native-vector-icons/FontAwesome5';
import PatientLogin from './src/screens/patientLogin';
import PatientSignUp from './src/screens/patientSignUp';
import PatientProfile from './src/screens/patientProfile';
import ShowMap from './src/screens/showMap';
import QrScanner from './src/screens/qrScanner';
import Feedback from './src/screens/feedback';
import Notice from './src/screens/notice';
import VisitHistory from './src/screens/visitHistory';

//Create a dedicated class that will manage the tabBar icon
class TabIcon extends Component {
    render() {
      var color = this.props.focused ? '#0074D9' : '#aaaaaa';
  
      return (
        <View style={{flex:1, flexDirection:'column', alignItems:'center', alignSelf:'center', justifyContent: 'center'}}>
          <Icon style={{color: color}} name={this.props.iconName || "circle"} size={24}/>
        </View>
      );
    }
}

const RouterComponent = () => {
    return (
        <Router navigationBarStyle={styles.navBar} titleStyle={styles.navTitle}>
            <Scene key="root" hideNavBar>
                {/* ActionConst.RESET disables the back arrow */}
                <Scene key="auth" type={ActionConst.RESET}>
                    <Scene hideNavBar key="login" component={PatientLogin}
                        title="Please Login" initial />
                    <Scene key="signUp" component={PatientSignUp} title="Sign Up" backTitle="Back"
                        backButtonTextStyle={styles.navBtnText} backButtonTintColor='white'/>
                </Scene>
                {/* ActionConst.RESET disables the back arrow */}
                <Scene key="tabbar" tabs tabBarStyle={styles.tabBar} type={ActionConst.RESET} >
                    <Scene key="map" component={ShowMap}
                        title="Oncology Map"
                        iconName="map-marker-alt"
                        icon={TabIcon}
                        onRight={() => { Actions.qrScanner() }}
                        rightTitle={'Scan QR'}
                        rightButtonTextStyle={styles.navBtnText}
                    />
                    <Scene key="history" component={VisitHistory}
                        title="Visits History"
                        iconName="history"
                        icon={TabIcon}
                        onRight={() => { Actions.qrScanner() }}
                        rightTitle={'Scan QR'}
                        rightButtonTextStyle={styles.navBtnText}
                    />
                    <Scene key="PatientProfile" component={PatientProfile}
                        title="Profile"
                        iconName="user-cog"
                        icon={TabIcon}
                        onRight={() => { Actions.qrScanner() }}
                        rightTitle={'Scan QR'}
                        rightButtonTextStyle={styles.navBtnText}
                    />
                </Scene>
                <Scene key="feedback" type={ActionConst.RESET} >
                    <Scene key="feedback" component={Feedback} back={true} backTitle={'Back'} 
                        backButtonTextStyle={styles.navBtnText} backButtonTintColor='white' title="Feedback"/>
                </Scene>
                <Scene key="qrScanner" >
                    <Scene key="qrScanner" component={QrScanner} title="QR Scanner" back={true} backTitle={'Back'} 
                        backButtonTextStyle={styles.navBtnText} backButtonTintColor='white'
                    />
                </Scene>
                <Scene key="notice" type={ActionConst.RESET}>
                    <Scene hideNavBar key="notice" component={Notice} title="QR Scanner" panHandlers={null}/>
                </Scene>
            </Scene>
        </Router>
    );
};

const styles = StyleSheet.create({
    tabBar: {
      borderTopColor: 'darkgrey',
      borderTopWidth: 1 / PixelRatio.get(),
      backgroundColor: 'ghostwhite',
      opacity: 0.98
    },
    navBar: {
        backgroundColor: '#3D95CE', // changing navbar color
    },
    navTitle: {
        color: 'white', // changing navbar title color
        fontFamily: 'Rubik-Medium',
        fontSize: 18,
        letterSpacing: 0.5
    },
    navBtnText: {
        color: 'white',
        fontFamily: 'Rubik-Regular'
    }
});

export default RouterComponent;