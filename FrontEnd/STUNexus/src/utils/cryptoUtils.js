/**
 * cryptoUtils.js
 *
 * Tiện ích mã hóa cho hệ thống xác thực thiết bị.
 * Sử dụng Web Crypto API với thuật toán ECDSA (P-256).
 *
 * - Private Key: extractable=false, lưu vào IndexedDB, không thể copy qua F12
 * - Public Key: xuất dạng Base64 để gửi lên Backend lúc đăng nhập
 * - Signature: ký dữ liệu điểm danh mỗi lần quét QR
 */

const DB_NAME = 'stunexus_crypto_db';
const DB_VERSION = 1;
const STORE_NAME = 'keys';

// ==================== IndexedDB Helpers ====================

function openDB() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);
    request.onupgradeneeded = (e) => {
      e.target.result.createObjectStore(STORE_NAME);
    };
    request.onsuccess = (e) => resolve(e.target.result);
    request.onerror = (e) => reject(e.target.error);
  });
}

async function saveKeyPair(maSv, keyPair) {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readwrite');
    const store = tx.objectStore(STORE_NAME);
    // Lưu cả 2 khóa với key là maSv
    store.put({ privateKey: keyPair.privateKey, publicKey: keyPair.publicKey }, maSv);
    tx.oncomplete = () => resolve();
    tx.onerror = (e) => reject(e.target.error);
  });
}

async function loadKeyPair(maSv) {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readonly');
    const store = tx.objectStore(STORE_NAME);
    const request = store.get(maSv);
    request.onsuccess = (e) => resolve(e.target.result || null);
    request.onerror = (e) => reject(e.target.error);
  });
}

// ==================== Core Crypto Functions ====================

/**
 * Khởi tạo / Nạp cặp khóa ECDSA cho sinh viên.
 * - Nếu đã có khóa trong IndexedDB: nạp lại và dùng tiếp.
 * - Nếu chưa có: tạo khóa mới (extractable: false cho Private Key).
 *
 * @param {string} maSv - Mã số sinh viên (dùng làm key lưu trong IndexedDB)
 * @returns {{ publicKeyBase64: string, isNew: boolean }}
 */
export async function initDeviceKey(maSv) {
  const globalKeyName = 'GLOBAL_DEVICE_KEY';
  try {
    // Kiểm tra khóa có sẵn chưa
    const existing = await loadKeyPair(globalKeyName);
    if (existing?.privateKey && existing?.publicKey) {
      // Đã có khóa — xuất Public Key để kiểm tra
      const publicKeyBase64 = await exportPublicKey(existing.publicKey);
      return { publicKeyBase64, isNew: false };
    }

    // Chưa có → Tạo cặp khóa mới
    const keyPair = await window.crypto.subtle.generateKey(
      {
        name: 'ECDSA',
        namedCurve: 'P-256', // Nhỏ gọn, hiệu năng cao
      },
      false, // extractable: FALSE → Private Key bị khóa chết trong trình duyệt, không thể export
      ['sign', 'verify']
    );

    // Lưu vào IndexedDB (Sử dụng chung một khóa toàn trình duyệt)
    await saveKeyPair(globalKeyName, keyPair);

    const publicKeyBase64 = await exportPublicKey(keyPair.publicKey);
    return { publicKeyBase64, isNew: true };
  } catch (err) {
    console.error('[CryptoUtils] initDeviceKey thất bại:', err);
    throw new Error('Không thể khởi tạo khóa bảo mật thiết bị.');
  }
}

/**
 * Ký dữ liệu điểm danh bằng Private Key của thiết bị.
 *
 * @param {string} maSv - Mã sinh viên
 * @param {string} rawPayload - Chuỗi dữ liệu gốc cần ký (VD: "DH001|42|10.762|106.660|1712345678000")
 * @returns {string} Chữ ký dạng Base64
 */
export async function signPayload(maSv, rawPayload) {
  const globalKeyName = 'GLOBAL_DEVICE_KEY';
  try {
    const keyPair = await loadKeyPair(globalKeyName);
    if (!keyPair?.privateKey) {
      throw new Error('Không tìm thấy Private Key. Vui lòng đăng xuất và đăng nhập lại để đăng ký thiết bị.');
    }

    const encoder = new TextEncoder();
    const data = encoder.encode(rawPayload);

    const signatureBuffer = await window.crypto.subtle.sign(
      { name: 'ECDSA', hash: 'SHA-256' },
      keyPair.privateKey,
      data
    );

    return bufferToBase64(signatureBuffer);
  } catch (err) {
    console.error('[CryptoUtils] signPayload thất bại:', err);
    throw err;
  }
}

// ==================== Helper Utilities ====================

/**
 * Xuất Public Key ra định dạng SPKI (Base64).
 * SPKI là chuẩn tương thích với .NET's ImportSubjectPublicKeyInfo.
 */
async function exportPublicKey(publicKey) {
  const exported = await window.crypto.subtle.exportKey('spki', publicKey);
  return bufferToBase64(exported);
}

function bufferToBase64(buffer) {
  const bytes = new Uint8Array(buffer);
  let binary = '';
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return window.btoa(binary);
}
