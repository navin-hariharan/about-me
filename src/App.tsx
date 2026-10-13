import { useEffect, useRef } from 'react';
import {
  ArrowDown, ArrowRight, ArrowUpRight, Github, Linkedin, Mail, MapPin,
  Moon, ShieldCheck, Sun,
} from 'lucide-react';
import { useTheme } from './hooks/useTheme';
import ProjectCard from './components/ProjectCard';
import SkillCard from './components/SkillCard';
import CertificateCard from './components/CertificateCard';
import ExperienceCard from './components/ExperienceCard';
import TypedText from './components/TypedText';
import { useProjects, skills, certificates, experiences } from './data';

const links = [
  { href: 'https://github.com/navin-hariharan', icon: Github, label: 'GitHub' },
  { href: 'https://www.linkedin.com/in/navin-hariharan/', icon: Linkedin, label: 'LinkedIn' },
  { href: 'mailto:navin@navin-hariharan.com', icon: Mail, label: 'Email' },
];

export default function App() {
  const { isDark, toggleTheme } = useTheme();
  const projects = useProjects();
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const nodes = rootRef.current?.querySelectorAll<HTMLElement>('[data-reveal]');
    if (!nodes?.length) return;
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
    nodes.forEach((node) => observer.observe(node));
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={rootRef} className={`portfolio ${isDark ? 'theme-dark' : 'theme-light'}`}>
      <div className="ambient ambient-one" /><div className="ambient ambient-two" />
      <header className="site-header">
        <a className="wordmark" href="#home" aria-label="Navin Hariharan home"><span>NH</span><i>.</i></a>
        <nav className="main-nav" aria-label="Main navigation">
          <a href="#about">About</a><a href="#work">Work</a><a href="#expertise">Expertise</a>
          <a href="#contact">Contact</a>
        </nav>
        <div className="header-actions">
          <span className="availability"><span /> Open to conversations</span>
          <button className="theme-toggle" onClick={toggleTheme} aria-label="Toggle colour theme">
            {isDark ? <Sun size={17} /> : <Moon size={17} />}
          </button>
        </div>
      </header>

      <main>
        <section className="hero page-width" id="home">
          <div className="hero-copy">
            <p className="eyebrow"><span className="eyebrow-line" /> SECURITY · SYSTEMS · STRATEGY</p>
            <h1>Building a more<br /><span>secure digital</span><br />world.</h1>
            <p className="hero-intro">I’m <strong>Navin Hariharan</strong> — a <TypedText strings={['cybersecurity expert', 'systems thinker', 'technology leader']} className="typed-accent" /> focused on making complex technology safer, simpler and more resilient.</p>
            <div className="hero-meta"><span><MapPin size={15} /> United Kingdom</span><span className="meta-divider" /> <span>Founder · Security practitioner</span></div>
            <div className="hero-actions">
              <a className="button button-primary" href="#work">Explore my work <ArrowRight size={17} /></a>
              <a className="text-link" href="mailto:navin@navin-hariharan.com">Let’s talk <ArrowUpRight size={16} /></a>
            </div>
            <div className="social-links">{links.map(({ href, icon: Icon, label }) => <a key={label} href={href} target={label === 'Email' ? undefined : '_blank'} rel="noreferrer" aria-label={label}><Icon size={18} /></a>)}</div>
          </div>
          <div className="hero-visual" aria-label="Portrait of Navin Hariharan">
            <div className="portrait-frame"><img src="https://huggingface.co/navin-hariharan/navin-hariharan-FLUX-LORA/resolve/main/samples/navin-hariharan.jpg" alt="Navin Hariharan" fetchPriority="high" /><div className="portrait-shade" />
              <div className="portrait-caption"><span className="caption-mark"><ShieldCheck size={17} /></span><span><b>Security by design</b><small>Practical. Human. Resilient.</small></span></div>
            </div>
            <div className="orbit orbit-one"/><div className="orbit orbit-two"/><div className="visual-index">01 <span>/</span> 04</div>
          </div>
          <a className="scroll-cue" href="#about"><ArrowDown size={15} /> SCROLL TO EXPLORE</a>
        </section>

        <section className="intro-band" id="about"><div className="page-width intro-grid" data-reveal>
          <p className="section-kicker">01 / A LITTLE ABOUT ME</p>
          <div><h2>Good security should<br /><span>make progress possible.</span></h2><p className="intro-text">I work at the intersection of cybersecurity, systems and emerging technology. My approach is grounded in curiosity and clear thinking: understand the real risk, build the right controls, and help people move forward with confidence.</p></div>
          <div className="intro-aside"><span className="aside-rule"/><p>Curious by nature.<br />Defensive by design.</p></div>
        </div></section>

        <section className="content-section page-width" id="experience" data-reveal>
          <div className="section-heading"><div><p className="section-kicker">02 / THE JOURNEY</p><h2>Experience</h2></div><p className="section-note">Building teams, businesses<br />and safer technology.</p></div>
          <div className="experience-list">{experiences.map((experience, index) => <ExperienceCard key={`${experience.company}-${index}`} experience={experience} isDark={isDark} />)}</div>
        </section>

        <section className="content-section work-section" id="work"><div className="page-width" data-reveal>
          <div className="section-heading"><div><p className="section-kicker">03 / SELECTED WORK</p><h2>Ideas into impact<span className="heading-dot">.</span></h2></div><a className="text-link" href="https://github.com/navin-hariharan" target="_blank" rel="noreferrer">More on GitHub <ArrowUpRight size={16} /></a></div>
          <p className="section-lead">A selection of projects and experiments across security, AI and open source.</p>
          {projects.length ? <div className="projects-grid">{projects.slice(0, 6).map((project: any, index: number) => <div className="project-wrap" key={`${project.title}-${index}`}><ProjectCard project={project} isDark={isDark} /></div>)}</div> : <div className="projects-loading"><span className="loading-pulse" /> Loading recent projects from GitHub and Hugging Face</div>}
        </div></section>

        <section className="content-section page-width" id="expertise" data-reveal>
          <div className="section-heading"><div><p className="section-kicker">04 / THE TOOLKIT</p><h2>Areas of expertise</h2></div><p className="section-note">The right tool matters.<br />So does knowing why.</p></div>
          <div className="skills-grid">{skills.map((skill, index) => <SkillCard key={`${skill.name}-${index}`} skill={skill} isDark={isDark} />)}</div>
        </section>

        <section className="content-section credentials-section page-width" data-reveal>
          <div className="section-heading"><div><p className="section-kicker">CREDENTIALS</p><h2>Always learning.</h2></div></div>
          <div className="cert-grid">{certificates.map((certificate, index) => <CertificateCard key={`${certificate.title}-${index}`} certificate={certificate} isDark={isDark} />)}</div>
        </section>

        <section className="contact-section" id="contact"><div className="page-width contact-inner" data-reveal>
          <p className="section-kicker">HAVE A CHALLENGE IN MIND?</p><h2>Let’s make technology<br /><span>work better for everyone.</span></h2><a className="button button-primary" href="mailto:navin@navin-hariharan.com">Start a conversation <ArrowUpRight size={17} /></a>
        </div></section>
      </main>
      <footer className="site-footer page-width"><a className="wordmark" href="#home"><span>NH</span><i>.</i></a><p>© {new Date().getFullYear()} Navin Hariharan</p><a href="#home">Back to top ↑</a></footer>
    </div>
  );
}
