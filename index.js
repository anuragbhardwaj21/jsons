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

server.post("/products", (req, res) => {
  const newProduct = req.body;
  newProduct.id =
    router.db
      .get("products")
      .reduce((maxId, product) => Math.max(maxId, product.id), 0) + 1; // Generate a new ID
  router.db.get("products").push(newProduct).write();
  res.status(201).json(newProduct);
});

server.delete("/products/:id", (req, res) => {
  const productId = parseInt(req.params.id);
  router.db.get("products").remove({ id: productId }).write();
  res.sendStatus(204);
});

server.put("/products/:id", (req, res) => {
  const productId = parseInt(req.params.id);
  const updatedProduct = req.body;
  router.db
    .get("products")
    .find({ id: productId })
    .assign(updatedProduct)
    .write();
  res.status(200).json(updatedProduct);
});

server.use(router);

server.listen(port);
