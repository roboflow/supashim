const { createClient } = require("@supabase/supabase-js");
var client;

module.exports = {
    createClient: function (supabaseUrl, supabaseKey, options = {}) {
        client = createClient(supabaseUrl, supabaseKey, options);
    },
    client: function () {
        if (!client) {
            throw new Error("You must call createClient before using supabase");
        }

        return client;
    }
};
