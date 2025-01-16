const fs = require("fs");
const users = [];

const requestHandler = (req, res) => {
  res.setHeader("Content-Type", "text/html");
  const methodFunction =
    routeDefinitions[req.method]?.[req.url] || routeDefinitions["GET"]["/404"];

  return methodFunction(req, res);
};

const routeDefinitions = {
  GET: {
    "/": (req, res) => {
      userList = users.length
        ? users.map((user) => {
            return `<li>${user}</li>`;
          })
        : `<li>Empty</li>`;

      res.write("<html>");
      res.write("<head><title>Hello!</title></head>");
      res.write(
        `<body>
        <p>Hello! Fellow</p>
        <ul>
          ${userList}
        </ul>
          <form action="/create-user" method="POST">
            <label for="user">Enter Username</label>
            <input type="text" name="user"/>
            <button type="submit">Send</button>
          </form>

          <form action="/message" method="POST">
            <label for="message">Enter Message</label>
            <input type="text" name="message"/>
            <button type="submit">Download Message</button>
          </form>
        </body>`
      );
      res.write("</html>");
      return res.end();
    },
    "/404": (req, res) => {
      res.write("<html>");
      res.write("<head><title>Not Found</title></head>");
      res.write(
        '<body>Page not found<br/><form action="/" ><button type="submit">Return Home</button></form></body>'
      );
      res.write("</html>");
      return res.end();
    },
  },
  POST: {
    "/message": (req, res) => {
      dataParser(req).then((data) => {
        fs.writeFileSync("message.txt", data);
        return res.end();
      });

      res.statusCode = 302;
      res.setHeader("Location", "/");
    },
    "/create-user": (req, res) => {
      dataParser(req).then((data) => {
        users.push(data);
        return res.end();
      });

      res.statusCode = 302;
      res.setHeader("Location", "/");
    },
  },
};

const dataParser = (req) => {
  const body = [];
  return new Promise((resolve, reject) => {
    req.on("data", (chunk) => {
      body.push(chunk);
    });

    req.on("end", () => {
      const parsedBody = Buffer.concat(body).toString();
      const message = parsedBody.split("=")[1];
      resolve(message);
    });
  });
};

module.exports = { handler: requestHandler, someText: "Some hard coded" };
