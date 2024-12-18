import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";

function RentalDetail() {
  const [rental, setRental] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { id } = useParams();

  useEffect(() => {
    const fetchRental = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8000/api/peminjaman/${id}/`,
          {
            headers: {
              Authorization: `Token ${localStorage.getItem("token")}`,
            },
          }
        );
        setRental(response.data);
      } catch (error) {
        console.error("Gagal untuk mengambil data peminjaman", error);
        setError("Gagal untuk mengambil data peminjaman");
      } finally {
        setLoading(false);
      }
    };
    fetchRental();
  }, [id]);

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
    <div className='mb-16 mt-24 min-h-screen'>
      <h1 className='text-2xl font-bold text-center mb-6'>Detail Rental</h1>
      <div className='max-w-3xl mx-auto bg-white rounded-lg border-2 border-black shadow-[4px_4px_0px_0px_#000000] p-8'>
        <div className='bg-gray-100 p-6 rounded-lg border-2 border-black mb-6'>
          <p className='text-gray-700 mb-2'>
            <span className='font-medium'>Sepeda:</span>{" "}
            {rental.sepeda_detail.jenis_sepeda_display}
          </p>
          <p className='text-gray-700 mb-2'>
            <span className='font-medium'>Waktu Pengambilan:</span>{" "}
            {rental.waktu_pengambilan}
          </p>
          <p className='text-gray-700 mb-2'>
            <span className='font-medium'>Waktu Pengembalian:</span>{" "}
            {rental.waktu_pengembalian || "Belum Dikembalikan"}
          </p>
          <p className='text-gray-700 mb-2'>
            <span className='font-medium'>Durasi Peminjaman:</span>{" "}
            {rental.durasi_jam
              ? `${rental.durasi_jam} jam`
              : "Belum Dikembalikan"}
          </p>
          <p className='text-gray-700 mb-2'>
            <span className='font-medium'>Total Bayar:</span> Rp{" "}
            {rental.total_biaya || "Belum Dikembalikan"}
          </p>
          <p className='text-gray-700 mb-2'>
            <span className='font-medium'>Status Pembayaran:</span>{" "}
            {rental.status_pembayaran}
          </p>
        </div>
        <div className='flex justify-between'>
          {!rental.waktu_pengembalian && (
            <Link
              to={`/pengembalian-sepeda?rentalId=${rental.id_peminjaman}`}
              className='px-4 py-2 text-black rounded-lg border-2 border-black shadow-[3px_3px_0px_0px_#92fedf] hover:shadow-none hover:text-black'
            >
              Kembalikan Sepeda
            </Link>
          )}
          {rental.waktu_pengembalian &&
            rental.status_pembayaran === "Belum Dibayar" && (
              <Link
                to={`/pembayaran?rentalId=${rental.id_peminjaman}`}
                className='px-4 py-2 text-black rounded-lg border-2 border-black shadow-[3px_3px_0px_0px_#92fedf] hover:shadow-none hover:text-black'
              >
                Bayar
              </Link>
            )}
        </div>
      </div>
    </div>
  );
}

export default RentalDetail;
