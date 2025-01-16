const fs = require("fs");

const requestHandler = (req, res) => {
  res.setHeader("Content-Type", "text/html");
  if (req.url === "/") {
    res.write("<html>");
    res.write("<head><title>Enter Message</title></head>");
    res.write(
      '<body><form action="/message" method="POST"><input type="text" name ="message"/><button type="submit">Send</button></form></body>'
    );
    res.write("</html>");
    return res.end();
  }
  if (req.url === "/message" && req.method === "POST") {
    const body = [];
    req.on("data", (chunk) => {
      console.log({ chunk });
      body.push(chunk);
      console.log(body);
    });

    req.on("end", () => {
      const parsedBody = Buffer.concat(body).toString();
      const message = parsedBody.split("=")[1];
      fs.writeFileSync("message.txt", message);
    });
    res.statusCode = 302;
    res.setHeader("Location", "/");
    return res.end();
  }

  res.write("<html>");
  res.write("<head><title>My First Page</title></head>");
  res.write("<body>Hello from Node.js Server!</body>");
  res.write("</html>");
  res.end();
};

module.exports = { handler: requestHandler, someText: "Some hard coded" };
