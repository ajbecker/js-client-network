
/**
 * Module dependencies.
 */

var express = require('express'), 
	routes = require('./routes'),
	socketListener = require("./socketListener"),
	
	// define the application and module exports.
	app = module.exports = express.createServer();

// Configuration
app.configure(function () {
	app.set('views', __dirname + '/views');
	app.set('view engine', 'jade');
	app.use(express.bodyParser());
	app.use(express.methodOverride());
	app.use(express.cookieParser());
	app.use(express.session({ secret: 'your secret here' }));
	app.use(app.router);
	app.use(express['static'](__dirname + '/public'));
});

app.configure('development', function () {
	app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});

app.configure('production', function () {
	app.use(express.errorHandler());
});

// Routes
app.get('/', routes.index);

// listen to the open port and open the socket.io connection.
app.listen(8081);
socketListener.listen(app);
console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);
