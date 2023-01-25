/*
    static methods for performing operations on the supabase
    postgres database via remote procedure calls
*/

const supabase = require("../Supabase");

export default class RPC {
    /*
        use supabase to create a table named `table_name`
        with three columns:
            * id (string representing the Firestore document ID)
            * path (jsonb column representing path components for nested subcollections; defaults to {})
            * data (jsonb column with the document's data)
    
        This happens via a Postgres RPC to `create_supashim_table`
        that checks if the table exists & creates it with the
        desired schema if not and uses it only as a value to avoid
        SQL injection attacks.

        This RPC checks to ensure that the name input is prefixed with
        `supashim_` to ensure that we're not polluting the postgres
        table namespace with arbitrary table names.

        You'll need to setup the following RPC in your Postgres database:
        ```
            # in the event you want to re-initialize the supashim database tables, uncomment this line:
            # SELECT 'drop table "' || tablename || '" cascade;' from pg_tables WHERE tablename LIKE 'supashim_%';

            CREATE OR REPLACE FUNCTION public.create_supashim_table(name text)
            RETURNS text
            SECURITY DEFINER
            LANGUAGE plpgsql
            AS $$
            BEGIN
                IF name LIKE 'supashim_%' THEN
                    EXECUTE 'CREATE TABLE IF NOT EXISTS ' || quote_ident(name) || ' (
                        id text,
                        path jsonb DEFAULT ''[]''::jsonb,
                        data jsonb,
                        PRIMARY KEY (id)
                    )';
                    RETURN 'ok';
                ELSE
                    RAISE EXCEPTION 'table name must be prefixed with supashim_';
                END IF;
            END;
            $$;

            NOTIFY pgrst, 'reload schema'
        ```
    */

    // prevent multiple subsequent calls to create_supashim_table from trying to create multiple tables
    private static tableCreationPromises = {};
    static async create_supashim_table(table_name) {
        console.log("create_supashim_table", table_name);

        if (table_name.indexOf("supashim_") !== 0) {
            throw new Error("table name must be prefixed with supashim_");
        }

        const tableCreationPromise = RPC.tableCreationPromises[table_name]
            ? RPC.tableCreationPromises[table_name] // use existing promise if it exists
            : supabase.client().rpc("create_supashim_table", {
                  name: table_name
              });
        RPC.tableCreationPromises[table_name] = tableCreationPromise;

        const { data, error } = await tableCreationPromise;

        if (error) {
            console.error("error creating table", error);
            throw new Error(error.message);
        }

        return data;
    }
}
