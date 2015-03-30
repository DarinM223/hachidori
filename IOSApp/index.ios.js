'use strict';

var React = require('react-native');
var App = require('./App.react.js');

var {
  AppRegistry,
  StyleSheet,
  Text,
  View,
} = React;

var HummingbirdApp = React.createClass({
  render: function() {
    return (
      <React.NavigatorIOS
        style={styles.container}
        initialRoute={{
          title: 'Animelist',
          component: App
        }}/>
    );
  }
});

var styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5FCFF',
  },
});

AppRegistry.registerComponent('HummingbirdReactApp', () => HummingbirdApp);
