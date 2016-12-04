const _ = require('lodash');
const fileService = require('./core/fileService');

const input = fileService.getFileContents('./input3.dat');

const possibleTriangles = _(input.split('\n'))
    .chain()
    .map(x => _(x.split(' '))
        .chain()
        .compact()  // remove empty and null values
        .map(y => +y)   // convert to number
        .value())  // parse all triangles side length values
    .reduce((results, line, number) => {
        results.matrix.push(line);

        if (results.matrix.length >= 3) {
            const transposedMatrix = _(results.matrix)
                .chain()
                .unzip() // transpose
                .map(x => _.orderBy(x, y => y))    // important to order for calc later
                .value();

            results.lines = _.concat(results.lines, transposedMatrix);
            results.matrix = [];    // clear matrix
        }

        return results;
    }, { matrix: [], lines: [] })
    .get('lines')
    .reduce((possible, triangle) => {
        if (triangle[0] + triangle[1] > triangle[2]) // test that shortest two sides are > longest. this is why we ordered it before
            possible++;

        return possible;
    }, 0)
    .value();

console.log('Result:', possibleTriangles);