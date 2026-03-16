import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldCheck, CheckCircle, XCircle, Calendar, Award, User, Search, RotateCcw } from 'lucide-react';
import achievrLogo from '../assets/achievr-logo.png';

const BACKEND_URL = 'http://localhost:5000';

export default function VerifyCertificate() {
  const navigate = useNavigate();
  const [certId, setCertId] = useState('');
  const [verification, setVerification] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleVerify = async (e) => {
    e.preventDefault();
    const id = certId.trim();
    if (!id) return;

    try {
      setLoading(true);
      setVerification(null);
      const response = await fetch(`${BACKEND_URL}/api/certificates/verify/${id}`);
      const backendData = await response.json();
      setVerification({ status: backendData.status, data: backendData, message: backendData.message });
    } catch {
      setVerification({ status: 'error', message: 'Service unavailable. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setCertId('');
    setVerification(null);
  };

  const isValid = verification?.status === 'valid' && verification?.data;
  const data = verification?.data || {};

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 flex flex-col">

      {/* Header */}
      <header className="border-b border-gray-200 bg-white/80 backdrop-blur sticky top-0 z-50 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <img
            src={achievrLogo}
            alt="AchievR"
            className="h-8 sm:h-9 w-auto cursor-pointer"
            onClick={() => navigate('/')}
          />
          <button
            onClick={() => navigate('/')}
            className="text-xs sm:text-sm font-medium text-white bg-orange-600 hover:bg-orange-700 px-3 sm:px-4 py-2 rounded-lg transition"
          >
            Back to AchievR
          </button>
        </div>
      </header>

      <main className="flex-1 max-w-4xl mx-auto px-4 sm:px-6 py-10 sm:py-16 space-y-8">

        {/* Page Title */}
        <div className="text-center space-y-2">
          <div className="w-10 h-10 sm:w-12 sm:h-12 bg-orange-50 border border-orange-200 rounded-xl flex items-center justify-center mx-auto mb-4">
            <ShieldCheck className="w-5 h-5 sm:w-6 sm:h-6 text-orange-500" />
          </div>

          <h1 className="text-xl sm:text-2xl font-semibold text-gray-900">
            Verify Certificate
          </h1>

          <p className="text-gray-700 font-light text-sm">
            Paste a certificate ID below to instantly check its authenticity
          </p>
        </div>

        {/* Search Box */}
        <form
          onSubmit={handleVerify}
          className="bg-white border border-gray-300 rounded-2xl p-4 sm:p-6 shadow-sm"
        >
          <label className="block text-sm text-gray-900 uppercase tracking-widest mb-3">
            Certificate ID
          </label>

          <div className="flex flex-col sm:flex-row gap-3">
            <input
              type="text"
              value={certId}
              onChange={(e) => setCertId(e.target.value)}
              placeholder="e.g CERT_1773XXXXXXXXX"
              className="flex-1 font-mono text-sm bg-gray-50 border border-gray-400 rounded-lg px-4 py-3 text-gray-900 placeholder-gray-400 focus:outline-none focus:border-orange-400 focus:ring-1 focus:ring-orange-400 transition"
            />

            <button
              type="submit"
              disabled={!certId.trim() || loading}
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-3 text-sm bg-orange-600 hover:bg-orange-700 disabled:bg-orange-600 disabled:text-white text-white rounded-lg transition"
            >
              {loading ? (
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <Search size={15} />
              )}
              {loading ? 'Checking...' : 'Verify'}
            </button>
          </div>
        </form>

        {/* Result */}
        {verification && (
          <div className="space-y-5 animate-fadeIn">

            {/* Status Banner */}
            <div
              className={`rounded-2xl border p-4 sm:p-6 flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-5 shadow-sm ${isValid ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'
                }`}
            >
              <div
                className={`w-12 h-12 rounded-xl flex items-center justify-center border ${isValid ? 'bg-green-100 border-green-200' : 'bg-red-100 border-red-200'
                  }`}
              >
                {isValid ? (
                  <CheckCircle className="w-6 h-6 text-green-600" />
                ) : (
                  <XCircle className="w-6 h-6 text-red-500" />
                )}
              </div>

              <div className="flex-1">
                <h2 className={`text-lg font-semibold ${isValid ? 'text-green-800' : 'text-red-800'}`}>
                  {isValid
                    ? 'Certificate is Valid'
                    : verification?.status === 'not_found'
                      ? 'Certificate Not Found'
                      : 'Invalid Certificate'}
                </h2>

                <p className={`text-sm font-light mt-0.5 ${isValid ? 'text-green-600' : 'text-red-500'}`}>
                  {verification?.message ||
                    (isValid
                      ? 'This certificate is authentic and verified by AchievR.'
                      : 'This certificate could not be verified.')}
                </p>
              </div>

              <button
                onClick={handleReset}
                className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-gray-800 border border-gray-200 bg-white hover:bg-gray-50 px-3 py-2 rounded-lg transition"
              >
                <RotateCcw size={12} />
                Search again
              </button>
            </div>

            {/* Certificate Details */}
            {isValid && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">

                {/* Student */}
                <div className="bg-white border border-gray-200 rounded-2xl p-4 sm:p-5 shadow-sm">
                  <div className="flex items-center gap-2 text-gray-400 text-xs uppercase tracking-widest mb-4">
                    <User size={12} />
                    Student
                  </div>

                  <p className="text-gray-900 font-medium text-base mb-3">
                    {data.student}
                  </p>

                  <div className="flex flex-wrap gap-2">
                    <span className="font-mono text-xs bg-orange-50 text-orange-600 border border-orange-200 px-3 py-1 rounded-full">
                      {data.rollNo}
                    </span>

                    <span className="text-xs bg-gray-100 border border-gray-200 text-gray-600 px-3 py-1 rounded-full capitalize">
                      {data.department}
                    </span>
                  </div>
                </div>

                {/* Achievement */}
                <div className="md:col-span-2 bg-white border border-gray-200 rounded-2xl p-4 sm:p-5 shadow-sm">

                  <div className="flex items-center gap-2 text-gray-400 text-xs uppercase tracking-widest mb-4">
                    <Award size={12} />
                    Achievement
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">

                    <div>
                      <p className="text-gray-400 text-xs mb-1">Title</p>
                      <p className="text-gray-900 font-medium leading-snug">
                        {data.achievement}
                      </p>
                    </div>

                    <div>
                      <p className="text-gray-400 text-xs mb-1">Level</p>
                      <span className="inline-flex items-center gap-1.5 text-xs bg-emerald-50 text-emerald-700 border border-emerald-200 px-3 py-1.5 rounded-lg">
                        <Award size={11} />
                        {data.level}
                      </span>
                    </div>

                    <div>
                      <p className="text-gray-400 text-xs mb-1">Organizer</p>
                      <p className="text-gray-700 font-light text-sm">
                        {data.organizer}
                      </p>
                    </div>

                    <div>
                      <p className="text-gray-400 text-xs mb-1">Event Date</p>
                      <div className="flex items-center gap-1.5 text-gray-700 text-sm">
                        <Calendar size={12} className="text-gray-400" />
                        {new Date(data.eventDate).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </div>
                    </div>

                  </div>

                  <div className="mt-5 pt-4 border-t border-gray-100">
                    <span className="text-xs uppercase tracking-widest text-purple-600 bg-purple-50 border border-purple-200 px-4 py-1.5 rounded-full">
                      {data.category} Achievement
                    </span>
                  </div>

                </div>
              </div>
            )}

          </div>
        )}



      </main>

      <footer className="border-t border-gray-200 py-6 bg-gray-100">
        <div className="max-w-6xl mx-auto text-center px-4">
          <p className="text-xs text-gray-900 font-light">
            © 2026 AchievR. All rights reserved. Developed by Hack Titans
            (Shashank & Omkar)
          </p>
        </div>
      </footer>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(6px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn { animation: fadeIn 0.3s ease-out; }
      `}</style>

    </div>
  );
}