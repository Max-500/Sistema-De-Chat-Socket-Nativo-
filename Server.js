const Server = require("net");

const server = Server.createServer();

function error(err) {
  console.error(err);
}

//Nos servira para guardar las conexiones al server (nombre y usario)
const connections = new Map();
const nombres = new Array();

function start(port) {
  //Significa que alguien se conecto al server y sacamos su IP y puerto
  server.on("connection", (socket) => {
    //Se puso porque como tal en el socket mandamos bits y esos los tenemos que poner en utf-8
    socket.setEncoding("utf-8");
    const remoteSocket = `${socket.remoteAddress}:${socket.remotePort}`;
    console.log(`New Connection from ${remoteSocket}`);
    //Este va a ser cuando tenga que leerse algo de información del socket
    socket.on("data", (data) => {
      console.log(data);
      if (!connections.has(socket)) {
        if (nombres.includes(data)) {
          socket.write("ESTE NOMBRE YA ESTA EN USO");
          connections.delete(socket)
          socket.write("END")
        } else {
          nombres.push(data);
          connections.set(socket, data);
          let mensaje = data + " ha entrado al chat"
          send(mensaje, socket)
        }
      } else if (data == "END") {
        eliminar(socket)
      } else {
        const full = `${connections.get(socket)} -> ${data}`;
        send(full, socket);
      }

      socket.on("error", (err) => {
        console.log("Algo sucedio");
        error(err.message);
      });

      socket.on("close", () => {
        console.log("Comunicacion finalizada");
      });
    });
  });

  server.listen({ host: "127.0.0.1", port: port }, () => {
    console.log(`Server is RUNNING IN PORT ${port}`);
  });
}

function eliminar(socket) {
  let usuario = connections.get(socket);
  let index = nombres.findIndex((n) => {
    return n === usuario;
  });
  nombres[index] = "";
  let mensaje = usuario + " ha abandonado el chat"
  send(mensaje, socket)
  connections.delete(socket);
}

function send(data, origin) {
  for (const socket of connections.keys()) {
    console.log("entro")
    if (socket != origin) {
      socket.write(data);
    }
  }
}

const main = () => {
  if (process.argv.length !== 3) {
    error(`Ingresa lo siguiente \n node ${__filename} port`);
  } else {
    let port = process.argv[2];
    port = parseInt(port);
    if (isNaN(port)) {
      error("Escribe números");
    } else {
      console.log(port);
      start(port);
    }
  }
};

main();
