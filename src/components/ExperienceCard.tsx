import React from 'react';
import { Building2, Calendar } from 'lucide-react';

interface Experience {
  company: string;
  position: string;
  date: string;
  location: string;
  description?: string;
}

interface Props {
  experience: Experience;
  isDark: boolean;
}

export default function ExperienceCard({ experience, isDark }: Props) {
  return (
    <div 
      className={`p-6 rounded-xl transition-all duration-300 ${
        isDark ? 'bg-gray-800 hover:bg-gray-750' : 'bg-white hover:bg-gray-50'
      } shadow-lg hover:shadow-xl`}
    >
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-xl font-bold">{experience.position}</h3>
          <div className="flex items-center gap-2 mt-1">
            <Building2 size={16} className="opacity-60" />
            <span className={isDark ? 'text-gray-300' : 'text-gray-600'}>
              {experience.company}
            </span>
          </div>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <Calendar size={16} className="opacity-60" />
          <span className={isDark ? 'text-gray-400' : 'text-gray-600'}>
            {experience.date}
          </span>
        </div>
      </div>
      <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
        {experience.location}
      </p>
      {experience.description && (
        <p className={`mt-4 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
          {experience.description}
        </p>
      )}
    </div>
  );
}