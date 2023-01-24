import CollectionReference from "./collection.ts";

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
        console.log("set document", this.parent.path, this.id, val);
        return pinkyPromise();
    }

    update(val) {
        console.log("update document", this.parent.path, this.id, val);
        return pinkyPromise();
    }

    get() {
        console.log("get document", this.parent.path, this.id);
        return pinkyPromise();
    }
}
