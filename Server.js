const { Server } = require("net");

const server = new Server();

function error(err) {
  console.error(err);
  //process.exit(1);
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
      if (!connections.has(socket)) {
        if(nombres.includes(data)){
            socket.write("ESTE NOMBRE YA ESTA EN USO")
            error("Verifica la informacion que mandas");
        }else{
            nombres.push(data)
            connections.set(socket, data);
        }
      } else if (data == "END") {
        socket.end();
        connections.delete(socket)
      } else {
        const full = `${connections.get(socket)} -> ${data}`;
        //socket.write(full);
        send(full, socket)
      }
    });
  });

  server.listen({host:"127.0.0.1", port: port }, () => {
    console.log(`Server is RUNNING IN PORT ${port}`);
  });

  server.on("error", (err) => {
    error(err.message);
  });
}

function send(data, origin) {
    for(const socket of connections.keys()){
        //console.log(connections.keys())
        if(socket != origin){
            socket.write(data)
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