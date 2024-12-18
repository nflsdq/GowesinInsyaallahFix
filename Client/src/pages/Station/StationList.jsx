import React, { useState, useEffect } from "react";
import axios from "axios";

function StationList() {
  const [station, setStation] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStation = async () => {
      try {
        const response = await axios.get("http://localhost:8000/api/stasiun/");
        setStation(response.data);
      } catch (error) {
        console.error("Gagal untuk mengambil data stasiun", error);
        setError("Gagal untuk mengambil data stasiun");
      } finally {
        setLoading(false);
      }
    };
    fetchStation();
  }, []);

  if (loading) {
    return (
      <div className='flex items-center justify-center h-screen'>
        <p className='text-lg font-semibold text-gray-500'>Loading data...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className='flex items-center justify-center h-screen'>
        <p className='text-lg font-semibold text-red-500'>{error}</p>
      </div>
    );
  }

  if (station.length === 0) {
    return (
      <div className='flex items-center justify-center h-screen'>
        <p className='text-lg font-semibold text-gray-500'>
          Tidak ada data stasiun yang tersedia.
        </p>
      </div>
    );
  }

  return (
    <div className='container mx-auto py-16 px-24 min-h-screen'>
      <h1 className='text-2xl font-semibold text-center my-6'>
        Daftar Stasiun
      </h1>
      <div className='grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-3 gap-12 my-8'>
        {station.map((station) => (
          <div
            key={station.id_stasiun}
            className='card bg-white rounded-2xl border-2 border-black overflow-hidden transform hover:scale-105 transition-all duration-300'
          >
            <img
              src={`./assets/Stasiun/${station.nama_stasiun}.jpg`}
              alt={station.nama_stasiun}
              className='w-full h-40 object-cover'
            />
            <div className='p-4 space-y-3 bg-[#ff8188]'>
              <h3 className='text-xl font-bold text-gray-900'>
                {station.nama_stasiun}
              </h3>
              <p className='text-sm text-gray-700'>Lokasi: {station.lokasi}</p>
              <p className='text-sm text-gray-700'>
                Kapasitas: {station.jumlah_sepeda} / {station.kapasitas}
              </p>
            </div>
            <div className='p-6 text-center'>
              <a
                href={station.url_lokasi}
                target='_blank'
                className='bg-white text-black px-16 py-3 rounded-3xl border-2 border-black hover:text-black shadow-[2px_2px_0px_0px_#ff8188] hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all'
              >
                Lihat di Peta
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default StationList;
