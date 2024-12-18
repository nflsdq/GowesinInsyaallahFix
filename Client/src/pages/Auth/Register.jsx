import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";

function Register() {
  const [formData, setFormData] = useState({
    username: "",
    nama: "",
    email: "",
    no_telp: "",
    password: "",
    confirm_password: "",
    role: "peminjam",
  });

  const [passwordVisible, setPasswordVisible] = useState(false);
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);

  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirm_password) {
      toast.error("Password tidak cocok, silahkan coba lagi!.");
      return;
    }

    try {
      await axios.post("http://localhost:8000/register/", formData);
      toast.success("Pendaftaran berhasil, silahkan masuk!");
      navigate("/masuk");
    } catch (error) {
      console.error("Daftar gagal:", error);
      toast.error(`${error.response.data.error}`);
    }
  };

  return (
    <section className='bg-gray-50 py-40'>
      <div className='flex flex-col items-center justify-center px-16 mt-16 mb-16 mx-auto h-screen py-0'>
        <h1
          href='/'
          className='flex items-center mb-6 text-3xl font-semibold text-gray-900'
        >
          Daftarkan Akun Anda
        </h1>
        <div className='w-full bg-white rounded-3xl border-2 border-black shadow-[6px_6px_0px_0px_#92fedf] max-w-md'>
          <div className='p-8 space-y-6 sm:p-8'>
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
                  name='username'
                  placeholder='Masukkan username'
                  value={formData.username}
                  onChange={handleChange}
                  className='bg-gray-50 border-2 border-black text-gray-900 text-md rounded-xl block w-full p-3'
                  required
                />
              </div>
              <div>
                <label
                  htmlFor='nama'
                  className='block mb-2 text-md font-medium text-gray-900'
                >
                  Nama
                </label>
                <input
                  type='text'
                  id='nama'
                  name='nama'
                  placeholder='Masukkan nama'
                  value={formData.nama}
                  onChange={handleChange}
                  className='bg-gray-50 border-2 border-black text-gray-900 text-md rounded-xl block w-full p-3'
                  required
                />
              </div>
              <div>
                <label
                  htmlFor='email'
                  className='block mb-2 text-md font-medium text-gray-900'
                >
                  Email
                </label>
                <input
                  type='email'
                  id='email'
                  name='email'
                  placeholder='Masukkan email'
                  value={formData.email}
                  onChange={handleChange}
                  className='bg-gray-50 border-2 border-black text-gray-900 text-md rounded-xl block w-full p-3'
                  required
                />
              </div>
              <div>
                <label
                  htmlFor='no_telp'
                  className='block mb-2 text-md font-medium text-gray-900'
                >
                  Nomor Telepon
                </label>
                <input
                  type='tel'
                  id='no_telp'
                  name='no_telp'
                  placeholder='Masukkan nomor telepon'
                  value={formData.no_telp}
                  onChange={handleChange}
                  className='bg-gray-50 border-2 border-black text-gray-900 text-md rounded-xl block w-full p-3'
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
                <div className='relative'>
                  <input
                    type={passwordVisible ? "text" : "password"}
                    id='password'
                    name='password'
                    placeholder='Masukkan password'
                    value={formData.password}
                    onChange={handleChange}
                    className='bg-gray-50 border-2 border-black text-gray-900 text-md rounded-xl block w-full p-3 pr-12'
                    required
                  />
                  <span
                    className='absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer'
                    onClick={() => setPasswordVisible(!passwordVisible)}
                  >
                    <i
                      className={`fa ${
                        passwordVisible ? "fa-eye-slash" : "fa-eye"
                      }`}
                      aria-hidden='true'
                    ></i>
                  </span>
                </div>
              </div>

              <div>
                <label
                  htmlFor='confirm_password'
                  className='block mb-2 text-md font-medium text-gray-900'
                >
                  Konfirmasi Password
                </label>
                <div className='relative'>
                  <input
                    type={confirmPasswordVisible ? "text" : "password"}
                    id='confirm_password'
                    name='confirm_password'
                    placeholder='Konfirmasi password'
                    value={formData.confirm_password}
                    onChange={handleChange}
                    className='bg-gray-50 border-2 border-black text-gray-900 text-md rounded-xl block w-full p-3 pr-12'
                    required
                  />
                  <span
                    className='absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer'
                    onClick={() =>
                      setConfirmPasswordVisible(!confirmPasswordVisible)
                    }
                  >
                    <i
                      className={`fa ${
                        confirmPasswordVisible ? "fa-eye-slash" : "fa-eye"
                      }`}
                      aria-hidden='true'
                    ></i>
                  </span>
                </div>
              </div>
              <div>
                <label
                  htmlFor='role'
                  className='block mb-2 text-md font-medium text-gray-900'
                >
                  Role
                </label>
                <select
                  id='role'
                  name='role'
                  value={formData.role}
                  onChange={handleChange}
                  className='bg-gray-50 border-2 border-black text-gray-900 text-md rounded-xl block w-full p-3'
                  required
                >
                  <option value='peminjam'>Peminjam</option>
                  <option value='pemilik'>Pemilik</option>
                </select>
              </div>
              <p className='text-md font-medium text-gray-900'>
                Sudah Punya Akun?{" "}
                <a href='/masuk' className='text-blue-600 hover:underline'>
                  Masuk disini
                </a>
              </p>
              <button
                type='submit'
                className='w-full bg-white text-black font-medium text-md px-5 py-2.5 text-center rounded-2xl border-2 border-black shadow-[3px_3px_0px_0px_#ff8188] hover:shadow-none'
              >
                Daftar
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Register;
