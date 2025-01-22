const getDb = require("../util/database").getDb;
const fs = require("fs");
const path = require("path");
const rootDir = require("../util/path");

const Cart = require("./cart");

const p = path.join(rootDir, "data", "products.json");

const getProductFromFile = (cb) => {
  fs.readFile(p, (err, fileContent) => {
    if (err) {
      cb([]);
    } else {
      cb(JSON.parse(fileContent));
    }
  });
};

class Product {
  constructor(title, imageUrl, description, price) {
    this.title = title;
    this.imageUrl = imageUrl ? imageUrl : "https://place-hold.it/300";
    this.description = description;
    this.price = price;
  }

  save() {
    const db = getDb();
    console.log(db);
    return db
      .collection("products")
      .insertOne(this)
      .then((result) => console.log(result))
      .catch((err) => console.log(err));
  }

  static fetchAll() {
    const db = getDb();
    return db
      .collection("products")
      .find()
      .toArray()
      .then((products) => products)
      .catch((err) => console.log(err));
  }

  static deleteById(id) {
    getProductFromFile((products) => {
      const product = products.find((prod) => prod.id === id);
      const updatedProducts = products.filter((prod) => prod.id !== id);
      fs.writeFile(p, JSON.stringify(updatedProducts), (err) => {
        if (!err) {
          Cart.deleteProduct(id, product.price);
        }
      });
    });
  }

  static findById(id, cb) {
    getProductFromFile((products) => {
      const product = products.find((p) => p.id === id);
      cb(product);
    });
  }
}

module.exports = Product;
