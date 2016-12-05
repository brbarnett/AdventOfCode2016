const _ = require('lodash');
const cryptoJs = require('crypto-js')

const input = 'ffykfhsq';

var password = '';
var i = 0;
while (password.length < 8) {
    const hash = cryptoJs.MD5(input + i++).toString(cryptoJs.enc.Base16); // get hash. I've hidden an increment in here, too
    if (_.startsWith(hash, '00000')) {   // check that hash begins with '00000'
        console.log('Found character', hash[5]);
        password += hash[5]; // get 6th character (base 0, so index is 5)
    }
}

console.log('Result:', password);