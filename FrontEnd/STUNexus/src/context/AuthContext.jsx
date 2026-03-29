import React, { createContext, useState, useEffect } from 'react';
import { getTable } from '../services/mockService';

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
    const admins = getTable('QuanTriVien');
    const admin = admins.find(u => u.TaiKhoan === username && u.MatKhau === password);
    if (admin) {
      const userData = { ...admin, role: 'admin' };
      setUser(userData);
      localStorage.setItem('stu_user', JSON.stringify(userData));
      return { success: true, role: 'admin' };
    }
    
    // 2. Check Lecturer
    const lecturers = getTable('GiangVien');
    const lecturer = lecturers.find(u => u.TaiKhoan === username && u.MatKhau === password);
    if (lecturer) {
      const userData = { ...lecturer, role: 'lecturer' };
      setUser(userData);
      localStorage.setItem('stu_user', JSON.stringify(userData));
      return { success: true, role: 'lecturer' };
    }

    // 3. Check Student
    const students = getTable('SinhVien');
    const student = students.find(u => u.TaiKhoan === username && u.MatKhau === password);
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

  const updateUserSession = (newUserData) => {
    const updated = { ...user, ...newUserData };
    setUser(updated);
    localStorage.setItem('stu_user', JSON.stringify(updated));
  }

  return (
    <AuthContext.Provider value={{ user, login, logout, updateUserSession, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
