function noop() {}

import CollectionReference from "./firestore/collection";
const supabase = require("../lib/supabase.js");

import Settings from "./settings.ts";
const globalSettings = Settings(true);

class FirestoreShim {
    public client;

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
