// App

var socket = require('./socket.js');

function Echo(message) {
    var buf = socket.makeBuffer();
    buf.writeUTF("echo") // Handler
    buf.writeUTF(message)
    socket.sendToGmod(buf.buf);
    console.log("Sent " + message);
}

Echo("test");

socket.addHandler("echo", function (sock, ba) {
    var str = ba.readUTF();
    console.log("Echo from GMod: " + str);
});

socket.addHandler("test", function (sock, ba) {
    var message = ba.readUTF();
    console.log("GMod says: " + message);
});