/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, { Component } from 'react';
import Config from 'react-native-config'
import firebase from 'firebase';
import Router from './Router';

class App extends Component {

  componentWillMount() {
    let config = {
      apiKey: Config.API_KEY,
      authDomain: Config.AUTH_DOMAIN,
      databaseURL: Config.DATABASE_URL,
      projectId: Config.PROJECT_ID,
      storageBucket: Config.STORAGE_BUCKET,
      messagingSenderId: Config.MESSAGING_SENDER
    };
    console.log(config);
    firebase.initializeApp(config);

    console.log("exit componentDidMount");
  }

  render() {
    return (
      <Router/>
    );
  }
}

export default App;