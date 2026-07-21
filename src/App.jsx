import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import axios from 'axios'; // PASTIKAN AXIOS DI-IMPORT
import {
  LayoutDashboard, Settings, Video, Database, User, LogOut,
  X, Upload, Menu, Trash2, BarChart2, Layers,
  Play, Pause, Square, Maximize, Camera, Disc,
  MapPin, ChevronDown
} from 'lucide-react';

import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

import UploadPage from './pages/UploadPage';

const CCTV_LOCATIONS = [
  { id: 'teuku-umar', name: 'Simpang Teuku Umar', url: 'http://localhost:5000/video_feed?cam=teuku_umar', lat: -8.6743, lng: 115.2074 },
  { id: 'tohpati', name: 'Simpang Tohpati', url: 'http://localhost:5000/video_feed?cam=tohpati', lat: -8.6358, lng: 115.2575 },
  { id: 'gatsu-sudirman', name: 'Simpang Gatsu - Sudirman', url: 'http://localhost:5000/video_feed?cam=gatsu_sudirman', lat: -8.6435, lng: 115.2158 },
  { id: 'sanur', name: 'Simpang Bypass Sanur', url: 'http://localhost:5000/video_feed?cam=sanur', lat: -8.6830, lng: 115.2635 },
];

const FpsChart = () => {
  const [data, setData] = useState([0, 5.9, 9.6, 9.9, 10.3, 9.7, 9.6, 11.4, 11.3, 9.5, 10.8, 8.5, 11.1, 10.0, 10.5, 10.2]);

  useEffect(() => {
    const interval = setInterval(() => {
      setData(prev => {
        const newData = [...prev.slice(1)];
        newData.push(Number((Math.random() * (11.8 - 8.5) + 8.5).toFixed(1)));
        return newData;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const maxFps = 15;
  const points = data.map((val, idx) => {
    const x = (idx / (data.length - 1)) * 100;
    const y = 100 - (val / maxFps) * 100;
    return `${x},${y}`;
  }).join(' ');

  const polygonPoints = `0,100 ${points} 100,100`;
  const currentFps = data[data.length - 1];

  // return (
  //   <div className="bg-[#111111] p-5 rounded-lg border border-slate-800 flex flex-col h-full w-full relative">
  //     {/* <div className="flex justify-between items-center mb-4">
  //       <div className="flex items-center gap-2">
  //         <BarChart2 className="text-blue-500" size={18} />
  //         <h3 className="text-sm font-bold text-white">Stability (FPS)</h3>
  //       </div>
  //       <div className="bg-blue-900/40 border border-blue-800 text-blue-400 text-xs font-bold px-3 py-1 rounded-full">
  //         Avg: 9.6 FPS
  //       </div>
  //     </div> */}

  //     <div className="relative flex-1 w-full mt-2 h-48">
  //       <div className="absolute inset-0 flex flex-col justify-between text-[9px] text-slate-500 font-mono pb-6">
  //         <div className="flex items-center gap-2"><span className="w-4 text-right">12-</span><div className="flex-1 border-t border-slate-800 border-dashed"></div></div>
  //         <div className="flex items-center gap-2"><span className="w-4 text-right">9-</span><div className="flex-1 border-t border-slate-800 border-dashed"></div></div>
  //         <div className="flex items-center gap-2"><span className="w-4 text-right">6-</span><div className="flex-1 border-t border-slate-800 border-dashed"></div></div>
  //         <div className="flex items-center gap-2"><span className="w-4 text-right">3-</span><div className="flex-1 border-t border-slate-800 border-dashed"></div></div>
  //         <div className="flex items-center gap-2"><span className="w-4 text-right">0-</span><div className="flex-1 border-t border-slate-800 border-dashed"></div></div>
  //       </div>
  //       <div className="absolute bottom-0 left-6 right-0 flex justify-between text-[8px] text-slate-600 font-mono">
  //         <span>00:00:00</span><span>00:00:05</span><span>00:00:10</span><span>00:00:15</span>
  //       </div>
  //       <div className="absolute inset-0 left-6 bottom-6">
  //         <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="w-full h-full overflow-visible">
  //           <defs>
  //             <linearGradient id="fpsGradient" x1="0" y1="0" x2="0" y2="1">
  //               <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.3" />
  //               <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.0" />
  //             </linearGradient>
  //           </defs>
  //           <polygon points={polygonPoints} fill="url(#fpsGradient)" className="transition-all duration-300" />
  //           <polyline points={points} fill="none" stroke="#3b82f6" strokeWidth="1.5" className="transition-all duration-300" vectorEffect="non-scaling-stroke" />
  //           {data.map((val, idx) => (
  //             <circle key={idx} cx={(idx / (data.length - 1)) * 100} cy={100 - (val / maxFps) * 100} r="1.5" fill="#0f172a" stroke="#60a5fa" strokeWidth="0.8" vectorEffect="non-scaling-stroke" className="transition-all duration-300" />
  //           ))}
  //         </svg>
  //         <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center">
  //           <div className="w-[1px] h-20 bg-slate-600 mb-1"></div>
  //           <div className="text-[10px] text-white font-mono bg-[#0a0a0a] border border-slate-700 px-2 py-1 rounded">
  //             <span className="text-slate-400">FPS:</span> <span className="text-blue-400 font-bold">{currentFps}</span>
  //           </div>
  //         </div>
  //       </div>
  //     </div>
  //   </div>
  // );
};

const AccuracyTable = () => (
  <div className="bg-[#111111] p-5 rounded-lg border border-slate-800 flex flex-col h-full">
    <div className="flex items-center gap-2 mb-4">
      <Database className="text-yellow-500" size={18} />
      <h3 className="text-sm font-bold text-white">Total Objects in Active Session</h3>
    </div>
    <div className="w-full overflow-x-auto mt-2">
      <table className="w-full text-left text-xs">
        <thead className="border-b border-slate-800">
          <tr>
            <th className="pb-3 text-slate-400 font-bold tracking-widest uppercase">Object Class</th>
            <th className="pb-3 text-center text-slate-400 font-bold tracking-widest uppercase">Total Detected</th>
            <th className="pb-3 text-right text-slate-400 font-bold tracking-widest uppercase">Average Accuracy</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-800/50">
          <tr><td className="py-4 text-slate-200">Mobil Target</td><td className="py-4 text-center text-blue-400 font-bold text-sm">142</td><td className="py-4 text-right text-emerald-500 font-bold">95.23%</td></tr>
          <tr><td className="py-4 text-slate-200">Mobil Biasa</td><td className="py-4 text-center text-blue-400 font-bold text-sm">850</td><td className="py-4 text-right text-emerald-500 font-bold">91.05%</td></tr>
          <tr><td className="py-4 text-slate-200">Motor</td><td className="py-4 text-center text-blue-400 font-bold text-sm">1,204</td><td className="py-4 text-right text-emerald-500 font-bold">88.40%</td></tr>
          <tr><td className="py-4 text-slate-200">Plat Nomor</td><td className="py-4 text-center text-blue-400 font-bold text-sm">1,400</td><td className="py-4 text-right text-amber-500 font-bold">71.24%</td></tr>
        </tbody>
      </table>
    </div>
  </div>
);

const createCustomIcon = (isActive) => L.divIcon({
  html: `<div style="background-color: ${isActive ? '#3b82f6' : '#1e293b'}; border: 2px solid ${isActive ? '#60a5fa' : '#ffffff'}; width: 36px; height: 36px; border-radius: 50%; display: flex; align-items: center; justify-content: center; box-shadow: 0 4px 10px rgba(0,0,0,0.5); transition: all 0.3s; z-index: ${isActive ? 999 : 1};">
           <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M23 7l-7 5 7 5V7z"></path><rect x="1" y="5" width="15" height="14" rx="2" ry="2"></rect></svg>
         </div>`,
  className: 'custom-cctv-icon',
  iconSize: [36, 36],
  iconAnchor: [18, 18]
});

const RegionMinimap = ({ locations, activeCctv, onSelectCctv }) => {
  const centerPosition = [-8.6500, 115.2200]; 

  return (
    <div className="bg-[#111111] p-5 rounded-lg border border-slate-800 flex flex-col w-full mt-6 relative z-0">
      <div className="flex items-center gap-2 mb-4">
        <MapPin className="text-blue-500" size={18} />
        <h3 className="text-sm font-bold text-white">Live Map - Wilayah Denpasar & Badung</h3>
      </div>

      <div className="w-full h-80 rounded-lg overflow-hidden border border-slate-700 relative z-0">
        <MapContainer center={centerPosition} zoom={13} style={{ height: '100%', width: '100%', zIndex: 0 }} zoomControl={true}>
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />

          {locations.map((loc) => (
            <Marker
              key={loc.id}
              position={[loc.lat, loc.lng]}
              icon={createCustomIcon(activeCctv.id === loc.id)}
              eventHandlers={{
                click: () => onSelectCctv(loc),
              }}
            >
              <Popup>
                <div className="text-slate-800 font-bold text-sm">{loc.name}</div>
                <div className="text-xs text-blue-600 mt-1 cursor-pointer font-semibold">📍 Sedang Memantau Area Ini</div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>
    </div>
  );
};


function App() {
  const [time, setTime] = useState(new Date().toLocaleTimeString('id-ID'));
  const [showAlert, setShowAlert] = useState(false);
  const [selectedLog, setSelectedLog] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [trafficStatus, setTrafficStatus] = useState('NORMAL');
  const [isVideoPlaying, setIsVideoPlaying] = useState(true);
  const [isRecording, setIsRecording] = useState(false);

  const [activeCctv, setActiveCctv] = useState(CCTV_LOCATIONS[0]);
  const [isLocationOpen, setIsLocationOpen] = useState(false);

  // MENGUBAH STATE DEFAULT LOG MENJADI KOSONG
  const [logs, setLogs] = useState([]);

  // FUNGSI FETCH DATA DARI API INCIDENTS
  const fetchIncidents = async () => {
    try {
      // Sesuaikan URL jika routing flask di blueprint tidak di prefix dengan /api/
      // Berdasarkan kode sebelumnya, kita menggunakan /api/accidents
      const response = await axios.get('http://127.0.0.1:5000/api/accidents');
      
      if (response.data && response.data.data) {
        // Melakukan mapping data dari backend ke struktur yang dibutuhkan UI
        const formattedLogs = response.data.data.map(item => ({
          id: item.id,
          // Mengambil waktu dari database
          time: item.incident_time || 'Waktu tidak tersedia',
          status: item.status || 'WARNING',
          // Jika lokasi kosong, gunakan nama kamera
          loc: item.location || item.camera_name || 'Lokasi tidak diketahui',
          detail: item.detail || 'Tidak ada detail',
          // Menyesuaikan jalur gambar (bisa URL penuh atau base URL flask)
          // Asumsi gambar dikembalikan sebagai URL absolut atau path lengkap
          img: item.image_path ? (item.image_path.startsWith('http') ? item.image_path : `http://127.0.0.1:5000/${item.image_path}`) : 'https://via.placeholder.com/150'
        }));
        
        setLogs(formattedLogs);
      }
    } catch (error) {
      console.error("Gagal mengambil data log insiden:", error);
    }
  };

  // MEMANGGIL DATA SECARA OTOMATIS SAAT KOMPONEN DIMUAT & POLLING TIAP 10 DETIK
  useEffect(() => {
    fetchIncidents();
    // Memperbarui log setiap 10 detik agar tetap aktual (real-time feeling)
    const logInterval = setInterval(fetchIncidents, 10000); 
    return () => clearInterval(logInterval);
  }, []);

  // FUNGSI HAPUS YANG MENGHUBUNGI BACKEND
  const handleDeleteLog = async (id) => {
    const confirmDelete = window.confirm("Yakin ingin menghapus riwayat insiden ini?");
    if (!confirmDelete) return;
    
    try {
        await axios.delete(`http://127.0.0.1:5000/api/accidents/${id}`);
        // Hapus dari state visual
        setLogs(prevLogs => prevLogs.filter(log => log.id !== id));
    } catch (error) {
        console.error("Gagal menghapus log:", error);
        alert("Gagal menghapus log dari sistem.");
    }
  };

  const handleSaveLog = (log) => alert(`Data tersimpan: ${log.status} di ${log.loc} pada ${log.time}`);

  const getStatusColor = (status) => {
    switch (status) {
      case 'DANGER': return 'border-red-600 text-red-500';
      case 'WARNING': return 'border-yellow-500 text-yellow-400';
      default: return 'border-emerald-500 text-emerald-400';
    }
  };

  useEffect(() => {
    const dangerLog = logs.find(l => l.status === 'DANGER');
    if (dangerLog) setShowAlert(true);
    const timer = setInterval(() => setTime(new Date().toLocaleTimeString('id-ID')), 1000);
    return () => clearInterval(timer);
  }, [logs]);

  useEffect(() => {
    const statuses = ['NORMAL', 'PADAT', 'MACET'];
    let currentIndex = 0;
    const trafficTimer = setInterval(() => {
      currentIndex = (currentIndex + 1) % statuses.length;
      setTrafficStatus(statuses[currentIndex]);
    }, 4000);
    return () => clearInterval(trafficTimer);
  }, []);

  const handleTogglePlay = () => setIsVideoPlaying(!isVideoPlaying);
  const handleStop = () => setIsVideoPlaying(false);
  const handleSnapshot = () => alert(`Snapshot dari ${activeCctv.name} berhasil disimpan!`);
  const handleToggleRecord = () => setIsRecording(!isRecording);

  const handleSelectLocation = (loc) => {
    setActiveCctv(loc);
    setIsLocationOpen(false);
  };

  return (
    <Router>
      <div className="flex bg-[#050505] min-h-screen text-slate-100 font-sans overflow-hidden">
        {/* SIDEBAR */}
        <nav className={`border-r border-slate-800 p-6 flex flex-col h-screen fixed bg-[#0a0a0a] z-20 transition-transform duration-300 ease-in-out w-64 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
          <div className="flex-1">
            <h2 className="text-blue-500 font-black text-xl pb-4 mb-6 tracking-tighter border-b border-slate-800 flex justify-between items-center">
              ITS-DENPASAR
              <button onClick={() => setIsSidebarOpen(false)} className="lg:hidden text-slate-400 hover:text-white"><X size={20} /></button>
            </h2>
            <ul className="space-y-4">
              {[{ name: 'Dashboard', icon: <LayoutDashboard size={18} />, path: '/' }, { name: 'Input Video', icon: <Video size={18} />, path: '/upload' },].map(item => (
                <li key={item.name}>
                  <Link to={item.path} className="flex items-center gap-3 text-slate-400 hover:text-white font-bold text-sm transition-colors">{item.icon} {item.name}</Link>
                </li>
              ))}
            </ul>
          </div>
          <div className="pt-6 border-t border-slate-800 mt-auto">
            <button className="flex items-center gap-3 text-slate-400 hover:text-red-500 text-sm font-bold transition-colors"><LogOut size={18} /> Logout</button>
          </div>
        </nav>

        {/* KONTEN UTAMA */}
        <main className={`p-8 w-full h-screen overflow-y-auto relative transition-all duration-300 ease-in-out ${isSidebarOpen ? 'ml-64' : 'ml-0'}`}>

          {/* MODAL PERINGATAN DANGER */}
          {showAlert && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
              <div className="bg-red-600 p-12 rounded-3xl border-4 border-white max-w-2xl w-full text-center shadow-[0_0_50px_rgba(220,38,38,0.5)]">
                <div className="text-8xl mb-6">⚠️</div>
                <h2 className="font-black text-white text-5xl uppercase mb-4">KECELAKAAN TERDETEKSI!</h2>
                <p className="text-white/90 text-lg mb-10">Sistem mendeteksi anomali berbahaya. Segera lakukan pengecekan pada log kejadian.</p>
                <button onClick={() => setShowAlert(false)} className="bg-white text-red-700 px-12 py-4 rounded-full font-black text-lg hover:bg-slate-100 transition-all shadow-xl">KONFIRMASI & TUTUP</button>
              </div>
            </div>
          )}

          {/* MODAL DETAIL LOG */}
          {selectedLog && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4">
              <div className="bg-slate-900 border border-slate-700 p-8 rounded-3xl max-w-lg w-full">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-xl font-black">DETAIL KEJADIAN</h3>
                  <button onClick={() => setSelectedLog(null)} className="text-slate-400 hover:text-white transition-colors"><X /></button>
                </div>
                <img src={selectedLog.img} className="w-full h-48 object-cover rounded-xl mb-4" alt="Bukti" />
                <p className="mb-2 text-sm text-slate-300"><strong className="text-white">Lokasi:</strong> {selectedLog.loc}</p>
                <p className="mb-2 text-sm text-slate-300"><strong className="text-white">Waktu:</strong> {selectedLog.time}</p>
                <p className="mb-6 text-sm text-slate-300"><strong className="text-white">Detail:</strong> {selectedLog.detail}</p>
                <button onClick={() => setSelectedLog(null)} className="w-full bg-blue-600 hover:bg-blue-700 py-3 rounded-lg font-bold transition-colors text-white">TUTUP</button>
              </div>
            </div>
          )}

          {/* HEADER */}
          <header className="flex justify-between items-center pb-8 border-b border-slate-800 mb-8">
            <div className="flex items-center gap-4">
              <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="p-2 bg-slate-900 rounded-lg border border-slate-700 text-slate-400 hover:text-white hover:bg-slate-800 transition-all"><Menu size={24} /></button>
              <div>
                <h1 className="text-2xl font-black text-white uppercase tracking-tight">Traffic AI Command Center</h1>
                <p className="text-blue-500 font-bold mt-1">Sistem Pemantauan Diskominfos Denpasar</p>
              </div>
            </div>
            <div className="bg-slate-900 px-6 py-3 rounded-xl border border-slate-700 flex items-center gap-4">
              <div className="text-right">
                <p className="text-[10px] text-slate-400 font-black uppercase">Waktu</p>
                <h2 className="text-xl font-mono font-bold text-white">{time} WITA</h2>
              </div>
              <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center"><User size={20} /></div>
            </div>
          </header>

          <Routes>
            {/* RUTE UTAMA: DASHBOARD */}
            <Route path="/" element={
              <div className="grid grid-cols-12 gap-6">
                <section className="col-span-12 xl:col-span-8 space-y-6">

                  {/* VIDEO FEED */}
                  <div className="aspect-video bg-black rounded-xl border border-slate-800 overflow-hidden shadow-2xl relative group">
                    <div className="absolute top-4 right-4 z-30 flex flex-col items-end">
                      <button
                        onClick={() => setIsLocationOpen(!isLocationOpen)}
                        className="flex items-center gap-2 bg-black/70 hover:bg-slate-950 text-white font-bold text-xs py-2 px-4 rounded-xl border border-slate-700 shadow-xl backdrop-blur-md transition-all active:scale-95"
                      >
                        <MapPin size={14} className="text-blue-400" />
                        <span>{activeCctv.name}</span>
                        <ChevronDown size={14} className={`text-slate-400 transition-transform duration-300 ${isLocationOpen ? 'rotate-180' : ''}`} />
                      </button>

                      <div className={`mt-2 w-56 bg-slate-950/95 border border-slate-800 rounded-xl overflow-hidden shadow-2xl backdrop-blur-lg transition-all duration-300 origin-top-right ${isLocationOpen ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-95 -translate-y-2 pointer-events-none'}`}>
                        <div className="p-2 text-[10px] uppercase font-black tracking-widest text-slate-500 border-b border-slate-900">
                          Pilih Live CCTV Dishub
                        </div>
                        <ul className="divide-y divide-slate-900">
                          {CCTV_LOCATIONS.map((loc) => (
                            <li key={loc.id}>
                              <button
                                onClick={() => handleSelectLocation(loc)}
                                className={`w-full text-left text-xs py-3 px-4 transition-colors font-semibold flex items-center justify-between ${activeCctv.id === loc.id ? 'bg-blue-600/20 text-blue-400 font-bold' : 'text-slate-300 hover:bg-slate-900 hover:text-white'}`}
                              >
                                {loc.name}
                                {activeCctv.id === loc.id && <span className="w-1.5 h-1.5 bg-blue-400 rounded-full"></span>}
                              </button>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    {isRecording && (
                      <div className="absolute top-4 left-4 z-10 flex items-center gap-2 bg-black/60 px-3 py-1.5 rounded-full border border-red-900/50 backdrop-blur-sm">
                        <span className="animate-pulse w-3 h-3 bg-red-600 rounded-full"></span>
                        <span className="text-xs font-bold text-red-500 tracking-widest">REC</span>
                      </div>
                    )}

                    {!isVideoPlaying && (
                      <div className="absolute inset-0 z-10 bg-black/50 backdrop-blur-sm flex flex-col items-center justify-center">
                        <Pause size={48} className="text-slate-400 mb-4 opacity-50" />
                        <p className="text-slate-300 font-bold tracking-widest">STREAM PAUSED</p>
                      </div>
                    )}

                    <img
                      src={activeCctv.url}
                      className={`w-full h-full object-cover transition-all duration-300 ${!isVideoPlaying ? 'opacity-30' : 'opacity-100'}`}
                      alt={`Koneksi Live ${activeCctv.name}`}
                    />

                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 via-black/70 to-transparent p-4 pt-12 transform translate-y-full group-hover:translate-y-0 transition-transform duration-300 z-20 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <button onClick={handleTogglePlay} className="p-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-full transition-colors shadow-lg shadow-blue-900/20" title={isVideoPlaying ? "Pause Stream" : "Play Stream"}>
                          {isVideoPlaying ? <Pause size={18} fill="currentColor" /> : <Play size={18} fill="currentColor" className="ml-0.5" />}
                        </button>
                        <button onClick={handleStop} className="p-2.5 text-slate-300 hover:bg-slate-800 hover:text-white rounded-full transition-all" title="Stop Stream">
                          <Square size={16} fill="currentColor" />
                        </button>
                        <div className="h-6 w-px bg-slate-700 mx-2"></div>
                        <div className="flex items-center gap-2">
                          <span className={`w-2 h-2 rounded-full ${isVideoPlaying ? 'bg-emerald-500' : 'bg-slate-500'}`}></span>
                          <span className="text-xs font-bold text-slate-300 tracking-wider">{isVideoPlaying ? 'LIVE FEED' : 'OFFLINE'}</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-1 bg-slate-900/80 border border-slate-700 rounded-full px-2 py-1 backdrop-blur-md">
                        <button onClick={handleSnapshot} className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-full transition-all" title="Ambil Snapshot">
                          <Camera size={16} />
                        </button>
                        <button onClick={handleToggleRecord} className={`p-2 rounded-full transition-all ${isRecording ? 'text-red-500 bg-red-950/50' : 'text-slate-400 hover:text-white hover:bg-slate-800'}`} title={isRecording ? "Stop Recording" : "Start Recording"}>
                          <Disc size={16} />
                        </button>
                        <div className="h-4 w-px bg-slate-700 mx-1"></div>
                        <button className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-full transition-all" title="Fullscreen">
                          <Maximize size={16} />
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* STATISTIK UTAMA */}
                  {/* <div className="grid grid-cols-3 gap-4">
                    <div className="bg-[#111111] p-5 rounded-lg border border-slate-800">
                      <p className="text-[10px] text-slate-500 font-bold tracking-widest">JUMLAH KENDARAAN</p>
                      <h2 className="text-2xl font-black mt-1 text-white">1,240</h2>
                    </div>
                    <div className="bg-[#111111] p-5 rounded-lg border border-slate-800">
                      <p className="text-[10px] text-slate-500 font-bold tracking-widest">KECEPATAN RATA-RATA</p>
                      <h2 className="text-2xl font-black mt-1 text-white">45 km/h</h2>
                    </div>

                    <div className={`bg-[#111111] p-5 rounded-lg border transition-all duration-500 ${trafficStatus === 'NORMAL' ? 'border-emerald-500/50 shadow-[0_0_15px_rgba(16,185,129,0.15)] bg-emerald-950/10' :
                      trafficStatus === 'PADAT' ? 'border-yellow-400/50 shadow-[0_0_15px_rgba(250,204,21,0.15)] bg-yellow-950/10' :
                        'border-red-500/50 shadow-[0_0_15px_rgba(239,68,68,0.2)] bg-red-950/10'
                      }`}>
                      <p className="text-[10px] text-slate-500 font-bold tracking-widest">STATUS LALU LINTAS</p>
                      <div className="flex items-center gap-3 mt-1">
                        <span className="relative flex h-4 w-4">
                          <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${trafficStatus === 'NORMAL' ? 'bg-emerald-400' : trafficStatus === 'PADAT' ? 'bg-yellow-400' : 'bg-red-500'}`}></span>
                          <span className={`relative inline-flex rounded-full h-4 w-4 ${trafficStatus === 'NORMAL' ? 'bg-emerald-500' : trafficStatus === 'PADAT' ? 'bg-yellow-500' : 'bg-red-600'}`}></span>
                        </span>
                        <h2 className={`text-2xl font-black transition-colors duration-300 ${trafficStatus === 'NORMAL' ? 'text-emerald-500' : trafficStatus === 'PADAT' ? 'text-yellow-400' : 'text-red-500'}`}>
                          {trafficStatus === 'NORMAL' ? 'NORMAL' : trafficStatus === 'PADAT' ? 'CUKUP PADAT' : 'MACET'}
                        </h2>
                      </div>
                    </div>
                  </div> */}

                  {/* GRAFIK & TABEL */}
                  <div className="grid grid-cols-12 gap-4">
                    <div className="col-span-12 lg:col-span-7"><FpsChart /></div>
                    {/* BAGIAN INI DI-COMMENT AGAR TOTAL OBJECT TIDAK TERLIHAT */}
                    {/* <div className="col-span-12 lg:col-span-5"><AccuracyTable /></div> */}
                  </div>

                  {/* PETA MINIMAP */}
                  {/* BAGIAN INI DI-COMMENT AGAR LIVE MAP TIDAK TERLIHAT */}
                  {/* <RegionMinimap locations={CCTV_LOCATIONS} activeCctv={activeCctv} onSelectCctv={handleSelectLocation} /> */}

                </section>

                {/* AREA LOG & BUKTI FOTO (DETEKSI KECELAKAAN TERKINI) */}
                <aside className="col-span-12 xl:col-span-4 bg-[#0a0a0a] border border-slate-800 p-6 rounded-lg h-[950px] overflow-y-auto">
                  <h3 className="text-xs font-black text-slate-400 mb-6 uppercase tracking-widest flex items-center gap-2">
                    <Layers size={16} /> Deteksi Kecelakaan Terkini
                  </h3>
                  
                  {/* PENANGANAN KETIKA DATA KOSONG */}
                  {logs.length === 0 ? (
                    <div className="text-center p-8 border border-slate-800 border-dashed rounded-xl mt-4">
                      <p className="text-slate-500 text-sm font-semibold">Tidak ada log kecelakaan saat ini.</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {logs.map(log => (
                        <div key={log.id} onClick={() => setSelectedLog(log)} className={`bg-black p-4 rounded-lg cursor-pointer border-l-4 border-r border-t border-b border-slate-800 hover:border-blue-700 transition-all ${getStatusColor(log.status)}`}>
                          <div className="flex gap-4 mb-3">
                            <img src={log.img} className="w-20 h-20 rounded-md object-cover" alt="Bukti" />
                            <div>
                              <p className="text-[10px] font-bold uppercase tracking-widest">{log.status}</p>
                              <p className="text-sm font-bold text-white mt-1">{log.loc}</p>
                              <p className="text-[10px] text-slate-500 mt-1">{log.time}</p>
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <button onClick={(e) => { e.stopPropagation(); handleSaveLog(log); }} className="flex-1 bg-slate-900 hover:bg-blue-600 text-[10px] font-black px-4 py-3 rounded transition-all text-white tracking-wider">SIMPAN</button>
                            <button onClick={(e) => { e.stopPropagation(); handleDeleteLog(log.id); }} className="bg-red-950/40 hover:bg-red-600 text-red-500 hover:text-white text-[10px] font-black px-4 py-3 rounded transition-all flex items-center justify-center gap-1"><Trash2 size={14} /> HAPUS</button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </aside>
              </div>
            } />
            
            {/* RUTE HALAMAN UPLOAD */}
            <Route path="/upload" element={<UploadPage />} />

          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;