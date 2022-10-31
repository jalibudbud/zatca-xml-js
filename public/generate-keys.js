'use strict';

const { EGS } = require('../lib/zatca/egs');
const egsunit = require('./metadata/main-egs.json')

const run = async () => {
  try {
    const egs = new EGS(egsunit, 'MainEGS');

    await egs.generateKeys();
  } catch (error) {
    console.log(error)
  }
}

run();