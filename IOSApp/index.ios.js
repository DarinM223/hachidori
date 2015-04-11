'use strict';

var React = require('react-native')
  , AllView = require('./AllView.ios.js');

var {
  AppRegistry,
  Text,
  View,
  TabBarIOS,
  NavigatorIOS
} = React;

var HummingbirdApp = React.createClass({
  getInitialState: function() {
    return {
      tab: 'currently-watching'
    };
  },

  render: function() {
    var mainPageText = null;

    switch (this.state.tab) {
      case 'all':
        mainPageText = 'Hello Blah!';
        break;
      case 'currently-watching':
        mainPageText = 'Hello Blah2!'; 
        break;
      case 'tab3':
        mainPageText = 'Hello Blah3!';
        break;
    }

    var mainView = (
      <View> 
        <Text>{mainPageText}</Text>
      </View>
    );

    return (
      <TabBarIOS
        selectedTab={this.state.tab}>

        <TabBarIOS.Item
          name="tab_all"
          title="All"
          icon={_ix_DEPRECATED('favorites')}
          accessibilityLabel="All"
          selected={this.state.tab === 'all'}
          onPress={() => { this.setState({ tab: 'all' }); }}>

          <NavigatorIOS
            initialRoute={{
              title: 'All',
              component: AllView,
              passProps: { tab: 'all' }
            }}/>
        </TabBarIOS.Item>

        <TabBarIOS.Item
          name="tab_currently_watching"
          title="Currently Watching"
          icon={_ix_DEPRECATED('history')}
          accessibilityLabel="Currently Watching"
          selected={this.state.tab === 'currently-watching'}
          onPress={() => { this.setState({ tab: 'currently-watching' }); }}>

          { mainView }
        </TabBarIOS.Item>

        <TabBarIOS.Item
          name="Tab 3"
          icon={_ix_DEPRECATED('more')}
          accessibilityLabel="Tab 3"
          selected={this.state.tab === 'tab3'}
          onPress={() => { this.setState({ tab: 'tab3' }); }}>

          { mainView }
        </TabBarIOS.Item>
      </TabBarIOS>
    );
  }
});

function _ix_DEPRECATED(imageUri) {
  return {
    uri: imageUri,
    isStatic: true
  };
}

AppRegistry.registerComponent('HummingbirdReactApp', () => HummingbirdApp);
