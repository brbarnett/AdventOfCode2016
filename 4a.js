const _ = require('lodash');
const fileService = require('./core/fileService');

const input = fileService.getFileContents('./input4.dat');

const realRoomPattern = new RegExp(/([-a-z]+?)(?:-)([0-9]+)(?:\[)(\w+)(?:\])/i);

const sum = _(input.split('\n'))
    .chain()
    .map(x => parseRoom(x)) // convert to rooms
    .filter(x => roomIsReal(x)) // only take real rooms
    .sumBy(x => x.sectorId)
    .value();

console.log('Result:', sum);

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
        .groupBy()
        .map((arr, prop, obj) => {
            return {
                letter: prop,
                count: arr.length
            };
        })
        .orderBy(['count', 'letter'], ['desc', 'asc'])
        .map(x => x.letter)
        .take(5)
        .join('')
        .value();

    return letters === room.checkSum;
}

/*
// tests
console.log(roomIsReal('aaaaa-bbb-z-y-x-123[abxyz]'));
console.log(roomIsReal('a-b-c-d-e-f-g-h-987[abcde]'));
console.log(roomIsReal('not-a-real-room-404[oarel]'));
console.log(roomIsReal('totally-real-room-200[decoy]'));
*/