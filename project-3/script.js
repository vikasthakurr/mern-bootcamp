// ===== ResumeIQ - ATS Resume Scorer =====
// Uses: Functions, Arrays, Strings, Objects

// ===== Keyword Database (Object) =====
const keywordCategories = {
  technical: {
    label: "Technical Skills",
    keywords: [
      "javascript", "python", "java", "react", "angular", "vue", "node.js", "nodejs",
      "express", "mongodb", "postgresql", "mysql", "sql", "nosql", "html", "css",
      "typescript", "graphql", "rest api", "rest apis", "git", "github", "docker",
      "kubernetes", "aws", "azure", "gcp", "firebase", "redis", "webpack",
      "next.js", "nextjs", "tailwind", "bootstrap", "sass", "less", "jquery",
      "c++", "c#", "ruby", "php", "swift", "kotlin", "flutter", "react native",
      "django", "flask", "spring boot", "laravel", "ci/cd", "jenkins", "terraform",
      "linux", "agile", "scrum", "jira", "figma", "photoshop"
    ]
  },
  soft: {
    label: "Soft Skills",
    keywords: [
      "leadership", "communication", "teamwork", "problem-solving", "problem solving",
      "collaboration", "adaptability", "time management", "critical thinking",
      "creativity", "project management", "decision making", "mentoring",
      "presentation", "negotiation", "conflict resolution", "attention to detail"
    ]
  },
  action: {
    label: "Action Verbs",
    keywords: [
      "developed", "built", "designed", "implemented", "managed", "led", "created",
      "optimized", "improved", "increased", "reduced", "delivered", "architected",
      "deployed", "automated", "analyzed", "integrated", "launched", "maintained",
      "collaborated", "mentored", "spearheaded", "streamlined", "engineered",
      "established", "coordinated", "resolved", "contributed", "refactored"
    ]
  },
  metrics: {
    label: "Quantifiable Metrics",
    keywords: [
      "%", "percent", "increased by", "reduced by", "improved by", "revenue",
      "users", "traffic", "performance", "efficiency", "cost", "budget",
      "team of", "clients", "projects", "applications"
    ]
  }
};

// ===== Resume Sections to Check (Array of Objects) =====
const resumeSections = [
  { name: "Contact Information", patterns: ["email", "phone", "@", ".com", "linkedin"] },
  { name: "Skills", patterns: ["skills", "technical skills", "technologies", "proficient"] },
  { name: "Experience", patterns: ["experience", "work history", "employment", "worked at"] },
  { name: "Education", patterns: ["education", "degree", "university", "college", "b.tech", "b.sc", "m.tech", "mba"] },
  { name: "Projects", patterns: ["projects", "project", "built", "developed", "created"] },
  { name: "Certifications", patterns: ["certification", "certified", "certificate", "course"] }
];

// ===== Score Messages (Array) =====
const scoreMessages = [
  { min: 0, max: 30, message: "Needs significant improvement. Your resume doesn't match the job well.", color: "#ff6b6b" },
  { min: 31, max: 50, message: "Below average. Consider adding more relevant keywords and details.", color: "#ff9f43" },
  { min: 51, max: 70, message: "Decent match. A few improvements could boost your chances.", color: "#f0a500" },
  { min: 71, max: 85, message: "Good match! Your resume aligns well with the job description.", color: "#00d4aa" },
  { min: 86, max: 100, message: "Excellent match! Your resume is highly optimized for this role.", color: "#00ff88" }
];

// ===== Utility Functions =====

// Function to normalize text (convert to lowercase, remove special chars)
function normalizeText(text) {
  return text.toLowerCase().replace(/[^\w\s/.#+@-]/g, ' ').replace(/\s+/g, ' ').trim();
}

// Function to extract keywords from job description
function extractJobKeywords(jobText) {
  const normalized = normalizeText(jobText);
  const foundKeywords = [];

  // Search through all categories
  Object.keys(keywordCategories).forEach(function(category) {
    const categoryKeywords = keywordCategories[category].keywords;

    categoryKeywords.forEach(function(keyword) {
      if (normalized.includes(keyword.toLowerCase()) && !foundKeywords.includes(keyword)) {
        foundKeywords.push(keyword);
      }
    });
  });

  // Also extract custom words (nouns/important terms from JD that aren't in our database)
  const words = normalized.split(' ');
  const commonWords = ["the", "a", "an", "is", "are", "was", "were", "be", "been",
    "have", "has", "had", "do", "does", "did", "will", "would", "could", "should",
    "may", "might", "shall", "can", "and", "or", "but", "in", "on", "at", "to",
    "for", "of", "with", "by", "from", "as", "into", "through", "during", "before",
    "after", "above", "below", "between", "out", "off", "over", "under", "again",
    "further", "then", "once", "here", "there", "when", "where", "why", "how",
    "all", "each", "every", "both", "few", "more", "most", "other", "some", "such",
    "no", "not", "only", "own", "same", "so", "than", "too", "very", "just",
    "because", "if", "while", "about", "up", "we", "you", "they", "i", "he", "she",
    "it", "this", "that", "these", "those", "am", "what", "which", "who", "whom",
    "its", "his", "her", "their", "our", "your", "my", "me", "him", "us", "them",
    "also", "new", "like", "well", "even", "any", "must", "need", "look", "looking",
    "work", "working", "year", "years", "plus", "etc", "including", "strong",
    "experience", "preferred", "required", "ability", "knowledge", "understanding"];

  words.forEach(function(word) {
    if (word.length > 3 && !commonWords.includes(word) && !foundKeywords.includes(word)) {
      // Check if it's likely a skill/technology (not already captured)
      const allDbKeywords = [];
      Object.keys(keywordCategories).forEach(function(cat) {
        keywordCategories[cat].keywords.forEach(function(kw) {
          allDbKeywords.push(kw);
        });
      });
      // Skip if already a partial match
      const isPartial = allDbKeywords.some(function(kw) {
        return kw.includes(word) || word.includes(kw);
      });
      if (!isPartial && word.match(/^[a-z]+$/)) {
        // Don't add generic words
      }
    }
  });

  return foundKeywords;
}

// Function to check which keywords from JD are present in resume
function matchKeywords(resumeText, jobKeywords) {
  const normalizedResume = normalizeText(resumeText);
  const matched = [];
  const missing = [];

  jobKeywords.forEach(function(keyword) {
    if (normalizedResume.includes(keyword.toLowerCase())) {
      matched.push(keyword);
    } else {
      missing.push(keyword);
    }
  });

  return { matched: matched, missing: missing };
}

// Function to analyze resume sections
function analyzeSections(resumeText) {
  const normalizedResume = normalizeText(resumeText);
  const results = [];

  resumeSections.forEach(function(section) {
    const found = section.patterns.some(function(pattern) {
      return normalizedResume.includes(pattern);
    });

    results.push({
      name: section.name,
      found: found
    });
  });

  return results;
}

// Function to calculate category scores
function calculateCategoryScores(resumeText, jobText) {
  const normalizedResume = normalizeText(resumeText);
  const normalizedJob = normalizeText(jobText);
  const scores = [];

  Object.keys(keywordCategories).forEach(function(category) {
    const catData = keywordCategories[category];
    let jobRelevant = 0;
    let resumeMatched = 0;

    catData.keywords.forEach(function(keyword) {
      if (normalizedJob.includes(keyword.toLowerCase())) {
        jobRelevant++;
        if (normalizedResume.includes(keyword.toLowerCase())) {
          resumeMatched++;
        }
      }
    });

    const score = jobRelevant > 0 ? Math.round((resumeMatched / jobRelevant) * 100) : 0;

    scores.push({
      label: catData.label,
      score: score,
      matched: resumeMatched,
      total: jobRelevant
    });
  });

  return scores;
}

// Function to generate suggestions
function generateSuggestions(missing, sectionResults, score) {
  const suggestions = [];

  // Check for missing sections
  sectionResults.forEach(function(section) {
    if (!section.found) {
      suggestions.push("Add a \"" + section.name + "\" section to your resume.");
    }
  });

  // Check for missing keywords
  if (missing.length > 5) {
    suggestions.push("Add more relevant keywords from the job description. You're missing " + missing.length + " key terms.");
  }

  // Check for action verbs
  const missingActions = missing.filter(function(kw) {
    return keywordCategories.action.keywords.includes(kw);
  });
  if (missingActions.length > 2) {
    suggestions.push("Use stronger action verbs like: " + missingActions.slice(0, 4).join(", ") + ".");
  }

  // Check for metrics
  const missingMetrics = missing.filter(function(kw) {
    return keywordCategories.metrics.keywords.includes(kw);
  });
  if (missingMetrics.length > 0) {
    suggestions.push("Add quantifiable achievements (numbers, percentages, metrics) to stand out.");
  }

  // General tips based on score
  if (score < 50) {
    suggestions.push("Tailor your resume specifically for this job. Mirror the language used in the JD.");
    suggestions.push("Consider adding a professional summary that highlights your most relevant skills.");
  }

  if (score >= 50 && score < 75) {
    suggestions.push("Good start! Focus on adding the missing technical keywords naturally in your experience section.");
  }

  if (suggestions.length === 0) {
    suggestions.push("Your resume looks well-optimized! Keep it concise and ensure formatting is ATS-friendly.");
  }

  return suggestions;
}

// Function to calculate overall ATS score
function calculateATSScore(matched, total, sectionResults) {
  // Keyword match weight: 60%
  const keywordScore = total > 0 ? (matched.length / total) * 60 : 0;

  // Section completeness weight: 25%
  const sectionsFound = sectionResults.filter(function(s) { return s.found; }).length;
  const sectionScore = (sectionsFound / sectionResults.length) * 25;

  // Resume length bonus: 15% (penalize if too short)
  const resumeText = document.getElementById('resumeInput').value;
  const wordCount = resumeText.trim().split(/\s+/).length;
  let lengthScore = 0;
  if (wordCount > 200) lengthScore = 15;
  else if (wordCount > 100) lengthScore = 10;
  else if (wordCount > 50) lengthScore = 5;

  return Math.min(100, Math.round(keywordScore + sectionScore + lengthScore));
}

// Function to get score message
function getScoreMessage(score) {
  const result = scoreMessages.find(function(item) {
    return score >= item.min && score <= item.max;
  });
  return result || scoreMessages[0];
}

// ===== DOM Rendering Functions =====

// Render keyword tags
function renderKeywords(containerId, keywords, className) {
  const container = document.getElementById(containerId);
  container.innerHTML = '';

  keywords.forEach(function(keyword) {
    const tag = document.createElement('span');
    tag.className = 'keyword-tag ' + className;
    tag.textContent = keyword;
    container.appendChild(tag);
  });
}

// Render section analysis
function renderSections(sectionResults) {
  const container = document.getElementById('sectionAnalysis');
  container.innerHTML = '';

  sectionResults.forEach(function(section) {
    const item = document.createElement('div');
    item.className = 'section-item';

    const statusClass = section.found ? 'found' : 'not-found';
    const statusText = section.found ? 'Found' : 'Missing';

    item.innerHTML = '<span>' + section.name + '</span>' +
      '<span class="section-status ' + statusClass + '">' + statusText + '</span>';

    container.appendChild(item);
  });
}

// Render category bars
function renderCategoryBars(categoryScores) {
  const container = document.getElementById('categoryBars');
  container.innerHTML = '';

  categoryScores.forEach(function(cat) {
    const item = document.createElement('div');
    item.className = 'category-item';

    item.innerHTML =
      '<div class="category-label">' +
        '<span>' + cat.label + ' (' + cat.matched + '/' + cat.total + ')</span>' +
        '<span>' + cat.score + '%</span>' +
      '</div>' +
      '<div class="category-bar">' +
        '<div class="category-bar-fill" style="width: 0%"></div>' +
      '</div>';

    container.appendChild(item);

    // Animate bar fill after append
    setTimeout(function() {
      item.querySelector('.category-bar-fill').style.width = cat.score + '%';
    }, 100);
  });
}

// Render suggestions
function renderSuggestions(suggestions) {
  const container = document.getElementById('suggestionsList');
  container.innerHTML = '';

  suggestions.forEach(function(suggestion) {
    const li = document.createElement('li');
    li.textContent = suggestion;
    container.appendChild(li);
  });
}

// Animate score circle
function animateScore(score, color) {
  const circle = document.getElementById('scoreCircle');
  const circumference = 2 * Math.PI * 45; // r=45
  const offset = circumference - (score / 100) * circumference;

  circle.style.stroke = color;
  circle.style.strokeDashoffset = offset;

  // Animate number
  const scoreEl = document.getElementById('scoreValue');
  let current = 0;
  const increment = Math.ceil(score / 40);
  const timer = setInterval(function() {
    current += increment;
    if (current >= score) {
      current = score;
      clearInterval(timer);
    }
    scoreEl.textContent = current;
  }, 30);
}

// ===== Main Analysis Function =====
function analyzeResume() {
  const resumeText = document.getElementById('resumeInput').value.trim();
  const jobText = document.getElementById('jobInput').value.trim();

  // Validation
  if (!resumeText) {
    alert('Please paste your resume content.');
    return;
  }
  if (!jobText) {
    alert('Please paste the job description.');
    return;
  }

  // Extract keywords from job description
  const jobKeywords = extractJobKeywords(jobText);

  if (jobKeywords.length === 0) {
    alert('Could not extract meaningful keywords from the job description. Please add more details.');
    return;
  }

  // Match keywords
  const { matched, missing } = matchKeywords(resumeText, jobKeywords);

  // Analyze sections
  const sectionResults = analyzeSections(resumeText);

  // Calculate scores
  const atsScore = calculateATSScore(matched, jobKeywords.length, sectionResults);
  const categoryScores = calculateCategoryScores(resumeText, jobText);
  const scoreMsg = getScoreMessage(atsScore);

  // Generate suggestions
  const suggestions = generateSuggestions(missing, sectionResults, atsScore);

  // Show results
  document.getElementById('results').classList.remove('hidden');

  // Render everything
  document.getElementById('matchedCount').textContent = matched.length;
  document.getElementById('missingCount').textContent = missing.length;
  document.getElementById('scoreLabel').textContent = 'ATS Score';
  document.getElementById('scoreMessage').textContent = scoreMsg.message;

  renderKeywords('matchedKeywords', matched, 'matched');
  renderKeywords('missingKeywords', missing, 'missing');
  renderSections(sectionResults);
  renderCategoryBars(categoryScores);
  renderSuggestions(suggestions);
  animateScore(atsScore, scoreMsg.color);

  // Scroll to results
  document.getElementById('results').scrollIntoView({ behavior: 'smooth' });
}

// ===== Event Listener =====
document.getElementById('analyzeBtn').addEventListener('click', analyzeResume);
