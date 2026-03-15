import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  ShieldCheck, 
  Calendar, 
  MapPin, 
  Users, 
  Award, 
  Download, 
  Share2,
  ExternalLink 
} from 'lucide-react';

const BACKEND_URL = 'http://localhost:5000';

export default function RecruiterPortfolio() {
  const { slug } = useParams();
  const [portfolio, setPortfolio] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch(`${BACKEND_URL}/api/recruiter/profile/${slug}`)
      .then(res => {
        if (!res.ok) throw new Error('Profile not found');
        return res.json();
      })
      .then(data => {
        setPortfolio(data);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-orange-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
          <p className="text-xl font-medium text-gray-600">Loading portfolio...</p>
        </div>
      </div>
    );
  }

  if (error || !portfolio?.success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-orange-50 flex items-center justify-center">
        <div className="max-w-md text-center p-8 bg-white rounded-3xl shadow-2xl">
          <ShieldCheck className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Portfolio Not Found</h1>
          <p className="text-gray-600 mb-6">This profile doesn't exist or has no verified achievements.</p>
          <Link 
            to="/" 
            className="inline-flex items-center gap-2 px-6 py-3 bg-orange-500 text-white font-semibold rounded-2xl hover:bg-orange-600 transition-all"
          >
            <span>← Back to AchievR</span>
          </Link>
        </div>
      </div>
    );
  }

  const { stats, student, topSkills, timeline } = portfolio;

  // Copy to clipboard
  const copyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    // Visual feedback (add toast later)
    console.log('Copied:', window.location.href);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-orange-50 to-rose-50">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-md border-b border-orange-100 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center gap-2 font-bold text-xl bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent">
              AchievR
            </Link>
            <button
              onClick={copyLink}
              className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-orange-500 to-red-500 text-white font-semibold rounded-2xl hover:shadow-lg hover:scale-105 transition-all duration-200"
            >
              <Share2 size={18} />
              Share Profile
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-12">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-3 bg-gradient-to-r from-orange-500 to-red-500 text-white px-8 py-4 rounded-3xl shadow-2xl mb-6">
            <ShieldCheck size={28} />
            <div>
              <h1 className="text-4xl font-bold leading-tight">{student.name}</h1>
              <p className="text-xl opacity-90">{student.rollNumber} • {student.department}</p>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-2xl mx-auto">
            <div className="bg-white/70 backdrop-blur p-8 rounded-3xl shadow-xl border border-orange-100 hover:shadow-2xl transition-all">
              <div className="flex items-center gap-3 mb-2">
                <Award className="w-10 h-10 text-orange-500" />
                <h3 className="text-2xl font-bold text-gray-900">{stats.totalCertificates}</h3>
              </div>
              <p className="text-gray-600 font-medium">Verified Certificates</p>
            </div>
            <div className="bg-white/70 backdrop-blur p-8 rounded-3xl shadow-xl border border-blue-100 hover:shadow-2xl transition-all">
              <div className="flex items-center gap-3 mb-2">
                <Users className="w-10 h-10 text-blue-500" />
                <h3 className="text-2xl font-bold text-gray-900">{stats.totalVerifications}</h3>
              </div>
              <p className="text-gray-600 font-medium">Total Verifications</p>
            </div>
            <div className="bg-white/70 backdrop-blur p-8 rounded-3xl shadow-xl border border-green-100 hover:shadow-2xl transition-all">
              <div className="flex items-center gap-3 mb-2">
                <Calendar className="w-10 h-10 text-green-500" />
                <h3 className="text-2xl font-bold text-gray-900">{student.year}</h3>
              </div>
              <p className="text-gray-600 font-medium">Batch of {student.year}</p>
            </div>
          </div>
        </div>

        {/* Skills Cloud */}
        {topSkills.technical.length > 0 && (
          <section className="mb-20">
            <h2 className="text-3xl font-bold text-gray-900 mb-12 text-center">Mastered Skills</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {topSkills.technical.map((skill, idx) => (
                <div 
                  key={skill} 
                  className="group p-6 bg-gradient-to-br from-orange-500/10 to-red-500/10 border border-orange-200 rounded-2xl hover:shadow-xl hover:scale-105 transition-all cursor-default"
                >
                  <h4 className="font-bold text-xl text-gray-900 group-hover:text-orange-600 mb-2">
                    {skill}
                  </h4>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-gradient-to-r from-orange-500 to-red-500 h-2 rounded-full transition-all"
                      style={{ width: `${Math.min(90, 40 + idx * 5)}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Achievements Timeline */}
        <section>
          <h2 className="text-3xl font-bold text-gray-900 mb-12 flex items-center gap-3 justify-center">
            <Award className="w-10 h-10 text-orange-500" />
            Verified Achievements
          </h2>

          <div className="grid gap-8">
            {timeline.slice(0, 12).map((achievement, idx) => (
              <div 
                key={idx}
                className="group bg-white/70 backdrop-blur border border-gray-200 rounded-3xl p-8 hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 overflow-hidden"
              >
                <div className="flex items-start gap-6 mb-6">
                  <div className="flex flex-col items-center w-16 flex-shrink-0 -mt-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-red-500 rounded-2xl flex items-center justify-center shadow-lg">
                      <Award className="w-6 h-6 text-white" />
                    </div>
                    <div className="w-px h-20 bg-gradient-to-b from-orange-500/50 to-transparent mt-2" />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between mb-3">
                      <h3 className="text-2xl font-bold text-gray-900 group-hover:text-orange-600 pr-4 min-w-0 truncate">
                        {achievement.title}
                      </h3>
                      <div className="flex items-center gap-2 ml-4">
                        <span className="px-3 py-1 bg-green-100 text-green-800 text-xs font-bold rounded-full">
                          {achievement.verifications} ✓
                        </span>
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 mb-6">
                      <span className="flex items-center gap-1">
                        <MapPin size={14} />
                        {achievement.level} • {achievement.category}
                      </span>
                      <span className="flex items-center gap-1">
                        <Calendar size={14} />
                        {new Date(achievement.eventDate).toLocaleDateString()}
                      </span>
                      {achievement.organizer && (
                        <span className="flex items-center gap-1 truncate max-w-[200px]">
                          {achievement.organizer}
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-4 pt-4 border-t border-gray-200">
                      <a
                        href={achievement.verifyUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-orange-500 to-red-500 text-white font-semibold rounded-2xl hover:shadow-lg hover:scale-105 transition-all group/link"
                      >
                        <ShieldCheck size={18} />
                        View Certificate
                        <ExternalLink size={16} className="group-hover:translate-x-1 transition-transform" />
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {timeline.length > 12 && (
            <div className="text-center mt-12">
              <p className="text-gray-500 text-lg">
                +{timeline.length - 12} more achievements
              </p>
            </div>
          )}
        </section>
      </div>

      {/* Footer */}
      <div className="border-t border-gray-200 mt-24 pt-12">
        <div className="max-w-6xl mx-auto px-6 text-center text-gray-500">
          <p className="mb-4">
            Verified achievements trusted by top recruiters • Powered by AchievR
          </p>
          <div className="flex items-center justify-center gap-6 text-sm">
            <Link to="/" className="hover:text-orange-500 transition-colors">AchievR Home</Link>
            <span>•</span>
            <a href="mailto:hello@achievr.in" className="hover:text-orange-500 transition-colors">Contact</a>
          </div>
        </div>
      </div>
    </div>
  );
}