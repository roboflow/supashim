function noop() {}

import CollectionReference from "./firestore/collection";
const supabase = require("../lib/supabase.js");

import Settings from "./settings";
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
