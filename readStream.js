const fs = require("fs");
const readline = require("readline");
// Using stream to so that we can load big file, easily.
let myInterface = readline.createInterface({
    input: fs.createReadStream("input.txt"),
});

module.exports = myInterface;