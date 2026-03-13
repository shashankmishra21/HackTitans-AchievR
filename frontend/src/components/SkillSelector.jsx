import { useState } from 'react';
import { X, Plus } from 'lucide-react';

const SKILLS_CATALOG = {
  technicalSkills: [
    'React', 'Node.js', 'Python', 'JavaScript', 'TypeScript', 'MongoDB',
    'SQL', 'AWS', 'Docker', 'Git', 'REST APIs', 'GraphQL', 'Machine Learning',
    'Data Analysis', 'DevOps', 'Java', 'C++', 'Go', 'Kubernetes', 'PostgreSQL',
    'Redis', 'Firebase', 'Next.js', 'Vue.js', 'Angular'
  ],
  softSkills: [
    'Leadership', 'Teamwork', 'Communication', 'Problem Solving',
    'Time Management', 'Project Management', 'Presentation Skills',
    'Decision Making', 'Adaptability', 'Creativity', 'Critical Thinking',
    'Mentoring', 'Conflict Resolution', 'Negotiation', 'Public Speaking'
  ],
  tools: [
    'Git/GitHub', 'VS Code', 'Postman', 'Docker', 'Jenkins', 'Figma',
    'Jira', 'Slack', 'AWS', 'Google Cloud', 'Azure', 'Webpack',
    'Babel', 'NPM', 'Linux', 'MySQL Workbench', 'MongoDB Atlas',
    'Firebase Console', 'Vercel', 'Heroku', 'DataGrip'
  ]
};

export default function SkillSelector({ selectedSkills, setSelectedSkills }) {
  const [customInputs, setCustomInputs] = useState({
    technicalSkills: '',
    softSkills: '',
    tools: ''
  });

  const [expandedCategories, setExpandedCategories] = useState({
    technicalSkills: false,
    softSkills: false,
    tools: false
  });

  const toggleSkill = (skillType, skill) => {
    setSelectedSkills(prev => ({
      ...prev,
      [skillType]: prev[skillType].includes(skill)
        ? prev[skillType].filter(s => s !== skill)
        : [...prev[skillType], skill]
    }));
  };

  const addCustomSkill = (skillType) => {
    const inputValue = customInputs[skillType].trim();

    if (!inputValue) {
      return;
    }

    // Check if skill already exists
    if (selectedSkills[skillType].includes(inputValue)) {
      alert('This skill is already added!');
      return;
    }

    // Add the custom skill
    setSelectedSkills(prev => ({
      ...prev,
      [skillType]: [...prev[skillType], inputValue]
    }));

    // Clear the input
    setCustomInputs(prev => ({
      ...prev,
      [skillType]: ''
    }));
  };

  const removeSkill = (skillType, skill) => {
    setSelectedSkills(prev => ({
      ...prev,
      [skillType]: prev[skillType].filter(s => s !== skill)
    }));
  };

  const handleKeyPress = (e, skillType) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addCustomSkill(skillType);
    }
  };

  const toggleCategory = (skillType) => {
    setExpandedCategories(prev => ({
      ...prev,
      [skillType]: !prev[skillType]
    }));
  };

  const renderSkillCategory = (skillType, title, icon, color, bgColor, borderColor) => {
    const isExpanded = expandedCategories[skillType];
    const displaySkills = isExpanded
      ? SKILLS_CATALOG[skillType]
      : SKILLS_CATALOG[skillType].slice(0, 6);

    return (
      <div className="border-2 border-gray-200 rounded-2xl p-6 hover:border-orange-400 transition duration-300">
        {/* Category Header */}
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
            <span>{icon}</span>
            {title}
          </h3>
          <span className="text-sm font-semibold text-white bg-orange-600 px-3 py-1 rounded-full">
            {selectedSkills[skillType].length}
          </span>
        </div>

        {/* Predefined Skills Grid */}
        <div className="mb-6">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mb-3">
            {displaySkills.map(skill => (
              <label
                key={skill}
                className={`flex items-center p-3 border-2 rounded-lg cursor-pointer transition duration-300 ${selectedSkills[skillType].includes(skill)
                  ? `${borderColor} ${bgColor}`
                  : 'border-gray-200 hover:border-orange-300 hover:bg-orange-50'
                  }`}
              >
                <input
                  type="checkbox"
                  checked={selectedSkills[skillType].includes(skill)}
                  onChange={() => toggleSkill(skillType, skill)}
                  className={`w-4 h-4 ${color} cursor-pointer`}
                />
                <span className="ml-2 text-sm text-gray-900 font-medium">{skill}</span>
              </label>
            ))}
          </div>

          {/* Show More/Less Button */}
          {SKILLS_CATALOG[skillType].length > 6 && (
            <button
              onClick={() => toggleCategory(skillType)}
              className="text-sm font-semibold text-orange-600 hover:text-orange-700 transition duration-300 mb-3"
            >
              {isExpanded ? '− Show Less' : '+ Show More'}
            </button>
          )}
        </div>

        {/* Custom Skill Input */}
        <div className="border-t-2 border-gray-100 pt-4">
          <label className="block text-sm font-semibold text-gray-900 mb-3">
            Add Custom {title}
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              value={customInputs[skillType]}
              onChange={(e) => setCustomInputs(prev => ({
                ...prev,
                [skillType]: e.target.value
              }))}
              onKeyPress={(e) => handleKeyPress(e, skillType)}
              placeholder={`Type a custom ${title.toLowerCase()} and press Enter...`}
              className="flex-1 px-4 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-orange-500 text-sm font-medium transition duration-300"
            />
            <button
              onClick={() => addCustomSkill(skillType)}
              className={`px-4 py-2 ${color} text-white font-semibold rounded-lg hover:opacity-90 transition duration-300 flex items-center gap-1`}
            >
              <Plus size={16} />
              Add
            </button>
          </div>
          <p className="text-xs text-gray-500 mt-2">Press Enter or click Add button to add custom skill</p>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-8">
      {/* Technical Skills */}
      {renderSkillCategory(
        'technicalSkills',
        'Technical Skills',
        '',
        'text-blue-600',
        'bg-blue-50',
        'border-blue-500'
      )}

      {/* Soft Skills */}
      {renderSkillCategory(
        'softSkills',
        'Soft Skills',
        '',
        'text-purple-600',
        'bg-purple-50',
        'border-purple-500'
      )}

      {/* Tools */}
      {renderSkillCategory(
        'tools',
        'Tools & Platforms',
        '',
        'text-orange-600',
        'bg-orange-50',
        'border-orange-500'
      )}

      {/* Selected Skills Summary */}
      {(selectedSkills.technicalSkills.length > 0 || selectedSkills.softSkills.length > 0 || selectedSkills.tools.length > 0) && (
        <div className="p-6 bg-gradient-to-br from-green-50 to-white border-2 border-green-300 rounded-2xl">
          <h4 className="font-bold text-lg text-gray-900 mb-4 flex items-center gap-2">
            Selected Skills Summary
            <span className="text-sm bg-green-600 text-white px-3 py-1 rounded-full font-semibold">
              {selectedSkills.technicalSkills.length + selectedSkills.softSkills.length + selectedSkills.tools.length}
            </span>
          </h4>

          {/* Technical Skills Selected */}
          {selectedSkills.technicalSkills.length > 0 && (
            <div className="mb-4">
              <p className="text-xs font-semibold text-blue-600 uppercase mb-2">Technical ({selectedSkills.technicalSkills.length})</p>
              <div className="flex flex-wrap gap-2">
                {selectedSkills.technicalSkills.map(skill => (
                  <div
                    key={skill}
                    className="bg-blue-500 text-white px-4 py-2 rounded-full text-sm font-semibold flex items-center gap-2 hover:bg-blue-600 transition duration-300"
                  >
                    {skill}
                    <button
                      onClick={() => removeSkill('technicalSkills', skill)}
                      className="hover:bg-blue-700 rounded-full p-1 transition"
                      title="Remove"
                    >
                      <X size={14} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Soft Skills Selected */}
          {selectedSkills.softSkills.length > 0 && (
            <div className="mb-4">
              <p className="text-xs font-semibold text-purple-600 uppercase mb-2">Soft Skills ({selectedSkills.softSkills.length})</p>
              <div className="flex flex-wrap gap-2">
                {selectedSkills.softSkills.map(skill => (
                  <div
                    key={skill}
                    className="bg-purple-500 text-white px-4 py-2 rounded-full text-sm font-semibold flex items-center gap-2 hover:bg-purple-600 transition duration-300"
                  >
                    {skill}
                    <button
                      onClick={() => removeSkill('softSkills', skill)}
                      className="hover:bg-purple-700 rounded-full p-1 transition"
                      title="Remove"
                    >
                      <X size={14} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Tools Selected */}
          {selectedSkills.tools.length > 0 && (
            <div>
              <p className="text-xs font-semibold text-orange-600 uppercase mb-2">Tools & Platforms ({selectedSkills.tools.length})</p>
              <div className="flex flex-wrap gap-2">
                {selectedSkills.tools.map(tool => (
                  <div
                    key={tool}
                    className="bg-orange-500 text-white px-4 py-2 rounded-full text-sm font-semibold flex items-center gap-2 hover:bg-orange-600 transition duration-300"
                  >
                    {tool}
                    <button
                      onClick={() => removeSkill('tools', tool)}
                      className="hover:bg-orange-700 rounded-full p-1 transition"
                      title="Remove"
                    >
                      <X size={14} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Empty State */}
      {selectedSkills.technicalSkills.length === 0 && selectedSkills.softSkills.length === 0 && selectedSkills.tools.length === 0 && (
        <div className="p-6 bg-blue-50 border-2 border-blue-200 rounded-2xl text-center">
          <p className="text-sm text-blue-700 font-light">
            Select skills from the list above or add your own custom skills to showcase your abilities
          </p>
        </div>
      )}
    </div>
  );
}