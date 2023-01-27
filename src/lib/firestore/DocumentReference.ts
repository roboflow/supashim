// https://firebase.google.com/docs/reference/js/v8/firebase.firestore.DocumentReference

const _ = require("lodash");

import CollectionReference from "./CollectionReference";
import DocumentSnapshot from "./DocumentSnapshot";

import Settings from "../Settings";
const globalSettings = Settings(true);

import RPC from "./RPC";

function pinkyPromise() {
    return new Promise(function (resolve, reject) {});
}

export default class DocumentReference {
    public readonly parent: CollectionReference;
    public readonly id: string;
    public readonly db: any;

    constructor(parent, id) {
        this.parent = parent;
        this.id = id;

        this.db = parent.db;
    }

    collection(path) {
        return new CollectionReference(
            this.parent.shim,
            [this.parent.path, path].join(":"),
            _.concat(this.parent.pathValues, this.id)
        );
    }

    onSnapshot(cb) {
        console.log("onSnapshot document", this.parent.path, this.id);

        // hack until we get realtime wired up
        const _this = this;
        var previousValue = undefined;
        var interval = setInterval(function () {
            _this.get(true).then(function (snapshot) {
                if (previousValue !== snapshot._data) {
                    console.log(_this.parent.path, snapshot.id, snapshot._data);
                    cb(snapshot);
                }
                previousValue = snapshot._data;
            });
        }, 2500);

        return function () {
            clearInterval(interval);
        };
    }

    async get(quiet = false) {
        if (!quiet) console.log("get document", this.parent.path, this.id);

        const { data, error } = await this.db
            .from(this.parent.tableName())
            .select("*")
            .eq("id", this.id);

        if (error && error.code === "42P01") {
            // table does not exist
            if (globalSettings().autoCreateTables) {
                const { data, error } = await RPC.create_supashim_table(this.parent.tableName());

                // retry if table was created
                if (!error) {
                    return await this.get();
                } else {
                    throw new Error(error.message);
                }
            }
        } else if (error) {
            throw new Error(error.message);
        }

        return new DocumentSnapshot(this, data && data[0] && data[0].data);
    }

    async set(val, options = {}) {
        console.log("set document", this.parent.path, this.id, val, options);

        // do an upsert
        const { data, error } = await this.db
            .from(this.parent.tableName())
            .upsert(
                { path: this.parent.pathValues, id: this.id, data: val },
                { onConflict: "path, id", ignoreDuplicates: false }
            )
            .select();

        if (error && error.code === "42P01") {
            // table does not exist
            if (globalSettings().autoCreateTables) {
                const { data, error } = await RPC.create_supashim_table(this.parent.tableName());

                // retry if table was created
                if (!error) {
                    return await this.set(val, options);
                } else {
                    throw new Error(error.message);
                }
            }
        } else if (error) {
            throw new Error(error.message);
        }
    }

    async update(val) {
        console.log("update document", this.parent.path, this.id, val);

        return await this.set(val);
    }
}
