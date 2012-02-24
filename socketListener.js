
var io = require("socket.io"),
	_ = require("underscore");

module.exports.listen = function (app) {
	var sio = io.listen(app),
		sockets = {},
		metaData = {
			connections: 0,
			clients: {},
			lastMessageTime: null,
			lastMessageFrom: null
		},
		fnSendMessage = function (sockId, msg) {
			var outgoingMsg,
				disconnected = [],
				connected = [];
			metaData.lastMessageTime = new Date().toString();
			metaData.lastMessageFrom = sockId;
			_.each(sockets, function (sock, id) {
				console.log("Checking for connection on " + id);
				(sock.disconnected ? disconnected : connected).push(id);
			});
			_.each(disconnected, function (id) {
				delete sockets[id];
				delete metaData.clients[id];
				metaData.connections -= 1;
			});
			_.each(connected, function (id) {
				console.log("Sending message");
				outgoingMsg = { meta: metaData, data: msg };
				console.log(outgoingMsg);
				sockets[id].emit("msg", outgoingMsg);
			});
		};
		
	sio.sockets.on("connection", function (socket) {
		sockets[socket.id] = socket;
		metaData.clients[socket.id] = socket.manager.handshaken[socket.id].address;
		metaData.connections += 1;
		fnSendMessage(socket.id, socket.id + " connected.");
		
		socket.on("disconnect", function () {
			delete sockets[socket.id];
			delete metaData.clients[socket.id];
			metaData.connections -= 1;
			fnSendMessage(socket.id, socket.id + " disconnected.");
		});
		socket.on("msg", function (msg) {
			fnSendMessage(socket.id, msg);
		});
	});
};