import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Activity, ShieldAlert, CheckCircle, Clock } from 'lucide-react';
import { api } from '../api/client';

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalScans: 0,
    recentReports: [],
    highRiskScans: 0
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const reports = await api.getReports();
        const highRisk = reports.filter(r => r.size > 2000).length;
        setStats({
          totalScans: reports.length,
          recentReports: reports.slice(0, 5),
          highRiskScans: highRisk
        });
      } catch (error) {
        console.error("Failed to fetch reports for dashboard:", error);
      }
    };
    fetchStats();
  }, []);

  return (
    <div className="animate-fade-in">
      <div className="mb-12">
        <h1 className="text-4xl mb-3">Security Overview</h1>
        <p className="text-neu-text text-lg font-semibold">Your network and application vulnerability status.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-14">
        {/* Total Scans Card */}
        <div className="neu-panel flex items-center gap-6">
          <div className="p-4 rounded-full shadow-neu-inner text-neu-accent">
            <Activity size={36} />
          </div>
          <div>
            <div className="text-4xl font-extrabold text-neu-textdark mb-1">{stats.totalScans}</div>
            <div className="text-sm font-bold uppercase tracking-wider text-neu-text">Total Scans</div>
          </div>
        </div>

        {/* Secure Assets Card */}
        <div className="neu-panel flex items-center gap-6">
          <div className="p-4 rounded-full shadow-neu-inner text-neu-green">
            <CheckCircle size={36} />
          </div>
          <div>
            <div className="text-4xl font-extrabold text-neu-textdark mb-1">{stats.totalScans - stats.highRiskScans}</div>
            <div className="text-sm font-bold uppercase tracking-wider text-neu-text">Secure Assets</div>
          </div>
        </div>

        {/* Vulnerable Targets Card */}
        <div className="neu-panel flex items-center gap-6">
          <div className="p-4 rounded-full shadow-neu-inner text-neu-red">
            <ShieldAlert size={36} />
          </div>
          <div>
            <div className="text-4xl font-extrabold text-neu-textdark mb-1">{stats.highRiskScans}</div>
            <div className="text-sm font-bold uppercase tracking-wider text-neu-text">Vulnerabilities</div>
          </div>
        </div>
      </div>

      <div className="neu-panel">
        <h2 className="text-2xl mb-8 flex items-center gap-4">
          <div className="p-3 rounded-full shadow-neu-inner text-neu-accent"><Clock size={24} /></div>
          Recent Activity
        </h2>

        {stats.recentReports.length > 0 ? (
          <div className="neu-panel-inner overflow-hidden">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b-2 border-neu-bg">
                  <th className="pb-4 font-bold text-sm uppercase tracking-wider text-neu-text">Report ID</th>
                  <th className="pb-4 font-bold text-sm uppercase tracking-wider text-neu-text">Date</th>
                  <th className="pb-4 font-bold text-sm uppercase tracking-wider text-neu-text">Time</th>
                  <th className="pb-4 font-bold text-sm uppercase tracking-wider text-neu-text text-center">Action</th>
                </tr>
              </thead>
              <tbody className="text-neu-textdark font-semibold">
                {stats.recentReports.map((report, idx) => (
                  <tr key={report.filename} className={idx !== stats.recentReports.length - 1 ? 'border-b-2 border-neu-bg/50' : ''}>
                    <td className="py-5 font-mono text-sm">{report.filename}</td>
                    <td className="py-5">{report.date}</td>
                    <td className="py-5 text-neu-text">{report.time}</td>
                    <td className="py-5 text-center">
                      <Link to="/reports" className="neu-button py-2 px-4 text-sm inline-flex">
                        View Details
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="neu-panel-inner text-center py-16">
            <div className="inline-block p-6 rounded-full shadow-neu-inner mb-6 text-neu-text/50">
              <Activity size={48} />
            </div>
            <p className="text-xl font-bold mb-6 text-neu-textdark">No scans performed yet</p>
            <Link to="/scanner" className="neu-button-primary inline-flex">
              Start Your First Scan
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
