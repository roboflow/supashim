// https://firebase.google.com/docs/reference/js/v8/firebase.firestore.Query

const _ = require("lodash");

import DocumentReference from "./DocumentReference";
import QuerySnapshot from "./QuerySnapshot";
import Settings from "../Settings";
const globalSettings = Settings(true);

export default class QueryReference {
    public readonly path: string;
    public readonly pathValues: string[];
    public readonly shim: FirestoreShim;
    public readonly db: any;
    public readonly filters: any[];

    constructor(shim: FirestoreShim, path, pathValues: string[] = [], filters: any[] = []) {
        this.path = path;
        this.pathValues = pathValues;
        this.filters = filters;

        this.shim = shim;
        this.db = shim.client;
    }

    tableName() {
        return `supashim_${this.path}`;
    }

    where(fieldPath: string, opStr: string, value: any): QueryReference {
        console.log(this.path, "where", this.filters, fieldPath, opStr, value);

        return new QueryReference(
            this.shim,
            this.path,
            this.pathValues,
            _.concat(this.filters, { fieldPath, opStr, value })
        );
    }

    onSnapshot(cb) {
        console.log("onSnapshot collection", this.path, this.filters);

        this.get().then(function (snapshot) {
            cb(snapshot);
        });
    }

    async get() {
        var query = this.db.from(this.tableName()).select("*");

        /*
            Example Queries:
            SELECT * FROM supashim_workspaces WHERE data->'roles'->'eF616TpNiRbl6MniCL8FOD4rXX32' IN ('"owner"', '"labeler"')
            SELECT * FROM supashim_workspaces WHERE data#>>'{roles,eF616TpNiRbl6MniCL8FOD4rXX32}' IN ('owner', 'labeler')
        */

        _.each(this.filters, function (filter) {
            // var fieldPath = "data";
            // var fieldPath = _.concat(
            //     "data",
            //     _.map(filter.fieldPath.split("."), function (part) {
            //         return `'${part}'`;
            //     }).join("->")
            // );

            var fieldPath = `data#>>'{${filter.fieldPath.replace(/\./g, ",")}}'`;

            // var value = _.map(filter.value, function (value) {
            //     // return `'${JSON.stringify(_.set({}, filter.fieldPath, value))}'::jsonb`;
            //     return _.set({}, filter.fieldPath, value);
            // });

            var value = filter.value;

            // debugger;

            if (filter.opStr === "==") {
                query = query.eq(fieldPath, value);
            } else if (filter.opStr === "!=") {
                query = query.neq(fieldPath, value);
            } else if (filter.opStr === ">") {
                query = query.gt(fieldPath, value);
            } else if (filter.opStr === ">=") {
                query = query.gte(fieldPath, value);
            } else if (filter.opStr === "<") {
                query = query.lt(fieldPath, value);
            } else if (filter.opStr === "<=") {
                query = query.lte(fieldPath, value);
            } else if (filter.opStr === "array-contains") {
                query = query.contains(fieldPath, [value]);
            } else if (filter.opStr === "array-contains-any") {
                query = query.contains(fieldPath, value);
            } else if (filter.opStr === "in") {
                query = query.in(fieldPath, value);
            } /*else if (filter.opStr === "not-in") {
                // TODO: notIn is not implemented
                query = query.notIn(fieldPath, value);
            }*/ else {
                throw new Error("Invalid filter operator: " + filter.opStr);
            }
        });

        const { data, error } = await query;

        if (error && error.code === "42P01") {
            // table does not exist
            if (globalSettings().autoCreateTables) {
                const { data, error } = await RPC.create_supashim_table(this.parent.tableName());

                // retry if table was created
                if (!error) {
                    return await this.get();
                } else {
                    throw new Error(error.message);
                }
            }
        } else if (error) {
            throw new Error(error.message);
        }

        // debugger;
        return new QuerySnapshot(this, data || []);
    }
}
