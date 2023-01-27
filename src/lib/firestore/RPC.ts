/*
    static methods for performing operations on the supabase
    postgres database via remote procedure calls
*/

const supabase = require("../Supabase");

export default class RPC {
    /*
        use supabase to create a table named `table_name`
        with three columns:
            * path (text column representing path components for nested subcollections; defaults to empty string which means top-level collection)
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
            -- Note: In the event you want to re-initialize the supashim database tables, uncomment these lines to drop them:
            -- DO $$ DECLARE
            --   r RECORD;
            -- BEGIN
            --   FOR r IN (SELECT tablename FROM pg_tables WHERE schemaname = current_schema() AND tablename LIKE 'supashim_%') LOOP
            --       EXECUTE 'DROP TABLE IF EXISTS ' || quote_ident(r.tablename) || ' CASCADE';
            --   END LOOP;
            -- END $$;

            CREATE OR REPLACE FUNCTION public.create_supashim_table(name TEXT)
            RETURNS TEXT
            SECURITY DEFINER
            LANGUAGE plpgsql
            AS $$
            BEGIN
                IF name LIKE 'supashim_%' THEN
                    EXECUTE 'CREATE TABLE IF NOT EXISTS ' || quote_ident(name) || ' (
                        path TEXT NOT NULL DEFAULT '''',
                        id TEXT NOT NULL,
                        data jsonb,
                        PRIMARY KEY (path, id)
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
