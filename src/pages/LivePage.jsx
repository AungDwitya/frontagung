import React, { useState, useEffect } from 'react';

export default function LivePage() {
    const [time, setTime] = useState(new Date().toLocaleTimeString('id-ID'));
    useEffect(() => {
        const timer = setInterval(() => setTime(new Date().toLocaleTimeString('id-ID')), 1000);
        return () => clearInterval(timer);
    }, []);

    return (
        <div className="space-y-6">
            <header className="flex justify-between items-end border-b border-slate-800 pb-6">
                <div>
                    <h1 className="text-3xl font-black text-white italic">LIVE MONITORING</h1>
                    <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-1">Real-time CCTV Stream</p>
                </div>
                <div className="text-2xl font-mono text-blue-500">{time}</div>
            </header>

            <div className="grid grid-cols-12 gap-8">
                <div className="col-span-8 aspect-video bg-black rounded-3xl border border-slate-800 shadow-2xl overflow-hidden">
                    <img src="http://localhost:5000/video_feed" className="w-full h-full object-cover" alt="Live Stream" />
                </div>
                <div className="col-span-4 bg-slate-900/30 p-6 rounded-3xl border border-slate-800">
                    <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-6">Log Anomali</h3>
                    <div className="p-5 bg-slate-950 rounded-2xl border-l-4 border-red-600">
                        <p className="text-sm font-black text-white">Status: Normal</p>
                    </div>
                </div>
            </div>
        </div>
    );
}