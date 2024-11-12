import React, { lazy, Suspense } from 'react';
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

// Lazy load ParticlesBackground for better initial load performance
const ParticlesBackground = lazy(() => import('./components/ParticlesBackground'));

export default function App() {
  const { isDark, toggleTheme } = useTheme();

  return (
    <div
      className={`min-h-screen relative transition-colors duration-300 ${
        isDark ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'
      }`}
    >
      <Suspense fallback={null}>
        <ParticlesBackground isDark={isDark} />
      </Suspense>
      
      <div className="relative z-10">
        <nav className="fixed w-full backdrop-blur-md bg-opacity-80 z-50 px-4 sm:px-6 py-4 flex justify-between items-center">
          <div className="w-8" />
          <button
            onClick={toggleTheme}
            className={`p-2 rounded-full transition-colors ${
              isDark
                ? 'bg-gray-800 hover:bg-gray-700'
                : 'bg-gray-200 hover:bg-gray-300'
            }`}
            aria-label="Toggle theme"
          >
            {isDark ? <Sun size={20} /> : <Moon size={20} />}
          </button>
        </nav>

        <main className="container mx-auto px-4 sm:px-6 pt-16">
          <section className="min-h-[90vh] flex flex-col justify-center py-8 sm:py-16">
            <div className="max-w-3xl mx-left animate-fade-in">
              <div className="flex flex-col sm:flex-row items-center gap-6 sm:gap-8 mb-8">
                <img
                  src="https://storage.rxresu.me/cm18ah1mk0h1umtv5564v0bh6/pictures/cm18ah1mk0h1umtv5564v0bh6.jpg"
                  alt="Navin Hariharan"
                  className="w-28 h-28 sm:w-32 sm:h-32 rounded-full object-cover border-4 border-yellow-400"
                  loading="lazy"
                  width={128}
                  height={128}
                />
                <div className="flex-1 text-center sm:text-left">
                  <h1 className="text-3xl sm:text-5xl font-bold mb-4 flex flex-col sm:flex-row items-center justify-center sm:justify-start">
                    Hi, I'm{' '}
                    <span className="bg-gradient-to-r from-yellow-400 to-yellow-600 bg-clip-text text-transparent inline-flex items-center ml-0 sm:ml-2">
                      Navin Hariharan
                    </span>
                  </h1>
                  <div className="text-xl sm:text-2xl mb-2 opacity-80 flex items-center justify-center sm:justify-start gap-2">
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
                  <div className="flex flex-col sm:flex-row items-center justify-center sm:justify-start gap-2 text-sm opacity-60">
                    <div className="flex items-center">
                      <MapPin size={16} />
                      <span className="ml-1">Chennai, India</span>
                    </div>
                    <span className="hidden sm:inline mx-2">•</span>
                    <div className="flex items-center">
                      <Flag size={16} />
                      <span className="ml-1">Indian</span>
                    </div>
                  </div>
                </div>
              </div>
              <p className="text-base sm:text-lg mb-8 opacity-80 text-center sm:text-left">
                With over 8 years of experience in cybersecurity and 2 years in
                AI, I lead as CEO of CyberHakz Pvt. Ltd. and Director of Alfa
                Global Wealth Advisors Pvt. Ltd. Passionate about coding,
                technology, and driving innovation in security solutions.
              </p>
              <div className="flex flex-wrap justify-center sm:justify-start gap-4 items-center">
                {[
                  {
                    href: "https://github.com/navin-hariharan",
                    icon: <Github size={24} />,
                    label: "GitHub Profile"
                  },
                  {
                    href: "https://www.linkedin.com/in/navin-hariharan/",
                    icon: <Linkedin size={24} />,
                    label: "LinkedIn Profile"
                  },
                  {
                    href: "https://www.instagram.com/navin_hariharan/",
                    icon: <Instagram size={24} />,
                    label: "Instagram Profile"
                  },
                  {
                    href: "mailto:navin@navin-hariharan.com",
                    icon: <Mail size={24} />,
                    label: "Email Contact"
                  }
                ].map((link, index) => (
                  <a
                    key={index}
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`p-2 rounded-full transition-colors ${
                      isDark ? 'hover:bg-gray-800' : 'hover:bg-gray-200'
                    }`}
                    aria-label={link.label}
                  >
                    {link.icon}
                  </a>
                ))}
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

          {[
            {
              title: "Experience",
              content: (
                <div className="space-y-6">
                  {experiences.map((experience, index) => (
                    <ExperienceCard
                      key={index}
                      experience={experience}
                      isDark={isDark}
                    />
                  ))}
                </div>
              )
            },
            {
              title: "Featured Projects",
              content: (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
                  {projects.map((project, index) => (
                    <ProjectCard key={index} project={project} isDark={isDark} />
                  ))}
                </div>
              )
            },
            {
              title: "Certifications",
              content: (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
                  {certificates.map((certificate, index) => (
                    <CertificateCard
                      key={index}
                      certificate={certificate}
                      isDark={isDark}
                    />
                  ))}
                </div>
              )
            },
            {
              title: "Skills & Technologies",
              content: (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                  {skills.map((skill, index) => (
                    <SkillCard key={index} skill={skill} isDark={isDark} />
                  ))}
                </div>
              )
            }
          ].map((section, index) => (
            <section key={index} className="py-12 sm:py-20">
              <h2 className="text-3xl sm:text-4xl font-bold mb-8 sm:mb-12 text-center sm:text-left">
                {section.title}
              </h2>
              {section.content}
            </section>
          ))}
        </main>

        <footer
          className={`py-6 sm:py-8 mt-12 sm:mt-20 border-t ${
            isDark ? 'border-gray-800' : 'border-gray-200'
          }`}
        >
          <div className="container mx-auto px-4 sm:px-6 text-center">
            <p className="opacity-60">
              © {new Date().getFullYear()} Navin Hariharan. All rights reserved.
            </p>
          </div>
        </footer>
      </div>
    </div>
  );
}
