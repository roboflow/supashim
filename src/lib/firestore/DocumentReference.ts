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
        return new CollectionReference(this.parent.shim, [this.parent.path, path].join("/"));
    }

    onSnapshot(cb) {
        console.log("onSnapshot document", this.parent.path, this.id);

        this.get().then(function (snapshot) {
            cb(snapshot);
        });
    }

    async get() {
        if (this.parent.path.indexOf("/") >= 0) {
            throw new Error(
                `get document for subcollections not yet implemented; path: ${this.parent.path}, doc: ${this.id}`
            );
        }

        console.log("get document", this.parent.path, this.id);

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

        return new DocumentSnapshot(this, data && data[0]);
    }

    set(val, options) {
        console.log("set document", this.parent.path, this.id, val, options);
        return pinkyPromise();
    }

    update(val) {
        console.log("update document", this.parent.path, this.id, val);
        return pinkyPromise();
    }
}
