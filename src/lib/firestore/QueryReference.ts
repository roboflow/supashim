// https://firebase.google.com/docs/reference/js/v8/firebase.firestore.Query

import DocumentReference from "./DocumentReference";
import Settings from "../Settings";
const globalSettings = Settings(true);

export default class QueryReference {
    public readonly path: string;
    public readonly pathValues: string[];
    public readonly shim: FirestoreShim;
    public readonly db: any;

    constructor(shim: FirestoreShim, path, pathValues: string[] = []) {
        this.path = path;
        this.pathValues = pathValues;

        this.shim = shim;
        this.db = shim.client;
    }

    tableName() {
        return `supashim_${this.path}`;
    }

    where(prop, op, value) {
        console.log(this.path, "where", prop, op, value);
        return this;
    }

    onSnapshot(cb) {
        console.log("onSnapshot collection", this.path);
    }
}