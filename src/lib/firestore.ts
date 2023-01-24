function noop() {}

import CollectionReference from "./firestore/collection";

class FirestoreShim {
    settings() {}

    collection(path) {
        return new CollectionReference(path);
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
