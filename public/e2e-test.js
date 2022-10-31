const { EGS, EGSUnitInfo } = require('../lib/zatca/egs');

const egsunit = {
  uuid: '6f4d20e0-6bfe-4a80-9389-7dabe6620f12',
  custom_id: 'EGS1-886431145',
  model: 'IOS',
  CRN_number: '454634645645654',
  VAT_name: 'Wesam Alzahir',
  VAT_number: '301121971500003',
  location: {
      city: 'Khobar',
      city_subdivision: 'West',
      street: 'King Fahahd st',
      plot_identification: '0000',
      building: '0000',
      postal_zone: '31952'
  },
  branch_name: 'My Branch Name',
  branch_industry: 'Food'
};

const run = async () => {
  try {
    const egs = new EGS(egsunit);

    // New Keys & CSR for the EGS
    await egs.generateNewKeysAndCSR(false, 'AltavantTest');
    
    const compliance_request_id = await egs.issueComplianceCertificate("123345");
    console.log(compliance_request_id)
  } catch (error) {
    console.log(error)
  }
}

run();