// import serialized firestore jsonl data (exported with `export.js`) into supabase

var _ = require("lodash");
var async = require("async");

var fs = require("fs");
const es = require("event-stream");

var stream = fs.createReadStream("./data.jsonl", "utf8");

var linesToProcess = [];
var concurrency = 25;

var lines = 0;
stream
    .pipe(es.split())
    .pipe(
        es.mapSync(function (line) {
            linesToProcess.push(line);
            if (linesToProcess.length >= concurrency) {
                var inFlight = linesToProcess;
                linesToProcess = [];

                stream.pause();

                processAll(inFlight, function () {
                    stream.resume();
                });
            }
        })
    )
    .on("error", function (err) {
        console.log("Error while reading file.", err);
    })
    .on("end", function () {
        processAll(linesToProcess, function () {
            console.log("Read entire file.", lines);
        });
    });

function processAll(inFlight, cb) {
    async.each(
        inFlight,
        function (line, cb) {
            lines++;

            // PLACEHOLDER: insert the line into Supabase here
            _.defer(function () {
                cb(null);
            });
        },
        function () {
            cb(null);
        }
    );
}
// async.eachLimit(
//     out,
//     100,
//     function (line, cb) {
//         try {
//             line = JSON.parse(line);
//         } catch (e) {
//             return cb(null);
//         }

//         var path = line[0];
//         var data = line[1];

//         console.log("write", path);
//         db_local
//             .doc(path)
//             .set(data)
//             .then(function () {
//                 console.log("wrote", path);
//                 cb(null);
//             });
//     },
//     function () {
//         process.exit(0);
//     }
// );
