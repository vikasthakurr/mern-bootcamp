const keywordCategories = {
  technical: {
    label: "Technical Skills",
    keywords: [
      "javascript",
      "python",
      "java",
      "react",
      "angular",
      "vue",
      "node.js",
      "nodejs",
      "express",
      "mongodb",
      "postgresql",
      "mysql",
      "sql",
      "nosql",
      "html",
      "css",
      "typescript",
      "graphql",
      "rest api",
      "rest apis",
      "git",
      "github",
      "docker",
      "kubernetes",
      "aws",
      "azure",
      "gcp",
      "firebase",
      "redis",
      "webpack",
      "next.js",
      "nextjs",
      "tailwind",
      "bootstrap",
      "sass",
      "less",
      "jquery",
      "c++",
      "c#",
      "ruby",
      "php",
      "swift",
      "kotlin",
      "flutter",
      "react native",
      "django",
      "flask",
      "spring boot",
      "laravel",
      "ci/cd",
      "jenkins",
      "terraform",
      "linux",
      "agile",
      "scrum",
      "jira",
      "figma",
      "photoshop",
    ],
  },
  soft: {
    label: "Soft Skills",
    keywords: [
      "leadership",
      "communication",
      "teamwork",
      "problem-solving",
      "problem solving",
      "collaboration",
      "adaptability",
      "time management",
      "critical thinking",
      "creativity",
      "project management",
      "decision making",
      "presentation",
      "negotiation",
      "conflict resolution",
      "attention to detail",
    ],
  },
  action: {
    label: "Action Verbs",
    keywords: [
      "developed",
      "built",
      "designed",
      "implemented",
      "managed",
      "led",
      "created",
      "optimized",
      "improved",
      "increased",
      "reduced",
      "delivered",
      "architected",
      "deployed",
      "automated",
      "analyzed",
      "integrated",
      "launched",
      "maintained",
      "collaborated",
      "mentored",
      "spearheaded",
      "streamlined",
      "engineered",
      "established",
      "coordinated",
      "resolved",
      "contributed",
      "refactored",
    ],
  },
  metrics: {
    label: "Quantifiable Metrics",
    keywords: [
      "percent",
      "increased by",
      "reduced by",
      "improved by",
      "revenue",
      "users",
      "traffic",
      "performance",
      "efficiency",
      "cost",
      "budget",
      "team of",
      "clients",
      "projects",
      "applications",
    ],
  },
};

const resumeSections = [
  {
    name: "Contact Information",
    patterns: ["email", "phone", "@", "linkedin"],
  },
  {
    name: "Skills",
    patterns: ["skills", "technical skills", "technologies", "proficient"],
  },
  {
    name: "Experience",
    patterns: ["experience", "work history", "employment", "worked at"],
  },
  {
    name: "Education",
    patterns: [
      "education",
      "degree",
      "university",
      "college",
      "b.tech",
      "b.sc",
      "m.tech",
      "mba",
    ],
  },
  {
    name: "Projects",
    patterns: ["projects", "project", "built", "developed", "created"],
  },
  {
    name: "Certifications",
    patterns: ["certification", "certified", "certificate", "course"],
  },
];

const scoreMessages = [
  {
    min: 0,
    max: 30,
    message:
      "Needs significant improvement. Your resume doesn't match the job well.",
    color: "#ff6b6b",
  },
  {
    min: 31,
    max: 50,
    message:
      "Below average. Consider adding more relevant keywords and details.",
    color: "#ff9f43",
  },
  {
    min: 51,
    max: 70,
    message: "Decent match. A few improvements could boost your chances.",
    color: "#f0a500",
  },
  {
    min: 71,
    max: 85,
    message: "Good match! Your resume aligns well with the job description.",
    color: "#00d4aa",
  },
  {
    min: 86,
    max: 100,
    message: "Excellent match! Your resume is highly optimized for this role.",
    color: "#00ff88",
  },
];

const STORAGE_KEY = "resumeiq.inputs";

let lastMissing = [];

function normalizeText(text) {
  return text
    .toLowerCase()
    .replace(/[^\w\s/.#+@-]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function escapeRegex(str) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function containsTerm(normalizedText, term) {
  const t = term.toLowerCase();
  if (/[a-z0-9]$/.test(t) && /^[a-z0-9]/.test(t)) {
    const pattern = new RegExp(
      "(^|[^a-z0-9])" + escapeRegex(t) + "([^a-z0-9]|$)",
      "i",
    );
    return pattern.test(normalizedText);
  }
  return normalizedText.includes(t);
}

function extractJobKeywords(jobText) {
  const normalized = normalizeText(jobText);
  const found = [];
  Object.keys(keywordCategories).forEach(function (category) {
    keywordCategories[category].keywords.forEach(function (keyword) {
      if (!found.includes(keyword) && containsTerm(normalized, keyword)) {
        found.push(keyword);
      }
    });
  });
  return found;
}

function matchKeywords(resumeText, jobKeywords) {
  const normalizedResume = normalizeText(resumeText);
  const matched = [];
  const missing = [];
  jobKeywords.forEach(function (keyword) {
    if (containsTerm(normalizedResume, keyword)) {
      matched.push(keyword);
    } else {
      missing.push(keyword);
    }
  });
  return { matched: matched, missing: missing };
}

function analyzeSections(resumeText) {
  const normalizedResume = normalizeText(resumeText);
  return resumeSections.map(function (section) {
    const found = section.patterns.some(function (pattern) {
      return containsTerm(normalizedResume, pattern);
    });
    return { name: section.name, found: found };
  });
}

function calculateCategoryScores(resumeText, jobText) {
  const normalizedResume = normalizeText(resumeText);
  const normalizedJob = normalizeText(jobText);
  return Object.keys(keywordCategories).map(function (category) {
    const catData = keywordCategories[category];
    let jobRelevant = 0;
    let resumeMatched = 0;
    catData.keywords.forEach(function (keyword) {
      if (containsTerm(normalizedJob, keyword)) {
        jobRelevant++;
        if (containsTerm(normalizedResume, keyword)) {
          resumeMatched++;
        }
      }
    });
    const score =
      jobRelevant > 0 ? Math.round((resumeMatched / jobRelevant) * 100) : 0;
    return {
      label: catData.label,
      score: score,
      matched: resumeMatched,
      total: jobRelevant,
    };
  });
}

function generateSuggestions(missing, sectionResults, score) {
  const suggestions = [];

  sectionResults.forEach(function (section) {
    if (!section.found) {
      suggestions.push('Add a "' + section.name + '" section to your resume.');
    }
  });

  if (missing.length > 5) {
    suggestions.push(
      "Add more relevant keywords from the job description. You're missing " +
        missing.length +
        " key terms.",
    );
  }

  const missingActions = missing.filter(function (kw) {
    return keywordCategories.action.keywords.includes(kw);
  });
  if (missingActions.length > 2) {
    suggestions.push(
      "Use stronger action verbs like: " +
        missingActions.slice(0, 4).join(", ") +
        ".",
    );
  }

  const missingMetrics = missing.filter(function (kw) {
    return keywordCategories.metrics.keywords.includes(kw);
  });
  if (missingMetrics.length > 0) {
    suggestions.push(
      "Add quantifiable achievements (numbers, percentages, metrics) to stand out.",
    );
  }

  if (score < 50) {
    suggestions.push(
      "Tailor your resume specifically for this job. Mirror the language used in the JD.",
    );
    suggestions.push(
      "Consider adding a professional summary that highlights your most relevant skills.",
    );
  } else if (score < 75) {
    suggestions.push(
      "Good start! Focus on adding the missing technical keywords naturally in your experience section.",
    );
  }

  if (suggestions.length === 0) {
    suggestions.push(
      "Your resume looks well-optimized! Keep it concise and ensure formatting is ATS-friendly.",
    );
  }

  return suggestions;
}

function countWords(text) {
  const trimmed = text.trim();
  return trimmed ? trimmed.split(/\s+/).length : 0;
}

function calculateATSScore(matchedCount, total, sectionResults, wordCount) {
  const keywordScore = total > 0 ? (matchedCount / total) * 60 : 0;

  const sectionsFound = sectionResults.filter(function (s) {
    return s.found;
  }).length;
  const sectionScore = (sectionsFound / sectionResults.length) * 25;

  let lengthScore = 0;
  if (wordCount > 200) lengthScore = 15;
  else if (wordCount > 100) lengthScore = 10;
  else if (wordCount > 50) lengthScore = 5;

  return Math.min(100, Math.round(keywordScore + sectionScore + lengthScore));
}

function getScoreMessage(score) {
  return (
    scoreMessages.find(function (item) {
      return score >= item.min && score <= item.max;
    }) || scoreMessages[0]
  );
}

function renderKeywords(containerId, keywords, className) {
  const container = document.getElementById(containerId);
  container.innerHTML = "";
  if (keywords.length === 0) {
    const empty = document.createElement("span");
    empty.className = "keyword-empty";
    empty.textContent = "None";
    container.appendChild(empty);
    return;
  }
  keywords.forEach(function (keyword) {
    const tag = document.createElement("span");
    tag.className = "keyword-tag " + className;
    tag.textContent = keyword;
    container.appendChild(tag);
  });
}

function renderSections(sectionResults) {
  const container = document.getElementById("sectionAnalysis");
  container.innerHTML = "";
  sectionResults.forEach(function (section) {
    const item = document.createElement("div");
    item.className = "section-item";
    const statusClass = section.found ? "found" : "not-found";
    const statusText = section.found ? "Found" : "Missing";
    const name = document.createElement("span");
    name.textContent = section.name;
    const status = document.createElement("span");
    status.className = "section-status " + statusClass;
    status.textContent = statusText;
    item.appendChild(name);
    item.appendChild(status);
    container.appendChild(item);
  });
}

function renderCategoryBars(categoryScores) {
  const container = document.getElementById("categoryBars");
  container.innerHTML = "";
  categoryScores.forEach(function (cat) {
    const item = document.createElement("div");
    item.className = "category-item";
    item.innerHTML =
      '<div class="category-label">' +
      "<span>" +
      cat.label +
      " (" +
      cat.matched +
      "/" +
      cat.total +
      ")</span>" +
      "<span>" +
      cat.score +
      "%</span>" +
      "</div>" +
      '<div class="category-bar">' +
      '<div class="category-bar-fill" style="width: 0%"></div>' +
      "</div>";
    container.appendChild(item);
    requestAnimationFrame(function () {
      item.querySelector(".category-bar-fill").style.width = cat.score + "%";
    });
  });
}

function renderSuggestions(suggestions) {
  const container = document.getElementById("suggestionsList");
  container.innerHTML = "";
  suggestions.forEach(function (suggestion) {
    const li = document.createElement("li");
    li.textContent = suggestion;
    container.appendChild(li);
  });
}

function animateScore(score, color) {
  const circle = document.getElementById("scoreCircle");
  const circumference = 2 * Math.PI * 45;
  const offset = circumference - (score / 100) * circumference;
  circle.style.stroke = color;
  circle.style.strokeDashoffset = offset;

  const scoreEl = document.getElementById("scoreValue");
  const reduceMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)",
  ).matches;
  if (reduceMotion) {
    scoreEl.textContent = score;
    return;
  }
  let current = 0;
  const increment = Math.max(1, Math.ceil(score / 40));
  const timer = setInterval(function () {
    current += increment;
    if (current >= score) {
      current = score;
      clearInterval(timer);
    }
    scoreEl.textContent = current;
  }, 30);
}

function showError(id, message) {
  const el = document.getElementById(id);
  if (!el) return;
  el.textContent = message;
  el.classList.toggle("visible", Boolean(message));
}

function saveInputs(resumeText, jobText) {
  try {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ resume: resumeText, job: jobText }),
    );
  } catch (e) {
    /* storage unavailable, ignore */
  }
}

function loadInputs() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return;
    const data = JSON.parse(raw);
    if (data.resume) document.getElementById("resumeInput").value = data.resume;
    if (data.job) document.getElementById("jobInput").value = data.job;
  } catch (e) {
    /* ignore parse errors */
  }
}

async function extractTextFromFile(file) {
  const name = file.name.toLowerCase();

  if (name.endsWith(".txt")) {
    return await file.text();
  }

  if (name.endsWith(".pdf")) {
    if (!window.pdfjsLib) throw new Error("PDF reader not loaded.");
    const buffer = await file.arrayBuffer();
    const pdf = await window.pdfjsLib.getDocument({ data: buffer }).promise;
    let text = "";
    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const content = await page.getTextContent();
      text +=
        content.items
          .map(function (item) {
            return item.str;
          })
          .join(" ") + "\n";
    }
    return text;
  }

  if (name.endsWith(".docx")) {
    if (!window.mammoth) throw new Error("DOCX reader not loaded.");
    const buffer = await file.arrayBuffer();
    const result = await window.mammoth.extractRawText({ arrayBuffer: buffer });
    return result.value;
  }

  throw new Error("Unsupported file type. Use .txt, .pdf, or .docx");
}

function setupFileUpload(inputId, textareaId, statusId, errorId) {
  const fileInput = document.getElementById(inputId);
  const textarea = document.getElementById(textareaId);
  const status = document.getElementById(statusId);

  fileInput.addEventListener("change", async function () {
    const file = fileInput.files[0];
    if (!file) return;
    showError(errorId, "");
    status.textContent = "Reading " + file.name + "...";
    try {
      const text = await extractTextFromFile(file);
      textarea.value = text.trim();
      status.textContent = "Loaded: " + file.name;
    } catch (err) {
      status.textContent = "";
      showError(errorId, err.message || "Could not read file.");
    } finally {
      fileInput.value = "";
    }
  });
}

function analyzeResume() {
  const resumeText = document.getElementById("resumeInput").value.trim();
  const jobText = document.getElementById("jobInput").value.trim();

  showError("resumeError", "");
  showError("jobError", "");

  let hasError = false;
  if (!resumeText) {
    showError("resumeError", "Please paste or upload your resume content.");
    hasError = true;
  }
  if (!jobText) {
    showError("jobError", "Please paste or upload the job description.");
    hasError = true;
  }
  if (hasError) return;

  const jobKeywords = extractJobKeywords(jobText);
  if (jobKeywords.length === 0) {
    showError(
      "jobError",
      "Could not find recognizable skills in the job description. Add more detail.",
    );
    return;
  }

  const { matched, missing } = matchKeywords(resumeText, jobKeywords);
  const sectionResults = analyzeSections(resumeText);
  const wordCount = countWords(resumeText);
  const atsScore = calculateATSScore(
    matched.length,
    jobKeywords.length,
    sectionResults,
    wordCount,
  );
  const categoryScores = calculateCategoryScores(resumeText, jobText);
  const scoreMsg = getScoreMessage(atsScore);
  const suggestions = generateSuggestions(missing, sectionResults, atsScore);

  saveInputs(resumeText, jobText);

  document.getElementById("results").classList.remove("hidden");
  document.getElementById("matchedCount").textContent = matched.length;
  document.getElementById("missingCount").textContent = missing.length;
  document.getElementById("scoreMessage").textContent = scoreMsg.message;

  renderKeywords("matchedKeywords", matched, "matched");
  renderKeywords("missingKeywords", missing, "missing");
  renderSections(sectionResults);
  renderCategoryBars(categoryScores);
  renderSuggestions(suggestions);
  animateScore(atsScore, scoreMsg.color);

  lastMissing = missing;

  window.ResumeIQ = {
    resumeText: resumeText,
    jobText: jobText,
    score: atsScore,
    matched: matched,
    missing: missing,
    sections: sectionResults,
  };
  document.dispatchEvent(new CustomEvent("resumeiq:analyzed"));

  document.getElementById("results").scrollIntoView({ behavior: "smooth" });
}

function copyMissingKeywords() {
  const missing = lastMissing;
  const status = document.getElementById("copyStatus");
  if (missing.length === 0) {
    status.textContent = "Nothing to copy.";
    return;
  }
  navigator.clipboard.writeText(missing.join(", ")).then(
    function () {
      status.textContent = "Copied " + missing.length + " keywords.";
    },
    function () {
      status.textContent = "Copy failed.";
    },
  );
}

function initThemeToggle() {
  const toggle = document.getElementById("themeToggle");
  if (!toggle) return;
  toggle.addEventListener("click", function () {
    const root = document.documentElement;
    const next = root.getAttribute("data-theme") === "light" ? "dark" : "light";
    root.setAttribute("data-theme", next);
    try {
      localStorage.setItem("resumeiq.theme", next);
    } catch (e) {}
  });
}

document.getElementById("analyzeBtn").addEventListener("click", analyzeResume);
document
  .getElementById("copyMissingBtn")
  .addEventListener("click", copyMissingKeywords);
setupFileUpload("resumeFile", "resumeInput", "resumeFileStatus", "resumeError");
setupFileUpload("jobFile", "jobInput", "jobFileStatus", "jobError");
initThemeToggle();
loadInputs();
