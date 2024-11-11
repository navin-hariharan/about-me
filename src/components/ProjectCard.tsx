import React from 'react';
import { ExternalLink, Github } from 'lucide-react';

interface Project {
  title: string;
  description: string;
  image: string;
  tags: string[];
  liveUrl?: string;
  githubUrl?: string;
}

interface Props {
  project: Project;
  isDark: boolean;
}

export default function ProjectCard({ project, isDark }: Props) {
  return (
    <div 
      className={`group relative overflow-hidden rounded-xl transition-all duration-300 h-full ${
        isDark ? 'bg-gray-800 hover:bg-gray-750' : 'bg-white hover:bg-gray-50'
      } shadow-lg hover:shadow-xl`}
    >
      <div className="aspect-video overflow-hidden">
        <img 
          src={project.image} 
          alt={project.title}
          className="w-full h-full object-cover transform transition-transform duration-300 group-hover:scale-105"
          loading="lazy"
        />
      </div>
      <div className="p-4 sm:p-6 flex flex-col h-[calc(100%-33.33%)]">
        <h3 className="text-lg sm:text-xl font-bold mb-2">{project.title}</h3>
        <p className={`mb-4 text-sm sm:text-base flex-grow ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
          {project.description}
        </p>
        <div className="flex flex-wrap gap-2 mb-4">
          {project.tags.map((tag, index) => (
            <span 
              key={index}
              className={`px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm ${
                isDark ? 'bg-gray-700 text-gray-300' : 'bg-gray-200 text-gray-700'
              }`}
            >
              {tag}
            </span>
          ))}
        </div>
        <div className="flex gap-4">
          {project.liveUrl && (
            <a 
              href={project.liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-yellow-500 hover:text-yellow-400 text-sm sm:text-base"
            >
              <ExternalLink size={16} className="sm:size-18" />
              <span>Live Demo</span>
            </a>
          )}
          {project.githubUrl && (
            <a 
              href={project.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-yellow-500 hover:text-yellow-400 text-sm sm:text-base"
            >
              <Github size={16} className="sm:size-18" />
              <span>Source</span>
            </a>
          )}
        </div>
      </div>
    </div>
  );
}