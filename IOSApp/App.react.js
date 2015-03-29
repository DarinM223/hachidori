'use strict';

var React = require('react-native');

var {
  Text,
  View
} = React;

var styles = React.StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 65,
    backgroundColor: 'white',
  },
  helloworld: {
    color: 'blue'
  },
});

var App = React.createClass({
  render: function() {
    return (
      <View style={styles.container}>
        <Text style={styles.helloworld}>
          Hello world!
        </Text>
      </View>
    );
  }
});

module.exports = App;
