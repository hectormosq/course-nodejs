const getDb = require("../util/database").getDb;
const mongoDb = require("mongodb");
class Product {
  constructor(title, imageUrl, description, price, userId, id) {
    this.title = title;
    this.imageUrl = imageUrl ? imageUrl : "https://place-hold.it/300";
    this.description = description;
    this.price = price;
    this.userId = userId;
    this._id = id ? mongoDb.ObjectId.createFromHexString(id) : undefined;
  }

  save() {
    const db = getDb();
    let dbOp;
    if (this._id) {
      dbOp = db.collection("products").updateOne(
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
    const db = getDb();
    return db.collection("products")
      .deleteOne({ _id: mongoDb.ObjectId.createFromHexString(id) })
      .then(() => {
        //Cart.deleteProduct(id, product.price);
      })
      .catch((err) => console.log(err));
  }
}

module.exports = Product;
