const PORTFOLIO = {
  name: "Kristoffer Reiken M. Raflores",
  shortName: "Reiken",
  role: "Computer Science student · Software Engineering",
  status: "Seeking a 520-hour internship",
  location: "Quezon City, Metro Manila",
  intro: "I’m Kristoffer Reiken Raflores, a fourth-year Computer Science student specializing in Software Engineering. I build responsive interfaces with JavaScript, React, and TypeScript, and I’m looking for an internship where I can keep learning.",
  photo: "assets/photos/1x1.jpg",
  resume: "assets/Kristoffer_Raflores_Intern_Resume.pdf",
  availability: "Required 520-hour OJT. Tentative start: December 2026 or January 2027, subject to my academic schedule.",
  about: [
    "My project work includes a browser-based music player, a team messaging app, and a gamified C++ learning system. I’ve worked on responsive interfaces, browser storage, and manual software testing.",
    "I’m familiar with Git workflows and enjoy contributing to a team. I’m seeking an internship and am open to broader software development responsibilities as I build my skills."
  ],
  focus: ["Responsive interfaces", "Browser-based applications", "Manual software testing"],
  education: {
    school: "FEU Institute of Technology",
    period: "2023–2027",
    degree: "Bachelor of Science in Computer Science",
    specialization: "Specialization in Software Engineering",
    graduation: "Expected graduation: 2027",
    coursework: ["Web Development", "Web Design", "Object-Oriented Programming", "Database Systems", "Human-Computer Interaction", "Software Engineering"]
  },
  skills: [
    { title: "Front-end development", label: "CORE FRONTEND", items: ["HTML5", "CSS3", "JavaScript", "Responsive web design", "React fundamentals", "Tailwind CSS fundamentals"], note: "Building responsive interfaces and reusable components through project work." },
    { title: "Web & browser tools", label: "BROWSER TECHNOLOGIES", items: ["REST API fundamentals", "JSON fundamentals", "localStorage", "IndexedDB"], note: "Working with browser storage and the basics of exchanging data with APIs." },
    { title: "Programming", label: "PROJECT EXPERIENCE & FUNDAMENTALS", items: ["TypeScript project experience", "C++ fundamentals", "Java fundamentals", "Python fundamentals"], note: "TypeScript experience from projects, alongside programming fundamentals from my studies." },
    { title: "Backend & databases", label: "FUNDAMENTALS & INTRODUCTORY EXPOSURE", items: ["SQL fundamentals", "MySQL fundamentals", "PHP: introductory", "Node.js: introductory", "Express.js: introductory"], note: "Foundational database knowledge and introductory exposure to backend development." },
    { title: "Development tools", label: "WORKFLOW", items: ["Git", "GitHub", "VS Code", "Vite", "npm", "Browser developer tools", "Figma: introductory", "Postman: introductory"], note: "Using development tools and Git workflows, with introductory exposure to Figma and Postman." },
    { title: "Testing & documentation", label: "THESIS CONTRIBUTIONS", items: ["Manual functional testing", "Interface testing", "Test cases", "Bug reports", "Retesting", "Thesis writing"], note: "Documenting defects, reporting findings, and checking fixes with the project team." }
  ],
  projects: [
    {
      title: "ForgeLang",
      category: "CS0035 FINAL PROJECT",
      summary: "An RPG-themed programming language and compiler visualizer that explains how code is checked and how variables are stored in a simulated memory map.",
      roleLabel: "PROJECT CONTEXT",
      role: "CS0035 final project · Custom language and compiler exploration",
      tags: ["Python", "Flask", "JavaScript", "HTML", "CSS", "Web Speech API"],
      coverLabel: "FORGELANG",
      coverStyle: "terminal",
      coverSubtitle: "From a line of code to a memory map.",
      coverCode: "hp health equip 100 done\nspawn health done",
      image: "",
      details: "ForgeLang uses RPG-inspired keywords such as hp, xp, lore, and status for data types. Its Python and Flask backend checks input through lexical, syntax, and semantic analysis. The web console displays compilation logs, variable values, and a symbol table with scope levels, simulated memory offsets, and byte widths. It also includes text editing, browser-supported voice input, and spoken feedback.",
      features: ["Custom keywords and checks for declarations, arithmetic, and scopes.", "Error explanations with a line number, reason, rule, and suggested correction.", "A live variable table and symbol table showing simulated memory allocation.", "Text and voice input, spoken status messages, and switchable console layouts."],
      demo: "",
      code: "https://github.com/KenRaf/ForgeLang_CS0035_Final_Project"
    },
    {
      title: "CodeSense",
      category: "GAMIFIED C++ LEARNING SYSTEM · 2025–2026",
      summary: "A gamified C++ debugging and learning system developed by a four-member thesis team. My main contributions were QA testing and thesis writing.",
      role: "QA Tester · Thesis Writing Contributor",
      tags: ["React", "TypeScript", "Supabase", "PostgreSQL"],
      coverLabel: "CODESENSE",
      coverStyle: "code",
      coverSubtitle: "Debugging. Learning. Progress.",
      image: "",
      details: "Performed manual functional and interface testing, documented defects, reported findings to the main programmer, and retested fixes. Contributed to a successfully defended thesis scheduled for presentation at the FEU Tech CS Expo in November 2026. The technologies shown are the project stack.",
      contributions: ["Prepared test cases, bug reports, and documentation.", "Performed functional and interface tests, then retested fixes.", "Supported interface adjustments and Campaign-mode learning questions.", "Contributed to the thesis writing within a four-member team."],
      demo: "",
      code: ""
    },
    {
      title: "Real-Time Messaging Web App",
      category: "TEAM PROJECT · IN PROGRESS · 2026",
      summary: "A responsive messaging platform with direct and group chats, real-time delivery, conversation history, read receipts, and profile customization.",
      role: "Front-End Developer · Three-person team",
      tags: ["React", "JavaScript", "Vite", "Tailwind CSS", "Socket.IO", "Supabase"],
      coverLabel: "MESSAGING",
      coverStyle: "chat",
      coverSubtitle: "Conversations, connected.",
      image: "",
      details: "Collaborating on a responsive messaging platform as part of a three-person team. My work focuses on the login and password-recovery interfaces, persistent light/dark theme, and client-side navigation. Authentication screens are connected to Supabase through the team’s shared workflow.",
      contributions: ["Developed the login and password-recovery interfaces.", "Implemented a persistent light/dark theme and client-side navigation.", "Connected authentication screens to Supabase through the team’s shared workflow."],
      demo: "",
      code: ""
    },
    {
      title: "NightWave",
      category: "BROWSER-BASED MUSIC PLAYER · 2026",
      summary: "A component-based music player with audio uploads, search, playback controls, and a library that saves tracks in the browser.",
      role: "Built the music player and browser storage features",
      tags: ["React", "TypeScript", "Vite", "CSS"],
      coverLabel: "NIGHTWAVE",
      coverStyle: "wave",
      coverSubtitle: "Your tracks. In your browser.",
      image: "",
      details: "Built a browser-based music player with audio upload, search, playback controls, shuffle, repeat, likes, metadata editing, and fullscreen playback. Uploaded audio and track information are preserved in the browser using IndexedDB and localStorage.",
      contributions: ["Built reusable components for the library, upload flow, and player controls.", "Implemented playback controls, shuffle, repeat, likes, and fullscreen playback.", "Added metadata editing and browser storage for uploaded audio and track information."],
      demo: "",
      code: "https://github.com/KenRaf/MusicPlayer-Side-"
    }
  ],
  certificates: [
    {
      title: "IT Specialist - Java",
      issuer: "Certiport, a Pearson VUE business",
      date: "Issued December 2024",
      image: "assets/certificates/Raflores_Java.jpg",
      pdf: "assets/certificates/Java.pdf"
    },
    {
      title: "IT Specialist - Python",
      issuer: "Certiport, a Pearson VUE business",
      date: "Issued July 2025 · Expires July 2030",
      image: "assets/certificates/Raflores_Python.jpg",
      pdf: "assets/certificates/Python.pdf"
    },
    {
      title: "PMI Project Management Ready",
      issuer: "Project Management Institute",
      date: "Issued March 2026 · Expires March 2031",
      image: "assets/certificates/Raflores_PMI.jpg",
      pdf: "assets/certificates/PMI Project Management Ready.pdf"
    }
  ],
  contact: {
    message: "I’m looking for a 520-hour internship, with a tentative start in December 2026 or January 2027, subject to my academic schedule. I’m open to front-end and broader software development responsibilities.",
    email: "rafloreskristoffer@gmail.com",
    phone: "09959070451",
    github: "https://github.com/KenRaf",
    linkedin: "https://www.linkedin.com/in/kristoffer-reiken-raflores-8940b1381/"
  },
  // Set enabled to false to turn off the added effects. Device reduced-motion
  // preferences always take priority. The rest of the website still works.
  animations: {
    enabled: true,
    intro: true,
    spotlight: true,
    reveal: true,
    projectTransitions: true
  },
  music: {
    // Replace this file with your own permitted MP3 to change the track.
    src: "assets/music/Keys Of Moon - The Epic Hero.mp3",
    title: "Keys Of Moon - The Epic Hero",
    volume: 0.25
    /* Background Music Credit:
  Song: The Epic Hero by Keys Of Moon
  Website: https://www.youtube.com/c/keysofmoonmusic
  License: Creative Commons BY-NC 3.0 (https://creativecommons.org/licenses/by-nc/3.0/)
  Powered by BreakingCopyright: https://breakingcopyright.com 
  */
  }
};
