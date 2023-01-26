// https://firebase.google.com/docs/reference/js/v8/firebase.firestore.DocumentSnapshot

import DocumentReference from "./DocumentReference";

export default class DocumentSnapshot {
    public readonly ref;
    public readonly id;
    public _data: any;

    constructor(ref: DocumentReference, data: any) {
        this.id = ref.id;
        this.ref = ref;
        this._data = JSON.stringify(data || null);
    }

    data() {
        if (!this._data) return null;
        return JSON.parse(this._data);
    }
}
