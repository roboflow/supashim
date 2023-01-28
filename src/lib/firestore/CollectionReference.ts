// https://firebase.google.com/docs/reference/js/v8/firebase.firestore.CollectionReference

import type { FirestoreShim } from "../FirestoreShim";
import QueryReference from "./QueryReference";

import DocumentReference from "./DocumentReference";
import Settings from "../Settings";
const globalSettings = Settings(true);

export default class CollectionReference extends QueryReference {
    constructor(shim: FirestoreShim, path, pathValues: string[] = []) {
        super(shim, path, pathValues, []);
    }

    doc(id) {
        return new DocumentReference(this, id);
    }
}
