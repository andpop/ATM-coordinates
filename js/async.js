import 'babel-polyfill';
import sourceAtmAddresses from '../data/atm_adresses';

async function test() {
    console.log('In test()');
    return 123;
}

console.log(sourceAtmAddresses);

test().then(res => console.log(res));

