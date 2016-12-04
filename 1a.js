const _ = require('lodash');
const fileService = require('./core/fileService');

const input = fileService.getFileContents('./input1.dat');

// define mapping from instructions to turns
const turns = {
    L: -90,
    R: 90
};

// define unit vectors
const directions = {
    '0': [0, 1],
    '90': [1, 0],
    '180': [0, -1],
    '270': [-1, 0]
};

const finalPosition = _(input)
    .chain()
    .split(',')
    .map(_ => _.trim()) // trim spaces
    .map(_ => {
        return {
            turn: _[0],
            distance: +_.substr(1)
        };
    })  // parse into individual instructions
    .reduce((results, instruction) => {
        results.direction += turns[instruction.turn];   // change direction
        results.direction = results.direction % 360;    // check between 0-360
        if (results.direction < 0) results.direction += 360; // ensure positive

        const vector = directions[results.direction];   // get unit vector
        results.vectors.push(_.map(vector, _ => _ * instruction.distance));   // add to position history

        return results;
    }, { direction: 0, vectors: [] })
    .get('vectors')   // get 'vectors' property
    .reduce((currentPosition, vector) => _.zipWith(currentPosition, vector, (a, b) => a + b), [0, 0])   // add each vector, accumulate position
    .value();

console.log('Result:', finalPosition[0] + finalPosition[1]);