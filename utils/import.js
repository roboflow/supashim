// import serialized firestore jsonl data (exported with `export.js`) into supabase

process.env["NODE_TLS_REJECT_UNAUTHORIZED"] = 0;

var _ = require("lodash");
var async = require("async");

var fs = require("fs");
const es = require("event-stream");

const fetch = require("node-fetch");

const supashim = require("../dist/main/index.js");

const supabaseSettings = JSON.parse(fs.readFileSync("./supabase.json"));

supashim.createClient(supabaseSettings.host, supabaseSettings.key, {
    global: { fetch: fetch.bind(globalThis) }
});
supashim.settings({
    autoCreateTables: true
});

const db = supashim.firestore();

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
            const [path, data] = JSON.parse(line);

            const parts = path.split("/");
            var ref = db.collection(parts.shift()).doc(parts.shift());
            while (parts.length) {
                ref = ref.collection(parts.shift()).doc(parts.shift());
            }

            console.log(ref.parent.tableName(), ref.parent.pathValues, ref.id);
            ref.set(data)
                .then(function () {
                    cb(null);
                })
                .catch(function () {
                    setTimeout(function () {
                        ref.set(data)
                            .then(function () {
                                cb(null);
                            })
                            .catch(function () {
                                cb(null);
                            });
                    }, 100);
                });
        },
        function () {
            cb(null);
        }
    );
}
