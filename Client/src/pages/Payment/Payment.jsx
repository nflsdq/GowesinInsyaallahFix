import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";

function Payment() {
  const [paymentMethod, setPaymentMethod] = useState("");
  const [rental, setRental] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();
  const rentalId = new URLSearchParams(location.search).get("rentalId");

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
        setLoading(false);
      } catch (error) {
        console.error("Gagal mengambil data rental", error);
        setError("Gagal mengambil data rental");
        setLoading(false);
      }
    };
    fetchRental();
  }, [rentalId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!paymentMethod) {
      toast.error("Pilih metode pembayaran!");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      await axios.post(
        "http://localhost:8000/api/pembayaran/",
        {
          peminjaman: rentalId,
          metode_pembayaran: paymentMethod,
        },
        {
          headers: { Authorization: `Token ${localStorage.getItem("token")}` },
        }
      );
      toast.success("Pembayaran berhasil!");
      navigate(`/peminjaman/${rentalId}`);
    } catch (error) {
      console.error("Gagal untuk membayar", error);
      toast.error(`Gagal untuk membayar: ${error.response.data.detail}`);
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
      <h2 className='text-2xl font-bold text-center mb-6'>Pembayaran</h2>
      <div className='max-w-3xl mx-auto rounded-lg border-2 border-black shadow-[4px_4px_0px_0px_#000000] p-8'>
        <div className='bg-gray-100 p-6 rounded-lg border-2 border-black mb-6'>
          <h3 className='text-lg font-semibold mb-4'>Detail Peminjaman</h3>
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
        </div>

        <form onSubmit={handleSubmit}>
          <div className='mb-4'>
            <label
              htmlFor='paymentMethod'
              className='block text-gray-700 font-medium mb-2'
            >
              Metode Pembayaran
            </label>
            <select
              id='paymentMethod'
              value={paymentMethod}
              onChange={(e) => setPaymentMethod(e.target.value)}
              className='w-full border-2 border-black rounded-lg px-4 py-2'
              required
            >
              <option value=''>Pilih Metode Pembayaran</option>
              <option value='Kartu Kredit'>Kartu Kredit</option>
              <option value='Kartu Debit'>Kardu Debit</option>
              <option value='Tunai'>Tunai</option>
              <option value='QRIS'>QRIS</option>
            </select>
          </div>
          <button
            type='submit'
            className='w-full py-3 text-md font-semibold rounded-lg border-2 border-black shadow-[4px_4px_0px_0px_#92fedf] hover:shadow-none'
          >
            Bayar
          </button>
        </form>
      </div>
    </div>
  );
}

export default Payment;
