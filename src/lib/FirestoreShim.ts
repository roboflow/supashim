function noop() {}

import CollectionReference from "./firestore/CollectionReference";
const supabase = require("./Supabase.js");

import Settings from "./Settings";
const globalSettings = Settings(true);

export class FirestoreShim {
    public readonly client: any;

    constructor(app?) {
        this.client = supabase.client();
    }

    settings() {}

    collection(path) {
        return new CollectionReference(this, path);
    }
}

function shim() {
    return new FirestoreShim();
}

shim.FieldValue = {
    serverTimestamp: noop,
    increment: noop,
    arrayUnion: noop,
    arrayRemove: noop
};

export default shim;
