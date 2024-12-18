import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";

function BikeDetail() {
  const [bike, setBike] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBike = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8000/api/sepeda/${id}/`
        );
        setBike(response.data);
      } catch (error) {
        console.error("Error fetching bike details:", error);
        setError("Failed to fetch bike details. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
    fetchBike();
  }, [id]);

  const handleConfirmRental = async () => {
    try {
      const response = await axios.post(
        "http://localhost:8000/api/peminjaman/",
        { sepeda: bike.id_sepeda },
        { headers: { Authorization: `Token ${localStorage.getItem("token")}` } }
      );
      toast.success("Peminjaman berhasil!");
      navigate(`/peminjaman/${response.data.id_peminjaman}`);
    } catch (error) {
      console.error("Gagal untuk meminjam:", error.response || error.message);
      toast.error(`Gagal untuk meminjam: ${error.response.data.detail}`);
    }
    setShowModal(false);
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
    <div className='container mx-auto py-16 px-24 min-h-screen'>
      <h1 className='text-2xl font-semibold my-4 text-center'>Detail Sepeda</h1>
      <div className='bg-white rounded-lg border-2 border-black shadow-[6px_6px_0px_0px_#92fedf] overflow-hidden'>
        <div className='flex flex-row items-center justify-between px-8'>
          <div className='flex-shrink-0 w-full lg:w-1/2 lg:mb-0'>
            <img
              src={`../assets/Sepeda/${bike.jenis_sepeda_display}.jpg`}
              alt={bike.jenis_sepeda_display}
              className='w-full h-[450px] object-cover'
            />
          </div>

          <div className='w-full lg:w-1/2'>
            <h3 className='text-3xl font-semibold text-gray-900 mb-4'>
              {bike.jenis_sepeda_display}
            </h3>
            <p className='text-md text-gray-700 mb-3'>
              Kondisi:{" "}
              <span className='font-medium'>{bike.kondisi_sepeda_display}</span>
            </p>
            <p className='text-md text-gray-700 mb-3'>
              Status:{" "}
              <span className='font-medium'>{bike.status_sepeda_display}</span>
            </p>
            <p className='text-md text-gray-700 mb-3'>
              Tarif per Jam:{" "}
              <span className='font-medium'>Rp {bike.biaya_sepeda}</span>
            </p>
            <p className='text-md text-gray-700 mb-6'>
              Lokasi Stasiun:{" "}
              <span className='font-medium'>
                {bike.stasiun_detail?.nama_stasiun}
              </span>
            </p>

            <div className='mt-8 text-center'>
              <button
                onClick={() => setShowModal(true)}
                className='w-full block py-3 px-6 text-sm font-medium bg-white text-black rounded-lg border-2 border-black shadow-[3px_3px_0px_0px_#ff8188] hover:shadow-none transition'
              >
                Pinjam Sepeda
              </button>
            </div>
          </div>
        </div>
      </div>

      {showModal && (
        <div className='fixed inset-0 z-50 flex items-center justify-center bg-gray-900 bg-opacity-50'>
          <div className='bg-white p-6 rounded-lg w-11/12 max-w-md'>
            <h2 className='text-lg font-semibold text-gray-900 mb-4'>
              Konfirmasi Peminjaman
            </h2>
            <p className='text-gray-700 mb-6'>
              Apakah anda sudah yakin untuk meminjam sepeda ini ?
            </p>
            <div className='flex justify-end space-x-4'>
              <button
                onClick={() => setShowModal(false)}
                className='py-2 px-4 bg-gray-300 text-gray-700 rounded-lg shadow hover:bg-gray-400'
              >
                Batal
              </button>
              <button
                onClick={handleConfirmRental}
                className='py-2 px-4 bg-blue-500 text-white rounded-lg shadow hover:bg-blue-600'
              >
                Konfirmasi
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default BikeDetail;
