const getDb = require("../util/database").getDb;
const mongoDb = require("mongodb");

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
  constructor(title, imageUrl, description, price, id) {
    this.title = title;
    this.imageUrl = imageUrl ? imageUrl : "https://place-hold.it/300";
    this.description = description;
    this.price = price;
    this._id = mongoDb.ObjectId.createFromHexString(id);
  }

  save() {
    const db = getDb();
    let dbOp;
    if (this._id) {
      dbOp = db
        .collection("products")
        .updateOne(
          { _id: this._id },
          {
            $set: this,
          }
        );
    } else {
      dbOp = db.collection("products").insertOne(this);
    }
    return dbOp
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

  static findById(prodId) {
    const db = getDb();
    return db
      .collection("products")
      .find({ _id: mongoDb.ObjectId.createFromHexString(prodId) })
      .next()
      .then((product) => product)
      .catch((err) => console.log(errr));
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
}

module.exports = Product;
