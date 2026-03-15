import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import {
  ShieldCheck, CheckCircle, XCircle, Calendar, Award, Copy, User, MapPin
} from 'lucide-react';

const BACKEND_URL = 'http://localhost:5000';

export default function VerifyCertificate() {
  const { certificateId } = useParams();
  const [verification, setVerification] = useState(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (certificateId) verifyCertificate(certificateId);
  }, [certificateId]);

  const verifyCertificate = async (id) => {
    try {
      setLoading(true);
      const response = await fetch(`${BACKEND_URL}/api/certificates/verify/${id}`);
      const backendData = await response.json();
      setVerification({ status: backendData.status, data: backendData });
    } catch (error) {
      setVerification({ status: 'error', message: 'Service unavailable' });
    } finally {
      setLoading(false);
    }
  };

  const copyCertificateId = () => {
    navigator.clipboard.writeText(certificateId);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  if (loading) return <LoadingState certId={certificateId} />;

  const isValid = verification?.status === 'valid' && verification?.data;
  const data = verification?.data || {};

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-slate-100">
      {/* Minimal Header */}
      <header className="bg-white/80 backdrop-blur border-b border-gray-200 shadow-sm sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
          <a href="/" className="font-bold text-xl text-gray-900 hover:text-orange-600 transition-colors">
            AchievR
          </a>
          <button
            onClick={copyCertificateId}
            className="flex items-center gap-2 px-4 py-2 text-sm bg-gray-100 hover:bg-gray-200 text-gray-800 font-medium rounded-lg transition-all border"
            title="Copy certificate ID"
          >
            <Copy size={16} />
            {copied ? 'Copied!' : 'ID'}
          </button>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 py-12 lg:py-20">
        {/* Single Clean Card */}
        <div className={`w-full max-w-6xl mx-auto shadow-2xl rounded-2xl overflow-hidden border-4 transition-all ${
          isValid 
            ? 'bg-white border-green-200 shadow-green-200/50 hover:shadow-green-300/60' 
            : 'bg-white border-gray-200 shadow-gray-200/50 hover:shadow-gray-300/60'
        }`}>
          
          {/* Status Bar */}
          <div className={`p-6 lg:p-8 border-b-2 ${
            isValid 
              ? 'bg-gradient-to-r from-green-50 to-emerald-50 border-green-100' 
              : 'bg-gradient-to-r from-gray-50 to-slate-50 border-gray-100'
          }`}>
            <div className="flex flex-col lg:flex-row lg:items-center gap-4 lg:gap-8">
              <div className="flex items-center gap-4">
                {isValid ? (
                  <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center shadow-lg">
                    <CheckCircle className="w-10 h-10 text-green-600" />
                  </div>
                ) : (
                  <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center shadow-lg">
                    <ShieldCheck className="w-10 h-10 text-gray-500" />
                  </div>
                )}
                <div>
                  <h1 className={`text-2xl lg:text-3xl font-bold ${
                    isValid ? 'text-green-900' : 'text-gray-900'
                  }`}>
                    {isValid ? 'Valid Certificate' : 'Certificate Verification'}
                  </h1>
                  <p className="text-lg text-gray-600 mt-1 font-medium">
                    {verification?.message || `Certificate ID: ${certificateId}`}
                  </p>
                </div>
              </div>

              {/* ID Display */}
              <div className="flex-1 lg:flex-none">
                <div className="font-mono text-sm bg-gray-50 px-5 py-3 rounded-xl border border-gray-200 font-semibold tracking-wide text-center lg:text-left">
                  {certificateId}
                </div>
              </div>
            </div>
          </div>

          {/* Details Grid - Landscape on LG */}
          {isValid && data ? (
            <div className="p-8 lg:p-12 grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12 items-start">
              
              {/* Student Info */}
              <div className="lg:col-span-1 space-y-6">
                <div className="p-6 bg-gradient-to-b from-blue-50 to-indigo-50 rounded-2xl border border-blue-100">
                  <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-3">
                    <User className="w-6 h-6 text-blue-600" />
                    Student Information
                  </h3>
                  <div className="space-y-3">
                    <div className="font-bold text-xl text-gray-900">{data.student}</div>
                    <div className="flex items-center gap-2 text-sm text-gray-700 bg-white px-4 py-2 rounded-xl border">
                      <span className="font-mono text-orange-600">{data.rollNo}</span>
                      <span>•</span>
                      <span className="capitalize">{data.department}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Achievement Details */}
              <div className="lg:col-span-2 space-y-6">
                <div className="p-6 bg-gradient-to-b from-orange-50 to-amber-50 rounded-2xl border border-orange-100">
                  <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                    <Award className="w-6 h-6 text-orange-600" />
                    Achievement Details
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2 text-lg">Title</h4>
                      <p className="text-xl font-bold text-gray-900 leading-tight">{data.achievement}</p>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2 text-lg">Level</h4>
                      <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-emerald-100 to-teal-100 text-emerald-800 font-bold rounded-xl shadow-sm">
                        <Award className="w-5 h-5" />
                        {data.level}
                      </div>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2 text-lg">Organizer</h4>
                      <p className="text-gray-900 font-medium">{data.organizer}</p>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2 text-lg">Event Date</h4>
                      <div className="flex items-center gap-2 text-gray-900 font-medium">
                        <Calendar className="w-5 h-5 text-gray-500" />
                        {new Date(data.eventDate).toLocaleDateString('en-US', { 
                          year: 'numeric', month: 'long', day: 'numeric' 
                        })}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Category Tag */}
                <div className="flex justify-center">
                  <div className="px-6 py-3 bg-gradient-to-r from-purple-100 to-indigo-100 text-purple-800 font-bold rounded-2xl shadow-lg uppercase tracking-wide text-sm">
                    {data.category} Achievement
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="p-12 lg:p-20 text-center">
              <div className="max-w-2xl mx-auto">
                <h3 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-6">
                  {verification?.status === 'not_found' ? 'Not Found' : 'Invalid'}
                </h3>
                <p className="text-xl text-gray-700 leading-relaxed mb-8">
                  {verification?.message || 'Certificate verification failed.'}
                </p>
              </div>
            </div>
          )}

          {/* Footer - Clean & Professional */}
          <div className="px-8 pb-8 pt-6 bg-gradient-to-r from-gray-50 to-slate-50 border-t border-gray-200 lg:flex lg:justify-between lg:items-center">
            <div className="text-center lg:text-left mb-6 lg:mb-0">
              <p className="text-sm text-gray-600">
                Verified instantly by AchievR's secure certificate registry
              </p>
            </div>
            <a 
              href="/" 
              className="inline-flex items-center gap-2 px-8 py-3 bg-white shadow-lg hover:shadow-xl border border-gray-200 text-gray-900 font-semibold rounded-2xl transition-all hover:bg-gray-50 text-sm lg:text-base"
            >
              ← Back to AchievR
            </a>
          </div>
        </div>
      </main>
    </div>
  );
}

// Loading Component
function LoadingState({ certId }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-slate-100 flex items-center justify-center p-8">
      <div className="text-center max-w-lg bg-white/80 backdrop-blur rounded-3xl p-12 shadow-2xl border border-gray-200">
        <div className="w-24 h-24 border-4 border-gray-200 border-t-orange-500 rounded-2xl animate-spin mx-auto mb-8 shadow-xl"></div>
        <h2 className="text-3xl font-bold text-gray-900 mb-4">Verifying Certificate</h2>
        <p className="text-xl text-gray-700 mb-8">Checking authenticity with AchievR...</p>
        <div className="font-mono text-lg bg-gray-100 px-6 py-4 rounded-2xl inline-block shadow-lg tracking-wide">
          {certId}
        </div>
      </div>
    </div>
  );
}