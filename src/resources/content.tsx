import { About, Blog, Gallery, Home, Newsletter, Person, Social, Work } from "@/types";
import { Line, Row, Text } from "@once-ui-system/core";

const person: Person = {
  firstName: "Devanshu",
  lastName: "Patil",
  name: `Devanshu Vijay Patil`,
  role: "Data Engineer",
  avatar: "/images/avatar.jpg",
  email: "devanshupatil1712@gmail.com",
  location: "Asia/Kolkata", // Pune, India — IANA zone powers the header clock
  languages: ["English", "Hindi", "Marathi"],
  locale: "en", // BCP 47 language tag for the HTML lang attribute
};

const newsletter: Newsletter = {
  display: true,
  title: <>Stay in the loop</>,
  description: (
    <>
      Occasional notes from {person.firstName} on data science, machine learning, and building AI
      products — no spam.
    </>
  ),
};

const social: Social = [
  // Links are automatically displayed.
  // Import new icons in /src/resources/icons.ts
  // Set essential: true for links you want to show on the about page
  {
    name: "GitHub",
    icon: "github",
    link: "https://github.com/ddp0411",
    essential: true,
  },
  {
    name: "LinkedIn",
    icon: "linkedin",
    link: "https://www.linkedin.com/in/devanshu-patil-8618b3222/",
    essential: true,
  },
  {
    name: "Email",
    icon: "email",
    link: `mailto:${person.email}`,
    essential: true,
  },
  {
    name: "Resume",
    icon: "document",
    link: "/devanshu-patil-resume.pdf",
    essential: true,
  },
];

const home: Home = {
  path: "/",
  image: "/images/og/home.jpg",
  label: "Home",
  title: `${person.name}'s Portfolio`,
  description: `Portfolio website showcasing my work as a ${person.role}`,
  headline: (
    <>
      Transforming data
      <br />
      into decisions
    </>
  ),
  featured: {
    display: true,
    title: (
      <Row gap="12" vertical="center">
        <strong className="ml-4">New role</strong>{" "}
        <Line background="brand-alpha-strong" vert height="20" />
        <Text marginRight="4" onBackground="brand-medium">
          Data Engineer @ Synthesys
        </Text>
      </Row>
    ),
    href: "/work",
  },
  subline: (
    <>
      I'm {person.firstName}, a {person.role.toLowerCase()} who turns complex datasets into clear,
      actionable insights — through machine learning, NLP, and generative AI, from data pipeline to
      deployed interface.
    </>
  ),
};

const about: About = {
  path: "/about",
  label: "About",
  title: `About – ${person.name}`,
  description: `Meet ${person.name}, ${person.role} from ${person.location}`,
  tableOfContent: {
    display: true,
    subItems: false,
  },
  avatar: {
    display: true,
  },
  calendar: {
    display: false, // no Cal.com/Calendly link
    link: "https://cal.com",
  },
  intro: {
    display: true,
    title: "Introduction",
    description: (
      <>
        I'm a computer engineer with a passion for data science, focused on transforming data into
        actionable insights. Over the past few years I've built and deployed Python applications with
        hands-on exposure to machine learning, NLP, and generative AI (RAG systems) — developing
        skills across data analysis, machine learning, visualization, and agentic AI through
        internships and projects.
        <br />
        <br />
        What draws me to data science is the ability to uncover patterns and solve real-world
        problems. I'm excited about using data to drive smarter decisions and make a positive impact
        across industries.
        <br />
        <br />
        Outside of academics, I enjoy working on collaborative projects and staying up to date with
        the latest trends in the field.
      </>
    ),
  },
  work: {
    display: true,
    title: "Work Experience",
    experiences: [
      {
        company: "Synthesys Solutions Pvt. Ltd.",
        timeframe: "Aug 2026 – Present",
        role: "Data Engineer",
        achievements: [
          <>
            Building and maintaining the data infrastructure that powers analytics and reporting, in
            collaboration with a team of engineers.
          </>,
          <>
            Working with Python, SQL, AWS, and Snowflake to design and run data pipelines end to end.
          </>,
          <>
            Generating insights from the processed data to support decision-making across the
            business.
          </>,
        ],
        tech: ["Python", "SQL", "AWS", "Snowflake"],
        images: [],
      },
      {
        company: "Freelance",
        timeframe: "Apr 2026 – Jul 2026",
        role: "AI Software Developer",
        achievements: [
          <>
            Building AI-native industrial software that leverages IoT and AI, using technologies such
            as Node.js and PostgreSQL.
          </>,
        ],
        tech: ["Node.js", "PostgreSQL", "IoT", "AI"],
        images: [],
      },
      {
        company: "Project Studio, Bangalore",
        timeframe: "Nov 2025 – Mar 2026",
        role: "Data Analytics Intern",
        achievements: [
          <>
            Worked on Apache Superset and Metabase for SQL-based data analysis and dashboard/chart
            creation.
          </>,
          <>Developed and deployed end-to-end automation workflows using n8n.</>,
          <>Gained exposure to the APITemplate platform for automated PDF generation.</>,
        ],
        tech: ["SQL", "Apache Superset", "Metabase", "n8n", "APITemplate"],
        images: [],
      },
      {
        company: "QnQ Solutions | Freelance",
        timeframe: "Jun 2025 – Nov 2025",
        role: "Business Analyst",
        achievements: [
          <>
            Built an end-to-end manufacturing analytics solution in Power BI to evaluate
            profitability, optimize inventory, and improve production efficiency through OEE, revenue,
            and process-variability (MAPE) analysis.
          </>,
          <>
            Analyzed a multi-sheet manufacturing and sales dataset and delivered shift-wise
            comparisons to improve employee efficiency.
          </>,
        ],
        tech: ["Power BI", "Excel", "DAX"],
        images: [],
      },
      {
        company: "Corizo",
        timeframe: "Jan 2024 – Apr 2024",
        role: "Data Science Intern",
        achievements: [
          <>Contributed across all stages of the data-analysis workflow.</>,
          <>Used Python, R, and SQL for data collection, cleaning, and interpretation.</>,
          <>
            Created visualizations with Matplotlib and Seaborn to communicate insights effectively.
          </>,
        ],
        tech: ["Python", "R", "SQL", "Matplotlib", "Seaborn"],
        images: [],
      },
    ],
  },
  studies: {
    display: true,
    title: "Studies",
    institutions: [
      {
        name: "IIT Madras",
        description: <>B.S. in Data Science and its Applications (2023 – present).</>,
      },
      {
        name: "Zeal College of Engineering and Research (SPPU)",
        description: <>B.E. in Computer Engineering (2021 – 2025) · SGPA 8.53.</>,
      },
      {
        name: "Rao Junior College of Science, Pune",
        description: <>Higher Secondary Certificate (HSC), 2019 – 2021 · 92.67%.</>,
      },
      {
        name: "Blue Ridge Public School, Pune",
        description: <>ICSE / ISC (CISCE), 2011 – 2019 · 90%.</>,
      },
    ],
  },
  technical: {
    display: true,
    title: "Technical skills",
    skills: [
      {
        title: "Machine Learning & Deep Learning",
        description: (
          <>
            Building and training predictive and deep-learning models — from classical ML with
            scikit-learn to neural networks (including LSTMs) in TensorFlow, Keras, and PyTorch.
          </>
        ),
        tags: [
          { name: "Python", icon: "python" },
          { name: "scikit-learn", icon: "scikitlearn" },
          { name: "TensorFlow", icon: "tensorflow" },
          { name: "Keras" },
          { name: "PyTorch" },
          { name: "NumPy" },
        ],
        images: [],
      },
      {
        title: "Generative & Agentic AI",
        description: (
          <>
            Building LLM-powered applications — including Retrieval-Augmented Generation (RAG)
            systems with semantic embeddings, vector search, and retrieval reranking.
          </>
        ),
        tags: [
          { name: "Python", icon: "python" },
          { name: "OpenAI", icon: "openai" },
          { name: "LangChain" },
          { name: "RAG" },
          { name: "FAISS" },
          { name: "Hugging Face" },
          { name: "NLTK" },
        ],
        images: [],
      },
      {
        title: "Data Analysis & Visualization",
        description: (
          <>
            Exploring and analysing data with pandas, and communicating findings through Power BI and
            Tableau dashboards and Matplotlib/Seaborn charts.
          </>
        ),
        tags: [
          { name: "pandas", icon: "pandas" },
          { name: "Power BI" },
          { name: "Tableau", icon: "tableau" },
          { name: "Matplotlib" },
          { name: "Seaborn" },
        ],
        images: [],
      },
      {
        title: "Databases",
        description: <>Designing and querying relational and document databases.</>,
        tags: [
          { name: "MySQL", icon: "mysql" },
          { name: "MongoDB", icon: "mongodb" },
        ],
        images: [],
      },
      {
        title: "Cloud & DevOps",
        description: (
          <>
            Deploying and versioning work across AWS, Azure, and Google Cloud with Git, Docker, and
            CI/CD via GitHub Actions.
          </>
        ),
        tags: [
          { name: "AWS", icon: "aws" },
          { name: "Azure" },
          { name: "GCP", icon: "gcp" },
          { name: "Git", icon: "git" },
          { name: "Docker" },
        ],
        images: [],
      },
      {
        title: "Web",
        description: <>Building interfaces and portfolio work with the web fundamentals.</>,
        tags: [
          { name: "HTML", icon: "html" },
          { name: "CSS", icon: "css" },
          { name: "JavaScript", icon: "javascript" },
        ],
        images: [],
      },
    ],
  },
};

const blog: Blog = {
  path: "/blog",
  label: "Blog",
  title: "Writing about data and tech...",
  description: `Read what ${person.name} has been up to recently`,
  // Create new blog posts by adding a new .mdx file to app/blog/posts
};

// "Work" tab = professional & academic experience (reuses about.work + about.studies data)
const work: Work = {
  path: "/work",
  label: "Work-Ex",
  title: `Work Experience – ${person.name}`,
  description: `Professional and academic experience of ${person.name}`,
};

// "Projects" tab = project case studies (.mdx files in app/projects/projects)
const projects: Work = {
  path: "/projects",
  label: "Projects",
  title: `Projects – ${person.name}`,
  description: `Data science and engineering projects by ${person.name}`,
};

// "Publications" tab = peer-reviewed papers
const publications: Work = {
  path: "/publications",
  label: "Publications",
  title: `Publications – ${person.name}`,
  description: `Peer-reviewed research published by ${person.name}`,
};

const gallery: Gallery = {
  path: "/gallery",
  label: "Gallery",
  title: `Photo gallery – ${person.name}`,
  description: `A photo collection by ${person.name}`,
  images: [],
};

export { person, social, newsletter, home, about, blog, work, projects, publications, gallery };
