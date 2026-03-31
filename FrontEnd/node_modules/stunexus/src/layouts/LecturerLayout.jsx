import React from 'react';
import { Outlet } from 'react-router-dom';
import LecturerSidebar from '../components/LecturerSidebar';
import Header from '../components/Header';

const LecturerLayout = () => {
  return (
    <div className="d-flex">
      <LecturerSidebar />
      <div className="main-wrapper flex-grow-1">
        <Header />
        <main className="p-4 bg-light flex-grow-1">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default LecturerLayout;
