import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Loader2, AlertCircle, Target, XCircle } from 'lucide-react';
import { api } from '../api/client';

const Scanner = () => {
  const [target, setTarget] = useState('');
  const [isScanning, setIsScanning] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleScan = async (e) => {
    e.preventDefault();
    if (!target) {
      setError('Please enter a target URL or IP address.');
      return;
    }
    
    setError('');
    setIsScanning(true);
    
    try {
      const results = await api.scan(target);
      navigate('/results', { state: { scanResults: results } });
    } catch (err) {
      setError(err.response?.data?.error || 'An error occurred during the scan. Please check backend connection.');
    } finally {
      setIsScanning(false);
    }
  };

  const handleClear = () => {
    setTarget('');
    setError('');
  };

  return (
    <div className="animate-fade-in max-w-4xl mx-auto">
      <div className="mb-12 text-center">
        <h1 className="text-4xl mb-4">Security Scanner</h1>
        <p className="text-neu-text text-lg font-semibold">Initialize active reconnaissance on your infrastructure.</p>
      </div>

      <div className="neu-panel relative overflow-hidden">
        {/* Decoration */}
        <div className="absolute top-0 right-0 -mt-10 -mr-10 text-neu-bg shadow-neu-inner rounded-full p-20 opacity-50 pointer-events-none">
          <Target size={120} strokeWidth={1} />
        </div>

        <form onSubmit={handleScan} className="relative z-10">
          <div className="mb-10">
            <label className="block font-bold text-sm uppercase tracking-wider text-neu-text mb-4 pl-2" htmlFor="targetInput">
              Target Endpoint
            </label>
            <input
              id="targetInput"
              type="text"
              className="neu-input text-lg"
              placeholder="e.g., example.com or 192.168.1.1"
              value={target}
              onChange={(e) => setTarget(e.target.value)}
              disabled={isScanning}
            />
          </div>

          {error && (
            <div className="mb-8 neu-panel-inner !bg-neu-red/10 text-neu-red flex items-center gap-4">
              <AlertCircle size={24} />
              <span className="font-bold">{error}</span>
            </div>
          )}

          <div className="flex flex-col sm:flex-row gap-6 mt-8">
            <button type="submit" className="neu-button-primary flex-1 py-4 text-lg" disabled={isScanning}>
              {isScanning ? (
                <>
                  <Loader2 size={24} className="animate-spin" />
                  Running Diagnostics...
                </>
              ) : (
                <>
                  <Search size={24} />
                  Initiate Scan
                </>
              )}
            </button>
            <button type="button" className="neu-button py-4 text-lg px-8 text-neu-text" onClick={handleClear} disabled={isScanning}>
              <XCircle size={24} />
              Clear
            </button>
          </div>
        </form>
      </div>

      {isScanning && (
        <div className="mt-12 text-center">
          <div className="neu-panel-inner inline-block px-12 py-8">
            <p className="font-bold text-neu-accent mb-6 text-lg animate-pulse">
              Executing Nmap & Curl Modules...
            </p>
            <div className="w-64 h-4 rounded-full shadow-neu-inner overflow-hidden relative mx-auto">
              <div className="absolute top-0 left-0 h-full w-1/2 bg-neu-accent rounded-full animate-[progress_1.5s_infinite_ease-in-out] shadow-[0_0_10px_rgba(66,153,225,0.6)]"></div>
            </div>
          </div>
          <style>
            {`
              @keyframes progress {
                0% { transform: translateX(-100%); }
                100% { transform: translateX(200%); }
              }
            `}
          </style>
        </div>
      )}
    </div>
  );
};

export default Scanner;
