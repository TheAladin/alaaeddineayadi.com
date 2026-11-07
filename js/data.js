// site content
window.PORTFOLIO = {
  name: "Alaa Eddine",
  initials: "AE",
  role: "Full-Stack Web Developer",

  hero: {
    greetingJp: "はじめまして",
    greeting: "Nice to meet you.",
    intro:
      "I build web apps end to end, from the database and API to the interface people use. I’m also into machine learning, especially computer vision: I’ve built tools that label images automatically and turn 3D scans into measurements.",
  },

  experience: [
    {
      company: "Bentley Systems",
      role: "Software Development Intern",
      start: "May 2026",
      end: "Aug. 2026",
      location: "Quebec City, QC",
      type: "Internship",
      summary:
        "Used cloud computing and machine learning to speed up engineering simulations: generating datasets in hours instead of days, and machine-learning models that approximate slow simulations.",
      tasks: [
        "Implemented, adapted and benchmarked machine-learning surrogate models that approximate Finite Element Method (FEM) simulations, comparing their outputs against the real simulations.",
        "Built a distributed simulation platform on Azure Batch that parallelized a serial engineering tool across spot VMs, cutting dataset generation from days to hours (60× faster) while reducing compute cost through spot pricing and autoscaling.",
        "Designed a parameter-elicitation survey to align simulation inputs with real-world data, translating the responses into statistical distributions used to generate synthetic training datasets.",
      ],
      stack: ["Python", "PyTorch", "Microsoft Azure", "Azure Batch", "Surrogate modelling", "Distributed computing"],
    },
    {
      company: "FPInnovations",
      role: "Software Development Intern",
      start: "Aug. 2025",
      end: "Mar. 2026",
      location: "Vancouver, BC (remote)",
      type: "Internship",
      summary:
        "Built a desktop application that turns 3D scans of wooden logs into volume measurements and interactive 3D views.",
      tasks: [
        "Architected and developed a PySide6/PyVista desktop application for interactive 3D visualization and analysis of timber assets.",
        "Implemented geometric computer vision algorithms (convex hulls, least-squares cylinder fitting) to extract precise log volumes and other volumetric metrics from raw 3D point clouds.",
        "Designed the modular architecture and data persistence layer for large-scale 3D and tabular datasets.",
      ],
      stack: ["Python", "PySide6", "PyVista", "Docker", "ONNX", "Point clouds", "Computational geometry"],
    },
    {
      company: "Norlab, Université Laval",
      role: "Machine Learning Research Intern",
      start: "May 2025",
      end: "Aug. 2025",
      location: "Quebec City, QC",
      type: "Internship",
      summary:
        "Used AI foundation models and 3D reconstruction to speed up image labelling and build digital twins of wooden logs.",
      tasks: [
        "Built an automated annotation tool on SAM (Segment Anything Model) that made data labelling 10× faster, then used the generated labels to train a lightweight U-Net segmentation model deployed into production.",
        "Benchmarked classical 3D reconstruction (Structure from Motion, photogrammetry) against neural rendering (NeRF, 3D Gaussian Splatting) to choose the best pipeline for digital twins of wooden logs.",
      ],
      stack: ["Python", "OpenCV", "PyTorch", "Docker", "ONNX", "Photogrammetry"],
    },
    {
      company: "GRAAL, Université Laval",
      role: "Machine Learning Research Intern",
      start: "May 2024",
      end: "Dec. 2024",
      location: "Quebec City, QC",
      type: "Internship",
      summary:
        "Part of a research team building medical-imaging AI that predicts how patients with macular degeneration respond to treatment. The work was accepted at SMASH 2026 (Mila).",
      tasks: [
        "Co-developed an interpretable machine-learning pipeline predicting treatment response for 1,203 patients with neovascular age-related macular degeneration from retinal OCT scans, outperforming end-to-end deep learning (AUC 0.77 vs. 0.57).",
        "Fine-tuned CNNs (ResNet18, U-Net, YOLOv3) with transfer learning to extract clinical biomarkers from 2,400+ retinal OCT scans at 0.82–0.91 accuracy, matching ophthalmologist-annotated biomarkers in downstream predictive performance.",
        "Built an OpenCV preprocessing pipeline for OCT scans, handling artifact removal and region-of-interest extraction.",
        "Co-authored “Visual Acuity Improvement Prediction in Neovascular Age-Related Macular Degeneration”, a peer-reviewed paper accepted at SMASH 2026 (Mila, Montréal).",
      ],
      stack: ["Python", "OpenCV", "PyTorch"],
    },
  ],

  // images are 16:10, anything else gets cropped. no image = title shown instead
  projects: [
    {
      title: "Sendy Birdy",
      category: "Client sharing",
      year: "2026",
      ai: false,
      image: "images/projects/sendy-birdy-preview.png",
      alt: "Sendy Birdy: “Send screenshots and demos to clients through private links that expire”, beside its library and a share page on a phone",
      short: "Self-hosted app for sending screenshots, demo videos and notes to clients through private links that expire.",
      description: [
        "Sendy Birdy keeps your screenshots, demo videos and Markdown notes in one library on your own machine. Pick a few, press Share, and a private link is on your clipboard with your message, your chosen order, an expiry date, an optional password and a downloads switch. Clients open it on their phone without signing up, and you can revoke it at any time.",
        "Only the share pages face the internet. The same code runs as two apps, and the public one never loads the admin routes at all, so there is nothing there to get wrong. Uploads are checked by content rather than file name, photos lose their GPS and EXIF data, and an activity log of views and downloads deletes itself after 90 days.",
      ],
      highlights: [
        "Separate public and admin apps, so only share links are exposed",
        "Argon2id passwords, 128-bit link tokens, rate-limited guessing and a strict CSP",
        "281 backend, 168 frontend and 22 Playwright end-to-end tests, run in CI",
        "Lighthouse 100 for accessibility and best practices, 99–100 for desktop performance",
        "Runs with Docker compose, with backups and a self-hosting guide",
      ],
      role: "Designer & developer",
      status: "Open source, v1.0.0 released",
      stack: ["FastAPI", "React", "TypeScript", "PostgreSQL", "Tailwind CSS", "Docker", "Playwright", "GitHub Actions"],
      links: { repo: "https://github.com/TheAladin/Sendy-Birdy" },
    },
    {
      title: "Minervus",
      category: "Education",
      year: "2026",
      ai: true,
      image: "images/projects/minervus-preview.png",
      alt: "Minervus: “Flashcards that schedule themselves. AI writes them for you.”, beside the card generator and a study session on a phone",
      short: "Flashcard app with spaced repetition that drafts cards from your notes or PDFs with Claude.",
      description: [
        "Minervus is a flashcard app built around spaced repetition. Paste text or upload a PDF, and Claude drafts flashcards from it. The drafts appear as editable cards, and nothing reaches your deck until you approve it.",
        "Studying shows one card at a time and hides the answer until you ask. Each rating (Again, Hard, Good or Easy) feeds a scheduler based on SM-2 that decides when you see the card next. The page feels instant, while every rating is still confirmed by the server, and a row lock stops two reviews of the same card from overwriting each other.",
      ],
      highlights: [
        "AI drafts use structured outputs, and the prompt treats the source as untrusted to resist prompt injection",
        "Refusals, timeouts and an unreachable API each get a clear message",
        "Every deck has an owner, and admins manage accounts from a page and a CLI",
        "273 backend, 133 unit and 30 Playwright browser tests",
      ],
      role: "Designer & developer",
      status: "Feature-complete MVP",
      stack: ["FastAPI", "React", "PostgreSQL", "SQLAlchemy", "Claude API", "Tailwind CSS", "Playwright"],
      links: { repo: "https://github.com/TheAladin/minervus" },
    },
  ],

  contact: {
    email: "ayadi.alaa.e@gmail.com",
    blurb:
      "Have a role to fill, a project in mind, or a question about anything on this page? Send me a message.",
    available: "Open to new opportunities",
    socials: [
      { label: "GitHub", icon: "github", url: "https://github.com/TheAladin" },
      { label: "LinkedIn", icon: "linkedin", url: "https://www.linkedin.com/in/alaa-eddine-ayadi-7bb416227/" },
    ],
  },
};
