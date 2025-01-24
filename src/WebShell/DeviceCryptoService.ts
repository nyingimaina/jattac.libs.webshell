export class DeviceCryptoService {
  private key: CryptoKey | null = null;

  async initializeKey(): Promise<void> {
    if (this.key) return;
    const fingerprint = await this.generateDeviceFingerprint();
    this.key = await this.deriveKey(fingerprint);
  }

  private async generateDeviceFingerprint(): Promise<string> {
    // Collect only hardware-specific and immutable properties
    const hardwareConcurrency = navigator.hardwareConcurrency || 4; // Number of CPU cores
    const maxTouchPoints = navigator.maxTouchPoints || 0; // Touchscreen capability
    const colorDepth = screen.colorDepth || 24; // Display color depth in bits
    const devicePixelRatio = window.devicePixelRatio || 1; // Physical pixel ratio, tied to the display

    // Combine these stable properties into a raw fingerprint
    const rawFingerprint = `${hardwareConcurrency}-${maxTouchPoints}-${colorDepth}-${devicePixelRatio}`;
    const hashedFingerprint = await this.hashFingerprint(rawFingerprint);

    return hashedFingerprint;
  }

  private async hashFingerprint(fingerprint: string): Promise<string> {
    // Use SubtleCrypto API for secure and fast hashing
    const encoder = new TextEncoder();
    const data = encoder.encode(fingerprint);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    return Array.from(new Uint8Array(hashBuffer))
      .map((b) => b.toString(16).padStart(2, '0'))
      .join('');
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
