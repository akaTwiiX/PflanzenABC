
export async function encryptData(data: any, password: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const worker = new Worker(new URL('../workers/crypto.worker', import.meta.url));
    worker.onmessage = ({ data: result }) => {
      if (result.type === 'encrypt_result') {
        resolve(result.payload);
        worker.terminate();
      } else if (result.type === 'error') {
        reject(new Error(result.payload));
        worker.terminate();
      }
    };
    worker.onerror = (err) => {
      reject(err);
      worker.terminate();
    };
    worker.postMessage({ type: 'encrypt', payload: data, password });
  });
}

export async function decryptData(encryptedData: string, password: string): Promise<any> {
  return new Promise((resolve, reject) => {
    const worker = new Worker(new URL('../workers/crypto.worker', import.meta.url));
    worker.onmessage = ({ data: result }) => {
      if (result.type === 'decrypt_result') {
        resolve(result.payload);
        worker.terminate();
      } else if (result.type === 'error') {
        reject(new Error(result.payload));
        worker.terminate();
      }
    };
    worker.onerror = (err) => {
      reject(err);
      worker.terminate();
    };
    worker.postMessage({ type: 'decrypt', payload: encryptedData, password });
  });
}
