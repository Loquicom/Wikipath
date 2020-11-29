const path = require('path');
const file = require('./src/helper/file');

console.log(__dirname);
console.log(file.list(__dirname));
console.log(path.join(__dirname, '../'));
console.log(file.list(path.join(__dirname, '../')));
console.log(path.join(__dirname, 'dist'));
console.log(file.list(path.join(__dirname, 'dist')));