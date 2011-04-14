var sys = require("sys");
var fs = require("fs");

var util = exports;

util.readFile = function(filepath, callback) {
    fs.readFile(filepath, "utf8", function (err, data) {
        if (err)
            sys.puts("Could not read " + filepath + " " + err);
        else
            callback(data);
    });
}

util.writeFile = function (filepath, string) {
    fs.writeFile(filepath, string, function(err) {
        if(err)
            sys.puts("Could not save " + filepath + " " + err);
        else
            sys.puts("Saved " + filepath);
    });
}

util.randomElement = function (elements) {
    if(elements.length > 0)
        return elements[Math.floor(elements.length * Math.random())];
    else
        return null;
}

util.guid: function() {
    var S4 = function() {
       return (((1+Math.random())*0x10000)|0).toString(16).substring(1);
    };
    return (S4()+S4()+"-"+S4()+"-"+S4()+"-"+S4()+"-"+S4()+S4()+S4());
}