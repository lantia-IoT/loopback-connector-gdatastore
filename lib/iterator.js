module.exports = (obj, fn, thisArg) => {
    for (var key in obj) {
        if (fn.call(thisArg, obj[key], key, obj) === false) {
            break;
        }
    }
}