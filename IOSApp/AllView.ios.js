'use strict';

var React = require('react-native');

var {
  Text,
  View,
  TabBarIOS
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

/**
 * @property {string} tab
 */
var AllView = React.createClass({
  render: function() {
    return (
      <View style={styles.container}>
        <Text style={styles.helloworld}>Tab name: { this.props.tab }</Text>
      </View>
    );
  }
});

module.exports = AllView;
