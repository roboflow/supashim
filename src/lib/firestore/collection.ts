import DocumentReference from "./doc.ts";

export default class CollectionReference {
    public path;

    constructor(path) {
        this.path = path;
    }

    where(prop, op, value) {
        return this;
    }

    onSnapshot(cb) {
        console.log("onSnapshot collection", this.path);
    }

    doc(id) {
        return new DocumentReference(this, id);
    }
}
