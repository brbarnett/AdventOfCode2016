const _ = require('lodash');
const cryptoJs = require('crypto-js')

const input = 'ffykfhsq';

var password = [];
var i = 0;
while (_.compact(password).length < 8) {
    const hash = cryptoJs.MD5(input + i++).toString(cryptoJs.enc.Base16); // get hash. I've hidden an increment in here, too
    if (_.startsWith(hash, '00000')) {   // check that hash begins with '00000'
        const index = +hash[5];
        if(isNaN(index) || index < 0 || index > 7) continue;   // skip invalid indices
        if(typeof password[index] !== 'undefined') continue;    // skip where position already defined

        console.log('Found character', hash[6]);
        password[index] = hash[6]; // get 6th character (base 0, so index is 5)
    }
}

console.log('Result:', _.join(password, ''));