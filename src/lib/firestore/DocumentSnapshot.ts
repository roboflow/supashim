// https://firebase.google.com/docs/reference/js/v8/firebase.firestore.DocumentSnapshot

import DocumentReference from "./DocumentReference";

export default class DocumentSnapshot {
    public readonly ref;
    public readonly id;
    private _data: any;

    constructor(ref: DocumentReference, data: any) {
        this.id = ref.id;
        this.ref = ref;
        this._data = data || null;
    }

    data() {
        return JSON.parse(JSON.stringify(this._data));
    }
}
