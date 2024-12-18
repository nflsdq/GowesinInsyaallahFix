import React from "react";
import { Link, useLocation } from "react-router-dom";

function Navbar({ isAuthenticated, onLogout }) {
  const location = useLocation();
  const role = localStorage.getItem("role");

  const isActive = (path) => location.pathname === path;

  return (
    <nav className='max-w-full mx-auto flex justify-between items-center py-3 px-24 bg-[#92fedf] border-b-2 border-black fixed top-0 left-0 w-full z-10'>
      <Link to='/' className='text-2xl font-bold text-black hover:text-black'>
        GowesIN
      </Link>

      <div className='ml-auto space-x-4 px-4'>
        <Link
          to='/'
          className={` ${
            isActive("/")
              ? "text-black hover:text-black"
              : "text-black hover:text-black"
          }`}
        >
          Beranda
        </Link>
        <Link
          to='/sepeda'
          className={` ${
            isActive("/bikes")
              ? "text-black  hover:text-black"
              : "text-black hover:text-black"
          }`}
        >
          Sepeda
        </Link>
        <Link
          to='/stasiun'
          className={` ${
            isActive("/stations")
              ? "text-black  hover:text-black"
              : "text-black hover:text-black"
          }`}
        >
          Stasiun
        </Link>

        {isAuthenticated &&
          (role === "peminjam" ? (
            <Link
              to='/riwayat-peminjaman'
              className={` ${
                isActive("/history")
                  ? "text-black  hover:text-black"
                  : "text-black hover:text-black"
              }`}
            >
              Riwayat Peminjaman
            </Link>
          ) : role === "pemilik" ? (
            <Link
              to='/dashboard'
              className={` ${
                isActive("/dashboard")
                  ? "text-black  hover:text-black"
                  : "text-black hover:text-black"
              }`}
            >
              Dashboard
            </Link>
          ) : null)}
      </div>

      <div className='space-x-4'>
        {isAuthenticated ? (
          <Link
            onClick={onLogout}
            className='bg-white text-black px-4 py-2 rounded-3xl border-2 border-black hover:text-black shadow-[2px_2px_0px_0px_#ff8188] hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all'
          >
            Keluar
          </Link>
        ) : (
          <>
            <Link
              to='/masuk'
              className='bg-white text-black px-4 py-2 rounded-3xl border-2 border-black hover:text-black shadow-[2px_2px_0px_0px_#9f87ff] hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all'
            >
              Mulai Sekarang
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
