var fs = require('fs'),
    nodePath = require('path');

module.exports = function(root) {
    root = root || __dirname;

    return function*(next) {
        var req = this.request,
            res = this.response;

        var path = nodePath.join(root, req.path);

        if (fs.existsSync(path)) {
            res.status(200);
            //read file
            res.data(fs.readFileSync(path));
        } else {
            yield next;
        }
    };
};
