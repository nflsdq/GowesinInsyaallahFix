import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

function RentalHistory() {
  const [rental, setRental] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    const fetchRental = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8000/api/peminjaman/",
          {
            headers: {
              Authorization: `Token ${localStorage.getItem("token")}`,
            },
          }
        );
        setRental(response.data);
      } catch (error) {
        console.error("Gagal untuk mengambil data riwayat peminjaman", error);
        setError("Gagal untuk mengambil data riwayat peminjaman");
      } finally {
        setLoading(false);
      }
    };
    fetchRental();
  }, []);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentRental = rental.slice(indexOfFirstItem, indexOfLastItem);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const nextPage = () => {
    setCurrentPage((prev) => (prev < totalPages ? prev + 1 : prev));
  };

  const prevPage = () => {
    setCurrentPage((prev) => (prev > 1 ? prev - 1 : prev));
  };

  const totalPages = Math.ceil(rental.length / itemsPerPage);

  const getPageNumbers = () => {
    const totalNumbersToShow = 5;
    const half = Math.floor(totalNumbersToShow / 2);

    let startPage = Math.max(currentPage - half, 1);
    let endPage = startPage + totalNumbersToShow - 1;

    if (endPage > totalPages) {
      endPage = totalPages;
      startPage = Math.max(endPage - totalNumbersToShow + 1, 1);
    }

    return Array.from(
      { length: endPage - startPage + 1 },
      (_, i) => startPage + i
    );
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

  if (rental.length === 0) {
    return (
      <div className='flex items-center justify-center h-screen'>
        <p className='text-lg font-semibold text-gray-500'>
          Tidak ada data riwayat peminjaman yang tersedia.
        </p>
      </div>
    );
  }

  return (
    <div className='container min-h-screen mx-auto py-16 px-24'>
      <h1 className='text-2xl font-semibold text-center my-6'>
        Riwayat Peminjaman
      </h1>
      <table className='border-2 border-black w-full rounded-lg overflow-hidden'>
        <thead className='bg-[#8B73EB] text-white rounded-t-lg'>
          <tr>
            <th className='px-6 py-4 text-center'>ID</th>
            <th className='px-6 py-4 text-center'>Waktu Pengambilan</th>
            <th className='px-6 py-4 text-center'>Waktu Pengembalian</th>
            <th className='px-6 py-4 text-center'>Biaya</th>
            <th className='px-6 py-4 text-center'>Status Pembayaran</th>
            <th className='px-6 py-4 text-center'>Detail</th>
          </tr>
        </thead>
        <tbody>
          {currentRental.map((rental) => (
            <tr
              key={rental.id_peminjaman}
              className='group even:bg-[#9F87FF] even:text-white even:hover:bg-[#8B73EB] odd:bg-white odd:text-black odd:hover:bg-gray-100'
            >
              <td className='px-6 py-4 text-center'>#{rental.id_peminjaman}</td>
              <td className='px-6 py-4 text-center'>
                {rental.waktu_pengambilan}
              </td>
              <td className='px-6 py-4 text-center'>
                {rental.waktu_pengembalian}
              </td>
              <td className='px-6 py-4 text-center'>
                Rp. {rental.total_biaya}
              </td>
              <td className='px-6 py-4 text-center'>
                {rental.status_pembayaran}
              </td>
              <td className='px-6 py-4 text-center'>
                <Link
                  to={`/peminjaman/${rental.id_peminjaman}`}
                  className='group-even:text-white group-odd:text-black'
                >
                  Lihat Detail
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className='flex justify-center mt-4'>
        <nav>
          <ul className='flex list-none'>
            <li>
              <button
                onClick={prevPage}
                disabled={currentPage === 1}
                className={`mx-1 px-3 py-1 rounded-md border-2 border-black ${
                  currentPage === 1
                    ? "cursor-not-allowed"
                    : "bg-white text-black shadow-[2px_2px_0px_0px_#9F87FF] hover:shadow-none"
                }`}
              >
                Sebelumnya
              </button>
            </li>

            {getPageNumbers().map((pageNumber) => (
              <li key={pageNumber}>
                <button
                  onClick={() => paginate(pageNumber)}
                  className={`mx-1 px-3 py-1 rounded-md border-2 border-black ${
                    currentPage === pageNumber
                      ? "shadow-[2px_2px_0px_0px_#9F87FF] hover:shadow-none text-black"
                      : "bg-white text-black hover:bg-gray-300"
                  }`}
                >
                  {pageNumber}
                </button>
              </li>
            ))}

            <li>
              <button
                onClick={nextPage}
                disabled={currentPage === totalPages}
                className={`mx-1 px-3 py-1 rounded-md border-2 border-black ${
                  currentPage === totalPages
                    ? "cursor-not-allowed"
                    : "bg-white text-black shadow-[2px_2px_0px_0px_#9F87FF] hover:shadow-none"
                }`}
              >
                Berikutnya
              </button>
            </li>
          </ul>
        </nav>
      </div>
    </div>
  );
}

export default RentalHistory;
