'use strict';

const {XMLBuilder} = require('fast-xml-parser');
const fspromises = require('fs/promises');
const { ZATCASimplifiedTaxInvoice } = require('../lib');
const { getInvoiceHash } = require('../lib/zatca/signing');
const config = require('./config.json');

class ZatcaTest {

  constructor(PIH) {
    this.props = {
      egs_info: config.egsunitinfo,
      invoice_counter_number: 1, // Counter
      invoice_serial_number: '00XXSAMPLE00', // Cegid document number
      issue_date: '2022-10-25',
      issue_time: '16:55:24',
      previous_invoice_hash: PIH,
      line_items: [
        {
          id: 1,
          name: 'IQOS 3 DUO System - Gold',
          quantity: 1,
          tax_exclusive_price: 243.48,
          // other_taxes?: ZATCASimplifiedInvoiceLineItemTax[],
          // discounts?: ZATCASimplifiedInvoiceLineItemDiscount[]
          VAT_percent: 0.15,
        }
      ]
      // cancelation?: ZATCASimplifiedInvoicCancelation
    };

    this.simplifiedInvoice = new ZATCASimplifiedTaxInvoice({ props: this.props });
    this.xmlStr = this.simplifiedInvoice.invoice_xml.toString({no_header: false});

    // Generate previous invoice hash
    // this.props['previous_invoice_hash'] = getInvoiceHash(this.xmlStr);
  }

  async createXml(xmlStr, signed) {
    try {
      const name = signed ? 'signed-invoice.xml' : 'unsigned-invoice.xml';
      const filename = `${__dirname}/exported-xml/${name}`;
      const result = await fspromises.writeFile(filename, xmlStr);
      return result || {};
    } catch (error) {
      throw {error};
    }
  }
}


const run = async () => {
  try {
    const unsignedZatca = new ZatcaTest();
    // await zatcaTest.createXml(zatcaTest.xmlStr);
    const PIH = getInvoiceHash(unsignedZatca.xmlStr);

    // Generate signed invoice
    const signedZatca = new ZatcaTest(PIH);

    const signedData = signedZatca.simplifiedInvoice.sign(config.egsunitinfo.compliance_certificate, config.egsunitinfo.private_key); 
    await signedZatca.createXml(signedData.signed_invoice_string, true);
    console.log('XML Created');
  } catch (error) {
    console.log(error);
  }
}

run();