// https://firebase.google.com/docs/reference/js/v8/firebase.firestore.CollectionReference

import type { FirestoreShim } from "../FirestoreShim";

import DocumentReference from "./DocumentReference";
import Settings from "../Settings";
const globalSettings = Settings(true);

export default class CollectionReference {
    public readonly path: string;
    public readonly shim: FirestoreShim;
    public readonly db: any;

    constructor(shim: FirestoreShim, path, pathValues = []) {
        this.path = path;

        this.shim = shim;
        this.db = shim.client;
    }

    tableName() {
        return `supashim_${this.path}`;
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
