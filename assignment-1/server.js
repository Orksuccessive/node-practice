const http = require("http");

const server = http.createServer((req, res) => {
  if (req.method === "GET" && req.url === "/") {
    res.writeHead(200, {
      "Content-Type": "text/html",
    });

    res.end("<h1>Hello</h1>");
  }

  else if (req.method === "GET" && req.url === "/json") {
    res.writeHead(200, {
      "Content-Type": "application/json",
    });

    res.end(JSON.stringify({ ok: true }));
  }

  else if (req.method === "POST" && req.url === "/echo") {
    let body = "";

    req.on("data", (chunk) => {
      body += chunk;
    });

    req.on("end", () => {
      try {
        const json = JSON.parse(body);

        res.writeHead(200, {
          "Content-Type": "application/json",
        });

        res.end(JSON.stringify(json));
      } catch (error) {
        res.writeHead(400, {
          "Content-Type": "application/json",
        });

        res.end(JSON.stringify({
          error: "Invalid JSON",
        }));
      }
    });
  }

  else {
    res.writeHead(404, {
      "Content-Type": "application/json",
    });

    res.end(JSON.stringify({
      error: "Route not found",
    }));
  }
});

server.listen(3000, () => {
  console.log("Server running on http://localhost:3000");
});