// https://firebase.google.com/docs/reference/js/v8/firebase.firestore.QuerySnapshot
// holds a bunch of DocumentSnapshots

import QueryReference from "./QueryReference";
import DocumentSnapshot from "./DocumentSnapshot";
import CollectionReference from "./CollectionReference";

export default class QuerySnapshot {
    public readonly ref: QueryReference;
    public readonly id;
    public docs: DocumentSnapshot[];

    constructor(ref: QueryReference, data: any) {
        this.ref = ref;
        this.docs = [];

        var _this = this;
        _.each(data, function (row) {
            _this.docs.push(
                new DocumentSnapshot(
                    new CollectionReference(ref.shim, ref.path, ref.pathValues).doc(row.id),
                    row.data
                )
            );
        });
    }

    forEach(cb) {
        _.each(this.docs, function (doc) {
            cb(doc);
        });
    }
}
