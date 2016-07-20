// Socket

var net = require("net");
var bytearray = require("./bytearray.js");
var port = 8080
var gmod = { address: "127.0.0.1", port: 13375 };

var server = net.createServer(function (socket) {
    var data = []
    socket.on("data", function (buffer) {
        data.push(buffer)
    })
    socket.on("close", function () {
        Receive(socket, data)
    })
}).listen(port, function () { console.log("TCP server listening on " + port) })

module.exports.server = server

// Adds handles
handlers = {}
function AddHandler(name, func) {
    handlers[name] = func
}

// Handles incoming data
function Receive(sock, data) {
    this.pos = 0
    var buffer = Buffer.concat(data)
    var ba = bytearray(buffer)
    ba.readInt()
    var handle = ba.readUTF()
    console.log("Received handle " + handle);
    if (handlers[handle]) {
        handlers[handle](sock, ba)
    }
}

// Utility function to create blank buffer
function MakeBuffer() {
    var buffer = new Buffer(1024)
    buffer.fill(0)
    var ba = bytearray(buffer)
    ba.writeInt(buffer.length - 4)
    return ba
}

function SendToGmod(buffer) {
    return Send(buffer, gmod.address, gmod.port);
}

// Sends buffer to one server
function Send(buffer, address, port) {
    var socket = net.connect(port, address)
    socket.on("error", function (err) { }) // stops crashing if connection fails
    socket.write(buffer)
    socket.end()
}

module.exports.addHandler = AddHandler;
module.exports.makeBuffer = MakeBuffer;
module.exports.sendToGmod = SendToGmod;