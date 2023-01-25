import CollectionReference from "./collection.ts";
import Settings from "../settings.ts";
const globalSettings = Settings(true);

function pinkyPromise() {
    return new Promise(function (resolve, reject) {});
}

export default class DocumentReference {
    public parent;
    public id;

    constructor(parent, id) {
        this.parent = parent;
        this.id = id;
    }

    collection(path) {
        return new CollectionReference(path);
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

    get() {
        if (this.parent.path.indexOf("/") >= 0) {
            throw new Error(
                `get document for subcollections not yet implemented; path: ${this.parent.path}, doc: ${this.id}`
            );
        }

        console.log("get document", this.parent.path, this.id);
        console.log("AUTO CREATE", globalSettings().autoCreateTables);
        return pinkyPromise();
    }
}
