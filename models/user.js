const { getDb } = require("../util/database");
const mongoDb = require("mongodb");

const ObjectId = mongoDb.ObjectId.createFromHexString;

const db = require("../util/database").getDb;

class User {
  constructor(username, email) {
    this.name = username;
    this.email = email;
  }

  save() {
    const db = getDb();
    return db.collection("users").insertOne(this);
  }

  static findById(userId) {
    const db = getDb();
    return db.collection("users").findOne({ _id: ObjectId(userId) });
  }
}

module.exports = User;
