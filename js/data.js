/**
 * data.js — every piece of copy on the site lives here.
 * Edit this file to update projects, skills, experience or links;
 * the rest of the code renders whatever it finds.
 */

export const profile = {
  name: 'Navin Hariharan',
  handle: 'navin-hariharan',
  email: 'navin@navin-hariharan.com',
  resume: 'assets/resume.pdf',
  roles: ['Ethical Hacker', 'AI Researcher', 'Red Teamer', 'Model Fine-tuner', 'navin-hariharan.com'],
};

export const socials = [
  { label: 'GitHub', handle: 'navin-hariharan', href: 'https://github.com/navin-hariharan' },
  { label: 'Hugging Face', handle: 'navin-hariharan', href: 'https://huggingface.co/navin-hariharan' },
  { label: 'LinkedIn', handle: 'in/navin-hariharan', href: 'https://in.linkedin.com/in/navin-hariharan' },
  { label: 'Instagram', handle: '@navin_hariharan', href: 'https://instagram.com/navin_hariharan' },
];

// Counters animate from 0 to `value`; `suffix` is appended after the number.
export const stats = [
  { value: 5, suffix: '+', label: 'Years breaking & securing systems' },
  { value: 265, suffix: 'k', label: 'CVE records in an open dataset' },
  { value: 5, suffix: '', label: 'Models published on Hugging Face' },
  { value: 600, suffix: '+', label: 'GitHub stars on open-source tools' },
];

const gh = (repo) => `https://github.com/navin-hariharan/${repo}`;
const hf = (path) => `https://huggingface.co/${path}`;

export const projects = [
  {
    id: 'cve',
    title: 'CVE Intelligence',
    year: '2025',
    category: 'Security',
    classification: 'TOP PRIORITY',
    summary: 'Open vulnerability database, a 265k-row CVE dataset and a Qwen2.5 8B model fine-tuned to reason about exploits.',
    detail:
      'Scrapes and normalises CVE records into a searchable store, publishes them as an open dataset, then fine-tunes Qwen2.5 so analysts can ask about impact and mitigation in plain language.',
    stack: ['Python', 'Qwen2.5', 'Transformers', 'Datasets'],
    metric: '11★ · 265k rows',
    links: [
      { label: 'Repo', href: gh('CVE-DATABASE') },
      { label: 'Model', href: hf('navin-hariharan/qwen2.5-cve-trained') },
      { label: 'Dataset', href: hf('datasets/navin-hariharan/cve-dataset') },
    ],
  },
  {
    id: 'donwinne',
    title: 'Donwinne',
    year: '2025',
    category: 'AI',
    classification: 'RESEARCH',
    summary: 'Petri net editor, simulator and analyser, paired with language models trained on Petri net structures.',
    detail:
      'A browser-based modelling tool for concurrent systems. A companion dataset and fine-tuned Qwen2.5 model read and generate nets, so a model can be drafted from a description.',
    stack: ['TypeScript', 'React', 'Qwen2.5', 'Graph theory'],
    links: [
      { label: 'Repo', href: gh('Donwinne') },
      { label: 'Model', href: hf('navin-hariharan/qwen2.5-petri-nets') },
      { label: 'Dataset', href: hf('datasets/navin-hariharan/petri-nets') },
    ],
  },
  {
    id: 'flux',
    title: 'FLUX LoRA Studio',
    year: '2025',
    category: 'AI',
    classification: 'GENERATIVE',
    summary: 'Personal FLUX LoRA fine-tunes and a serverless RunPod worker for on-demand image generation.',
    detail:
      'DreamBooth-style LoRA training on FLUX, packaged as a RunPod serverless worker that loads adapters at request time and scales to zero between jobs.',
    stack: ['FLUX', 'LoRA', 'PyTorch', 'RunPod'],
    links: [
      { label: 'Model', href: hf('navin-hariharan/navin-hariharan-FLUX-LORA') },
      { label: 'Worker', href: gh('FLUX-INFERENCE-LORA') },
    ],
  },
  {
    id: 'icbm',
    title: 'Create ICBM',
    year: '2026',
    category: 'Games',
    classification: 'ORDNANCE',
    summary: 'A Create addon for Minecraft with tiered missiles and creative warheads.',
    detail:
      'Flashbang, recon-marker and phantom-decoy warheads built on Create’s contraption system, released for community feedback and bug reports.',
    stack: ['Java', 'Minecraft', 'Create'],
    links: [{ label: 'Repo', href: gh('create-icbm') }],
  },
  {
    id: 'pengu',
    title: 'Pengu’s Teams',
    year: '2026',
    category: 'Games',
    classification: 'MULTIPLAYER',
    summary: 'A Minecraft mod for teams, chunk claiming and shared maps.',
    detail: 'Team management, land claims and shared map views for multiplayer servers, published for community servers.',
    stack: ['Java', 'Minecraft'],
    links: [{ label: 'Repo', href: gh('penguteams') }],
  },
  {
    id: 'pos',
    title: 'Restaurant POS',
    year: '2026',
    category: 'Products',
    classification: 'PRODUCTION',
    summary: 'A containerised point-of-sale system: orders, tables and billing in one web app.',
    detail: 'A self-hosted POS shipped as Docker containers, built to run on a small on-premises server.',
    stack: ['TypeScript', 'Docker'],
    links: [{ label: 'Repo', href: gh('Restuarant-POS-System') }],
  },
  {
    id: 'telerat',
    title: 'TeleRat',
    year: 'Earlier',
    category: 'Security',
    classification: 'RED TEAM',
    summary: 'Remote administration toolkit for red-team labs that works without port forwarding.',
    detail: 'Uses Telegram as the command channel, so lab machines can be reached from anywhere without opening inbound ports.',
    stack: ['Python', 'Telegram API'],
    metric: '4★',
    links: [{ label: 'Repo', href: gh('TeleRat') }],
  },
  {
    id: 'payload',
    title: 'Payload Master',
    year: 'Earlier',
    category: 'Security',
    classification: 'RED TEAM',
    summary: 'One-tap Metasploit payload generation from Termux.',
    detail: 'Wraps msfvenom in a guided menu so payloads can be built from an Android phone during an engagement.',
    stack: ['Python', 'Metasploit', 'Termux'],
    metric: '10★',
    links: [{ label: 'Repo', href: gh('PAYLOAD_MASTER') }],
  },
];

export const archive = [
  { name: 'Master-Bomber', note: 'Mail, SMS & call sending tool', lang: 'Python', stars: 576, href: gh('Master-Bomber') },
  { name: 'WEB-DEFACE', note: 'SQL injection lab tooling', lang: 'Python', stars: 6, href: gh('WEB-DEFACE') },
  { name: 'Forensic-Tool-NTU', note: 'Disk-image forensics for MSc coursework', lang: 'Python', stars: 0, href: gh('Forensic-Tool-NTU') },
  { name: 'cyberhakz-open-webui', note: 'Self-hosted LLM interface', lang: 'Svelte', stars: 0, href: gh('cyberhakz-open-webui') },
  { name: 'kali-icon-pack', note: 'Icon pack for Debian desktops', lang: 'Icons', stars: 1, href: gh('kali-icon-pack') },
  { name: 'smile_please', note: 'Photo capture tool', lang: 'Python', stars: 1, href: gh('smile_please') },
];

// Capability modules: the front of each flip card shows code + title, the back lists tools.
export const capabilities = [
  { code: 'OFF', title: 'Offensive Security', color: 'magenta', level: 95, body: 'Web, network and wireless assessments that end in fixes, not just findings.', tools: ['Burp Suite', 'Metasploit', 'Nmap', 'Nikto', 'Wireshark', 'Kali'] },
  { code: 'AI', title: 'Applied AI', color: 'cyan', level: 90, body: 'Fine-tuning open models on security and domain data, then shipping them as services.', tools: ['PyTorch', 'Transformers', 'FLUX', 'DreamBooth', 'Ollama', 'CUDA'] },
  { code: 'OPS', title: 'Infrastructure', color: 'green', level: 88, body: 'Self-hosted, observable and backed up, from a home lab to a company domain.', tools: ['Docker', 'TrueNAS', 'Cloudflare Tunnel', 'Tailscale', 'Windows Server', 'OpenWrt'] },
  { code: 'DEV', title: 'Software', color: 'cyan', level: 85, body: 'APIs, dashboards and mods, written to be read by the next person.', tools: ['Python', 'FastAPI', 'Flask', 'TypeScript', 'React', 'Java'] },
  { code: 'FOR', title: 'Forensics', color: 'green', level: 80, body: 'Disk images, logs and artefacts turned into a timeline that holds up.', tools: ['Disk imaging', 'Timelines', 'journalctl', 'OSINT'] },
  { code: 'NET', title: 'Networking', color: 'magenta', level: 84, body: 'Segmented networks, VPN meshes and SQM tuned so backups don’t hurt anyone.', tools: ['OpenWrt', 'Tailscale', 'Active Directory', 'DNS', 'SQM'] },
];

// Hex grid: short skill tags, each tinted by its group.
export const hexSkills = [
  ['Python', 'dev'], ['Nmap', 'sec'], ['PyTorch', 'ai'], ['Burp', 'sec'], ['Docker', 'ops'], ['FastAPI', 'dev'],
  ['Kali', 'sec'], ['FLUX', 'ai'], ['Linux', 'ops'], ['React', 'dev'], ['MSF', 'sec'], ['CUDA', 'ai'],
  ['Bash', 'ops'], ['SQL', 'dev'], ['OSINT', 'sec'], ['Ollama', 'ai'], ['Git', 'dev'], ['Wireshark', 'sec'],
  ['TrueNAS', 'ops'], ['HF Hub', 'ai'], ['Java', 'dev'], ['AD', 'ops'], ['LoRA', 'ai'], ['TS', 'dev'],
];

// `logo` points at assets/logos/<slug>.svg — swap those files for official
// brand logos to use them site-wide; the layout stays the same.
export const experience = [
  { when: '2021 → NOW', title: 'Director', org: 'CyberHakz Private Limited', level: 'ROOT', logo: 'assets/logos/cyberhakz.svg', body: 'Director of a security practice delivering penetration testing, hardening and AI tooling across client engagements.' },
  { when: '2021 → NOW', title: 'Director', org: 'Alfa Global Wealth Advisors', level: 'ADMIN', logo: 'assets/logos/alfa-global.svg', body: 'Owns the firm’s technology: Windows Server and Active Directory, network segmentation, backups and staff security.' },
  { when: 'MSc', title: 'MSc Cybersecurity', org: 'Postgraduate', level: 'EDU', body: 'Postgraduate study in security, forensics and secure systems.' },
  { when: 'INTERN', title: 'Cyber Crime Intern', org: 'Gurugram Police', level: 'FIELD', logo: 'assets/logos/gurugram-police.svg', body: 'Supported cyber-crime investigations with digital evidence handling and OSINT.' },
  { when: 'BE', title: 'BE Computer Science & Engineering', org: 'Undergraduate', level: 'EDU', body: 'Undergraduate foundation in systems, networks and software engineering.' },
];

export const certificates = [
  { short: 'CEH', title: 'Certified Ethical Hacker', issuer: 'EC-Council', date: 'May 2021', image: 'assets/certificates/CEH.jpg' },
  { short: 'SEC+', title: 'CompTIA Security+ ce', issuer: 'CompTIA', date: 'Nov 2024', image: 'assets/certificates/CompTIA.jpg' },
];

// The looping terminal demo. Each step is a command plus the output it prints.
export const terminalScript = [
  {
    cmd: 'nmap -sV -T4 target.lab',
    out: [
      'Starting Nmap 7.95 ( https://nmap.org )',
      'PORT     STATE SERVICE  VERSION',
      '22/tcp   open  ssh      OpenSSH 9.6',
      '80/tcp   open  http     nginx 1.25',
      '443/tcp  open  ssl/http nginx 1.25',
      '<ok>Nmap done: 1 IP address (1 host up) scanned in 6.42s</ok>',
    ],
  },
  {
    cmd: 'ssh navin@navin-hariharan.com',
    out: ['<dim>Authenticating with public key "ed25519"</dim>', '<ok>Welcome to navin-hariharan.com. 0 incidents open.</ok>'],
  },
  {
    cmd: 'python3 finetune.py --model qwen2.5 --data cve-dataset',
    out: ['loading 265,412 records…', 'epoch 3/3  loss 0.412  ██████████ 100%', '<ok>pushed → hf.co/navin-hariharan/qwen2.5-cve-trained</ok>'],
  },
  {
    cmd: 'git push origin main',
    out: ['Enumerating objects: 42, done.', 'Writing objects: 100% (42/42), 18.3 KiB', '<ok>To github.com:navin-hariharan/about-me.git</ok>', '   6775b6d..c0ffee1  main -> main'],
  },
];
