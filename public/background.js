chrome.app.runtime.onLaunched.addListener(function() {
  chrome.app.window.create('window.html', {
    'id': 'hummingWinId',
    'minWidth': 780,
    'bounds': {
      'width': 800,
      'height': 1000
    },
  });
});
