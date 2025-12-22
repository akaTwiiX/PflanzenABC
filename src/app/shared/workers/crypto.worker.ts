/// <reference lib="webworker" />

addEventListener('message', async ({ data }) => {
    const { type, payload, password } = data;

    try {
        if (type === 'encrypt') {
            const result = await encryptData(payload, password);
            postMessage({ type: 'encrypt_result', payload: result });
        } else if (type === 'decrypt') {
            const result = await decryptData(payload, password);
            postMessage({ type: 'decrypt_result', payload: result });
        }
    } catch (error: any) {
        postMessage({ type: 'error', payload: error.message });
    }
});

async function deriveKey(password: string, salt: BufferSource): Promise<CryptoKey> {
    const enc = new TextEncoder();
    const keyMaterial = await solarCrypto.importKey(
        'raw',
        enc.encode(password),
        { name: 'PBKDF2' },
        false,
        ['deriveKey'],
    );

    return solarCrypto.deriveKey(
        {
            name: 'PBKDF2',
            salt,
            iterations: 100000,
            hash: 'SHA-256',
        },
        keyMaterial,
        { name: 'AES-GCM', length: 256 },
        false,
        ['encrypt', 'decrypt'],
    );
}

const solarCrypto = self.crypto.subtle;

async function encryptData(data: any, password: string): Promise<string> {
    const enc = new TextEncoder();
    const salt = self.crypto.getRandomValues(new Uint8Array(16));
    const iv = self.crypto.getRandomValues(new Uint8Array(12));
    const key = await deriveKey(password, salt);

    const encoded = enc.encode(JSON.stringify(data));
    const ciphertext = await solarCrypto.encrypt({ name: 'AES-GCM', iv }, key, encoded);

    const combined = new Uint8Array([...salt, ...iv, ...new Uint8Array(ciphertext)]);
    return btoa(String.fromCharCode(...combined));
}

async function decryptData(encryptedData: string, password: string): Promise<any> {
    const raw = Uint8Array.from(atob(encryptedData), (c) => c.charCodeAt(0));
    const salt = raw.slice(0, 16);
    const iv = raw.slice(16, 28);
    const ciphertext = raw.slice(28);

    const key = await deriveKey(password, salt);
    const decrypted = await solarCrypto.decrypt({ name: 'AES-GCM', iv }, key, ciphertext);

    const dec = new TextDecoder();
    return JSON.parse(dec.decode(decrypted));
}
