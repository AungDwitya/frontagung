import React, { useState } from 'react';
import { Link } from 'react-router-dom';

export default function UploadPage() {
    const [videoFile, setVideoFile] = useState(null);

    return (
        <div className="min-h-screen bg-[#020617] text-slate-100 p-8">
            <Link to="/" className="text-blue-500 font-black mb-8 block">← KEMBALI KE LIVE DASHBOARD</Link>
            <h1 className="text-3xl font-black text-white uppercase italic mb-8">PENGUJIAN VIDEO</h1>

            <div className="relative aspect-video bg-black rounded-3xl border border-slate-800 flex items-center justify-center">
                {videoFile ? (
                    <video src={videoFile} controls className="w-full h-full rounded-3xl" />
                ) : (
                    <label className="cursor-pointer bg-blue-600 hover:bg-blue-500 text-white font-black px-10 py-4 rounded-full">
                        PILIH FILE VIDEO UNTUK ANALISIS
                        <input type="file" onChange={(e) => setVideoFile(URL.createObjectURL(e.target.files[0]))} className="hidden" />
                    </label>
                )}
            </div>
        </div>
    );
}