import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";

function Login({ setIsAuthenticated }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:8000/login/", {
        username,
        password,
      });
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("role", response.data.role);
      localStorage.setItem("username", response.data.username);
      localStorage.setItem("userId", response.data.id);
      setIsAuthenticated(true);
      toast.success("Masuk berhasil!");
      navigate("/");
    } catch (error) {
      console.error("Login failed:", error);
      toast.error("Username atau password salah!");
    }
  };

  return (
    <section className='bg-gray-50'>
      <div className='flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0'>
        <h1
          href='/'
          className='flex items-center mb-6 text-3xl font-semibold text-gray-900'
        >
          Masuk ke Akun Anda
        </h1>
        <div className='w-full bg-white rounded-3xl border-2 border-black shadow-[6px_6px_0px_0px_#92fedf] max-w-md'>
          <div className='p-8 space-y-6'>
            <form className='space-y-6' onSubmit={handleSubmit}>
              <div>
                <label
                  htmlFor='username'
                  className='block mb-2 text-md font-medium text-gray-900'
                >
                  Username
                </label>
                <input
                  type='text'
                  id='username'
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className='bg-gray-50 border-2 border-black text-gray-900 text-md rounded-xl focus:ring-primary-600 focus:border-primary-600 block w-full p-3'
                  placeholder='Masukkan username'
                  autoComplete='username'
                  required
                />
              </div>
              <div>
                <label
                  htmlFor='password'
                  className='block mb-2 text-md font-medium text-gray-900'
                >
                  Password
                </label>
                <input
                  type='password'
                  id='password'
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className='bg-gray-50 border-2 border-black text-gray-900 text-md rounded-xl focus:ring-primary-600 focus:border-primary-600 block w-full p-3'
                  placeholder='••••••••'
                  autoComplete='current-password'
                  required
                />
              </div>
              <p className='text-md font-medium text-gray-900'>
                Belum punya akun?{" "}
                <a href='/daftar' className='text-blue-600 hover:underline'>
                  Daftar disini
                </a>
              </p>
              <button
                type='submit'
                className='w-full bg-white text-black font-medium text-md px-5 py-2.5 text-center rounded-2xl border-2 border-black shadow-[3px_3px_0px_0px_#ff8188] hover:shadow-none'
              >
                Masuk
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Login;
