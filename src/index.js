function notYetImplemented(method) {
    return function () {
        console.log(`[supashim]: Method (${method}) not yet implemented.`);
        return {};
    };
}

const Settings = require("./lib/settings.ts").default;
const globalSettings = Settings(true, {
    autoCreateTables: false
});

module.exports = {
    "createClient": require("./lib/supabase.js").createClient,
    "supabase": require("./lib/supabase.js").client,
    "settings": globalSettings,

    "analytics": notYetImplemented("analytics"),
    "app-check": notYetImplemented("app-check"),
    "app": notYetImplemented("app"),
    "auth": notYetImplemented("auth"),
    "database": notYetImplemented("database"),
    "firestore": require("./lib/firestore").default,
    "functions": notYetImplemented("functions"),
    "initializeApp": notYetImplemented("initializeApp"),
    "messaging": notYetImplemented("messaging"),
    "performance": notYetImplemented("performance"),
    "remote-config": notYetImplemented("remote-config"),
    "storage": notYetImplemented("storage"),
    "User": notYetImplemented("User"),

    "apps": []
};
