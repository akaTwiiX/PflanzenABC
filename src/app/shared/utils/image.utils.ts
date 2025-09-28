import { Filesystem, Directory } from '@capacitor/filesystem';

export function convertBlobToBase64(blob: Blob): Promise<string | ArrayBuffer | null> {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onerror = reject;
        reader.onload = () => resolve(reader.result);
        reader.readAsDataURL(blob);
    });
}

export async function loadNativeImage(fileName: string): Promise<string | undefined> {
    try {
        const folderName = 'PflanzenABC';
        const fullPath = `Pictures/${folderName}/${fileName}`;
        const result = await Filesystem.readFile({
            path: fullPath,
            directory: Directory.ExternalStorage,
        });
        return `data:image/jpeg;base64,${result.data}`;
    } catch (err) {
        console.error('Failed to load native image', err);
        return undefined;
    }
}