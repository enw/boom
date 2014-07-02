#!/usr/bin/env node
  var fs = require('fs'),
     argv = require('minimist')(process.argv.slice(2)),
     args = argv._,
     action = args[0],
     name = args[1],
     value = args.slice(2).join(" "); // rest

var DATA_DIR = process.env.HOME + '/.boom';

var cache = {
  name: 'Elliot Winard'
};

function getFN(name)  {
  return DATA_DIR+'/'+name;
};

var actionHash = {
  help: function () {
    throw new Error('help');
  },
  // save value
  set: function () {
    var fn=getFN(name);
    fs.writeFile(fn, value, function (err) {
        if (err) throw err;
        console.log('okay');
      });
  },

  // output value to stdout
  get: function () {
    console.log(fs.readFileSync(getFN(name), {encoding:'utf8'}));
    /*
    var value = cache[name];
    if (value == undefined) throw new Error("value not remebered")
    console.log(cache[name]);
    */
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

// make data dir if it's not already created
try {
  fs.mkdirSync(DATA_DIR);
} catch(err) {
  if (err.code == 'EEXIST') {
    // directory already exists

  } else {
    console.log('err',err);
  }
}

try {
  actionHash[action]();
} catch (err) {
  //  console.log(err);
  console.log('ERR',err);
  console.log('boom <action>s - set, get, forget, list help');
}

//console.log(action, name, value);
//console.log(argv);

//console.log('cache', cache);
