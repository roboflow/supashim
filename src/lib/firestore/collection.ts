import DocumentReference from "./doc.ts";
import Settings from "../settings.ts";
const globalSettings = Settings(true);

export default class CollectionReference {
    public path: string;
    public shim: FirestoreShim;
    public db;

    constructor(shim, path) {
        this.path = path;

        this.shim = shim;
        this.db = shim.client;
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
