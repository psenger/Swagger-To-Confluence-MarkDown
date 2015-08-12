var walk = require('walk').walk,
    path = require('path'),
    fs = require('fs'),
    Promise = require('bluebird'),
    Handlebars = require('handlebars');


var viewDirectory = __dirname + '/views/';
var source = null;
var template = null;


var promise = new Promise(function (resolve, reject) {
    walk(viewDirectory)
        .on('file', function (root, stat, next) {
            var filePath = path.join(root, stat.name);
            fs.readFile(filePath, 'utf8', function (err, data) {
                if (!err) {
                    var ext = path.extname(filePath);
                    var templateName = path.relative(viewDirectory, filePath).slice(0, -(ext.length)).replace(/[ -]/g, '_').replace('\\', '/');
                    Handlebars.registerPartial(templateName, data);
                } else {
                    reject(err);
                }
                next();
            });
        })
        .on('end', function () {
            resolve(true);
        });
})
    .then(function (result) {
        return new Promise(function (resolve, reject) {
            source = fs.readFileSync( __dirname + '/views/index.hbs', {encoding: 'utf8'});
            resolve(result);
        });
    })
    .then(function (result) {
        return new Promise(function (resolve, reject) {

            var helpers = require('./helpers');

            Handlebars.registerHelper( 'toUpperCase', helpers.toUpperCase );
            Handlebars.registerHelper( 'schema', helpers.schema );
            Handlebars.registerHelper( 'titleBGColor', helpers.titleBGColor );
            Handlebars.registerHelper( 'borderColor', helpers.borderColor );
            Handlebars.registerHelper( 'refLink', helpers.refLink );
            Handlebars.registerHelper( 'anchor', helpers.anchor );

            template = Handlebars.compile(source);
            resolve(result);
        });
    })
    .then(function (result) {
        // @TODO PAS: need to include the CLI library and be able to pass a URL as well as a file.
        var data = require('./swagger.json');
        var result = template(data);
        console.log ( result );
        return new Promise(function (resolve, reject) {
            resolve(result);
        });
    });
