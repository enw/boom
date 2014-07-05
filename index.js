#!/usr/bin/env node
var fs = require('fs'),
     sprintf = require('sprintf').sprintf;

var  argv = require('minimist')(process.argv.slice(2)),
     args = argv._,
     first = args[0],
     rest = args.slice(1).join(' '); // rest

// {type:stdout}, {type:file,filename:<filename>}
var outputType = { STDOUT: 'stdout', FILE: 'file' };
var outputStyle = { type: outputType.STDOUT };
if (argv['o'] && argv['o'] != true) {
  outputStyle.type = outputType.FILE;
  outputStyle.filename = argv.o;
}

function output(s) {
  //console.log('OUTPUT', outputStyle);
  switch (outputStyle.type) {
  case outputType.STDOUT:
    console.log(s);
    break;
  case outputType.FILE:
    fs.writeFileSync(outputStyle.filename, s);
    break;
  default:
    console.log('ERROR : unknown output type', oututStyle.type);
  }
};
  //console.log(outputStyle);

var DATA_DIR = process.env.HOME + '/.boom_cache';

function getFN(name)  {
  return DATA_DIR+'/'+name;
};

// edit
function edit(done) {
  if (!process.env.EDITOR) {
    console.error('EDITOR environment variable must be set');
    return;
  }
  var editor = process.env.EDITOR,
    fn = getFN(rest),
    editor = require('editor');
    editor(fn, function(code,sig) {
        if (done) done();
    });
};

// dump list of rembered items to stdout
function list () {
  var files = fs.readdirSync(DATA_DIR);
  if (files.length==0) {
    console.log('no remembered snippets');
  } else {
    //      console.log('argv', argv);
    console.log('remembered snippets:');
    for (var i=0;i<files.length;i++) {
      console.log( '\t' + files[i]);
    }
  };
  return files;
};

var actions = {
  // save value from stdin
  set: function () {
    console.log('starting read from stdin...');

    // asynchronously get value
    // done() takes err, data
    function getValue(done) {
      process.stdin.setEncoding('utf8');

      var value = "";
      // collect data from stdin
      process.stdin.on('readable', function() {
          var chunk = process.stdin.read();
          if (chunk !== null) {
            value += chunk;
          }
        });

      // write data to file
      process.stdin.on('end', function() {
          var name=first;
          var fn=getFN(name);
          fs.writeFile(fn, value, function (err) {
              if (err) throw err;
              console.log("'%s' saved", name);
              list();
            });
          done();
        });
    };
    getValue(function(d) {});
  },

  // output value to stdout
  get: function () {
    var name=rest;
    output(fs.readFileSync(getFN(name), {encoding:'utf8'}));
  },

  // forget value
  forget: function () {
    var name=first,
      fn=getFN(rest);
    fs.unlinkSync(fn);
    console.log("'%s' deleted", rest);
  },

  // dump what is stored to stdout
  list: list
};

// make data dir if it's not already created
try {
  fs.mkdirSync(DATA_DIR);

  // copy files from template folder to DATA_DIR
  function getTemplatePath(fn) {
    return __dirname+'/templates/'+fn;
  };
  var files = fs.readdirSync(__dirname+'/templates');
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
  // handle help
  if (argv.h || argv.help) {
    usage();
    return;
  };


  // if no args given, list
  if (args.length==0) {
    return list();
  };

  // boom list
  // boom [ forget | rm ] <name>
  // boom get <name>
  // boom <name> <value>
  switch (first) {
    case "list":
      list();
      break;
    case "edit":
      edit();
      break;
    case "forget":
    case "rm":
      actions.forget();
      break;
    case "get":
      actions.get();
      break;
    default:
      actions.set();
      break;
  }
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
      case 'NOARGS':
        console.log('%s', err.message);
        break;
      default:
        console.log('unhandled ERRRR',err);
      }
      // do nothing special
  }

  function usage() {
    // always output recommended syntax
    console.log();
    console.log('usage:');
    console.log('\t$ boom list');
    console.log('\t$ boom get <name>');
    console.log('\t$ boom [ forget | rm ] <name>');
    console.log('\t$ boom <name> <value>');
    console.log('\t$ boom <name>');
  };
}
