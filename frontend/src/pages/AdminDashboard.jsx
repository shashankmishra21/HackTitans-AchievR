import { useState, useEffect } from 'react';
import apiClient from '../api/apiClient';
import { Award, CheckCircle, FileCheck, Loader, AlertCircle, TrendingUp, RefreshCw } from 'lucide-react';
import Footer from '../components/Footer';

export default function AdminDashboard() {

  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [certifying, setCertifying] = useState(null);
  const [stats, setStats] = useState({
    total: 0,
    approved: 0,
    certified: 0,
    pending: 0,
    rate: 0
  });
  const [searchTerm, setSearchTerm] = useState('');


  useEffect(() => {
    fetchApprovedActivities();
  }, []);


  const fetchApprovedActivities = async () => {
    try {
      setLoading(true);
      const response = await apiClient.get('/activities/admin/approved');

      const activitiesList = response.data.activities || [];
      setActivities(activitiesList);

      const certified = activitiesList.filter(a => a.certificateId).length;
      const pending = activitiesList.length - certified;
      const rate = activitiesList.length > 0 ? Math.round((certified / activitiesList.length) * 100) : 0;

      setStats({
        total: activitiesList.length,
        approved: activitiesList.length,
        certified,
        pending,
        rate
      });

    } catch (error) {
      alert('Error loading activities: ' + error.message);
    } finally {
      setLoading(false);
    }
  };


  const handleGenerateCertificate = async (activity) => {
    if (!activity || !activity._id) {
      alert('Invalid activity');
      return;
    }
    setCertifying(activity._id);

    try {
      await apiClient.post(`/certificates/generate/${activity._id}`);
      alert("Certificate Generated Successfully");
      fetchApprovedActivities();
    } catch (error) {
      alert(error.response?.data?.error || "Failed to generate certificate");
    } finally {
      setCertifying(null);
    }
  };


  const filteredActivities = activities
    .filter(a => a?.student)
    .filter(activity => {
      const title = activity.title ? activity.title.toLowerCase() : '';
      const studentName = activity.student?.name ? activity.student.name.toLowerCase() : '';
      return title.includes(searchTerm.toLowerCase()) || studentName.includes(searchTerm.toLowerCase());
    })
    .sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));


  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gradient-to-br from-gray-50 to-white">
        <div className="text-center">
          <Loader className="w-12 h-12 text-orange-600 animate-spin mx-auto mb-4" />
          <p className="text-lg text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 ">
      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-6 sm:py-12">

        {/* Header */}
        <div className="mb-8 sm:mb-12 flex items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-6xl font-normal text-gray-900 mb-1 sm:mb-3">
              Admin Dashboard
            </h1>
            <p className="text-gray-600 font-light text-sm sm:text-base mt-1 sm:mt-2">
              Manage & certify approved activities
            </p>
          </div>
          <button
            onClick={fetchApprovedActivities}
            className="flex items-center gap-2 px-3 sm:px-4 py-2 bg-white border-2 border-gray-200 rounded-lg hover:border-orange-400 transition text-sm sm:text-base font-light text-gray-900 whitespace-nowrap flex-shrink-0"
          >
            <RefreshCw className="w-4 h-4" /> Refresh
          </button>
        </div>

        {/* Stat Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6 sm:mb-8">
          <StatCard
            label="Total Activities"
            value={stats.total}
            color="from-blue-500 to-blue-600"
          />
          <StatCard
            label="Pending"
            value={stats.pending}
            color="from-yellow-500 to-yellow-600"
          />
          <StatCard
            label="Certified"
            value={stats.certified}
            color="from-green-500 to-green-600"
          />
          <StatCard
            label="Rate"
            value={`${stats.rate}%`}
            color="from-purple-500 to-purple-600"
          />
        </div>

        {/* Search Bar */}
        <div className="mb-4 sm:mb-6 bg-white p-3 sm:p-4 rounded-xl border-2 border-gray-200">
          <input
            type="text"
            placeholder="Search by student or activity..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-orange-400 focus:outline-none font-medium text-sm sm:text-base"
          />
        </div>

        {/* Activities Section */}
        <div className="bg-white border-2 border-gray-200 rounded-xl shadow-xl overflow-hidden">

          {/* Section Header */}
          <div className="p-4 sm:p-6 border-b-2 border-gray-200 bg-gradient-to-r from-orange-50 to-white">
            <div className="flex items-center gap-2 sm:gap-3">
              <FileCheck className="w-5 h-5 sm:w-6 sm:h-6 text-orange-600 flex-shrink-0" />
              <h2 className="text-lg sm:text-2xl font-light text-gray-900">Approved Activities</h2>
              <span className="px-2 sm:px-3 py-1 bg-orange-100 text-orange-700 text-xs sm:text-sm font-bold rounded-full">
                {filteredActivities.length}
              </span>
            </div>
          </div>

          {filteredActivities.length === 0 ? (
            <div className="p-8 sm:p-12 text-center">
              <div className="flex flex-col items-center">
                <CheckCircle className="w-10 h-10 sm:w-12 sm:h-12 text-green-600 mb-4" />
                <p className="text-base sm:text-lg text-gray-700 font-semibold">All activities certified!</p>
                <p className="text-xs sm:text-sm text-gray-600">No pending certifications</p>
              </div>
            </div>
          ) : (
            <>
              {/* ── MOBILE CARD LIST (below md) ── */}
              <div className="md:hidden divide-y divide-gray-200">
                {filteredActivities.map((activity, index) => (
                  <div key={activity._id || index} className="p-4 bg-white hover:bg-orange-50 transition">

                    {/* Top row: name + Generate button */}
                    <div className="flex items-start justify-between gap-3 mb-3">
                      <div className="min-w-0">
                        <p className="font-semibold text-gray-900 text-sm leading-tight">
                          {activity.student.name || 'N/A'}
                        </p>
                        <p className="text-xs text-gray-500 mt-0.5 truncate">
                          {activity.student.email || 'N/A'}
                        </p>
                      </div>
                      <button
                        onClick={() => handleGenerateCertificate(activity)}
                        disabled={certifying === activity._id || !!activity.certificateId}
                        className="flex-shrink-0 inline-flex items-center gap-1.5 px-3 py-2 bg-gradient-to-r from-orange-600 to-orange-500 text-white hover:from-orange-700 hover:to-orange-600 disabled:from-gray-400 disabled:to-gray-400 transition rounded-lg text-xs font-bold whitespace-nowrap"
                      >
                        {certifying === activity._id ? (
                          <>
                            <Loader className="w-3 h-3 animate-spin" />
                            Sending...
                          </>
                        ) : activity.certificateId ? (
                          <>
                            <CheckCircle className="w-3 h-3" />
                            Done
                          </>
                        ) : (
                          <>
                            <Award className="w-3 h-3" />
                            Generate
                          </>
                        )}
                      </button>
                    </div>

                    {/* Activity title */}
                    <p className="text-sm font-medium text-gray-800 mb-3 leading-snug">
                      {activity.title || 'N/A'}
                    </p>

                    {/* Bottom row: badges */}
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="px-2 py-0.5 bg-orange-100 text-orange-700 text-xs font-bold rounded-full">
                        {activity.category || 'N/A'}
                      </span>
                      <span className="px-2 py-0.5 bg-indigo-100 text-indigo-700 text-xs font-bold rounded-full">
                        {activity.achievementLevel || 'N/A'}
                      </span>
                      <span className={`px-2 py-0.5 text-xs font-bold rounded-full ${activity.certificateId
                        ? 'bg-green-100 text-green-700'
                        : 'bg-yellow-100 text-yellow-700'}`}>
                        {activity.certificateId ? 'Certified' : 'Pending'}
                      </span>
                    </div>

                  </div>
                ))}
              </div>

              {/* ── DESKTOP TABLE (md and above) ── */}
              <div className="hidden md:block overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b-2 border-gray-200">
                    <tr>
                      <th className="p-4 text-left text-xs font-semibold text-gray-700 uppercase">Student</th>
                      <th className="p-4 text-left text-xs font-semibold text-gray-700 uppercase">Activity</th>
                      <th className="p-4 text-left text-xs font-semibold text-gray-700 uppercase">Category</th>
                      <th className="p-4 text-left text-xs font-semibold text-gray-700 uppercase">Level</th>
                      <th className="p-4 text-left text-xs font-semibold text-gray-700 uppercase">Status</th>
                      <th className="p-4 text-left text-xs font-semibold text-gray-700 uppercase">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredActivities.map((activity, index) => (
                      <tr
                        key={activity._id || index}
                        className={`border-b border-gray-200 hover:bg-orange-50 transition ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}
                      >
                        <td className="p-4">
                          <div className="font-semibold text-gray-900">{activity.student.name || 'N/A'}</div>
                          <div className="text-xs text-gray-600">{activity.student.email || 'N/A'}</div>
                        </td>
                        <td className="p-4">
                          <div className="font-medium text-gray-900 truncate max-w-xs">
                            {activity.title || 'N/A'}
                          </div>
                        </td>
                        <td className="p-4">
                          <span className="px-3 py-1 bg-orange-100 text-orange-700 text-xs font-bold rounded-full">
                            {activity.category || 'N/A'}
                          </span>
                        </td>
                        <td className="p-4">
                          <span className="px-3 py-1 bg-indigo-100 text-indigo-700 text-xs font-bold rounded-full">
                            {activity.achievementLevel || 'N/A'}
                          </span>
                        </td>
                        <td className="p-4">
                          <span className={`px-3 py-1 text-xs font-bold rounded-full ${activity.certificateId
                            ? 'bg-green-100 text-green-700'
                            : 'bg-yellow-100 text-yellow-700'}`}>
                            {activity.certificateId ? 'Certified' : 'Pending'}
                          </span>
                        </td>
                        <td className="p-4">
                          <button
                            onClick={() => handleGenerateCertificate(activity)}
                            disabled={certifying === activity._id || !!activity.certificateId}
                            className="inline-flex items-center gap-1 px-3 py-2 bg-gradient-to-r from-orange-600 to-orange-500 text-white hover:from-orange-700 hover:to-orange-600 disabled:from-gray-400 disabled:to-gray-400 transition rounded-lg text-sm font-bold whitespace-nowrap"
                          >
                            {certifying === activity._id ? (
                              <>
                                <Loader className="w-3 h-3 animate-spin" />
                                Sending...
                              </>
                            ) : activity.certificateId ? (
                              <>
                                <CheckCircle className="w-3 h-3" />
                                Done
                              </>
                            ) : (
                              <>
                                <Award className="w-3 h-3" />
                                Generate
                              </>
                            )}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}
        </div>

      </div>
      <Footer />
    </div>

  );
}

function StatCard({ label, value, icon, color }) {
  return (
    <div className={`bg-gradient-to-br ${color} text-white rounded-xl p-4 sm:p-6 shadow-lg hover:shadow-xl transition`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs sm:text-sm opacity-90 font-light">{label}</p>
          <p className="text-2xl sm:text-4xl font-bold mt-1 sm:mt-2">{value}</p>
        </div>
        <div className="opacity-20 text-4xl sm:text-6xl">{icon}</div>
      </div>
    </div>
  );
}