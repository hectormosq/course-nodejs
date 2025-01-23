const { getDb } = require("../util/database");
const mongoDb = require("mongodb");

const ObjectId = mongoDb.ObjectId.createFromHexString;
class User {
  constructor(username, email, cart, id) {
    this.name = username;
    this.email = email;
    this.cart = cart;
    this._id = id;
  }

  save() {
    const db = getDb();
    return db.collection("users").insertOne(this);
  }

  addToCart(product) {
    const cartProductIndex = this.cart.items.findIndex((cp) => {
      return cp.productId.toString() === product._id.toString();
    });

    let newQty = 1;
    const updatedCartItems = [...this.cart.items];
    if (cartProductIndex >= 0) {
      newQty = this.cart.items[cartProductIndex].qty + 1;
      updatedCartItems[cartProductIndex].qty = newQty;
    } else {
      updatedCartItems.push({ productId: product._id, qty: newQty });
    }
    const updatedCart = { items: updatedCartItems };
    const db = getDb();
    return db
      .collection("users")
      .updateOne({ _id: this._id }, { $set: { cart: updatedCart } });
  }

  static findById(userId) {
    const db = getDb();
    return db.collection("users").findOne({ _id: ObjectId(userId) });
  }

  getCart() {
    const db = getDb();
    const productIds = this.cart.items.map((item) => {
      return item.productId;
    });
    return db
      .collection("products")
      .find({ _id: { $in: productIds } })
      .toArray()
      .then((products) => {
        return products.map((product) => {
          return {
            ...product,
            qty: this.cart.items.find((i) => {
              return i.productId.toString() === product._id.toString();
            }).qty,
          };
        });
      });
  }
}

module.exports = User;
