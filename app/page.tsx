import {
  ArrowDownRight, ArrowRight, ArrowUpRight, Braces, Check, Github,
  Linkedin, LockKeyhole, Mail, MoveUpRight, Network, Shield, Terminal,
} from 'lucide-react';

const capabilities = [
  { number: '01', icon: Shield, title: 'Cyber security', detail: 'Security architecture, threat-led thinking and practical controls that hold up in the real world.', tags: ['Security strategy', 'Risk', 'Defence'] },
  { number: '02', icon: Network, title: 'Systems & infrastructure', detail: 'Reliable platforms, networks and operations built to stay understandable as they grow.', tags: ['Windows & Linux', 'Networks', 'Automation'] },
  { number: '03', icon: Braces, title: 'AI & engineering', detail: 'Exploring useful applications of AI and building the tooling that makes good ideas real.', tags: ['Python', 'Applied AI', 'Open source'] },
];

const experience = [
  { company: 'CyberHakz Private Limited', role: 'Founder & CEO', date: '2021 — Now', copy: 'Building a security-focused business and helping organisations approach technology with more confidence.' },
  { company: 'Alfa Global Wealth Advisors Private Limited', role: 'Director', date: '2021 — Now', copy: 'Providing strategic direction and oversight across business operations.' },
];

const certificates = [
  { name: 'Certified Ethical Hacker', issuer: 'EC-Council', year: '2021', href: '/certificates/CEH.jpg', mark: 'CEH' },
  { name: 'CompTIA Security+ ce', issuer: 'CompTIA', year: '2024', href: '/certificates/CompTIA.jpg', mark: 'S+' },
];

export default function Home() {
  return (
    <main>
      <header className="topbar wrap">
        <a className="brand" href="#top" aria-label="Navin Hariharan home"><span className="brand-mark">N<span>.</span></span><span className="brand-name">NAVIN HARIHARAN<small>SECURITY · SYSTEMS · STRATEGY</small></span></a>
        <nav className="nav" aria-label="Main navigation"><a href="#about">About</a><a href="#work">What I do</a><a href="#experience">Experience</a><a href="#contact">Contact</a></nav>
        <a className="top-cta" href="mailto:navin@navin-hariharan.com">Let’s talk <ArrowUpRight size={15} /></a>
      </header>

      <section className="hero wrap" id="top">
        <div className="hero-copy">
          <div className="availability"><span className="pulse" /> INDEPENDENT THINKER · UNITED KINGDOM</div>
          <h1>Make it<br /><em>secure.</em><br />Make it <span className="outline">work.</span></h1>
          <p className="hero-summary">I’m Navin Hariharan. I work across cybersecurity, systems and emerging technology to make the complex feel clear—and the important things more resilient.</p>
          <div className="hero-buttons"><a className="button button-lime" href="#work">Explore my work <ArrowRight size={16} /></a><a className="button button-quiet" href="mailto:navin@navin-hariharan.com">Get in touch <MoveUpRight size={15} /></a></div>
          <div className="hero-foot"><span>01 / 04</span><span className="hero-rule" /><span>SECURITY WITH A HUMAN POINT OF VIEW</span></div>
        </div>
        <div className="hero-art" aria-label="Abstract visual representing secure connected systems">
          <div className="art-grid" /><div className="art-ring ring-a" /><div className="art-ring ring-b" />
          <div className="orbit-label label-a"><LockKeyhole size={14} /> TRUSTED BY DESIGN</div><div className="orbit-label label-b"><span className="mini-dot" /> SYSTEMS ONLINE</div>
          <div className="portrait-frame"><img src="/navin-hariharan.jpg" alt="Portrait of Navin Hariharan" /><span className="portrait-scan" /><div className="portrait-caption"><span>01 — PROFILE</span><strong>NAVIN<br />HARIHARAN</strong></div></div>
          <div className="portrait-tag"><span className="mini-dot" /> HUMAN FIRST<br />SECURITY ALWAYS</div>
          <div className="code-card"><div className="code-head"><span /><span /><span /><i>control-plane</i></div><div className="code-lines"><b>01</b><span><i>const</i> resilience = {'{'}</span><b>02</b><span>&nbsp;&nbsp;secure: <strong>true</strong>,</span><b>03</b><span>&nbsp;&nbsp;human: <strong>true</strong>,</span><b>04</b><span>&nbsp;&nbsp;future: <em>open</em></span><b>05</b><span>{'}'}</span></div></div>
          <div className="art-stamp">BUILT<br />FOR WHAT<br /><span>MATTERS</span><ArrowDownRight size={20} /></div>
        </div>
        <a className="scroll-link" href="#about">SCROLL TO EXPLORE <ArrowDownRight size={14} /></a>
        <span className="hero-index">NH—001</span>
      </section>

      <section className="manifesto" id="about"><div className="wrap manifesto-grid"><p className="eyebrow">01 / THE POINT OF IT ALL</p><div><h2>Good security should<br />make <span>progress possible.</span></h2><p className="manifesto-copy">Technology is only useful when people can trust it. My work starts with the real problem, finds the controls that matter, and leaves teams in a stronger position than before.</p></div><div className="manifesto-note"><span className="note-line" />CURIOUS BY NATURE.<br />DEFENSIVE BY DESIGN.</div></div></section>

      <section className="section wrap" id="work"><div className="section-head"><div><p className="eyebrow">02 / HOW I CAN HELP</p><h2>Clarity in the<br /><span>complicated bits.</span></h2></div><p className="section-intro">A practical mix of security judgement, systems experience and a builder’s instinct.</p></div>
        <div className="capability-list">{capabilities.map(({ number, icon: Icon, title, detail, tags }) => <article className="capability" key={number}><span className="cap-number">{number}</span><div className="cap-icon"><Icon size={20} strokeWidth={1.5} /></div><div className="cap-main"><h3>{title}</h3><p>{detail}</p><div className="tags">{tags.map(tag => <span key={tag}>{tag}</span>)}</div></div><ArrowUpRight className="cap-arrow" size={18} /></article>)}</div>
        <div className="work-links"><a href="https://github.com/navin-hariharan" target="_blank" rel="noreferrer"><Github size={17} /> Open source on GitHub <ArrowUpRight size={14} /></a><a href="https://huggingface.co/navin-hariharan" target="_blank" rel="noreferrer"><Terminal size={17} /> AI experiments on Hugging Face <ArrowUpRight size={14} /></a></div>
      </section>

      <section className="experience-section" id="experience"><div className="wrap experience-inner"><div className="section-head exp-head"><div><p className="eyebrow">03 / THE JOURNEY</p><h2>Built through<br /><span>doing the work.</span></h2></div><p className="section-intro">Founder, director, security practitioner.<br />Always learning; always building.</p></div><div className="timeline">{experience.map(item => <article className="timeline-item" key={item.company}><span className="timeline-dot" /><div className="timeline-date">{item.date}</div><div className="timeline-content"><div><p className="company">{item.company}</p><h3>{item.role}</h3></div><p>{item.copy}</p></div></article>)}</div></div></section>

      <section className="section wrap credentials"><div className="credential-heading"><div><p className="eyebrow">04 / CREDENTIALS</p><h2>Earned, then <span>put to work.</span></h2></div><a className="text-link" href="/resume.pdf" target="_blank" rel="noreferrer">View résumé <ArrowUpRight size={15} /></a></div><div className="certificates">{certificates.map(cert => <a className="certificate" href={cert.href} target="_blank" rel="noreferrer" key={cert.name}><div className="cert-mark">{cert.mark}</div><div><span className="cert-issuer">{cert.issuer} · {cert.year}</span><h3>{cert.name}</h3><span className="cert-verify"><Check size={13} /> View certificate</span></div><ArrowUpRight className="cert-arrow" size={17} /></a>)}</div></section>

      <section className="contact" id="contact"><div className="contact-noise" /><div className="wrap contact-inner"><p className="eyebrow">HAVE SOMETHING IMPORTANT TO SOLVE?</p><h2>Let’s make the<br /><span>next move count.</span></h2><p>For thoughtful conversations about security, systems or building something better.</p><a className="button button-lime" href="mailto:navin@navin-hariharan.com">navin@navin-hariharan.com <ArrowUpRight size={16} /></a><div className="contact-socials"><a href="https://github.com/navin-hariharan" target="_blank" rel="noreferrer"><Github size={17} /> GitHub</a><a href="https://www.linkedin.com/in/navin-hariharan/" target="_blank" rel="noreferrer"><Linkedin size={17} /> LinkedIn</a><a href="mailto:navin@navin-hariharan.com"><Mail size={17} /> Email</a></div></div></section>
      <footer className="footer wrap"><a className="brand" href="#top"><span className="brand-mark">N<span>.</span></span><span className="brand-name">NAVIN HARIHARAN<small>SECURITY · SYSTEMS · STRATEGY</small></span></a><span>© {new Date().getFullYear()} Navin Hariharan</span><a href="#top">BACK TO TOP ↑</a></footer>
    </main>
  );
}