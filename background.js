chrome.app.runtime.onLaunched.addListener(function() {
  chrome.app.window.create('window.html', {
    'id': 'hummingWinId',
    'bounds': {
      'width': 800,
      'height': 1000
    }
  });
});
