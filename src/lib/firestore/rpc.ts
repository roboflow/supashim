/*
    static methods for performing operations on the supabase
    postgres database via remote procedure calls
*/

const supabase = require("../supabase.js");

export default class RPC {
    /*
        use supabase to create a table named `table_name`
        with two columns:
            * id (string representing the Firestore document ID)
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
            CREATE OR REPLACE FUNCTION public.create_supashim_table(name text)
            RETURNS text
            SECURITY DEFINER
            LANGUAGE plpgsql
            AS $$
            BEGIN
                IF name LIKE 'supashim_%' THEN
                    EXECUTE 'CREATE TABLE IF NOT EXISTS ' || quote_ident(name) || ' (
                        id text,
                        data jsonb,
                        PRIMARY KEY (id)
                    )';
                    RETURN 'ok';
                ELSE
                    RAISE EXCEPTION 'table name must be prefixed with supashim_';
                END IF;
            END;
            $$;
        ```

        Then run
        ```
            NOTIFY pgrst, 'reload schema'
        ```
        to update the PostgREST schema cache.
    */
    static async create_supashim_table(table_name) {
        if (table_name.indexOf("supashim_") !== 0) {
            throw new Error("table name must be prefixed with supashim_");
        }

        const { data, error } = await supabase.client().rpc("create_supashim_table", {
            name: table_name
        });

        if (error) {
            console.error("error creating table", error);
            throw new Error(error.message);
        }

        return data;
    }
}
