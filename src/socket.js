// socket.js
let socket;

module.exports.initializeSocket = function() {
  socket = require("socket.io-client")(
    process.env.REACT_APP_CHATROOM_SERVER_URL
  );
};

module.exports.registerEventListener = function(event, func) {
  socket.off(event);
  socket.on(event, func);
};

module.exports.sendMessage = function(message) {
  socket.emit("message", message);
};

module.exports.sendFingerprintId = function(fingerprintId) {
  socket.emit("fingerprintId", fingerprintId);
};
