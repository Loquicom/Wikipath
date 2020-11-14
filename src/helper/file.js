/**
 * Fonction utilitaire sur les fichiers
 */
const fs = require('fs');

module.exports.exist = function (path, verbose = false) {
    try {
        return fs.existsSync(path);
    } catch (err) {
        if (verbose) {
            console.log(err);
        }
        return false;
    }
};

module.exports.makedir = function (path, isFilePath = false, verbose = false) {
    if (isFilePath) {
        let split = path.split('/');
        delete split[split.length - 1];
        path = split.join('/');
    }
    if (!module.exports.exist(path)) {
        try {
            fs.mkdirSync(path, {recursive: true});
            return true;
        } catch (err) {
            if (verbose) {
                console.error(err);
            }
            return false;
        }
    } else {
        return true;
    }
};

module.exports.put = function (path, content, verbose = false) {
    try {
        fs.writeFileSync(path, content);
        return true;
    } catch (err) {
        if (verbose) {
            console.error(err);
        }
        return false;
    }
};

module.exports.append = function (path, content, verbose = false) {
    try {
        fs.appendFileSync(path, content);
        return true;
    } catch (err) {
        if (verbose) {
            console.error(err);
        }
        return false;
    }
};

module.exports.delete = function (path, verbose = false) {
    try {
        fs.unlinkSync(path);
        return true;
    } catch (err) {
        if (verbose) {
            console.error(err);
        }
        return false;
    }
};

module.exports.getExtension = function (filename) {
    const split = filename.split('.');
    return split[split.length - 1];
};

module.exports.isDir = function (path) {
    if (!module.exports.exist(path)) {
        return false;
    }
    return fs.statSync(path).isDirectory();
};

module.exports.isFile = function (path) {
    if (!module.exports.exist(path)) {
        return false;
    }
    return fs.statSync(path).isFile();
};

module.exports.list = function (path) {
    if (!module.exports.isDir(path)) {
        return [];
    }
    return fs.readdirSync(path);
};

module.exports.copy = function (source, dest, verbose = false) {
    if (!module.exports.isFile(source)) {
        return false;
    }
    try {
        fs.copyFileSync(source, dest);
        return true;
    } catch (err) {
        if (verbose) {
            console.error(err);
        }
        return false;
    }
};

module.exports.read = function (filepath, verbose = false) {
    if (!module.exports.isFile(filepath)) {
        return false;
    }
    try {
        return fs.readFileSync(filepath).toString();
    } catch (err) {
        if (verbose) {
            console.error(err);
        }
        return false;
    }
}

module.exports.loadJson = function (filepath, verbose = false) {
    const content = module.exports.read(filepath, verbose);
    if (!content) {
        return false;
    }
    try {
        return JSON.parse(content);
    } catch (err) {
        if (verbose) {
            console.error(err);
        }
        return false;
    }
}

module.exports.writeJson = function (path, content, verbose = false) {
    try {
        const json = JSON.stringify(content, null, 4);
        module.exports.put(path, json, verbose);
    } catch (err) {
        if (verbose) {
            console.error(err);
        }
        return false;
    }
    return true;
}

module.exports.system = fs;