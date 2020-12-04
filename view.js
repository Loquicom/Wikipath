const file = require('./src/helper/file');

function printDir(path) {
    const files = file.list(path);
    if(!files) {
        return;
    }
    console.log('------------');
    console.log(path);
    console.log(files);
    for(let f of files) {
        if (file.isDir(f)) {
            printDir(path + '/' + f);
        }
    }
}

printDir('./dist');