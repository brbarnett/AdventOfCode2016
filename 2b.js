const _ = require('lodash');
const fileService = require('./core/fileService');

const input = fileService.getFileContents('./input2.dat');

// define unit vectors
const directions = {
    'U': [-1, 0],
    'R': [0, 1],
    'D': [1, 0],
    'L': [0, -1]
};

const keypad = [
    [null, null, 1, null , null],
    [null, 2, 3, 4, null],  
    [5, 6, 7, 8, 9],   // start at 5, so [2, 0]
    [null, 'A', 'B', 'C', null],
    [null,  null, 'D', null, null]
];

const buttons = _(input.split('\n'))    // split by return
    .chain()
    .map(x => x.split(''))  // split each line into individual chars
    .reduce((results, line) => {
        _.forEach(line, direction => {
            const newPosition = _.zipWith(results.position, directions[direction], (a, b) => a + b);    // get new position by adding arrays
            
            if(positionIsLegal(newPosition)) 
                results.position = newPosition; // move to new position if it's legal
        });

        // add to pressed buttons
        results.buttons.push(keypad[results.position[0]][results.position[1]]);

        return results;
    }, { position: [2, 0], buttons: [] })   // start at 5, keep track of position
    .get('buttons') // get pressed buttons
    .value();

console.log('Result:', buttons);

function positionIsLegal(position) {
    if(position[0] < 0 || position[0] > 4) return false;
    if(position[1] < 0 || position[1] > 4) return false;
    if(keypad[position[0]][position[1]] === null) return false;

    return true;
}