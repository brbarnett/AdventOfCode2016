const _ = require('lodash');

const fileService = require('./core/fileService');

const input = fileService.getFileContents('./6.dat');

const message = _(input)
    .chain()
    .split('\r\n')  // split into lines
    .map(x => x.split(''))  // split into char arrays
    .unzip()    // transpose
    .map(x => _.groupBy(x)) // group so we can count by character
    .map(x => _(x)
        .chain()
        .map((arr, prop) => ({
            letter: prop,
            count: arr.length
        }))
        .orderBy('count', 'asc')
        .head()
        .value()
    )
    .map(x => x.letter) // get 'letter'
    .join('')   // join for answer
    .value();

console.log('Result:', message);