let jobs = [
  {
    id: "j1",
    title: "Build a landing page",
    description: "Need a responsive landing page in React.",
    budget: 500,
    category: "web",
    clientId: "u1",
    createdAt: new Date("2026-10-01").toISOString(),
  },
  {
    id: "j2",
    title: "Design a logo",
    description: "Modern logo for a coffee brand.",
    budget: 150,
    category: "design",
    clientId: "u1",
    createdAt: new Date("2026-10-05").toISOString(),
  },
];

function nextId() {
  return "j" + (jobs.length + 1) + "_" + Date.now();
}

export const jobModel = {
  all() {
    return jobs;
  },

  findById(id) {
    return jobs.find((j) => j.id === id);
  },

  create({ title, description, budget, category, clientId }) {
    const job = {
      id: nextId(),
      title,
      description,
      budget,
      category,
      clientId,
      createdAt: new Date().toISOString(),
    };
    jobs.push(job);
    return job;
  },

  update(id, changes) {
    const job = jobs.find((j) => j.id === id);
    if (!job) return null;
    Object.assign(job, changes);
    return job;
  },

  remove(id) {
    const before = jobs.length;
    jobs = jobs.filter((j) => j.id !== id);
    return jobs.length < before;
  },
};
