const server = require("http").createServer();
const io = require("socket.io")(server, {
  transports: ["websocket", "polling"],
});
const users = {};
const messages = [];
io.on("connection", (client) => {
  client.on("username", (username) => {
    const user = {
      name: username,
      id: client.id,
    };
    users[client.id] = user;
    io.emit("connected", user);
    io.emit("users", Object.values(users));
    io.emit("message", messages);
  });

  client.on("send", (message) => {
    messages.push({
      text: message,
      date: new Date().toISOString(),
      user: users[client.id],
    });
    io.emit("message", messages);
  });

  client.on("disconnect", () => {
    delete users[client.id];
    io.emit("disconnected", client.id);
  });
});
server.listen(3000);
