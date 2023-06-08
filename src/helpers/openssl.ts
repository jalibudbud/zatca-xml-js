import { spawn } from 'child_process';

export const OpenSSL = (cmd: string[]): Promise<string> => {
  return new Promise<string>((resolve, reject) => {
    try {
      const command = spawn('openssl', cmd);
      let result = '';
      command.stdout.on('data', (data) => {
        result += data.toString();
      });
      command.on('close', (code: number) => {
        return resolve(result);
      });
      command.on('error', (error: any) => {
        return reject(error);
      });
    } catch (error: any) {
      reject(error);
    }
  });
}