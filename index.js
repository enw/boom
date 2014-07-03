#!/usr/bin/env node
  var fs = require('fs'),
     argv = require('minimist')(process.argv.slice(2)),
     args = argv._,
     first = args[0],
     rest = args.slice(1).join(' '); // rest

var DATA_DIR = process.env.HOME + '/.boom_cache';

function getFN(name)  {
  return DATA_DIR+'/'+name;
};

var actions = {
  help: function () {
    throw new Error('help');
  },
  // save value
  set: function () {
    var name=first, value=rest;
    var fn=getFN(name);
    fs.writeFile(fn, value, function (err) {
        if (err) throw err;
        console.log(name,'saved');
      });
  },

  // output value to stdout
  get: function () {
    var name=rest;
    console.log(fs.readFileSync(getFN(name), {encoding:'utf8'}));
  },

  // forget value
  forget: function () {
    var name=first,
      fn=getFN(rest);
    fs.unlinkSync(fn);
    console.log('okay');
  },

  // dump what is stored to stdout
  list: function () {
    var files = fs.readdirSync(DATA_DIR);
    if (files.length==0) {
      console.log('no remembered snippets');
    } else {
      console.log('remembered snippets:');
      for (var i=0;i<files.length;i++) {
        console.log( '\t' + files[i]);
      }
    };
    return files;
  }
};

// make data dir if it's not already created
try {
  fs.mkdirSync(DATA_DIR);

  // copy files from template folder to DATA_DIR
  function getTemplatePath(fn) {
    return './templates/'+fn;
  };
  var files = fs.readdirSync('./templates');
  for (var i=0;i<files.length;i++) {
    var fn = files[i];
    fs.writeFileSync(getFN(fn), fs.readFileSync(getTemplatePath(fn, {encoding:'utf8'})));
  };
} catch(err) {
  if (err.code == 'EEXIST') {
    // directory already exists
    // so do mothing
  } else {
    console.log('err',err);
  }
}

try {
  actions[first]();
} catch (err) {
  //  console.log(err);
  switch(err.name) {
    case 'TypeError':
      // Property 'undefined' of object #<Object> is not a function
      // console.log(err);
      break;
    default:
      switch(err.code) {
      case 'ENOENT': // no such file in dir
          // do nothing
        console.log('unable to forget "%s".',rest);
          break;
      default:
        console.log('unhandled ERRRR',err);
      }
      // do nothing special
  }

  // always output recommended syntax
  console.log();
  console.log('usage: boom <action> [name] [value]');
  console.log('    actions: set, get, forget, list');
}
