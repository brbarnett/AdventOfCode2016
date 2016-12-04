const _ = require('lodash');
const fileService = require('./core/fileService');

const input = fileService.getFileContents('./input4.dat');

const realRoomPattern = new RegExp(/([-a-z]+?)(?:-)([0-9]+)(?:\[)(\w+)(?:\])/i);

const room = _(input.split('\n'))
    .chain()
    .map(parseRoom) // convert to rooms
    .filter(roomIsReal) // only take real rooms
    .map(room => Object.assign(room, {
        decrypted: _(room.name.split(''))
            .chain()
            .map(letter => shiftCharacter(letter, room.sectorId))   // shift characters
            .join('')   // join char array to string
            .value()
    }))
    .filter(x => _.includes(x.decrypted, 'north'))  // check for a room that includes 'north' in the name
    .head() // get first 
    .value();

console.log('Result:', room);

function parseRoom(roomName) {
    const matches = roomName.match(realRoomPattern);

    return {
        initial: roomName,
        name: matches[1],
        sectorId: +matches[2],
        checkSum: matches[3]
    };
}

function roomIsReal(room) {
    const letters = _(room.name.replace(/-/g, '').split(''))
        .chain()
        .groupBy()  // group by letter to get counts
        .map((arr, prop, obj) => ({
            letter: prop,
            count: arr.length
        }))
        .orderBy(['count', 'letter'], ['desc', 'asc'])
        .map(x => x.letter) // get only letter property
        .take(5)    // take first 5 only
        .join('')   // join char array to string
        .value();

    return letters === room.checkSum;
}

// lowercase a-z ranges from 97-122
function shiftCharacter(char, shift) {
    if (char === '-') return ' ';    // '-' goes to space

    var ascii = char.charCodeAt(0); // get ascii code
    ascii += shift % 26;    // shift chars, use mod 26 to wrap
    if (ascii > 122)
        ascii -= 26;    // ensure within range

    return String.fromCharCode(ascii);  // translate char code to ascii
}

/*
// tests
console.log(roomIsReal('aaaaa-bbb-z-y-x-123[abxyz]'));
console.log(roomIsReal('a-b-c-d-e-f-g-h-987[abcde]'));
console.log(roomIsReal('not-a-real-room-404[oarel]'));
console.log(roomIsReal('totally-real-room-200[decoy]'));
*/