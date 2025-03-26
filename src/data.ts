import { useEffect, useState } from "react";

async function fetchGitHubRepos() {
  try {
    const response = await fetch(
      "https://api.github.com/users/navin-hariharan/repos?sort=stars&direction=desc",
    );
    if (!response.ok) {
      console.error(
        `GitHub API error: ${response.status} ${response.statusText}`,
      );
      return [];
    }
    const repos = await response.json();
    return repos.slice(0, 3).map((repo: any) => ({
      title: repo.name,
      description: repo.description || "No description available",
      image: "https://checkmarx.com/wp-content/uploads/2022/08/thumbnail.png",
      tags: [repo.language, `⭐ ${repo.stargazers_count}`].filter(Boolean),
      githubUrl: repo.html_url,
      date: new Date(repo.created_at).toLocaleDateString("en-US", {
        month: "short",
        year: "numeric",
      }),
      source: "GitHub",
    }));
  } catch (error) {
    console.error("Error fetching GitHub repos:", error);
    return [];
  }
}

async function fetchHuggingFaceModels() {
  try {
    const response = await fetch(
      "https://huggingface.co/api/models?author=navin-hariharan",
    );
    if (!response.ok) {
      console.error(
        `HuggingFace Models API error: ${response.status} ${response.statusText}`,
      );
      return [];
    }
    const models = await response.json();

    return models.slice(0, 3).map((model: any) => ({
      title: model.modelId || "Untitled Model",
      description: model.description || "No description available",
      image:
        "https://cdn.analyticsvidhya.com/wp-content/uploads/2024/06/hugging-face.jpg",
      tags: ["Model", ...(model.tags || [])].slice(0, 3),
      huggingFaceUrl: `https://huggingface.co/${model.modelId}`,
      date: new Date(model.lastModified || Date.now()).toLocaleDateString(
        "en-US",
        { month: "short", year: "numeric" },
      ),
      source: "HuggingFace",
    }));
  } catch (error) {
    console.error("Error fetching HuggingFace models:", error);
    return [];
  }
}

async function fetchHuggingFaceDatasets() {
  try {
    const response = await fetch(
      "https://huggingface.co/api/datasets?author=navin-hariharan",
    );
    if (!response.ok) {
      console.error(
        `HuggingFace Datasets API error: ${response.status} ${response.statusText}`,
      );
      return [];
    }
    const datasets = await response.json();

    return datasets.slice(0, 3).map((dataset: any) => ({
      title: dataset.id || "Untitled Dataset",
      description: dataset.description || "No description available",
      image:
        "https://www.researchgate.net/publication/228713375/figure/fig4/AS:669477234540555@1536627219446/An-Example-of-Petri-Nets-Graph.png",
      tags: ["Dataset", ...(dataset.tags || [])].slice(0, 3),
      huggingFaceUrl: `https://huggingface.co/datasets/${dataset.id}`,
      date: new Date(dataset.lastModified || Date.now()).toLocaleDateString(
        "en-US",
        { month: "short", year: "numeric" },
      ),
      source: "HuggingFace",
    }));
  } catch (error) {
    console.error("Error fetching HuggingFace datasets:", error);
    return [];
  }
}

export const useProjects = () => {
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    async function fetchAllRepos() {
      const [githubRepos, hfModels, hfDatasets] = await Promise.all([
        fetchGitHubRepos(),
        fetchHuggingFaceModels(),
        fetchHuggingFaceDatasets(),
      ]);

      setProjects([...githubRepos, ...hfModels, ...hfDatasets]);
    }

    fetchAllRepos();
  }, []);

  return projects;
};

export const experiences = [
  {
    company: "CYBERHAKZ PRIVATE LIMITED",
    position: "Founder/CEO",
    date: "Mar 2021 - Present",
    location: "India",
    description:
      "Leading the company and managing operations, ensuring top security methods, and driving strategic growth initiatives.",
  },
  {
    company: "ALFA GLOBAL WEALTH ADVISORS PRIVATE LIMITED",
    position: "Director",
    date: "Mar 2021 - Present",
    location: "India",
    description:
      "Providing strategic direction and oversight for wealth management operations.",
  },
];

export const skills = [
  {
    name: "CyberSecurity",
    icon: "https://raw.githubusercontent.com/simple-icons/simple-icons/develop/icons/kalilinux.svg",
    level: 95,
    keywords: [
      "nikto",
      "nmap",
      "burpsuite",
      "postman",
      "wifite",
      "metasploit",
      "SET toolkit",
    ],
  },
  {
    name: "AI & ML",
    icon: "https://raw.githubusercontent.com/simple-icons/simple-icons/develop/icons/pytorch.svg",
    level: 90,
    keywords: [
      "PyTorch",
      "TensorFlow",
      "CUDA",
      "cuDNN",
      "Stable Diffusion",
      "FLUX",
    ],
  },
  {
    name: "Python Ecosystem",
    icon: "https://raw.githubusercontent.com/simple-icons/simple-icons/develop/icons/python.svg",
    level: 85,
    keywords: ["Flask", "FastAPI", "REST API", "Pandas"],
  },
  {
    name: "Linux & Shell",
    icon: "https://raw.githubusercontent.com/simple-icons/simple-icons/develop/icons/linux.svg",
    level: 90,
    keywords: ["bash", "kali", "parrot", "ubuntu", "debian"],
  },
  {
    name: "Databases",
    icon: "https://raw.githubusercontent.com/simple-icons/simple-icons/develop/icons/mysql.svg",
    level: 85,
    keywords: ["SQL", "MariaDB", "NocoDB"],
  },
  {
    name: "Security Tools",
    icon: "https://raw.githubusercontent.com/simple-icons/simple-icons/develop/icons/wireshark.svg",
    level: 92,
    keywords: ["Wireshark", "Burpsuite", "Tor", "Postman"],
  },
  {
    name: "Version Control",
    icon: "https://raw.githubusercontent.com/simple-icons/simple-icons/develop/icons/git.svg",
    level: 88,
    keywords: ["Git", "GitHub", "GitLab"],
  },
  {
    name: "Cloud Platforms",
    icon: "https://simpleicons.org/icons/amazonwebservices.svg",
    level: 82,
    keywords: ["AWS", "Heroku", "repl.it"],
  },
];

export const certificates = [
  {
    title: "Certified Ethical Hacker (CEH)",
    issuer: "EC-Council",
    date: "May 2021",
    image: "/certificates/CEH.jpg",
    verificationUrl: "/certificates/CEH.jpg",
  },
  {
    title: "CompTIA Security+ ce",
    issuer: "CompTIA",
    date: "Nov 2024",
    image: "/certificates/CompTIA.jpg",
    verificationUrl: "/certificates/CompTIA.jpg",
  },
];
