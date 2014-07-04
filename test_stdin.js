#!/usr/bin/env node
process.stdin.setEncoding('utf8');

process.stdin.on('readable', function() {
    var chunk = process.stdin.read();
    if (chunk !== null) {
      console.log('there is an incoming stream.  use it as input.');
        process.exit(0);
      //      process.stdout.write('data: ' + chunk);
    } else {
        console.log('no incoming stream.  take input from command-line.');
        process.exit(0);
    }
  });

process.stdin.on('end', function() {
    process.stdout.write('end');
});
