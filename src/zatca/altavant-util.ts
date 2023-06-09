import fs from 'fs';
import { OpenSSL } from '../helpers/openssl';

export class AltavantUtil {
  private _options: any;
  private _savedCSIDdata: any;

  constructor(altavantOptions: any) {
    const { solution_name, integration_files_dir, egs_info, isProduction } = altavantOptions;
    this._options = {
      private_key_file: `${integration_files_dir}/${egs_info.custom_id}-${solution_name}-private.pem`,
      public_key_file: `${integration_files_dir}/${egs_info.custom_id}-${solution_name}-public.pem`,
      csr_config_file: `${integration_files_dir}/${egs_info.custom_id}-${solution_name}.cnf`,
      csr_file: `${integration_files_dir}/${egs_info.custom_id}-${solution_name}.csr`,
      compliance_response_file: `${integration_files_dir}/${egs_info.custom_id}-${solution_name}-compliance-response.json`,
      production_response_file: `${integration_files_dir}/${egs_info.custom_id}-${solution_name}-production-response.json`,
      ...altavantOptions
    };

    delete this._options['egs_info'];

    /**
     * Load 
     */
    this.loadOnboardingData();
  }

  get options() {
    return this._options;
  }

  get savedCSIDdata() {
    return this._savedCSIDdata;
  }
  
  loadOnboardingData() {
    try {
      const production = require(this.options.production_response_file);
      const compliance = require(this.options.compliance_response_file);
      this._savedCSIDdata = {
        production_certificate: production.issued_certificate,
        production_api_secret: production.api_secret,
        production_request_id: production.request_id,
        compliance_certificate: compliance.issued_certificate,
        compliance_api_secret: compliance.api_secret,
        compliance_request_id: compliance.request_id,
        private_key: this.getKeys()
      };
    }
    catch (error) {
    }
  }

  async savePublicAndPrivateKeys(privatekey: string) {
    const { private_key_file, public_key_file } = this._options;

      fs.writeFileSync(private_key_file, privatekey);

      // Generate Public Key
      await OpenSSL(['ec', '-in', private_key_file, '-pubout', '-conv_form', 'compressed', '-out', public_key_file]);
  }

  async getCSR() {
    // tryac
  }

  getKeys() {
    const { private_key_file } = this._options;
    
    try {    
        const privatekey = fs.readFileSync(private_key_file, { encoding: 'utf8' });
        return privatekey;
    } catch (error) {
        throw error;
    }
  }
}