import React from 'react';
import { useNavigate } from 'react-router-dom';
import { AlertTriangle, Home, RotateCcw, Terminal } from 'lucide-react';

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-oracle-900 flex flex-col items-center justify-center p-4 relative overflow-hidden">
      {/* Background Decor: Subtle grid or "vein" lines */}
      <div className="absolute inset-0 pointer-events-none opacity-5">
        <div className="absolute top-10 left-10 w-64 h-64 bg-red-600 rounded-full blur-[100px]"></div>
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-red-900 rounded-full blur-[120px]"></div>
      </div>

      <div className="relative z-10 max-w-lg w-full text-center space-y-8">
        
        {/* The 404 Glitch Header */}
        <div className="relative">
            <h1 className="text-9xl font-black text-transparent bg-clip-text bg-gradient-to-b from-gray-700 to-oracle-900 select-none">
                404
            </h1>
            <div className="absolute inset-0 flex items-center justify-center">
                <h1 className="text-6xl font-black text-red-600 font-mono tracking-tighter animate-pulse">
                    ERROR
                </h1>
            </div>
        </div>

        {/* Terminal Error Log */}
        <div className="bg-black/50 backdrop-blur-sm border border-red-900/30 rounded-lg p-6 font-mono text-left shadow-2xl">
            <div className="flex items-center gap-2 border-b border-red-900/30 pb-2 mb-4">
                <div className="w-3 h-3 rounded-full bg-red-600/50"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-600/50"></div>
                <div className="w-3 h-3 rounded-full bg-green-600/50"></div>
                <span className="text-xs text-red-400 ml-auto">System_Alert_Level_5</span>
            </div>
            <div className="space-y-2 text-sm">
                <p className="text-red-500">
                    <span className="text-gray-500 mr-2">{'>'}</span> 
                    CRITICAL FAILURE: Target URI not found.
                </p>
                <p className="text-gray-400">
                    <span className="text-gray-500 mr-2">{'>'}</span> 
                    Scanning sector... <span className="text-red-500">0 results.</span>
                </p>
                <p className="text-gray-400">
                    <span className="text-gray-500 mr-2">{'>'}</span> 
                    Oracle status: <span className="text-green-500">ONLINE</span>
                </p>
                <p className="text-gray-400">
                    <span className="text-gray-500 mr-2">{'>'}</span> 
                    Connection: <span className="text-yellow-500">UNSTABLE</span>
                </p>
                <p className="text-gray-500 animate-pulse mt-4">
                    _waiting for operator input...
                </p>
            </div>
        </div>

        {/* User Message */}
        <div>
            <h2 className="text-2xl font-bold text-white mb-2">Page Not Found</h2>
            <p className="text-gray-400">
                The data fragment you are looking for has been redacted, moved, or never existed in the Oracle.
            </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button 
                onClick={() => navigate(-1)}
                className="btn btn-outline border-oracle-700 text-gray-300 hover:bg-oracle-800 hover:text-white"
            >
                <RotateCcw size={18} />
                Trace Back
            </button>
            <button 
                onClick={() => navigate('/dashboard')}
                className="btn bg-red-600 hover:bg-red-700 text-white border-none shadow-[0_0_15px_rgba(220,38,38,0.3)] hover:shadow-[0_0_25px_rgba(220,38,38,0.5)] transition-all"
            >
                <Home size={18} />
                Return to Command Center
            </button>
        </div>

      </div>
      
      {/* Footer System ID */}
      <div className="absolute bottom-6 text-xs text-gray-700 font-mono">
        ERR_ID: 0x892_BV_NULL_PTR
      </div>
    </div>
  );
};

export default NotFound;