
var app = require('./server.js');

var PORT = process.env.PORT;

if (typeof PORT === 'undefined' || PORT === null) {
  PORT = process.env.PORT = 3000;
}

app.listen(PORT, function() {
  console.log('Server started on port: ' + PORT);
});

