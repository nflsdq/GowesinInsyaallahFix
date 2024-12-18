import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

function BikeList() {
  const [bike, setBike] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [selectedStation, setSelectedStation] = useState("");
  const [selectedBikeType, setSelectedBikeType] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    const fetchBikes = async () => {
      try {
        const response = await axios.get("http://localhost:8000/api/sepeda/");
        setBike(response.data);
      } catch (error) {
        console.error("Gagal ambil data sepeda:", error);
        setError("Gagal untuk mengambil data sepeda.");
      } finally {
        setLoading(false);
      }
    };
    fetchBikes();
  }, []);

  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    const jenisSepedaQuery = searchParams.get("jenis_sepeda") || "";
    const stasiunQuery = searchParams.get("stasiun") || "";

    if (jenisSepedaQuery) {
      setSelectedBikeType(jenisSepedaQuery);
    }

    if (stasiunQuery) {
      setSelectedStation(stasiunQuery);
    }
  }, []);

  const filteredBikes = bike
    .filter((bike) => {
      if (
        selectedStation &&
        bike.stasiun_detail?.nama_stasiun !== selectedStation
      ) {
        return false;
      }
      if (selectedBikeType && bike.jenis_sepeda_display !== selectedBikeType) {
        return false;
      }
      return true;
    })
    .sort((a, b) => (a.status_sepeda === "T" ? -1 : 1));

  const updateURL = () => {
    const params = new URLSearchParams();
    if (selectedBikeType) {
      params.set("jenis_sepeda", selectedBikeType);
    }
    if (selectedStation) {
      params.set("stasiun", selectedStation);
    }
    navigate(`?${params.toString()}`);
  };

  useEffect(() => {
    updateURL();
  }, [selectedBikeType, selectedStation]);

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

  if (bike.length === 0) {
    return (
      <div className='flex items-center justify-center h-screen'>
        <p className='text-lg font-semibold text-gray-500'>
          Tidak ada data sepeda yang tersedia.
        </p>
      </div>
    );
  }

  const stationOptions = [
    ...new Set(bike.map((bike) => bike.stasiun_detail?.nama_stasiun)),
  ];

  const bikeTypeOptions = [
    ...new Set(bike.map((bike) => bike.jenis_sepeda_display)),
  ];

  return (
    <div className='container mx-auto px-24 py-16 min-h-screen'>
      <h1 className='text-2xl font-semibold text-center my-6'>Daftar Sepeda</h1>

      <div className='flex justify-between mb-6'>
        <div>
          <label htmlFor='stasiun' className='text-gray-700 mr-2'>
            Filter by Stasiun:
          </label>
          <select
            id='stasiun'
            value={selectedStation}
            onChange={(e) => setSelectedStation(e.target.value)}
            className='px-4 py-2 rounded-2xl border-2 border-black'
          >
            <option value=''>Semua Stasiun</option>
            {stationOptions.map((stasiun, index) => (
              <option key={index} value={stasiun}>
                {stasiun}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor='jenisSepeda' className='text-gray-700 mr-2'>
            Filter by Jenis Sepeda:
          </label>
          <select
            id='jenisSepeda'
            value={selectedBikeType}
            onChange={(e) => setSelectedBikeType(e.target.value)}
            className='px-4 py-2 rounded-2xl border-2 border-black'
          >
            <option value=''>Semua Jenis Sepeda</option>
            {bikeTypeOptions.map((jenis, index) => (
              <option key={index} value={jenis}>
                {jenis}
              </option>
            ))}
          </select>
        </div>
      </div>

      {filteredBikes.length > 0 ? (
        <div className='grid grid-cols-4 gap-12 my-8'>
          {filteredBikes.map((bike) => (
            <div
              key={bike.id_sepeda}
              className='card bg-white rounded-2xl  overflow-hidden border-2 border-black transform hover:scale-105 transition-all duration-300'
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
                <p className='text-gray-700'>Pemilik: {bike.pemilik}</p>
                <p className='text-gray-700 font-semibold'>
                  Biaya: {bike.biaya_sepeda}
                </p>
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
                  className='bg-white text-black px-4 py-2 rounded-3xl border-2 border-black hover:text-black shadow-[2px_2px_0px_0px_#ff8188] hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all'
                >
                  Detail
                </Link>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className='flex justify-center mt-60'>
          <p className='text-lg font-semibold text-gray-500'>
            Tidak ada sepeda yang sesuai dengan filter.
          </p>
        </div>
      )}
    </div>
  );
}

export default BikeList;
