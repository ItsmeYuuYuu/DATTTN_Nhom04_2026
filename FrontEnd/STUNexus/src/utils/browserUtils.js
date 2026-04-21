import fpPromise from '@fingerprintjs/fingerprintjs';

/**
 * Lấy mã vân tay phần cứng (Fingerprint) của thiết bị.
 * Mã này được sinh ra dựa trên các thông số phần cứng, trình duyệt, font...
 * Giúp định danh duy nhất thiết bị, chống lại việc copy dữ liệu bộ nhớ cục bộ (nhỏ như IndexedDB).
 * @returns {Promise<string>} Mã băm định danh thiết bị.
 */
export async function getDeviceFingerprint() {
    try {
        const fp = await fpPromise.load();
        const result = await fp.get();
        return result.visitorId;
    } catch (error) {
        console.error("Lỗi khi lấy Fingerprint:", error);
        return "UNKNOWN_FINGERPRINT";
    }
}
