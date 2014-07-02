#!/usr/bin/env node
var argv = require('minimist')(process.argv.slice(2)),
     args = argv._,
     action = args[0],
     name = args[1],
     value = args.slice(2).join(" "); // rest

console.log(action, name, value);
console.log(argv);

