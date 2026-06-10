import React, { useState, useEffect } from 'react';
import { FileText, Download, Eye, X } from 'lucide-react';
import { api } from '../api/client';

const Reports = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedReport, setSelectedReport] = useState(null);
  const [reportContent, setReportContent] = useState('');

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const data = await api.getReports();
        setReports(data);
      } catch (error) {
        console.error("Failed to fetch reports:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchReports();
  }, []);

  const handleView = async (filename) => {
    try {
      const data = await api.getReport(filename);
      setReportContent(data.content);
      setSelectedReport(filename);
    } catch (error) {
      console.error("Failed to load report:", error);
    }
  };

  const handleDownload = async (filename) => {
    try {
      const data = await api.getReport(filename);
      const blob = new Blob([data.content], { type: 'text/plain' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Failed to download report:", error);
    }
  };

  return (
    <div className="animate-fade-in">
      <div className="mb-12">
        <h1 className="text-4xl mb-4">Scan History</h1>
        <p className="text-neu-text text-lg font-semibold">Access and download your previous security assessments.</p>
      </div>

      <div className={`grid gap-10 transition-all duration-500 ${selectedReport ? 'grid-cols-1 lg:grid-cols-2' : 'grid-cols-1'}`}>
        
        {/* Reports List */}
        <div className="neu-panel max-h-[calc(100vh-250px)] flex flex-col">
          <h2 className="text-2xl mb-8 flex items-center gap-4">
            <div className="p-3 rounded-full shadow-neu-inner text-neu-accent"><FileText size={24} /></div>
            Archived Reports
          </h2>

          <div className="neu-panel-inner flex-1 overflow-y-auto p-4">
            {loading ? (
              <div className="text-center py-10 font-bold text-neu-text animate-pulse">
                Fetching archives...
              </div>
            ) : reports.length > 0 ? (
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b-2 border-neu-bg">
                    <th className="pb-4 pl-4 font-bold text-sm uppercase tracking-wider text-neu-text">Document</th>
                    <th className="pb-4 font-bold text-sm uppercase tracking-wider text-neu-text">Timestamp</th>
                    <th className="pb-4 pr-4 font-bold text-sm uppercase tracking-wider text-neu-text text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="text-neu-textdark font-semibold">
                  {reports.map((report, i) => {
                    const isSelected = selectedReport === report.filename;
                    return (
                      <tr key={report.filename} className={i !== reports.length - 1 ? 'border-b-2 border-neu-bg/50' : ''}>
                        <td className="py-4 pl-4 font-mono text-sm">
                          <div className={`transition-colors ${isSelected ? 'text-neu-accent font-bold' : ''}`}>
                            {report.filename}
                          </div>
                        </td>
                        <td className="py-4">
                          <div className="text-sm">{report.date}</div>
                          <div className="text-xs text-neu-text">{report.time}</div>
                        </td>
                        <td className="py-4 pr-4 text-right">
                          <div className="flex justify-end gap-4">
                            <button 
                              onClick={() => handleView(report.filename)}
                              className={`p-3 rounded-xl transition-all duration-200 border-none cursor-pointer ${isSelected ? 'shadow-neu-inner text-neu-accent bg-neu-bg' : 'shadow-neu-outer hover:shadow-neu-outer-hover text-neu-text hover:text-neu-accent bg-neu-bg'}`}
                              title="View Document"
                            >
                              <Eye size={18} />
                            </button>
                            <button 
                              onClick={() => handleDownload(report.filename)}
                              className="p-3 rounded-xl shadow-neu-outer hover:shadow-neu-outer-hover text-neu-text hover:text-neu-accent transition-all duration-200 bg-neu-bg border-none cursor-pointer"
                              title="Download TXT"
                            >
                              <Download size={18} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            ) : (
              <div className="text-center py-16 font-bold text-neu-text">
                No historical data found.
              </div>
            )}
          </div>
        </div>

        {/* Report Detail Viewer */}
        {selectedReport && (
          <div className="neu-panel max-h-[calc(100vh-250px)] flex flex-col animate-fade-in">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold flex items-center gap-3">
                <span className="text-neu-accent">Viewer:</span> 
                <span className="font-mono text-base truncate max-w-[200px] sm:max-w-xs">{selectedReport}</span>
              </h2>
              <button 
                onClick={() => setSelectedReport(null)}
                className="p-2 rounded-xl shadow-neu-outer hover:shadow-neu-inner text-neu-red transition-all cursor-pointer border-none bg-neu-bg"
              >
                <X size={20} />
              </button>
            </div>
            
            <div className="neu-panel-inner flex-1 overflow-y-auto p-6 font-mono text-sm leading-relaxed text-neu-textdark whitespace-pre-wrap">
              {reportContent}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Reports;
