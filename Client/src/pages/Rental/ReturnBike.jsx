import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";

function ReturnBike() {
  const [stationId, setStationId] = useState("");
  const [station, setStation] = useState([]);
  const [rental, setRental] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();
  const rentalId = new URLSearchParams(location.search).get("rentalId");

  useEffect(() => {
    const fetchStation = async () => {
      try {
        const response = await axios.get("http://localhost:8000/api/stasiun/", {
          headers: { Authorization: `Token ${localStorage.getItem("token")}` },
        });
        setStation(response.data);
      } catch (error) {
        console.error("Gagal untuk mengambil data stasiun", error);
        setError("Gagal untuk mengambil data stasiun");
      }
    };

    fetchStation();
  }, []);

  useEffect(() => {
    const fetchRental = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8000/api/peminjaman/${rentalId}/`,
          {
            headers: {
              Authorization: `Token ${localStorage.getItem("token")}`,
            },
          }
        );
        setRental(response.data);
      } catch (error) {
        console.error("Gagal untuk mengambil peminjaman", error);
        setError("Gagal untuk mengambil peminjaman");
      }
    };

    fetchRental();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.patch(
        `http://localhost:8000/api/peminjaman/${rentalId}/`,
        {
          stasiun_pengembalian: stationId,
          waktu_pengembalian: new Date().toISOString(),
        },
        {
          headers: { Authorization: `Token ${localStorage.getItem("token")}` },
        }
      );
      toast.success("Sepeda berhasil dikembalikan!");
      navigate(`/peminjaman/${rentalId}`);
    } catch (error) {
      console.error("Gagal untuk mengembalikan sepeda", error);
      toast.error("Gagal mengembalikan sepeda");
    } finally {
      setLoading(false);
    }
  };

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

  return (
    <div className='min-h-screen mb-16 mt-24'>
      <h2 className='text-2xl font-bold text-center mb-6'>
        Pengembalian Sepeda
      </h2>
      <div className='max-w-3xl mx-auto rounded-lg border-2 border-black shadow-[4px_4px_0px_0px_#000000] p-8'>
        <div className='bg-gray-100 p-6 rounded-lg border-2 border-black mb-6'>
          <h3 className='text-lg font-semibold mb-4'>
            Detail Pengambilan Sepeda
          </h3>
          <p className='text-gray-700 mb-2'>
            <span className='font-medium'>Sepeda:</span>{" "}
            {rental?.sepeda_detail?.jenis_sepeda_display ||
              "Data tidak tersedia"}
          </p>
          <p className='text-gray-700 mb-2'>
            <span className='font-medium'>Waktu Pengambilan:</span>{" "}
            {rental.waktu_pengambilan}
          </p>
          <p className='text-gray-700 mb-2'>
            <span className='font-medium'>Stasiun Pengambilan:</span>{" "}
            {rental?.stasiun_pengambilan_detail?.nama_stasiun}
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className='mb-4'>
            <label
              htmlFor='station'
              className='block text-gray-700 font-medium mb-2'
            >
              Stasiun Pengembalian
            </label>
            <select
              id='station'
              value={stationId}
              onChange={(e) => setStationId(e.target.value)}
              required
              className='w-full border-2 border-black rounded-lg px-4 py-2'
            >
              <option value='' disabled>
                Pilih Stasiun Pengembalian
              </option>
              {station.map((station) => (
                <option key={station.id_stasiun} value={station.id_stasiun}>
                  {station.nama_stasiun}
                </option>
              ))}
            </select>
          </div>
          <button
            type='submit'
            className='w-full py-3 text-md font-semibold rounded-xl border-2 border-black shadow-[4px_4px_0px_0px_#92fedf] hover:shadow-none'
          >
            Kembalikan Sepeda
          </button>
        </form>
      </div>
    </div>
  );
}

export default ReturnBike;
