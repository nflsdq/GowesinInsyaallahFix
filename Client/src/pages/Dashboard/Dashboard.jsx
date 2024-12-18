import React, { useState, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";

function Dashboard() {
  const [activeTab, setActiveTab] = useState("Dashboard");
  const [bikeData, setBikeData] = useState({
    totalSepeda: 0,
    tersedia: 0,
    dipinjam: 0,
  });
  const [bikeList, setBikeList] = useState([]);
  const [stationData, setStationData] = useState([]);
  const [station, setStation] = useState([]);
  const [selectedStation, setSelectedStation] = useState("");
  const [rentalHistory, setRentalHistory] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    jenis_sepeda: "SG",
    kondisi_sepeda: "B",
    status_sepeda: "T",
    stasiun: "",
  });

  useEffect(() => {
    if (activeTab === "Dashboard") {
      fetchBikeData();
    } else if (activeTab === "Sepeda") {
      fetchBikeList();
    } else if (activeTab === "Stasiun") {
      fetchStationData();
    } else if (activeTab === "Riwayat") {
      fetchRentalHistory();
    }
  }, [activeTab]);

  const fetchBikeList = async () => {
    try {
      const response = await axios.get(
        "http://localhost:8000/api/sepeda-pemilik/",
        {
          headers: {
            Authorization: `Token ${localStorage.getItem("token")}`,
          },
        }
      );
      setBikeList(response.data);
    } catch (error) {
      console.error("Gagal mengambil data sepeda", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const userId = localStorage.getItem("userId");
      console.log(userId);

      if (userId) {
        formData.pemilik = userId;
      } else {
        console.log("User ID tidak ditemukan!");
      }

      console.log(formData);

      if (editingId) {
        await axios.put(
          `http://localhost:8000/api/sepeda-pemilik/${editingId}/`,
          formData,
          {
            headers: {
              Authorization: `Token ${localStorage.getItem("token")}`,
            },
          }
        );
      } else {
        await axios.post(
          "http://localhost:8000/api/sepeda-pemilik/",
          formData,
          {
            headers: {
              Authorization: `Token ${localStorage.getItem("token")}`,
            },
          }
        );
      }

      setShowForm(false);
      setEditingId(null);
      setFormData({
        jenis_sepeda: "SG",
        kondisi_sepeda: "B",
        status_sepeda: "T",
        stasiun: "",
      });

      fetchBikeList();
    } catch (error) {
      console.error("Gagal menambahkan sepeda", error);
      toast.error("Gagal menambahkan sepeda");
    }
  };

  const handleEdit = (sepeda) => {
    setFormData({
      jenis_sepeda: sepeda.jenis_sepeda,
      kondisi_sepeda: sepeda.kondisi_sepeda,
      status_sepeda: sepeda.status_sepeda,
      stasiun: sepeda.stasiun,
    });
    setEditingId(sepeda.id_sepeda);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this bike?")) {
      try {
        await axios.delete(`http://localhost:8000/api/sepeda-pemilik/${id}/`, {
          headers: {
            Authorization: `Token ${localStorage.getItem("token")}`,
          },
        });
        fetchBikeList();
      } catch (error) {
        console.error("Gagal menghapus sepeda", error);
        toast.error("Gagal menghapus sepeda");
      }
    }
  };

  const fetchBikeData = async () => {
    try {
      const bikeResponse = await axios.get(
        "http://localhost:8000/api/sepeda-pemilik/",
        {
          headers: {
            Authorization: `Token ${localStorage.getItem("token")}`,
          },
        }
      );
      const sepeda = bikeResponse.data;
      const total = sepeda.length;
      const tersedia = sepeda.filter(
        (item) => item.status_sepeda === "T"
      ).length;
      const dipinjam = sepeda.filter(
        (item) => item.status_sepeda === "D"
      ).length;

      const incomeResponse = await axios.get(
        "http://localhost:8000/api/sepeda-pemilik/income/",
        {
          headers: {
            Authorization: `Token ${localStorage.getItem("token")}`,
          },
        }
      );

      setBikeData({
        totalSepeda: total,
        tersedia: tersedia,
        dipinjam: dipinjam,
        totalPendapatan: incomeResponse.data.total_pendapatan,
      });
    } catch (error) {
      console.error("Gagal mengambil data sepeda", error);
    }
  };

  useEffect(() => {
    const fetchStation = async () => {
      try {
        const response = await axios.get("http://localhost:8000/api/stasiun/", {
          headers: { Authorization: `Token ${localStorage.getItem("token")}` },
        });
        setStation(response.data);
      } catch (error) {
        console.error("Gagal mengambil data stasiun:", error);
        setError(error);
      }
    };

    fetchStation();
  }, []);

  const fetchStationData = async () => {
    try {
      const response = await axios.get(
        "http://localhost:8000/api/sepeda-pemilik/",
        {
          headers: {
            Authorization: `Token ${localStorage.getItem("token")}`,
          },
        }
      );

      const stationCounts = response.data.reduce((acc, bike) => {
        const stasiunId = bike.stasiun;
        if (!acc[stasiunId]) {
          acc[stasiunId] = {
            id: stasiunId,
            total: 0,
            tersedia: 0,
            dipinjam: 0,
            tidakTersedia: 0,
          };
        }
        acc[stasiunId].total += 1;
        if (bike.status_sepeda === "T") acc[stasiunId].tersedia += 1;
        else if (bike.status_sepeda === "D") acc[stasiunId].dipinjam += 1;
        else if (bike.status_sepeda === "TT") acc[stasiunId].tidakTersedia += 1;
        return acc;
      }, {});

      const stasiunResponse = await axios.get(
        "http://localhost:8000/api/stasiun/",
        {
          headers: {
            Authorization: `Token ${localStorage.getItem("token")}`,
          },
        }
      );

      const stasiunWithCounts = stasiunResponse.data.map((stasiun) => ({
        ...stasiun,
        ...(stationCounts[stasiun.id_stasiun] || {
          total: 0,
          tersedia: 0,
          dipinjam: 0,
          tidakTersedia: 0,
        }),
      }));

      setStationData(stasiunWithCounts);
    } catch (error) {
      console.error("Gagal mengambil data stasiun", error);
    }
  };

  const fetchRentalHistory = async () => {
    try {
      const response = await axios.get(
        "http://localhost:8000/api/peminjaman-pemilik/",
        {
          headers: {
            Authorization: `Token ${localStorage.getItem("token")}`,
          },
        }
      );

      const userId = localStorage.getItem("userId");
      const filteredRiwayat = response.data.filter(
        (rental) => rental.sepeda_detail.pemilik_id == userId
      );

      setRentalHistory(filteredRiwayat);
    } catch (error) {
      console.error("Gagal mengambil data riwayat", error);
    }
  };

  const renderDashboard = () => (
    <div className='mb-16'>
      <div className='mb-8 grid grid-cols-1 gap-6 lg:grid-cols-4'>
        <div className='rounded-2xl bg-[#9F87FF] p-6 border-2 border-black shadow-[3px_3px_0px_0px_#000000]'>
          <h3 className='text-lg font-medium'>Total Sepeda</h3>
          <p className='text-3xl font-bold'>{bikeData.totalSepeda}</p>
        </div>
        <div className='rounded-2xl bg-[#ffaa82] p-6 border-2 border-black shadow-[3px_3px_0px_0px_#000000]'>
          <h3 className='text-lg font-medium'>Sepeda Tersedia</h3>
          <p className='text-3xl font-bold'>{bikeData.tersedia}</p>
        </div>
        <div className='rounded-2xl bg-[#ff8188] p-6 border-2 border-black shadow-[3px_3px_0px_0px_#000000]'>
          <h3 className='text-lg font-medium'>Sepeda Disewa</h3>
          <p className='text-3xl font-bold'>{bikeData.dipinjam}</p>
        </div>
        <div className='rounded-2xl bg-white p-6 border-2 border-black shadow-[3px_3px_0px_0px_#000000]'>
          <h3 className='text-lg font-medium'>Total Pemasukan</h3>
          <p className='text-3xl font-bold'>
            Rp {bikeData.totalPendapatan?.toLocaleString() || "0"}
          </p>
        </div>
      </div>

      <div className='grid grid-cols-1 gap-6 lg:grid-cols-3'>
        <div className='rounded-2xl bg-white p-6 border-2 border-black shadow-[3px_3px_0px_0px_#000000]'>
          <h3 className='mb-4 text-lg text-center font-bold text-black'>
            Chart Status Sepeda
          </h3>
          <div className='h-64 flex items-center justify-center bg-gray-100'>
            <p className='text-gray-500 text-center'>
              Niatnya ada chart disini, Tapi juga kalo gada apa" disini kosong
              banget.
            </p>
          </div>
        </div>
        <div className='rounded-2xl bg-white p-6 border-2 border-black shadow-[3px_3px_0px_0px_#000000]'>
          <h3 className='mb-4 text-lg text-center font-bold text-black'>
            Chart Sepeda per Statiun
          </h3>
          <div className='h-64 flex items-center justify-center bg-gray-100'>
            <p className='text-gray-500 text-center'>
              Niatnya ada chart disini, Tapi juga kalo gada apa" disini kosong
              banget.
            </p>
          </div>
        </div>
        <div className='rounded-2xl bg-white p-6 border-2 border-black shadow-[3px_3px_0px_0px_#000000]'>
          <h3 className='mb-4 text-lg text-center font-bold text-black'>
            Chart Tipe Sepeda
          </h3>
          <div className='h-64 flex items-center justify-center bg-gray-100'>
            <p className='text-gray-500 text-center'>
              Niatnya ada chart disini, Tapi juga kalo gada apa" disini kosong
              banget.
            </p>
          </div>
        </div>
      </div>
    </div>
  );

  const renderSepedaTab = () => (
    <div className='mt-8'>
      <div className='flex justify-between items-center mb-6'>
        <h2 className='text-2xl font-bold'>Kelola Sepeda</h2>
        <button
          onClick={() => setShowForm(true)}
          className='flex items-center gap-2 px-4 py-2 rounded-lg border-2 border-black'
        >
          <i className='fas fa-plus'></i> Tambah Sepeda
        </button>
      </div>

      {showForm && (
        <div className='mb-8 p-6 bg-white rounded-lg border-2 border-black'>
          <h3 className='text-xl font-semibold mb-4'>
            {editingId ? "Edit Sepeda" : "Tambah Sepeda"}
          </h3>
          <form onSubmit={handleSubmit} className='space-y-4'>
            <div>
              <label className='block text-sm font-medium text-gray-700'>
                Jenis Sepeda
              </label>
              <select
                value={formData.jenis_sepeda}
                onChange={(e) =>
                  setFormData({ ...formData, jenis_sepeda: e.target.value })
                }
                className='mt-1 block w-full rounded-md '
              >
                <option value='SG'>Sepeda Gunung</option>
                <option value='SE'>Sepeda Elektrik</option>
                <option value='SA'>Sepeda Anak</option>
                <option value='S'>Skuter</option>
              </select>
            </div>
            <div>
              <label className='block text-sm font-medium text-gray-700'>
                Kondisi
              </label>
              <select
                value={formData.kondisi_sepeda}
                onChange={(e) =>
                  setFormData({ ...formData, kondisi_sepeda: e.target.value })
                }
                className='mt-1 block w-full rounded-md '
              >
                <option value='B'>Baik</option>
                <option value='R'>Rusak</option>
              </select>
            </div>
            <div>
              <label
                htmlFor='status_sepeda'
                className='block text-sm font-medium text-gray-700'
              >
                Status
              </label>
              <select
                value={formData.status_sepeda}
                onChange={(e) =>
                  setFormData({ ...formData, status_sepeda: e.target.value })
                }
                className='mt-1 block w-full rounded-md '
              >
                <option value='T'>Tersedia</option>
                <option value='TT'>Tidak Tersedia</option>
                <option value='D'>Dipinjam</option>
              </select>
            </div>
            <div>
              <label
                htmlFor='stasiun'
                className='block text-sm font-medium text-gray-700'
              >
                Stasiun
              </label>
              <select
                id='station'
                value={selectedStation}
                onChange={(e) => {
                  setSelectedStation(e.target.value);
                  setFormData({ ...formData, stasiun: e.target.value });
                }}
                required
                className='mt-1 block w-full rounded-md '
              >
                <option value='' disabled>
                  Pilih Stasiun
                </option>
                {station.map((station) => (
                  <option key={station.id_stasiun} value={station.id_stasiun}>
                    {station.nama_stasiun}
                  </option>
                ))}
              </select>
            </div>
            <div className='flex gap-4'>
              <button
                type='submit'
                className='bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600'
              >
                {editingId ? "Perbarui" : "Tambah"}
              </button>
              <button
                type='button'
                onClick={() => {
                  setShowForm(false);
                  setEditingId(null);
                }}
                className='bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400'
              >
                Batal
              </button>
            </div>
          </form>
        </div>
      )}

      <div className='bg-white rounded-lg shadow-md overflow-hidden mb-8'>
        <table className='w-full rounded-lg overflow-hidden'>
          <thead className='bg-[#8B73EB] text-white'>
            <tr>
              <th className='px-5 py-4 text-center'>ID</th>
              <th className='px-5 py-4 text-center'>Jenis Sepeda</th>
              <th className='px-5 py-4 text-center'>Kondisi</th>
              <th className='px-5 py-4 text-center'>Status</th>
              <th className='px-5 py-4 text-center'>Stasiun</th>
              <th className='px-5 py-4 text-center'>Actions</th>
            </tr>
          </thead>
          <tbody>
            {bikeList.map((bike) => (
              <tr
                key={bike.id_sepeda}
                className='group even:bg-[#9F87FF] even:text-white even:hover:bg-[#8B73EB] odd:bg-white odd:text-black odd:hover:bg-gray-100'
              >
                <td className='px-5 py-4 text-center'>{bike.id_sepeda}</td>
                <td className='px-5 py-4 text-center'>
                  {bike.jenis_sepeda_display}
                </td>
                <td className='px-5 py-4 text-center'>
                  {bike.kondisi_sepeda_display}
                </td>
                <td className='px-5 py-4 text-center'>
                  {bike.status_sepeda_display}
                </td>
                <td className='px-5 py-4 text-center'>
                  {bike.stasiun_detail?.nama_stasiun}
                </td>
                <td className='px-5 py-4 text-center'>
                  <div className='flex gap-2 justify-center'>
                    <button
                      onClick={() => handleEdit(bike)}
                      className='text-blue-600 hover:text-blue-900'
                    >
                      <i className='fas fa-pencil-alt'></i>
                    </button>
                    <button
                      onClick={() => handleDelete(bike.id_sepeda)}
                      className='text-red-600 hover:text-red-900'
                    >
                      <i className='fas fa-trash'></i>
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderStasiunTab = () => (
    <div className='mb-24'>
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
        {stationData.map((stasiun) => (
          <div
            key={stasiun.id_stasiun}
            className='bg-gray-50 rounded-lg p-6 border-2 border-black'
          >
            <h3 className='text-xl font-semibold mb-4'>
              {stasiun.nama_stasiun}
            </h3>
            <div className='space-y-2'>
              <p className='text-gray-600'>
                Total Sepeda: <span className='font-bold'>{stasiun.total}</span>
              </p>
              <p className='text-green-600'>
                Tersedia: <span className='font-bold'>{stasiun.tersedia}</span>
              </p>
              <p className='text-blue-600'>
                Dipinjam: <span className='font-bold'>{stasiun.dipinjam}</span>
              </p>
              <p className='text-red-600'>
                Tidak Tersedia:{" "}
                <span className='font-bold'>{stasiun.tidakTersedia}</span>
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderRiwayatTab = () => (
    <div className='bg-white rounded-lg shadow-md mb-24'>
      {rentalHistory.length === 0 ? (
        <p className='text-center text-gray-500'>
          Tidak ada riwayat peminjaman
        </p>
      ) : (
        <div className='overflow-x-auto'>
          <table className='w-full rounded-lg overflow-hidden'>
            <thead className='bg-[#eb9f7b]'>
              <tr>
                <th className='px-5 py-4 text-center'>ID</th>
                <th className='px-5 py-4 text-center'>Sepeda</th>
                <th className='px-5 py-4 text-center'>Nama Penyewa</th>
                <th className='px-5 py-4 text-center'>Stasiun Pengambilan</th>
                <th className='px-5 py-4 text-center'>Durasi Pinjam</th>
                <th className='px-5 py-4 text-center'>Total Biaya</th>
                <th className='px-5 py-4 text-center'>Status Pembayaran</th>
              </tr>
            </thead>
            <tbody>
              {rentalHistory.map((rental) => (
                <tr
                  key={rental.id_peminjaman}
                  className='group even:bg-[#ffaa82] even:hover:bg-[#eb9f7b] odd:bg-white odd:text-black odd:hover:bg-gray-100'
                >
                  <td className='px-5 py-4 text-center'>
                    {rental.id_peminjaman}
                  </td>
                  <td className='px-5 py-4 text-center'>
                    {rental.sepeda_detail.jenis_sepeda_display}
                  </td>
                  <td className='px-5 py-4 text-center'>
                    {rental.pelanggan_detail.nama}
                  </td>
                  <td className='px-5 py-4 text-center'>
                    {rental.stasiun_pengambilan_detail?.nama_stasiun}
                  </td>
                  <td className='px-5 py-4 text-center'>
                    {rental.durasi_jam} jam
                  </td>
                  <td className='px-5 py-4 text-center'>
                    Rp {rental.total_biaya?.toLocaleString() || "0"}
                  </td>
                  <td className='px-5 py-4 text-center'>
                    {rental.status_pembayaran}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );

  return (
    <div className='min-h-screen pt-24 px-24'>
      <div className='mb-8 flex justify-center gap-4'>
        <div>
          <button
            onClick={() => setActiveTab("Dashboard")}
            className={`px-6 py-3 border-2 border-black rounded-full ${
              activeTab === "Dashboard"
                ? "shadow-[3px_3px_0px_0px_#ff8188] hover:shadow-none"
                : "hover:bg-gray-100"
            }`}
          >
            Dashboard
          </button>
        </div>

        <div>
          <button
            onClick={() => setActiveTab("Sepeda")}
            className={`px-6 py-3 border-2 border-black rounded-full ${
              activeTab === "Sepeda"
                ? "shadow-[3px_3px_0px_0px_#9f87ff] hover:shadow-none"
                : "hover:bg-gray-100"
            }`}
          >
            Sepeda
          </button>
        </div>

        <div>
          <button
            onClick={() => setActiveTab("Stasiun")}
            className={`px-6 py-3 border-2 border-black rounded-full ${
              activeTab === "Stasiun"
                ? "shadow-[3px_3px_0px_0px_#92fedf] hover:shadow-none"
                : "hover:bg-gray-100"
            }`}
          >
            Stasiun
          </button>
        </div>

        <div>
          <button
            onClick={() => setActiveTab("Riwayat")}
            className={`px-6 py-3 border-2 border-black rounded-full ${
              activeTab === "Riwayat"
                ? "shadow-[3px_3px_0px_0px_#ffaa82] hover:shadow-none"
                : "hover:bg-gray-100"
            }`}
          >
            Riwayat
          </button>
        </div>
      </div>

      {activeTab === "Dashboard" && renderDashboard()}
      {activeTab === "Sepeda" && renderSepedaTab()}
      {activeTab === "Stasiun" && renderStasiunTab()}
      {activeTab === "Riwayat" && renderRiwayatTab()}
    </div>
  );
}

export default Dashboard;
