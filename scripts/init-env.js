import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const src = path.join(__dirname, '..', 'src', 'environments', 'environment.ts');
const dest = path.join(__dirname, '..', 'src', 'environments', 'environment.dev.ts');

if (!fs.existsSync(dest)) {
    try {
        fs.copyFileSync(src, dest);
        console.log('Successfully created environment.dev.ts from environment.ts');
    } catch (err) {
        console.error('Error creating environment.dev.ts:', err);
        process.exit(1);
    }
} else {
    console.log('environment.dev.ts already exists, skipping copy.');
}
