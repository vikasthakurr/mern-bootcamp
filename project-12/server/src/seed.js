import { connectDB, disconnectDB } from "./config/db.js";
import { User } from "./models/User.js";
import { Job } from "./models/Job.js";
import { Proposal } from "./models/Proposal.js";
import { Conversation } from "./models/Conversation.js";
import { Message } from "./models/Message.js";

async function seed() {
  await connectDB();

  await Message.deleteMany({});
  await Conversation.deleteMany({});
  await Proposal.deleteMany({});
  await Job.deleteMany({});
  await User.deleteMany({});

  const alice = await User.create({
    name: "Alice Client",
    email: "alice@demo.com",
    password: "password123",
    role: "client",
  });

  const dave = await User.create({
    name: "Dave Client",
    email: "dave@demo.com",
    password: "password123",
    role: "client",
  });

  const bob = await User.create({
    name: "Bob Freelancer",
    email: "bob@demo.com",
    password: "password123",
    role: "freelancer",
  });

  const carol = await User.create({
    name: "Carol Freelancer",
    email: "carol@demo.com",
    password: "password123",
    role: "freelancer",
  });

  const jobs = await Job.create([
    {
      title: "Build a landing page",
      description: "Need a responsive landing page in React.",
      budget: 500,
      category: "web",
      client: alice._id,
    },
    {
      title: "Design a logo",
      description: "Modern logo for a coffee brand.",
      budget: 150,
      category: "design",
      client: alice._id,
    },
    {
      title: "iOS app MVP",
      description: "A simple to-do app for iOS.",
      budget: 2000,
      category: "mobile",
      client: dave._id,
    },
    {
      title: "SEO audit",
      description: "Audit and improve my website SEO.",
      budget: 300,
      category: "marketing",
      client: dave._id,
    },
    {
      title: "Portfolio website",
      description: "Static portfolio site with a blog.",
      budget: 450,
      category: "web",
      client: alice._id,
    },
  ]);

  await Proposal.create([
    {
      job: jobs[0]._id,
      freelancer: bob._id,
      coverLetter: "I can build this in 3 days.",
      bidAmount: 450,
    },
    {
      job: jobs[0]._id,
      freelancer: carol._id,
      coverLetter: "I specialize in React landing pages.",
      bidAmount: 480,
    },
    {
      job: jobs[2]._id,
      freelancer: bob._id,
      coverLetter: "I have shipped several iOS apps.",
      bidAmount: 1800,
    },
  ]);

  console.log("Seed complete.");
  console.log(`Users: ${await User.countDocuments()}`);
  console.log(`Jobs: ${await Job.countDocuments()}`);
  console.log(`Proposals: ${await Proposal.countDocuments()}`);
  console.log("");
  console.log("Demo logins (password for all: password123):");
  console.log("  client     -> alice@demo.com");
  console.log("  client     -> dave@demo.com");
  console.log("  freelancer -> bob@demo.com");
  console.log("  freelancer -> carol@demo.com");

  await disconnectDB();
  process.exit(0);
}

seed().catch((error) => {
  console.error("Seed failed:", error);
  process.exit(1);
});
