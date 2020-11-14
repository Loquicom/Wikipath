const regexIp = /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/g;
const regexHex = /^[0-9a-fA-F]{8}$/;
const iphex = {};

iphex.encode = function(ip) {
    if (!regexIp.test(ip)) {
        return false;
    }
    // Get the 4 number of the ip and transform into hex value
    const hex = ip.split('.').map(entry => parseInt(entry).toString(16));
    // Return in one string
    return hex.join('').toUpperCase();
};

iphex.decode = function(hex) {
    if (!regexHex.test(hex)) {
        return false;
    }
    // Split in 4 string of 2 char and transform hex to decimal value
    const number = hex.match(/.{2}/g).map(entry => parseInt(entry, 16));
    // Return ip
    return number.join('.');
};

iphex.isIp = function(ip) {
    return regexIp.test(ip);
};

iphex.isHex = function(hex) {
    return regexHex.test(hex);
};

module.exports = iphex;