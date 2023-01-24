function noop() {}

module.exports = function () {
    return {
        doc: require("./doc.js"),
        where: require("./collection.js"),
        onSnapshot: noop
    };
};
