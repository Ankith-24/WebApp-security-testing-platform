import React from 'react';
import { useLocation, Link, Navigate } from 'react-router-dom';
import { Shield, Server, Globe, AlertTriangle, ArrowLeft } from 'lucide-react';

const Results = () => {
  const location = useLocation();
  const { scanResults } = location.state || {};

  if (!scanResults) {
    return <Navigate to="/scanner" />;
  }

  const { target, ports, services, headers, findings, riskLevel } = scanResults;

  const getRiskColor = (level) => {
    switch (level) {
      case 'High': return 'text-neu-red';
      case 'Medium': return 'text-neu-yellow';
      default: return 'text-neu-green';
    }
  };

  return (
    <div className="animate-fade-in">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8 mb-12">
        <div>
          <Link to="/scanner" className="neu-button inline-flex py-2 px-4 text-sm mb-6 font-bold">
            <ArrowLeft size={18} /> Back
          </Link>
          <h1 className="text-4xl flex flex-wrap items-center gap-4">
            Results for 
            <span className="neu-panel-inner py-2 px-6 text-neu-accent text-3xl">{target}</span>
          </h1>
        </div>

        <div className="neu-panel flex flex-col items-center justify-center p-6 min-w-[200px]">
          <div className="text-sm font-bold uppercase tracking-wider text-neu-text mb-2">Risk Level</div>
          <div className={`text-3xl font-extrabold uppercase flex items-center gap-3 ${getRiskColor(riskLevel)}`}>
            <Shield size={32} /> {riskLevel}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 mb-10">
        {/* Services & Ports */}
        <div className="neu-panel">
          <h2 className="text-2xl mb-8 flex items-center gap-4">
            <div className="p-3 rounded-full shadow-neu-inner text-neu-accent"><Server size={24} /></div>
            Open Ports
          </h2>
          
          {services.length > 0 ? (
            <div className="neu-panel-inner overflow-hidden">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b-2 border-neu-bg">
                    <th className="pb-3 text-center text-neu-text font-bold text-sm">Port</th>
                    <th className="pb-3 text-neu-text font-bold text-sm">Service</th>
                    <th className="pb-3 text-neu-text font-bold text-sm">Version</th>
                  </tr>
                </thead>
                <tbody className="text-neu-textdark font-semibold text-sm">
                  {services.map((svc, i) => (
                    <tr key={i} className={i !== services.length - 1 ? 'border-b-2 border-neu-bg/50' : ''}>
                      <td className="py-4 text-center text-neu-accent font-bold">{svc.port}/{svc.protocol}</td>
                      <td className="py-4 uppercase tracking-wider">{svc.service}</td>
                      <td className="py-4 text-neu-text">{svc.version || 'Unknown'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="neu-panel-inner text-center py-10 font-bold text-neu-text">
              No open ports detected.
            </div>
          )}
        </div>

        {/* HTTP Headers */}
        <div className="neu-panel">
          <h2 className="text-2xl mb-8 flex items-center gap-4">
            <div className="p-3 rounded-full shadow-neu-inner text-neu-accent"><Globe size={24} /></div>
            HTTP Headers
          </h2>
          
          {Object.keys(headers).length > 0 ? (
            <div className="neu-panel-inner max-h-[350px] overflow-y-auto">
              <table className="w-full text-left">
                <tbody className="text-sm">
                  {Object.entries(headers).map(([key, value], idx) => (
                    <tr key={key} className={idx !== Object.keys(headers).length - 1 ? 'border-b-2 border-neu-bg/50' : ''}>
                      <td className="py-3 font-bold text-neu-textdark w-1/3 align-top">{key}</td>
                      <td className="py-3 text-neu-text font-mono break-all">{value}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="neu-panel-inner text-center py-10 font-bold text-neu-text">
              No HTTP headers retrieved.
            </div>
          )}
        </div>
      </div>

      {/* Security Findings */}
      <div className="neu-panel">
        <h2 className="text-2xl mb-8 flex items-center gap-4">
          <div className="p-3 rounded-full shadow-neu-inner text-neu-red"><AlertTriangle size={24} /></div>
          Security Findings
        </h2>

        {findings.length > 0 ? (
          <div className="flex flex-col gap-6">
            {findings.map((finding, i) => (
              <div key={i} className="neu-panel-inner !p-6 flex flex-col md:flex-row gap-6 items-start">
                <div className={`neu-badge ${finding.severity === 'High' ? 'text-neu-red' : finding.severity === 'Medium' ? 'text-neu-yellow' : 'text-neu-green'}`}>
                  {finding.severity} Risk
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-2">{finding.title}</h3>
                  <p className="text-neu-text font-medium leading-relaxed">{finding.description}</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="neu-panel-inner text-center py-12 flex flex-col items-center">
            <div className="p-6 rounded-full shadow-neu-inner text-neu-green mb-6">
              <Shield size={48} />
            </div>
            <p className="text-xl font-bold text-neu-textdark">No Vulnerabilities Detected</p>
            <p className="text-neu-text font-semibold">The target appears to be secure based on current checks.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Results;
