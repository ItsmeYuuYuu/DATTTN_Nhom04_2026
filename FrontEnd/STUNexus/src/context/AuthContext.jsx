import React, { createContext, useState, useEffect } from 'react';
import mockData from '../data/mockDb.json';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem('stu_user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const login = (username, password) => {
    // 1. Check Admin
    const admin = mockData.QuanTriVien.find(u => u.TaiKhoan === username && u.MatKhau === password);
    if (admin) {
      const userData = { ...admin, role: 'admin' };
      setUser(userData);
      localStorage.setItem('stu_user', JSON.stringify(userData));
      return { success: true, role: 'admin' };
    }
    
    // 2. Check Lecturer
    const lecturer = mockData.GiangVien.find(u => u.TaiKhoan === username && u.MatKhau === password);
    if (lecturer) {
      const userData = { ...lecturer, role: 'lecturer' };
      setUser(userData);
      localStorage.setItem('stu_user', JSON.stringify(userData));
      return { success: true, role: 'lecturer' };
    }

    // 3. Check Student
    const student = mockData.SinhVien.find(u => u.TaiKhoan === username && u.MatKhau === password);
    if (student) {
      const userData = { ...student, role: 'student' };
      setUser(userData);
      localStorage.setItem('stu_user', JSON.stringify(userData));
      return { success: true, role: 'student' };
    }

    return { success: false, message: 'Tài khoản hoặc mật khẩu không chính xác' };
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('stu_user');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
