'use strict';

const { EGS } = require('../lib/zatca/egs');
const egsunit = require('./metadata/main-egs.json')

const run = async () => {
  try {
    const egs = new EGS(egsunit, 'MainEGS');

    await egs.getKeys();
    await egs.getCSR();

    // Issue a new compliance cert for the EGS
    const compliance_request_id = await egs.issueComplianceCertificate("123345");
  } catch (error) {
    console.log(error)
  }
}

run();