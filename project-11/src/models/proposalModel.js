let proposals = [
  {
    id: "p1",
    jobId: "j1",
    freelancerId: "u2",
    coverLetter: "I can build this in 3 days.",
    bidAmount: 450,
    createdAt: new Date("2026-10-02").toISOString(),
  },
];

function nextId() {
  return "p" + (proposals.length + 1) + "_" + Date.now();
}

export const proposalModel = {
  all() {
    return proposals;
  },

  findByJob(jobId) {
    return proposals.filter((p) => p.jobId === jobId);
  },

  create({ jobId, freelancerId, coverLetter, bidAmount }) {
    const proposal = {
      id: nextId(),
      jobId,
      freelancerId,
      coverLetter,
      bidAmount,
      createdAt: new Date().toISOString(),
    };
    proposals.push(proposal);
    return proposal;
  },
};
