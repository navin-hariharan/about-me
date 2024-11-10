import React from 'react';
import {
  Moon,
  Sun,
  Github,
  Linkedin,
  Instagram,
  Mail,
  MapPin,
  Flag,
  Download,
} from 'lucide-react';
import { useTheme } from './hooks/useTheme';
import ProjectCard from './components/ProjectCard';
import SkillCard from './components/SkillCard';
import CertificateCard from './components/CertificateCard';
import ExperienceCard from './components/ExperienceCard';
import TypedText from './components/TypedText';
import { projects, skills, certificates, experiences } from './data';

export default function App() {
  const { isDark, toggleTheme } = useTheme();

  return (
    <div
      className={`min-h-screen transition-colors duration-300 ${
        isDark ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'
      }`}
    >
      <nav className="fixed w-full backdrop-blur-md bg-opacity-80 z-50 px-6 py-4 flex justify-between items-center">
        <div className="w-8" />
        <button
          onClick={toggleTheme}
          className={`p-2 rounded-full ${
            isDark
              ? 'bg-gray-800 hover:bg-gray-700'
              : 'bg-gray-200 hover:bg-gray-300'
          }`}
        >
          {isDark ? <Sun size={20} /> : <Moon size={20} />}
        </button>
      </nav>

      <main className="container mx-auto px-6 pt-16">
        <section className="min-h-[90vh] flex flex-col justify-center">
          <div className="max-w-3xl animate-fade-in">
            <div className="flex items-center gap-8 mb-8">
              <img
                src="https://storage.rxresu.me/cm18ah1mk0h1umtv5564v0bh6/pictures/cm18ah1mk0h1umtv5564v0bh6.jpg"
                alt="Navin Hariharan"
                className="w-32 h-32 rounded-full object-cover border-4 border-yellow-400"
              />
              <div className="flex-1">
                <h1 className="text-5xl font-bold mb-4 flex items-center">
                  Hi, I'm&nbsp;{' '}
                  <span className="bg-gradient-to-r from-yellow-400 to-yellow-600 bg-clip-text text-transparent inline-flex items-center">
                    Navin Hariharan
                  </span>
                </h1>
                <div className="text-2xl mb-2 opacity-80 flex items-center gap-2">
                  <span>I'm a</span>
                  <TypedText
                    strings={[
                      "Cybersecurity Expert",
                      "AI Developer",
                      "Entrepreneur",
                      "Tech Innovator"
                    ]}
                    className="text-yellow-500"
                  />
                </div>
                <div className="flex items-center gap-2 text-sm opacity-60 whitespace-nowrap">
                  <div className="flex items-center">
                    <MapPin size={16} />
                    <span className="ml-1">Chennai, India</span>
                  </div>
                  <span className="mx-2">•</span>
                  <div className="flex items-center">
                    <Flag size={16} />
                    <span className="ml-1">Indian</span>
                  </div>
                </div>
              </div>
            </div>
            <p className="text-lg mb-8 opacity-80">
              With over 8 years of experience in cybersecurity and 2 years in
              AI, I lead as CEO of CyberHakz Pvt. Ltd. and Director of Alfa
              Global Wealth Advisors Pvt. Ltd. Passionate about coding,
              technology, and driving innovation in security solutions.
            </p>
            <div className="flex gap-4 items-center">
              <a
                href="https://github.com/navin-hariharan"
                target="_blank"
                rel="noopener noreferrer"
                className={`p-2 rounded-full ${
                  isDark ? 'hover:bg-gray-800' : 'hover:bg-gray-200'
                }`}
              >
                <Github size={24} />
              </a>
              <a
                href="https://www.linkedin.com/in/navin-hariharan/"
                target="_blank"
                rel="noopener noreferrer"
                className={`p-2 rounded-full ${
                  isDark ? 'hover:bg-gray-800' : 'hover:bg-gray-200'
                }`}
              >
                <Linkedin size={24} />
              </a>
              <a
                href="https://www.instagram.com/navin_hariharan/"
                target="_blank"
                rel="noopener noreferrer"
                className={`p-2 rounded-full ${
                  isDark ? 'hover:bg-gray-800' : 'hover:bg-gray-200'
                }`}
              >
                <Instagram size={24} />
              </a>
              <a
                href="mailto:navin@navin-hariharan.com"
                className={`p-2 rounded-full ${
                  isDark ? 'hover:bg-gray-800' : 'hover:bg-gray-200'
                }`}
              >
                <Mail size={24} />
              </a>
              <a
                href="/resume.pdf"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-4 py-2 bg-yellow-500 hover:bg-yellow-600 text-white rounded-full transition-colors duration-300"
              >
                <Download size={20} />
                <span>Download Resume</span>
              </a>
            </div>
          </div>
        </section>

        <section className="py-20">
          <h2 className="text-4xl font-bold mb-12">Experience</h2>
          <div className="space-y-6">
            {experiences.map((experience, index) => (
              <ExperienceCard
                key={index}
                experience={experience}
                isDark={isDark}
              />
            ))}
          </div>
        </section>

        <section className="py-20">
          <h2 className="text-4xl font-bold mb-12">Featured Projects</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {projects.map((project, index) => (
              <ProjectCard key={index} project={project} isDark={isDark} />
            ))}
          </div>
        </section>

        <section className="py-20">
          <h2 className="text-4xl font-bold mb-12">Certifications</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {certificates.map((certificate, index) => (
              <CertificateCard
                key={index}
                certificate={certificate}
                isDark={isDark}
              />
            ))}
          </div>
        </section>

        <section className="py-20">
          <h2 className="text-4xl font-bold mb-12">Skills & Technologies</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {skills.map((skill, index) => (
              <SkillCard key={index} skill={skill} isDark={isDark} />
            ))}
          </div>
        </section>
      </main>

      <footer
        className={`py-8 mt-20 border-t ${
          isDark ? 'border-gray-800' : 'border-gray-200'
        }`}
      >
        <div className="container mx-auto px-6 text-center">
          <p className="opacity-60">
            © {new Date().getFullYear()} Navin Hariharan. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
