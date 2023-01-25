import CollectionReference from "./collection";

import Settings from "../settings";
const globalSettings = Settings(true);

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
        return new CollectionReference(this.parent.shim, path);
    }

    onSnapshot(cb) {
        console.log("onSnapshot document", this.parent.path, this.id);
    }

    set(val, options) {
        console.log("set document", this.parent.path, this.id, val, options);
        return pinkyPromise();
    }

    update(val) {
        console.log("update document", this.parent.path, this.id, val);
        return pinkyPromise();
    }

    async get() {
        if (this.parent.path.indexOf("/") >= 0) {
            throw new Error(
                `get document for subcollections not yet implemented; path: ${this.parent.path}, doc: ${this.id}`
            );
        }

        console.log("get document", this.parent.path, this.id);
        console.log("AUTO CREATE", globalSettings().autoCreateTables);

        const { data, error } = await this.db.from(this.parent.path).select("*").eq("id", this.id);
        console.log({ data, error });

        await pinkyPromise();
    }
}
