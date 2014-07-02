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
  },

  // forget value
  forget: function () {
    var fn=getFN(name);
    fs.unlinkSync(fn);
    console.log('okay');
  },

  // dump what is stored to stdout
  list: function () {
    var files = fs.readdirSync(DATA_DIR);
    console.log("remembered snippets:");
    for (var i=0;i<files.length;i++) {
      console.log( '\t' + files[i]);
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
  switch(err.name) {
    case "TypeError":
      // Property 'undefined' of object #<Object> is not a function
      // console.log(err);
      break;
    default:
      switch(err.code) {
      case "ENOENT": // no such file in dir
          // do nothing
          console.log('!!! nothing to forget !!!');
          break;
      default:
        console.log("unhandled ERRRR",err);
      }
      // do nothing special
  }

  // always output recommended syntax
  console.log();
  console.log('usage: boom <action> [name] [value]');
  console.log('    actions: set, get, forget, list, help');
}

//console.log(action, name, value);
//console.log(argv);

//console.log('cache', cache);
