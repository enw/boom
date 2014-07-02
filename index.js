#!/usr/bin/env node
var argv = require('minimist')(process.argv.slice(2)),
     args = argv._,
     action = args[0],
     name = args[1],
     value = args.slice(2).join(" "); // rest

var cache = {
  name: 'Elliot Winard'
};

var actionHash = {
  help: function () {
    throw new Error('help');
  },
  // save value
  set: function () {
    cache[name] = value;
  },

  // output value to stdout
  get: function () {
    var value = cache[name];
    if (value == undefined) throw new Error("value not remebered")
    console.log(cache[name]);
  },

  // forget value
  forget: function () {
    delete cache[name];
    console.log('okay');
  },

  // dump what is stored to stdout
  list: function () {
    console.log('remembered things:');
    var i=0, k;
    for (k in cache) {
      console.log(i++ + ': ' + k);
    }
  }
};

try {
  actionHash[action]();
} catch (err) {
  //  console.log(err);
    console.log('boom <action>s - set, get, forget, list help');
}

//console.log(action, name, value);
//console.log(argv);

console.log('cache', cache);
