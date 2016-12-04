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

const firstIntersection = _(input)
    .chain()
    .split(',')
    .map(x => x.trim()) // trim spaces
    .map(x => {
        return {
            turn: x[0],
            distance: +x.substr(1)
        };
    })  // parse into individual instructions
    .reduce((results, instruction) => {
        results.direction += turns[instruction.turn];   // change direction
        results.direction = results.direction % 360;    // check between 0-360
        if (results.direction < 0) results.direction += 360; // ensure positive

        const vector = directions[results.direction];   // get unit vector

        // do this a little differently: track unit location history so we can more
        // easily detect crossover (future path collides with past path)
        var i;
        for (i = 0; i < instruction.distance; i++) {
            results.vectors.push(vector);   // add to position history
        }

        return results;
    }, { direction: 0, vectors: [] })
    .get('vectors')   // get 'vectors' property
    .reduce((results, vector) => {
        results.currentPosition = _.zipWith(results.currentPosition, vector, (a, b) => a + b);
        results.positionHistory.push({
            position: results.currentPosition,
            visit: _.filter(results.positionHistory, x => _.isEqual(x.position, results.currentPosition)).length
        });

        return results;
    }, { currentPosition: [0, 0], positionHistory: [{ position: [0, 0], visit: 0 }] })
    .get('positionHistory') // get position history to check for intersections
    .filter(x => x.visit > 0)
    .head()
    .value();

console.log('Result:', firstIntersection.position[0] + firstIntersection.position[1]);