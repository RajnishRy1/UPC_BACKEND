const webSocketsServerPort = 8000;
const WebSocketServer = require("websocket").server;
const http = require("http");
const server = http.createServer();
server.listen(webSocketsServerPort);

const clients = {};

const getUniqueID = () => {
  const s4 = () =>
    Math.floor((1 + Math.random()) * 0x10000)
      .toString(16)
      .substring(1);
  return s4() + s4() + "-" + s4();
};

const wsServer = new WebSocketServer({
  httpServer: server,
});

wsServer.on("request", function (request) {
  var userId = getUniqueID();
  console.log("new request" + request.origin);
  const connection = request.accept("null", request.origin);
  clients[userId] = connection;
});
