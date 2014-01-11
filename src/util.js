function formatFloat(tinyFloat) {
    var split = tinyFloat.toString().split('-');
    if (split.length !== 2) {
        return tinyFloat;
    }
    var fixedPrecision = parseInt(split[1]) + 1;
    return tinyFloat.toFixed(fixedPrecision);
}