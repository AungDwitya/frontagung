import React, { useState, useEffect } from 'react';
import { Video, Upload, ArrowLeft, Loader2, CheckCircle, AlertCircle, Trash2, Film, Camera, Database, MapPin, Edit, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import axios from 'axios';

export default function UploadPage() {
    // State untuk Video Lokal
    const [file, setFile] = useState(null);
    
    // State untuk CCTV
    const [cctvName, setCctvName] = useState('');
    const [rtspUrl, setRtspUrl] = useState('');
    const [cctvLat, setCctvLat] = useState('');
    const [cctvLng, setCctvLng] = useState('');

    const [status, setStatus] = useState({ loading: false, message: '', type: '' });
    
    // State untuk tabel gabungan (Video & CCTV)
    const [mediaList, setMediaList] = useState([]);
    const [isLoadingList, setIsLoadingList] = useState(false);

    // ==========================================
    // STATE BARU UNTUK MODAL EDIT
    // ==========================================
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [editData, setEditData] = useState({
        id: null,
        displayType: '',
        name: '',
        source: '',
        lat: '',
        lng: '',
        status: ''
    });

    // Fungsi mengambil data Video dan CCTV sekaligus
    const fetchMediaList = async () => {
        setIsLoadingList(true);
        try {
            const [videoRes, cctvRes] = await Promise.all([
                axios.get('http://127.0.0.1:5000/api/videos').catch(() => ({ data: { data: [] } })),
                axios.get('http://127.0.0.1:5000/api/cctv').catch(() => ({ data: { data: [] } }))
            ]);

            const videos = (videoRes.data.data || []).map(v => ({
                id: v.id,
                displayType: 'VIDEO',
                name: 'Video Lokal',
                source: v.filename || 'File Video',
                status: v.process_status || 'PENDING' // Mengambil status video dari database
            }));

            const cctvs = (cctvRes.data.data || []).map(c => ({
                id: c.id,
                displayType: 'CCTV',
                name: c.name,
                source: c.rtsp_url,
                lat: c.lat,
                lng: c.lng,
                status: c.status
            }));

            setMediaList([...videos, ...cctvs]); 
        } catch (error) {
            console.error("Gagal mengambil data list gabungan:", error);
        } finally {
            setIsLoadingList(false);
        }
    };

    useEffect(() => {
        fetchMediaList();
    }, []);

    const handleFileChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            setFile(e.target.files[0]);
            setStatus({ loading: false, message: '', type: '' });
        }
    };

    // Fungsi khusus POST Video
    const handleUploadVideo = async () => {
        if (!file) {
            setStatus({ loading: false, message: 'Pilih file video terlebih dahulu.', type: 'error' });
            return;
        }

        setStatus({ loading: true, message: 'Mengunggah video...', type: 'info' });
        try {
            const formData = new FormData();
            // PERBAIKAN: Field diubah menjadi 'video' sesuai dengan controller Flask
            formData.append('video', file); 
            
            // PERBAIKAN: URL endpoint diubah menjadi /api/videos
            await axios.post('http://127.0.0.1:5000/api/videos', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });

            setStatus({ loading: false, message: 'Video berhasil ditambahkan!', type: 'success' });
            setFile(null);
            fetchMediaList();
        } catch (error) {
            setStatus({ loading: false, message: 'Gagal mengunggah video.', type: 'error' });
        }
    };

    // Fungsi khusus POST CCTV
    const handleAddCCTV = async () => {
        if (!cctvName || !rtspUrl || !cctvLat || !cctvLng) {
            setStatus({ loading: false, message: 'Harap lengkapi semua form CCTV (Nama, URL, Lat, Lng).', type: 'error' });
            return;
        }

        setStatus({ loading: true, message: 'Menyimpan data CCTV...', type: 'info' });
        try {
            const payload = {
                name: cctvName,
                rtsp_url: rtspUrl,
                lat: cctvLat,
                lng: cctvLng,
                status: 'ACTIVE'
            };

            await axios.post('http://127.0.0.1:5000/api/cctv', payload, {
                headers: { 'Content-Type': 'application/json' }
            });

            setStatus({ loading: false, message: 'CCTV berhasil ditambahkan!', type: 'success' });
            setCctvName('');
            setRtspUrl('');
            setCctvLat('');
            setCctvLng('');
            fetchMediaList();
        } catch (error) {
            setStatus({ loading: false, message: 'Gagal menyimpan CCTV.', type: 'error' });
        }
    };

    // Fungsi Hapus
    const handleDelete = async (id, type) => {
        const confirmDelete = window.confirm(`Yakin ingin menghapus ${type} ini?`);
        if (!confirmDelete) return;

        try {
            if (type === 'CCTV') {
                await axios.delete(`http://127.0.0.1:5000/api/cctv/${id}`);
            } else {
                // PERBAIKAN: URL endpoint hapus video diubah menjadi /api/videos/
                await axios.delete(`http://127.0.0.1:5000/api/videos/${id}`);
            }
            fetchMediaList(); 
        } catch (error) {
            console.error("Gagal menghapus data:", error);
            alert("Gagal menghapus data dari sistem.");
        }
    };

    // ==========================================
    // FUNGSI UNTUK MENGELOLA MODAL EDIT
    // ==========================================
    
    // Membuka modal dan memasukkan data baris ke dalam form
    const openEditModal = (item) => {
        setEditData({
            id: item.id,
            displayType: item.displayType,
            name: item.name || '',
            source: item.source || '',
            lat: item.lat || '',
            lng: item.lng || '',
            status: item.status || 'ACTIVE'
        });
        setIsEditModalOpen(true);
    };

    // Menangani perubahan input pada form di dalam Modal
    const handleEditChange = (e) => {
        const { name, value } = e.target;
        setEditData(prev => ({ ...prev, [name]: value }));
    };

    // Mengirim data pembaruan ke backend
    const submitEdit = async (e) => {
        e.preventDefault();
        
        try {
            // JIKA TIPE DATA ADALAH CCTV
            if (editData.displayType === 'CCTV') {
                const payload = {
                    name: editData.name,
                    rtsp_url: editData.source,
                    lat: editData.lat,
                    lng: editData.lng,
                    status: editData.status
                };
                await axios.put(`http://127.0.0.1:5000/api/cctv/${editData.id}`, payload);
                alert("Data CCTV berhasil diperbarui!");
            } 
            // JIKA TIPE DATA ADALAH VIDEO
            else if (editData.displayType === 'VIDEO') {
                const payload = {
                    process_status: editData.status
                };
                await axios.put(`http://127.0.0.1:5000/api/videos/${editData.id}`, payload);
                alert("Status video berhasil diperbarui!");
            }
            
            setIsEditModalOpen(false);
            fetchMediaList(); // Segarkan tabel
        } catch (error) {
            console.error("Gagal memperbarui data:", error);
            alert("Terjadi kesalahan saat menyimpan pembaruan.");
        }
    };

    return (
        <div className="flex flex-col min-h-screen bg-[#0a0a0a] text-slate-100 p-8 relative">
            <Link to="/" className="inline-flex items-center gap-2 text-blue-500 hover:text-blue-400 font-black mb-8 w-fit transition-colors">
                <ArrowLeft size={20} /> KEMBALI KE LIVE DASHBOARD
            </Link>
            
            <div className="flex flex-col xl:flex-row gap-8 max-w-7xl mx-auto w-full">
                
                {/* KOTAK KIRI: AREA UPLOAD & INPUT CCTV */}
                <div className="flex-1 flex flex-col p-8 bg-[#111111] rounded-2xl border border-slate-800 shadow-2xl h-fit">
                    <div className="flex flex-col items-center justify-center mb-6">
                        <Video size={48} className="mb-4 text-blue-500" />
                        <h2 className="text-2xl font-black text-white mb-2 uppercase tracking-tight">Input Media</h2>
                        <p className="text-sm text-slate-400 text-center">Kelola file video lokal atau kamera CCTV di satu tempat.</p>
                    </div>

                    <div className="flex flex-col gap-6 w-full">
                        
                        {/* BAGIAN 1: UPLOAD VIDEO */}
                        <div className="flex flex-col gap-2">
                            <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-slate-700 border-dashed rounded-xl cursor-pointer bg-slate-900/50 hover:bg-slate-800 hover:border-blue-500 transition-all">
                                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                    <Upload className="w-6 h-6 mb-2 text-slate-500" />
                                    <p className="mb-1 text-sm text-slate-400"><span className="font-semibold text-blue-500">Klik untuk upload video</span></p>
                                    <p className="text-xs text-slate-500">MP4, AVI, atau MKV</p>
                                </div>
                                <input type="file" className="hidden" accept="video/*" onChange={handleFileChange} disabled={status.loading} />
                            </label>
                            
                            {file && (
                                <div className="flex items-center justify-between bg-emerald-950/30 border border-emerald-900/50 p-3 rounded-xl mt-2">
                                    <span className="text-sm font-bold text-emerald-400 truncate max-w-[200px]">{file.name}</span>
                                    <button 
                                        onClick={handleUploadVideo} disabled={status.loading}
                                        className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-black py-2 px-4 rounded-lg transition-all"
                                    >
                                        UPLOAD VIDEO
                                    </button>
                                </div>
                            )}
                        </div>

                        <div className="flex items-center gap-4">
                            <hr className="flex-1 border-slate-700" />
                            <span className="text-xs text-slate-500 uppercase font-black tracking-widest">atau tambah cctv</span>
                            <hr className="flex-1 border-slate-700" />
                        </div>

                        {/* BAGIAN 2: INPUT CCTV */}
                        <div className="flex flex-col gap-3">
                            <input
                                type="text" placeholder="Nama Lokasi CCTV (Contoh: Simpang Kuta)"
                                className="bg-slate-900/80 border border-slate-700 text-white text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-3.5 outline-none"
                                value={cctvName} onChange={(e) => setCctvName(e.target.value)} disabled={status.loading}
                            />
                            <input
                                type="text" placeholder="Masukkan Link URL RTSP (rtsp://...)"
                                className="bg-slate-900/80 border border-slate-700 text-white text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-3.5 outline-none"
                                value={rtspUrl} onChange={(e) => setRtspUrl(e.target.value)} disabled={status.loading}
                            />
                            <div className="flex gap-3">
                                <input
                                    type="number" step="any" placeholder="Latitude (-8.65...)"
                                    className="bg-slate-900/80 border border-slate-700 text-white text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-3.5 outline-none"
                                    value={cctvLat} onChange={(e) => setCctvLat(e.target.value)} disabled={status.loading}
                                />
                                <input
                                    type="number" step="any" placeholder="Longitude (115.21...)"
                                    className="bg-slate-900/80 border border-slate-700 text-white text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-3.5 outline-none"
                                    value={cctvLng} onChange={(e) => setCctvLng(e.target.value)} disabled={status.loading}
                                />
                            </div>

                            <button 
                                onClick={handleAddCCTV} disabled={status.loading}
                                className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-500 text-white font-black py-3.5 px-4 rounded-xl transition-all shadow-lg shadow-blue-900/20 disabled:bg-slate-700 mt-2"
                            >
                                SIMPAN CCTV
                            </button>
                        </div>
                        
                        {/* PESAN NOTIFIKASI */}
                        {status.message && (
                            <div className={`flex items-center gap-2 p-3 rounded-lg text-sm font-bold ${
                                status.type === 'error' ? 'bg-red-950/50 text-red-500 border border-red-900' : 
                                status.type === 'success' ? 'bg-emerald-950/50 text-emerald-500 border border-emerald-900' :
                                'bg-blue-950/50 text-blue-400 border border-blue-900'
                            }`}>
                                {status.type === 'error' && <AlertCircle size={16} />}
                                {status.type === 'success' && <CheckCircle size={16} />}
                                {status.type === 'info' && <Loader2 size={16} className="animate-spin" />}
                                {status.message}
                            </div>
                        )}
                    </div>
                </div>

                {/* KOTAK KANAN: TABEL DAFTAR MEDIA GABUNGAN */}
                <div className="flex-[1.5] bg-[#111111] p-8 rounded-2xl border border-slate-800 shadow-2xl flex flex-col">
                    <div className="flex items-center justify-between mb-6 border-b border-slate-800 pb-4">
                        <div className="flex items-center gap-3">
                            <Database className="text-blue-500" size={24} />
                            <h2 className="text-xl font-black text-white uppercase tracking-tight">Daftar Sumber Kamera</h2>
                        </div>
                        <button onClick={fetchMediaList} className="text-sm font-bold text-slate-400 hover:text-white flex items-center gap-2 transition-colors">
                            {isLoadingList ? <Loader2 size={16} className="animate-spin" /> : "Refresh Data"}
                        </button>
                    </div>

                    <div className="overflow-x-auto rounded-xl border border-slate-800 flex-1">
                        <table className="w-full text-left text-sm">
                            <thead className="bg-slate-900 text-slate-400 uppercase text-xs font-black tracking-widest">
                                <tr>
                                    <th className="px-6 py-4 border-b border-slate-800">Nama / Tipe</th>
                                    <th className="px-6 py-4 border-b border-slate-800">Sumber Info</th>
                                    <th className="px-6 py-4 border-b border-slate-800 text-center">Status</th>
                                    <th className="px-6 py-4 border-b border-slate-800 text-right">Aksi</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-800">
                                {mediaList.length === 0 && !isLoadingList ? (
                                    <tr>
                                        <td colSpan="4" className="px-6 py-8 text-center text-slate-500 font-medium">
                                            Belum ada data video atau CCTV yang tersimpan.
                                        </td>
                                    </tr>
                                ) : (
                                    mediaList.map((item, index) => (
                                        <tr key={`${item.displayType}-${item.id}-${index}`} className="hover:bg-slate-900/50 transition-colors group">
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex flex-col gap-1">
                                                    <span className="font-bold text-slate-200">{item.name}</span>
                                                    <div className="flex items-center gap-1.5 text-xs">
                                                        {item.displayType === 'VIDEO' ? (
                                                            <span className="flex items-center gap-1 text-emerald-500"><Film size={12} /> VIDEO</span>
                                                        ) : (
                                                            <span className="flex items-center gap-1 text-blue-500"><Camera size={12} /> CCTV</span>
                                                        )}
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-xs text-slate-400">
                                                <div className="truncate max-w-[200px] mb-1 font-mono" title={item.source}>{item.source}</div>
                                                {item.displayType === 'CCTV' && (
                                                    <div className="flex items-center gap-1 text-[10px] text-slate-500"><MapPin size={10}/> {item.lat}, {item.lng}</div>
                                                )}
                                            </td>
                                            <td className="px-6 py-4 text-center">
                                                <span className={`px-3 py-1 rounded-full text-[10px] font-black tracking-widest border ${
                                                    item.status === 'ACTIVE' || item.status === 'PROCESSED' 
                                                    ? 'bg-emerald-950/50 text-emerald-500 border-emerald-900' 
                                                    : 'bg-slate-900 text-slate-500 border-slate-700'
                                                }`}>
                                                    {item.status}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <div className="flex items-center justify-end gap-1 opacity-50 group-hover:opacity-100 transition-opacity">
                                                    <button 
                                                        onClick={() => openEditModal(item)}
                                                        className="text-slate-500 hover:text-blue-400 p-2 rounded-lg hover:bg-blue-950/50 transition-all"
                                                        title="Edit Data"
                                                    >
                                                        <Edit size={18} />
                                                    </button>
                                                    
                                                    <button 
                                                        onClick={() => handleDelete(item.id, item.displayType)}
                                                        className="text-slate-500 hover:text-red-500 p-2 rounded-lg hover:bg-red-950/50 transition-all"
                                                        title="Hapus Data"
                                                    >
                                                        <Trash2 size={18} />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

            </div>

            {/* ========================================== */}
            {/* KOMPONEN MODAL EDIT (Muncul saat state aktif) */}
            {/* ========================================== */}
            {isEditModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
                    <div className="bg-[#111111] border border-slate-700 rounded-2xl p-6 w-full max-w-md shadow-2xl relative">
                        
                        <button 
                            onClick={() => setIsEditModalOpen(false)}
                            className="absolute top-4 right-4 text-slate-500 hover:text-white transition-colors"
                        >
                            <X size={20} />
                        </button>

                        <h3 className="text-xl font-black text-white mb-6 uppercase tracking-tight flex items-center gap-2">
                            <Edit size={20} className="text-blue-500"/> Edit Data {editData.displayType}
                        </h3>

                        <form onSubmit={submitEdit} className="flex flex-col gap-4">
                            {/* JIKA TIPE DATA ADALAH CCTV */}
                            {editData.displayType === 'CCTV' ? (
                                <>
                                    <div>
                                        <label className="block text-xs text-slate-400 mb-1 font-bold">Nama Lokasi</label>
                                        <input 
                                            type="text" name="name" value={editData.name} onChange={handleEditChange} required
                                            className="bg-slate-900 border border-slate-700 text-white text-sm rounded-lg block w-full p-3 focus:border-blue-500 outline-none"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs text-slate-400 mb-1 font-bold">URL RTSP</label>
                                        <input 
                                            type="text" name="source" value={editData.source} onChange={handleEditChange} required
                                            className="bg-slate-900 border border-slate-700 text-white text-sm rounded-lg block w-full p-3 focus:border-blue-500 outline-none"
                                        />
                                    </div>
                                    <div className="flex gap-4">
                                        <div className="flex-1">
                                            <label className="block text-xs text-slate-400 mb-1 font-bold">Latitude</label>
                                            <input 
                                                type="number" step="any" name="lat" value={editData.lat} onChange={handleEditChange} required
                                                className="bg-slate-900 border border-slate-700 text-white text-sm rounded-lg block w-full p-3 focus:border-blue-500 outline-none"
                                            />
                                        </div>
                                        <div className="flex-1">
                                            <label className="block text-xs text-slate-400 mb-1 font-bold">Longitude</label>
                                            <input 
                                                type="number" step="any" name="lng" value={editData.lng} onChange={handleEditChange} required
                                                className="bg-slate-900 border border-slate-700 text-white text-sm rounded-lg block w-full p-3 focus:border-blue-500 outline-none"
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-xs text-slate-400 mb-1 font-bold">Status Kamera</label>
                                        <select 
                                            name="status" value={editData.status} onChange={handleEditChange}
                                            className="bg-slate-900 border border-slate-700 text-white text-sm rounded-lg block w-full p-3 focus:border-blue-500 outline-none"
                                        >
                                            <option value="ACTIVE">ACTIVE</option>
                                            <option value="INACTIVE">INACTIVE</option>
                                            <option value="ERROR">ERROR</option>
                                        </select>
                                    </div>
                                </>
                            ) : (
                                /* JIKA TIPE DATA ADALAH VIDEO */
                                <>
                                    <div>
                                        <label className="block text-xs text-slate-400 mb-1 font-bold">Nama File</label>
                                        <input 
                                            type="text" value={editData.source} disabled
                                            className="bg-slate-900 border border-slate-700 text-slate-500 text-sm rounded-lg block w-full p-3 outline-none cursor-not-allowed"
                                        />
                                        <p className="text-[10px] text-slate-500 mt-1">Nama file video tidak dapat diubah.</p>
                                    </div>
                                    <div>
                                        <label className="block text-xs text-slate-400 mb-1 font-bold">Status Proses Video</label>
                                        <select 
                                            name="status" value={editData.status} onChange={handleEditChange}
                                            className="bg-slate-900 border border-slate-700 text-white text-sm rounded-lg block w-full p-3 focus:border-blue-500 outline-none"
                                        >
                                            <option value="PENDING">PENDING</option>
                                            <option value="PROCESSED">PROCESSED</option>
                                            <option value="ERROR">ERROR</option>
                                        </select>
                                    </div>
                                </>
                            )}

                            <div className="flex justify-end gap-3 mt-4">
                                <button 
                                    type="button" onClick={() => setIsEditModalOpen(false)}
                                    className="px-4 py-2 text-sm font-bold text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
                                >
                                    BATAL
                                </button>
                                <button 
                                    type="submit" 
                                    className="px-4 py-2 text-sm font-bold bg-blue-600 hover:bg-blue-500 text-white rounded-lg transition-colors"
                                >
                                    SIMPAN PERUBAHAN
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

        </div>
    );
}