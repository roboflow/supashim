// serialize your firestore data to jsonl
/*
    Instructions:
    * Make sure to authenticate with firebase first
      (so admin.initializeApp works)
    * Then create a collection.json with the collections
      and subcollections you want to export from Firestore
      (see collections.example.json)
*/
// usage: node export.js
// this will store to ./data.jsonl
// then use import.js to load the data into supabase

const _ = require("lodash");
const async = require("async");
const fs = require("fs");

const admin = require("firebase-admin");
const app = admin.initializeApp();

const db = app.firestore();

const collections = JSON.parse(fs.readFileSync("./collections.json", "utf8"));
const out = fs.createWriteStream("data.jsonl");

// reads large collections in chunks to avoid memory issues
// and firestore timeouts
const BATCH_SIZE = 10000;

async.eachOfSeries(collections, copy, function () {
    out.end();
    process.exit(0);
});

function copy(tree, collection, cb) {
    const todo = [];
    getAll(collection, function (snapshots) {
        _.each(snapshots, function (child) {
            var path = collection + "/" + child.id;
            var data = child.data();

            console.log(path);
            out.write(JSON.stringify([path, data]) + "\n");

            _.each(tree, function (tree, subcollection) {
                var task = function (cb) {
                    copy(tree, collection + "/" + child.id + "/" + subcollection, cb);
                };
                todo.push(task);
            });
        });
    }).then(function () {
        async.eachLimit(
            todo,
            25,
            function (task, cb) {
                _.defer(function () {
                    task(cb);
                });
            },
            function () {
                cb(null);
            }
        );
    });
}

function getBatch(collection, start, cb) {
    var ref = db.collection(collection).limit(BATCH_SIZE);
    if (start) ref = ref.startAfter(start);

    ref.get().then(function (snapshot) {
        cb(snapshot);
    });
}

function getAll(collection, drainCB) {
    return new Promise(function (resolve) {
        var snapshots = [];
        var drained = 0;

        var next = function (batch) {
            _.each(batch.docs, function (snapshot) {
                snapshots.push(snapshot);
            });

            if (drainCB) {
                // avoid memory issues
                drainCB(snapshots);
                drained += snapshots.length;
                snapshots = [];
            }

            if (batch.docs && batch.docs.length == BATCH_SIZE) {
                // full batch; fetch another
                // starting right after the end of this one
                console.log(
                    "Loaded",
                    drained + snapshots.length,
                    "documents from",
                    collection + "..."
                );
                getBatch(collection, batch.docs[BATCH_SIZE - 1], next);
            } else {
                // we reached the end!
                resolve(snapshots);
            }
        };

        getBatch(collection, null, next);
    });
}
