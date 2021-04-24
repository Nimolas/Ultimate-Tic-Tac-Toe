import * as io from "socket.io";

class NetworkServer {
    server: io.Server;

    constructor() {
        this.server = new io.listen(3000);
        this.server.on("connection", socket => {
            if (Object.keys(this.server.clients().sockets).length > 1) {
                socket.emit("TooManyConnections", "This server already has 2 players")
                socket.disconnect(true);
            }
        })
    }
}