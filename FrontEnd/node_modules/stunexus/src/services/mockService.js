import rawDb from '../data/mockDb.json';

const DB_KEY = 'stunexus_db';
const DB_VERSION = 3; // Cập nhật mockDb version khớp với data mới nhất bên SQL

// Khởi tạo hoặc lấy DB từ LocalStorage
export const getDb = () => {
  const data = localStorage.getItem(DB_KEY);
  const version = localStorage.getItem('stunexus_db_version');
  
  if (data && version == DB_VERSION) return JSON.parse(data);
  
  localStorage.setItem('stunexus_db_version', DB_VERSION);
  localStorage.setItem(DB_KEY, JSON.stringify(rawDb));
  return rawDb;
};

// Ghi đè toàn bộ DB mới
export const saveDb = (newDb) => {
  localStorage.setItem(DB_KEY, JSON.stringify(newDb));
};

// Lấy 1 bảng cụ thể (Ví dụ: 'SinhVien', 'GiangVien')
export const getTable = (tableName) => {
  const db = getDb();
  return db[tableName] || [];
};

// Cập nhật 1 bảng cụ thể 
export const updateTable = (tableName, updatedArray) => {
  const db = getDb();
  db[tableName] = updatedArray;
  saveDb(db);
};

// Reset DB về trạng thái gốc của file JSON
export const resetDb = () => {
  localStorage.setItem(DB_KEY, JSON.stringify(rawDb));
  return rawDb;
};
