function noop() {}

import CollectionReference from "./firestore/CollectionReference";
const supabase = require("./Supabase");

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
    serverTimestamp: function () {
        return Date.now();
    },
    increment: function (amount) {
        return `INC ${amount}`;
    },
    arrayUnion: function (...values) {
        return `UNION ${values}`;
    },
    arrayRemove: function (...values) {
        return `REMOVE ${values}`;
    }
};

export default shim;
