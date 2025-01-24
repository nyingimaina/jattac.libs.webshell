export class DeviceCryptoService {
  private key: CryptoKey | null = null;

  async initializeKey(): Promise<void> {
    if (this.key) return;
    const fingerprint = await this.generateDeviceFingerprint();
    this.key = await this.deriveKey(fingerprint);
  }

  private async generateDeviceFingerprint(): Promise<string> {
    // Collect device-specific identifiers
    const userAgent = navigator.userAgent;
    const screenResolution = `${screen.width}x${screen.height}`;
    const language = navigator.language;
    const hardwareConcurrency = navigator.hardwareConcurrency || 1;
    const deviceMemory = (navigator as any).deviceMemory || 4; // Fallback to 4GB if unavailable).toString();

    // Combine all information into a fingerprint
    const fingerprint = `${userAgent}-${screenResolution}-${language}-${hardwareConcurrency}-${deviceMemory}`;
    return fingerprint;
  }

  private async deriveKey(fingerprint: string): Promise<CryptoKey> {
    const encoder = new TextEncoder();
    const hashBuffer = await crypto.subtle.digest('SHA-256', encoder.encode(fingerprint));
    return crypto.subtle.importKey('raw', hashBuffer, { name: 'AES-GCM' }, false, ['encrypt', 'decrypt']);
  }

  async encrypt(data: object): Promise<string> {
    await this.initializeKey();
    if (!this.key) throw new Error('Encryption key is not set');

    const iv = crypto.getRandomValues(new Uint8Array(12));
    const encoder = new TextEncoder();
    const encodedData = encoder.encode(JSON.stringify(data));

    const encryptedData = await crypto.subtle.encrypt({ name: 'AES-GCM', iv }, this.key, encodedData);

    const combinedBuffer = new Uint8Array(iv.length + encryptedData.byteLength);
    combinedBuffer.set(iv);
    combinedBuffer.set(new Uint8Array(encryptedData), iv.length);

    return btoa(String.fromCharCode(...combinedBuffer));
  }

  async decrypt(base64Data: string): Promise<object> {
    await this.initializeKey();
    if (!this.key) throw new Error('Encryption key is not set');

    const combinedBuffer = Uint8Array.from(atob(base64Data), (c) => c.charCodeAt(0));
    const iv = combinedBuffer.slice(0, 12);
    const encryptedData = combinedBuffer.slice(12);

    const decryptedData = await crypto.subtle.decrypt({ name: 'AES-GCM', iv }, this.key, encryptedData);

    const decoder = new TextDecoder();
    return JSON.parse(decoder.decode(decryptedData));
  }
}
