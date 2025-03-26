import React from 'react';
import { ExternalLink, Github } from 'lucide-react';

interface Project {
  title: string;
  description: string;
  image: string;
  tags: string[];
  liveUrl?: string;
  githubUrl?: string;
  huggingFaceUrl?: string;
  date: string;
  source: string;
}

interface Props {
  project: Project;
  isDark: boolean;
}

export default function ProjectCard({ project, isDark }: Props) {
  const isHuggingFace = project.source === 'HuggingFace';
  const isModel = project.tags.includes('Model');
  const isDataset = project.tags.includes('Dataset');

  return (
    <div
      className={`group relative overflow-hidden rounded-lg transition-all duration-300 h-full ${
        isDark ? 'bg-gray-800 hover:bg-gray-750' : 'bg-white hover:bg-gray-50'
      } shadow hover:shadow-lg`}
    >
      <div className="aspect-video overflow-hidden">
        <img
          src={project.image}
          alt={project.title}
          className="w-full h-full object-cover transform transition-transform duration-300 group-hover:scale-105"
          loading="lazy"
        />
      </div>
      <div className="p-4">
        <div className="flex justify-between items-start gap-2 mb-2">
          <h3 className="text-base font-bold line-clamp-1">{project.title}</h3>
          <div className="flex gap-1">
            {(isModel || isDataset) && (
              <span className={`text-xs px-2 py-0.5 rounded-full ${
                isModel
                  ? 'bg-green-100 text-green-700'
                  : 'bg-blue-100 text-blue-700'
              }`}>
                {isModel ? 'Model' : 'Dataset'}
              </span>
            )}
            <span className={`text-xs px-2 py-0.5 rounded-full ${
              project.source === 'GitHub'
                ? 'bg-purple-100 text-purple-700'
                : 'bg-yellow-100 text-yellow-700'
            }`}>
              {project.source}
            </span>
          </div>
        </div>
        <p className={`text-sm mb-3 line-clamp-2 flex-grow ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
          {project.description}
        </p>
        <div className="flex flex-wrap gap-1.5 mb-3">
          {project.tags
            .filter(tag => tag !== 'Model' && tag !== 'Dataset')
            .map((tag, index) => (
              <span
                key={index}
                className={`px-2 py-0.5 rounded-full text-xs ${
                  isDark ? 'bg-gray-700 text-gray-300' : 'bg-gray-200 text-gray-700'
                }`}
              >
                {tag}
              </span>
            ))}
        </div>
        <div className="flex items-center justify-between">
          <div className="flex gap-2">
            {project.githubUrl && (
              <a
                href={project.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-yellow-500 hover:text-yellow-400"
                aria-label="View on GitHub"
              >
                <Github size={18} />
              </a>
            )}
            {(project.huggingFaceUrl || project.liveUrl) && (
              <a
                href={project.huggingFaceUrl || project.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-yellow-500 hover:text-yellow-400"
                aria-label={`View on ${isHuggingFace ? 'HuggingFace' : 'Live Demo'}`}
              >
                <ExternalLink size={18} />
              </a>
            )}
          </div>
          <span className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
            {project.date}
          </span>
        </div>
      </div>
    </div>
  );
}
