const _ = require('lodash');
const fileService = require('./core/fileService');

const input = fileService.getFileContents('./input3.dat');

const possibleTriangles = _(input.split('\n'))
    .chain()
    .map(x => {
        return _(x.split(' '))
            .chain()
            .compact()  // remove empty and null values
            .map(y => +y)   // convert to number
            .orderBy(y => y)    // important to order for calc later
            .value();
    })  // parse all triangles side length values
    .reduce((possible, triangle) => {
        if (triangle[0] + triangle[1] > triangle[2]) // test that shortest two sides are > longest. this is why we ordered it before
            possible++;

        return possible;
    }, 0)
    .value();

console.log('Result:', possibleTriangles);