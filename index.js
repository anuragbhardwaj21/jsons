const jsonServer = require("json-server");
const server = jsonServer.create();
const router = jsonServer.router("db.json");
const middlewares = jsonServer.defaults();
const port = process.env.PORT || 8080;

server.use(middlewares);

server.use(jsonServer.bodyParser);
server.use((req, res, next) => {
  if (req.method === "GET" && req.query._sort) {
    const order = req.query._order || "asc";
    const sortBy = req.query._sort;
    req.query._sort = `${order === "desc" ? "-" : ""}${sortBy}`;
  }
  next();
});

server.use((req, res, next) => {
  if (req.method === "GET" && req.query.category) {
    const category = req.query.category;
    req.query.category = category;
  }
  if (req.method === "GET" && req.query.gender) {
    const gender = req.query.gender;
    req.query.gender = gender;
  }
  next();
});

server.use(router);
server.listen(port);
