const mongodb = require("mongodb");
const MONGO_URI = require('./connection').connectionParam;
const MongoClient = mongodb.MongoClient;

let _db;

const mongoConnect = (callback) => {

  // TODO how password should be handled
  MongoClient.connect(
    MONGO_URI
  )
    .then((client) => {
      console.log("Connected!");
      _db = client.db()
      callback(client)
    })
    .catch((err) => {
      console.log(err);
      throw err
    });
};

const getDb = () => {
    if (_db) {
        return _db;
    }

    throw 'No database found!'
}

exports.mongoConnect = mongoConnect
exports.getDb = getDb

