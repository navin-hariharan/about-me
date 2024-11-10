import React from 'react';

interface Skill {
  name: string;
  icon: string;
  level: number;
  keywords: string[];
}

interface Props {
  skill: Skill;
  isDark: boolean;
}

export default function SkillCard({ skill, isDark }: Props) {
  return (
    <div 
      className={`p-6 rounded-xl transition-all duration-300 ${
        isDark ? 'bg-gray-800 hover:bg-gray-750' : 'bg-white hover:bg-gray-50'
      } shadow hover:shadow-md`}
    >
      <div className="flex items-center gap-4 mb-4">
        <img 
          src={skill.icon} 
          alt={skill.name} 
          className={`w-8 h-8 ${isDark ? 'filter invert' : ''}`}
        />
        <h3 className="font-semibold">{skill.name}</h3>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700 mb-4">
        <div 
          className="bg-yellow-500 h-2.5 rounded-full transition-all duration-300"
          style={{ width: `${skill.level}%` }}
        />
      </div>
      <div className="flex flex-wrap gap-2">
        {skill.keywords.map((keyword, index) => (
          <span
            key={index}
            className={`text-xs px-2 py-1 rounded-full ${
              isDark ? 'bg-gray-700 text-gray-300' : 'bg-gray-200 text-gray-700'
            }`}
          >
            {keyword}
          </span>
        ))}
      </div>
    </div>
  );
}