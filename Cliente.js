const { Socket } = require("net");
const readline = require("readline").createInterface({
  input: process.stdin,
  output: process.stdout,
});

function connect(host, port) {
  const socket = new Socket();
  socket.connect({ host: host, port: port });
  socket.setEncoding("utf-8");

  socket.on("connect", () => {

    readline.question("Elige tu nombre de usuario: ", (username) =>{
      if(username.length === 0){
        socket.end()
        process.exit(1)
      }else{
        socket.write(username)
      }
    })

    //Nos sirve para leer todo lo que ingrese por el terminal
    readline.on("line", (line) => {
      socket.write(line);
      if (line == "END") {
        socket.end();
        process.exit(0)
      }
    });

  });

  socket.on("data", (data) => {
    if(data === "END"){
      process.exit(1)
    }else{
      console.log(data)
    }
  });

  socket.on("error", (error) => {
    console.log(error.message)
    console.log("se ha cerrado el servidor")
    process.exit(0)
  });
}

function main() {
  if (process.argv.length !== 4) {
    error(`Ingresa lo siguiente \n node ${__filename} host port`);
  } else {
    let host = process.argv[2];
    let port = process.argv[3];

    port = parseInt(port);
    if (isNaN(port)) {
      error("Escribe números");
    } else {
      connect(host, port);
    }
  }
}

function error(err) {
  console.error(err);
  process.exit(1);
}


main();