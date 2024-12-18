import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import ilustrasiSepeda from "../assets/sapiens.svg";

function Home() {
  const [bike, setBike] = useState([]);
  const [station, setStation] = useState([]);
  const [bikeTypeOptions, setBikeTypeOptions] = useState([]);

  const [selectedBikeType, setSelectedBikeType] = useState("");
  const [selectedStation, setSelectedStation] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get("http://localhost:8000/api/sepeda/")
      .then((response) => {
        setBike(response.data);
        const uniqueJenisSepeda = [
          ...new Set(response.data.map((bike) => bike.jenis_sepeda_display)),
        ];
        setBikeTypeOptions(uniqueJenisSepeda);
      })
      .catch((error) => {
        console.error("There was an error fetching the bikes!", error);
      });
  }, []);

  useEffect(() => {
    axios
      .get("http://localhost:8000/api/stasiun/")
      .then((response) => {
        setStation(response.data);
      })
      .catch((error) => {
        console.error("There was an error fetching the station!", error);
      });
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    const params = new URLSearchParams({
      jenis_sepeda: selectedBikeType,
      stasiun: selectedStation,
    });
    navigate(`/sepeda?${params.toString()}`);
  };

  return (
    <div className='pt-8 px-24 overflow-hidden'>
      <section className='py-16 relative'>
        <div className='container mx-auto px-4 lg:flex lg:items-center'>
          <div className='lg:w-1/2'>
            <h1 className='text-4xl font-bold mb-6'>
              Jelajahi Kampusmu dengan{" "}
              <Link to='/' className='text-black font-bold hover:text-black'>
                Gowes<span className='text-blue-500'>IN</span>
              </Link>
            </h1>
            <p className='text-lg mb-12'>
              Penyewaan sepeda per jam yang terjangkau dan ramah lingkungan.
              Nikmati kebebasan bersepeda tanpa beban kepemilikan.
            </p>
            <Link
              to='/sepeda'
              className='bg-white text-black px-6 py-3 rounded-3xl border-2 border-black hover:text-black shadow-[2px_2px_0px_0px_#92fedf] hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all'
            >
              Mulai Bersepeda
            </Link>
          </div>
          <div className='lg:w-1/2 mt-8 lg:mt-0 relative'>
            <img
              src={ilustrasiSepeda}
              alt='Ilustrasi Sepeda'
              className='transform scale-x-[-1] w-[100%] h-auto max-w-none max-h-full object-contain'
            />
          </div>
        </div>
      </section>

      <section className='container mx-auto px-4 py-16'>
        <div className='max-w-4xl mx-auto bg-white p-8 rounded-2xl border-2 border-black'>
          <h2 className='text-2xl font-bold text-center mb-6'>
            Temukan Sepeda Sempurna Anda
          </h2>
          <form className='grid gap-4 md:grid-cols-3' onSubmit={handleSearch}>
            <select
              className='form-select block w-full px-3 py-2 rounded-2xl border-2 border-black'
              aria-label='Pilih jenis sepeda'
              value={selectedBikeType}
              onChange={(e) => setSelectedBikeType(e.target.value)}
            >
              <option value=''>Jenis Sepeda</option>
              {bikeTypeOptions.map((jenis, index) => (
                <option key={index} value={jenis}>
                  {jenis}
                </option>
              ))}
            </select>
            <select
              className='form-select block w-full px-3 py-2 rounded-2xl border-2 border-black'
              aria-label='Pilih stasiun'
              value={selectedStation}
              onChange={(e) => setSelectedStation(e.target.value)}
            >
              <option value=''>Stasiun</option>
              {station.map((station) => (
                <option key={station.id_stasiun} value={station.nama_stasiun}>
                  {station.nama_stasiun}
                </option>
              ))}
            </select>
            <button
              type='submit'
              className='font-medium bg-[#d1d3d4] text-black rounded-2xl border-2 border-black'
            >
              Cari
            </button>
          </form>
        </div>
      </section>

      <section className='container mx-auto px-4 pt-16'>
        <h1 className='text-2xl font-semibold text-center'>Sepeda Tersedia</h1>
        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12 my-8'>
          {bike
            .filter((bike) => bike.status_sepeda === "T")
            .slice(0, 4)
            .map((bike) => (
              <div
                key={bike.id_sepeda}
                className='card bg-white rounded-2xl overflow-hidden border-2 border-black transform hover:scale-105 transition-all duration-300'
              >
                <div className='absolute top-3 right-3 bg-[#ffaa82] text-black text-sm font-medium px-3 py-1 rounded-full'>
                  {bike.jenis_sepeda_display}
                </div>

                <div className='flex justify-center mt-6'>
                  <img
                    src={`./assets/Sepeda/${bike.jenis_sepeda_display}.jpg`}
                    alt={bike.jenis_sepeda}
                    className='object-contain h-40'
                  />
                </div>

                <div className='p-4 bg-[#ffaa82]'>
                  <h3 className='text-lg font-bold text-gray-900'>
                    {bike.jenis_sepeda_display}
                  </h3>
                  <p className='text-gray-700'>
                    Kondisi: {bike.kondisi_sepeda_display}
                  </p>
                  <p className='text-gray-700 font-semibold'>
                    Biaya: {bike.biaya_sepeda}
                  </p>
                  <p className='text-gray-700'>Pemilik: {bike.pemilik}</p>
                  <div className='flex items-center text-gray-700 mt-2'>
                    <i className='fas fa-map-marker-alt me-2'></i>
                    <span>
                      {bike.stasiun_detail?.nama_stasiun ||
                        "Tidak ada data stasiun"}
                    </span>
                  </div>
                </div>

                <div className='border-t p-4 flex justify-between items-center'>
                  <span className='text-gray-900'>
                    Status: {bike.status_sepeda_display}
                  </span>
                  <Link
                    to={`/sepeda/${bike.id_sepeda}`}
                    className='bg-white text-black px-4 py-2 rounded-3xl border-2 border-black hover:text-black shadow-[2px_2px_0px_0px_#ffaa88] hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all'
                  >
                    Detail
                  </Link>
                </div>
              </div>
            ))}
        </div>

        <div className='mt-12 text-center'>
          <Link
            to='/bikes'
            className='px-6 py-4 text-black rounded-full border-2 border-black hover:text-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all'
          >
            Lihat Semua Sepeda
          </Link>
        </div>
      </section>

      <section className='container mx-auto px-4 pt-16'>
        <h1 className='text-2xl font-semibold text-center'>Daftar Stasiun</h1>
        <div className='grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-3 gap-12 my-8'>
          {station.slice(0, 3).map((station) => (
            <div
              key={station.id_stasiun}
              className='card bg-white rounded-2xl border-2 border-black overflow-hidden transform hover:scale-105 transition-all duration-300'
            >
              <img
                src={`./assets/Stasiun/${station.nama_stasiun}.jpg`}
                alt={station.nama_stasiun}
                className='w-full h-32 object-cover'
              />
              <div className='p-4 space-y-3 bg-[#ff8188]'>
                <h3 className='text-xl font-bold text-gray-900'>
                  {station.nama_stasiun}
                </h3>
                <p className='text-sm text-gray-700'>
                  Lokasi: {station.lokasi}
                </p>
                <p className='text-sm text-gray-700'>
                  Kapasitas: {station.jumlah_sepeda} / {station.kapasitas}
                </p>
              </div>
              <div className='p-6 text-center'>
                <a
                  href={station.url_lokasi}
                  target='blank'
                  className='bg-white text-black px-16 py-3 rounded-3xl border-2 border-black hover:text-black shadow-[2px_2px_0px_0px_#ff8188] hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all'
                >
                  Lihat di Peta
                </a>
              </div>
            </div>
          ))}
        </div>

        <div className='mt-12 text-center'>
          <Link
            to='/stasiun'
            className='px-6 py-4 text-black rounded-full border-2 border-black hover:text-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all'
          >
            Lihat Semua Stasiun
          </Link>
        </div>
      </section>

      <section className='py-16'>
        <div className='container mx-auto px-4'>
          <h2 className='text-2xl font-bold text-center mb-8'>
            Cara Kerja GowesIN
          </h2>
          <div className='grid gap-8 md:grid-cols-3'>
            {[
              {
                icon: "fas fa-search",
                title: "1. Cari Sepeda",
                description:
                  "Pilih jenis sepeda dan lokasi stasiun yang Anda inginkan.",
              },
              {
                icon: "fas fa-bicycle",
                title: "2. Sewa Sepeda",
                description:
                  "Ambil sepeda dari stasiun dan mulai perjalanan Anda.",
              },
              {
                icon: "fas fa-undo",
                title: "3. Kembalikan Sepeda",
                description:
                  "Kembalikan sepeda ke stasiun mana pun saat selesai.",
              },
            ].map((step, index) => (
              <div
                key={index}
                className='bg-white shadow rounded-2xl p-6 border-2 border-black text-center hover:shadow-lg transition'
              >
                <i className={`${step.icon} text-[#9f87ff] text-4xl mb-4`}></i>
                <h3 className='text-lg font-bold mb-2'>{step.title}</h3>
                <p>{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

export default Home;
