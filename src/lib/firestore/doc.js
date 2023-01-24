function noop() {}
function pinkyPromise() {
    return new Promise(function (resolve, reject) {});
}

module.exports = function () {
    return {
        collection: require("./collection.js"),
        onSnapshot: noop,
        set: pinkyPromise,
        update: pinkyPromise,
        get: pinkyPromise
    };
};
