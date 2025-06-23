
export const financialProviders = [
  {
    id: "danacepat-finance",
    name: "DanaCepat Finance",
    logo: "https://placehold.co/100x100.png",
    description: "Quick and easy financing for certified training programs with competitive rates.",
    tags: ["Personal Loans", "Education Credit"],
    dataAiHint: "finance logo",
    financingSchemes: "We offer personal loans and education credit with flexible repayment terms. Our focus is on supporting students in vocational and tech training programs. Interest rates start from 1.5% per month.",
    contact: {
        email: "contact@danacepat.com",
        website: "https://www.danacepat.com",
    }
  },
  {
    id: "maju-bersama-capital",
    name: "Maju Bersama Capital",
    logo: "https://placehold.co/100x100.png",
    description: "Flexible financing solutions for vocational training and skill development.",
    tags: ["Micro Loans", "Skill Development Fund"],
    dataAiHint: "investment logo",
    financingSchemes: "Our micro-loans are designed for short-term courses, while our Skill Development Fund supports longer-term vocational education. We partner directly with LPKs.",
    contact: {
        email: "support@majubersama.com",
        website: "https://www.majubersama.com",
    }
  },
  {
    id: "amanah-syariah-funding",
    name: "Amanah Syariah Funding",
    logo: "https://placehold.co/100x100.png",
    description: "Sharia-compliant financing for all types of professional training courses.",
    tags: ["Syariah Compliant", "Interest-Free"],
    dataAiHint: "islamic finance",
    financingSchemes: "We provide interest-free, Sharia-compliant loans based on Murabahah and Ijarah contracts. Our goal is to make education accessible without compromising religious principles.",
    contact: {
        email: "info@amanahsyariah.id",
        website: "https://www.amanahsyariah.id",
    }
  },
  {
    id: "global-ed-venture",
    name: "Global Ed-Venture",
    logo: "https://placehold.co/100x100.png",
    description: "Specialized in funding for international standard training and certifications.",
    tags: ["International Certification", "Study Abroad"],
    dataAiHint: "education logo",
    financingSchemes: "Funding available for students pursuing internationally recognized certifications like CISCO, Microsoft, or preparing for study abroad programs. We cover tuition and living expenses.",
     contact: {
        email: "admissions@globaledventure.com",
        website: "https://www.globaledventure.com",
    }
  },
  {
    id: "kredit-pintar-edukasi",
    name: "Kredit Pintar Edukasi",
    logo: "https://placehold.co/100x100.png",
    description: "Smart and accessible educational loans with a fast approval process.",
    tags: ["Fast Approval", "Online Courses"],
    dataAiHint: "smart loan",
    financingSchemes: "Fully online application process with approval in under 24 hours. Perfect for bootcamps and online courses. We disburse funds directly to the training provider.",
     contact: {
        email: "cs@kreditpintar.co.id",
        website: "https://www.kreditpintar.co.id",
    }
  },
  {
    id: "usaha-mandiri-finance",
    name: "Usaha Mandiri Finance",
    logo: "https://placehold.co/100x100.png",
    description: "Supporting small and medium enterprises with training-related financing.",
    tags: ["SME Support", "Corporate Training"],
    dataAiHint: "business finance",
    financingSchemes: "We offer financing for companies looking to upskill their employees. Our corporate packages can be tailored to the needs of your business and training program.",
     contact: {
        email: "corporate@usahamandiri.com",
        website: "https://www.usahamandiri.com",
    }
  },
];

export const students = [
  {
    id: "std-001",
    name: "Budi Hartono",
    email: "budi.hartono@example.com",
    program: "Digital Marketing Bootcamp",
    status: "Active",
    avatar: "https://placehold.co/100x100.png",
    dataAiHint: "student portrait",
    enrollmentDate: "2023-01-15",
    dateOfBirth: "2000-05-20",
    previousEducation: "SMA Negeri 1 Jakarta",
    parentName: "Slamet Hartono",
    progress: 75,
    contact: {
      phone: "081234567890",
      address: "Jl. Merdeka No. 1, Jakarta"
    },
    grades: {
      "Introduction": "A",
      "SEO": "B+",
      "SEM": "A-",
      "Social Media": "In Progress"
    }
  },
  {
    id: "std-002",
    name: "Citra Dewi",
    email: "citra.dewi@example.com",
    program: "Full-Stack Web Development",
    status: "Completed",
    avatar: "https://placehold.co/100x100.png",
    dataAiHint: "student portrait",
    enrollmentDate: "2022-11-20",
    dateOfBirth: "1999-11-10",
    previousEducation: "SMK Telkom Bandung",
    parentName: "Asep Sunandar",
    progress: 100,
    contact: {
      phone: "081234567891",
      address: "Jl. Sudirman No. 2, Bandung"
    },
    grades: {
      "HTML/CSS": "A",
      "JavaScript": "A",
      "React": "A-",
      "Node.js": "B+"
    }
  },
  {
    id: "std-003",
    name: "Eka Putra",
    email: "eka.putra@example.com",
    program: "UI/UX Design Fundamentals",
    status: "Active",
    avatar: "https://placehold.co/100x100.png",
    dataAiHint: "student portrait",
    enrollmentDate: "2023-02-01",
    dateOfBirth: "2001-02-25",
    previousEducation: "SMA Gajah Mada",
    parentName: "Joko Widodo",
    progress: 40,
     contact: {
      phone: "081234567892",
      address: "Jl. Gajah Mada No. 3, Surabaya"
    },
    grades: {
      "Design Thinking": "A",
      "Wireframing": "B",
      "Prototyping": "In Progress",
      "User Testing": "Not Started"
    }
  },
  {
    id: "std-004",
    name: "Fitri Indah",
    email: "fitri.indah@example.com",
    program: "Data Science with Python",
    status: "Withdrawn",
    avatar: "https://placehold.co/100x100.png",
    dataAiHint: "student portrait",
    enrollmentDate: "2023-01-10",
    dateOfBirth: "2002-08-17",
    previousEducation: "MAN 2 Medan",
    parentName: "Bambang Pamungkas",
    progress: 20,
     contact: {
      phone: "081234567893",
      address: "Jl. Pahlawan No. 4, Medan"
    },
    grades: {
      "Python Basics": "C",
      "Pandas": "Incomplete",
      "Matplotlib": "Not Started",
      "Scikit-learn": "Not Started"
    }
  },
];

export const programs = [
  { id: 'prog-01', name: 'Digital Marketing Bootcamp', duration: '3 Months' },
  { id: 'prog-02', name: 'Full-Stack Web Development', duration: '6 Months' },
  { id: 'prog-03', name: 'UI/UX Design Fundamentals', duration: '8 Weeks' },
  { id: 'prog-04', name: 'Data Science with Python', duration: '4 Months' },
];

export const jobs = [
  {
    id: "job-001",
    title: "Welder",
    company: "Mitsubishi Heavy Industries, Japan",
    cost: "Rp 25.000.000",
    departureDate: "2024-12-15",
    studentIds: ["std-001", "std-002"],
  },
  {
    id: "job-002",
    title: "Caregiver",
    company: "Sakura Home, Japan",
    cost: "Rp 20.000.000",
    departureDate: "2024-11-30",
    studentIds: ["std-003"],
  },
  {
    id: "job-003",
    title: "Hospitality Staff",
    company: "Seoul Grand Hotel, South Korea",
    cost: "Rp 18.000.000",
    departureDate: "2025-01-20",
    studentIds: [],
  },
  {
    id: "job-004",
    title: "Automotive Assembly",
    company: "Hyundai Motors, South Korea",
    cost: "Rp 22.000.000",
    departureDate: "2024-12-01",
    studentIds: ["std-004"],
  },
];
