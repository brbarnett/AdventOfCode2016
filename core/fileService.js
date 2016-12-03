var fs = require('fs');

module.exports = {
    getFileContents: function getFileContents(path) {
        return fs.readFileSync(path, 'utf8');
    }
};