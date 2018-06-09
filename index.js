// index.js

const http = require("http");

var server = http.createServer(
  function(req, res)
  {
    res.end("Hello Node.js!");
    console.log("Hello Node.js!");
  }
);

server.listen(process.env.PORT || 5000)
