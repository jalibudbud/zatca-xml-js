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
      production_response_file: `${integration_files_dir}/${egs_info.custom_id}-${solution_name}-production-response.json`
    };

    this.loadCSIDJSONResponse(isProduction);
  }

  get options() {
    return this._options;
  }

  get savedCSIDdata() {
    return this._savedCSIDdata;
  }
  
  loadCSIDJSONResponse(production?: boolean) {
    try {
      const path = production ? this.options.production_response_file : this.options.compliance_response_file;
      const { issued_certificate, api_secret, request_id } = require(path);
      this._savedCSIDdata = production
        ?
        {
          production_certificate: issued_certificate,
          production_api_secret: api_secret,
          production_request_id: request_id
        }
        :
        {
          compliance_certificate: issued_certificate,
          compliance_api_secret: api_secret,
          compliance_request_id: request_id
        }
      ;
    } catch (error) {
        
    }
  }

  async savePublicAndPrivateKeys(privatekey: string) {
    const { private_key_file, public_key_file } = this._options;

      fs.writeFileSync(private_key_file, privatekey);

      // Generate Public Key
      await OpenSSL(['ec', '-in', private_key_file, '-pubout', '-conv_form', 'compressed', '-out', public_key_file]);
  }
}