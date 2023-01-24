function noop() {}

function ret() {
    return {
        settings: noop,
        collection: require("./firestore/collection")
    };
}

ret.FieldValue = {
    serverTimestamp: noop,
    increment: noop,
    arrayUnion: noop,
    arrayRemove: noop
};

module.exports = ret;
