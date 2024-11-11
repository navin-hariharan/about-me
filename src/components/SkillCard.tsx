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
      className={`p-4 sm:p-6 rounded-xl transition-all duration-300 h-full ${
        isDark ? 'bg-gray-800 hover:bg-gray-750' : 'bg-white hover:bg-gray-50'
      } shadow hover:shadow-md`}
    >
      <div className="flex items-center gap-3 sm:gap-4 mb-4">
        <img 
          src={skill.icon} 
          alt={skill.name} 
          className={`w-6 h-6 sm:w-8 sm:h-8 ${isDark ? 'filter invert' : ''}`}
          loading="lazy"
        />
        <h3 className="font-semibold text-sm sm:text-base">{skill.name}</h3>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2 sm:h-2.5 dark:bg-gray-700 mb-3 sm:mb-4">
        <div 
          className="bg-yellow-500 h-2 sm:h-2.5 rounded-full transition-all duration-300"
          style={{ width: `${skill.level}%` }}
        />
      </div>
      <div className="flex flex-wrap gap-1.5 sm:gap-2">
        {skill.keywords.map((keyword, index) => (
          <span
            key={index}
            className={`text-xs px-2 py-0.5 sm:py-1 rounded-full ${
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