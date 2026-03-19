import { useState } from 'react';
import SkillSelector from '../components/SkillSelector';
import { Upload, CheckCircle2, AlertCircle, Loader, GraduationCap, FileText } from 'lucide-react';
import apiClient from '../api/apiClient';


export default function SubmitActivity() {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'Technical',
    eventDate: '',
    organizingBody: '',
    achievementLevel: 'College'
  });

  const [selectedSkills, setSelectedSkills] = useState({
    technicalSkills: [],
    softSkills: [],
    tools: []
  });

  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [dragActive, setDragActive] = useState(false);


  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setFile(e.dataTransfer.files[0]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (
      selectedSkills.technicalSkills.length === 0 &&
      selectedSkills.softSkills.length === 0 &&
      selectedSkills.tools.length === 0
    ) {
      setError('Please select at least one skill');
      return;
    }

    setLoading(true);

    const formDataObj = new FormData();
    Object.keys(formData).forEach((key) => {
      formDataObj.append(key, formData[key]);
    });

    formDataObj.append(
      'selectedTechnicalSkills',
      JSON.stringify(selectedSkills.technicalSkills)
    );
    formDataObj.append('selectedSoftSkills', JSON.stringify(selectedSkills.softSkills));
    formDataObj.append('selectedTools', JSON.stringify(selectedSkills.tools));

    if (file) {
      formDataObj.append('document', file);
    }

    try {
      const response = await apiClient.post('/activities/submit', formDataObj, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'multipart/form-data'
        }
      });

      setSuccess(true);
      setTimeout(() => {
        window.location.href = '/dashboard';
      }, 2000);
    } catch (err) {
      setError(err.response?.data?.error || 'Error submitting activity');
    } finally {
      setLoading(false);
    }
  };

    return (
      <div className="min-h-screen bg-gradient-to-br from-white via-orange-50/20 to-white">
        {/* Header Section */}
        <div className="border-b border-gray-100 bg-gradient-to-b from-white to-orange-50/30 sticky top-0 z-40">
          <div className="max-w-6xl mx-auto px-4 sm:px-8 py-4 sm:py-6">
            <div className="flex items-center gap-3 mb-2 sm:mb-4">
              <div className="bg-gradient-to-br from-orange-600 to-orange-500 p-2 sm:p-3 rounded-xl shadow-lg flex-shrink-0">
                <GraduationCap size={22} className="text-white sm:hidden" />
                <GraduationCap size={28} className="text-white hidden sm:block" />
              </div>

              <div>
                <h1 className="text-2xl sm:text-4xl font-light text-gray-900">Submit Achievement</h1>
                <p className="text-gray-500 font-light mt-0.5 sm:mt-1 text-sm sm:text-base">
                  Document your accomplishments and verify them instantly
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-6xl mx-auto px-4 sm:px-8 py-6 sm:py-12">

          {/* Success Alert */}
          {success && (
            <div className="mb-6 sm:mb-8 bg-green-50 border-2 border-green-300 rounded-xl p-4 sm:p-6 flex items-start gap-3 sm:gap-4 animate-fadeInUp">
              <CheckCircle2 size={24} className="text-green-600 flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-semibold text-green-900 text-base sm:text-lg">Activity Submitted Successfully!</h3>
                <p className="text-green-700 font-light mt-1 text-sm sm:text-base">Redirecting to dashboard...</p>
              </div>
            </div>
          )}

          {/* Error Alert */}
          {error && (
            <div className="mb-6 sm:mb-8 bg-red-50 border-2 border-red-300 rounded-xl p-4 sm:p-6 flex items-start gap-3 sm:gap-4 animate-fadeInUp">
              <AlertCircle size={24} className="text-red-600 flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-semibold text-red-900 text-base sm:text-lg">Submission Error</h3>
                <p className="text-red-700 font-light mt-1 text-sm sm:text-base">{error}</p>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6 sm:space-y-8">

            {/* Activity Details Section */}
            <div className="bg-white p-5 sm:p-8 rounded-2xl border-2 border-gray-100 shadow-lg hover:shadow-xl transition duration-300">

              <div className="flex items-center gap-3 mb-6 sm:mb-8">
                <div className="bg-gradient-to-br from-orange-600 to-orange-500 p-2 sm:p-3 rounded-lg flex-shrink-0">
                  <FileText size={20} className="text-white sm:hidden" />
                  <FileText size={24} className="text-white hidden sm:block" />
                </div>

                <div>
                  <h2 className="text-xl sm:text-2xl font-light text-gray-900">Activity Details</h2>
                  <p className="text-gray-500 font-light text-xs sm:text-sm mt-0.5 sm:mt-1">
                    Share the details of your achievement
                  </p>
                </div>
              </div>

              <div className="space-y-5 sm:space-y-6">

                {/* Title */}
                <div>
                  <label className="block text-gray-700 font-normal mb-2 sm:mb-3 text-sm sm:text-base">
                    Achievement Title *
                  </label>

                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    placeholder="e.g., Won State Level Hackathon"
                    className="w-full px-4 sm:px-5 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 font-light transition text-sm sm:text-base"
                    required
                  />
                </div>

                {/* Description */}
                <div>
                  <label className="block text-gray-700 font-normal mb-2 sm:mb-3 text-sm sm:text-base">
                    Detailed Description *
                  </label>

                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    placeholder="Describe your achievement in detail including your role, impact, and outcomes..."
                    className="w-full px-4 sm:px-5 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 font-light h-36 sm:h-40 resize-none transition text-sm sm:text-base"
                    required
                  />
                </div>

                {/* Category & Date */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">

                  <div>
                    <label className="block text-gray-700 font-normal mb-2 sm:mb-3 text-sm sm:text-base">
                      Category *
                    </label>

                    <select
                      name="category"
                      value={formData.category}
                      onChange={handleChange}
                      className="w-full px-4 sm:px-5 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 font-light bg-white cursor-pointer transition text-sm sm:text-base"
                    >
                      <option>Technical</option>
                      <option>Sports</option>
                      <option>Cultural</option>
                      <option>Volunteering</option>
                      <option>Internship</option>
                      <option>Leadership</option>
                      <option>Academic</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-gray-700 font-normal mb-2 sm:mb-3 text-sm sm:text-base">
                      Event Date *
                    </label>

                    <input
                      type="date"
                      name="eventDate"
                      value={formData.eventDate}
                      onChange={handleChange}
                      className="w-full px-4 sm:px-5 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 font-light bg-white transition text-sm sm:text-base"
                      required
                    />
                  </div>
                </div>

                {/* Organizing Body */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">

                  <div>
                    <label className="block text-gray-700 font-normal mb-2 sm:mb-3 text-sm sm:text-base">
                      Organizing Body
                    </label>

                    <input
                      type="text"
                      name="organizingBody"
                      value={formData.organizingBody}
                      onChange={handleChange}
                      placeholder="e.g., Government of India, IEEE"
                      className="w-full px-4 sm:px-5 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 font-light transition text-sm sm:text-base"
                    />
                  </div>

                  <div>
                    <label className="block text-gray-700 font-normal mb-2 sm:mb-3 text-sm sm:text-base">
                      Achievement Level
                    </label>

                    <select
                      name="achievementLevel"
                      value={formData.achievementLevel}
                      onChange={handleChange}
                      className="w-full px-4 sm:px-5 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 font-light bg-white cursor-pointer transition text-sm sm:text-base"
                    >
                      <option>College</option>
                      <option>University</option>
                      <option>State</option>
                      <option>National</option>
                      <option>International</option>
                    </select>
                  </div>
                </div>

                {/* File Upload */}
                <div>
                  <label className="block text-gray-700 font-normal mb-2 sm:mb-3 text-sm sm:text-base">
                    Proof Document (Optional)
                  </label>

                  <div
                    onDragEnter={handleDrag}
                    onDragLeave={handleDrag}
                    onDragOver={handleDrag}
                    onDrop={handleDrop}
                    className={`border-2 border-dashed rounded-2xl p-6 sm:p-8 text-center transition duration-300 cursor-pointer group ${dragActive
                      ? 'border-orange-500 bg-orange-50'
                      : 'border-gray-300 bg-gray-50 hover:border-orange-400 hover:bg-orange-50/50'
                      }`}
                  >
                    <input
                      type="file"
                      onChange={handleFileChange}
                      className="hidden"
                      id="file-input"
                      accept=".pdf,.jpg,.png,.jpeg"
                    />

                    <label htmlFor="file-input" className="cursor-pointer block">

                      {file ? (
                        <div className="flex items-center justify-center gap-3">
                          <CheckCircle2 size={28} className="text-green-600 flex-shrink-0" />
                          <div className="text-left min-w-0">
                            <p className="text-green-700 font-normal text-base sm:text-lg truncate">{file.name}</p>
                            <p className="text-sm text-green-600 font-light">Click to change file</p>
                          </div>
                        </div>
                      ) : (
                        <div>
                          <Upload size={36} className="mx-auto text-orange-500 mb-3 group-hover:scale-110 transition sm:hidden" />
                          <Upload size={40} className="mx-auto text-orange-500 mb-3 group-hover:scale-110 transition hidden sm:block" />
                          <p className="text-gray-700 font-normal text-base sm:text-lg">
                            Click to upload or drag & drop
                          </p>
                          <p className="text-xs sm:text-sm text-gray-500 font-light mt-2">
                            PDF, JPG, PNG (max 10MB)
                          </p>
                        </div>
                      )}

                    </label>
                  </div>
                </div>

              </div>
            </div>

            {/* Skills Section */}
            <div className="bg-white p-5 sm:p-8 rounded-2xl border-2 border-gray-100 shadow-lg hover:shadow-xl transition duration-300">

              <div className="flex items-center gap-3 mb-6 sm:mb-8">
                <div className="bg-gradient-to-br from-orange-600 to-orange-500 p-2 sm:p-3 rounded-lg flex-shrink-0">
                  <Loader size={20} className="text-white sm:hidden" />
                  <Loader size={24} className="text-white hidden sm:block" />
                </div>

                <div>
                  <h2 className="text-xl sm:text-2xl font-light text-gray-900">Select Your Skills</h2>
                  <p className="text-gray-500 font-light text-xs sm:text-sm mt-0.5 sm:mt-1">
                    Choose all skills that apply to this achievement
                  </p>
                </div>
              </div>

              <div className="bg-orange-50/50 border-2 border-orange-200 rounded-xl p-4 sm:p-6 mb-6">
                <p className="text-orange-900 font-normal text-xs sm:text-sm">
                  ✨ Selecting relevant skills helps institutions evaluate your qualifications and verify achievements more accurately.
                </p>
              </div>

              <SkillSelector
                selectedSkills={selectedSkills}
                setSelectedSkills={setSelectedSkills}
              />
            </div>

            {/* Submit */}
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">

              <button
                type="submit"
                disabled={loading}
                className="flex-1 bg-gradient-to-r from-orange-600 to-orange-500 hover:from-orange-700 hover:to-orange-600 disabled:from-gray-400 disabled:to-gray-400 text-white py-4 rounded-xl font-normal text-base sm:text-lg transition duration-300 shadow-lg shadow-orange-500/30 hover:shadow-orange-500/50 disabled:shadow-none flex items-center justify-center gap-3 group"
              >
                {loading ? (
                  <>
                    <div className="animate-spin">
                      <Loader size={20} />
                    </div>
                    Submitting...
                  </>
                ) : (
                  <>
                    <Upload size={20} />
                    Submit Achievement for Verification
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={() => window.history.back()}
                className="w-full sm:w-auto px-8 py-4 border-2 border-gray-300 text-gray-600 hover:border-gray-400 hover:bg-gray-50 font-normal rounded-xl transition duration-300 text-base"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>

        {/* Animations */}
        <style>{`
      @keyframes fadeInUp {
        from { opacity: 0; transform: translateY(20px); }
        to { opacity: 1; transform: translateY(0); }
      }
      .animate-fadeInUp { animation: fadeInUp 0.5s ease-out; }
    `}</style>
      </div>
    );
  }
