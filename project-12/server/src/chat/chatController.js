import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { Job } from "../models/Job.js";
import { Proposal } from "../models/Proposal.js";
import { Conversation } from "../models/Conversation.js";
import { Message } from "../models/Message.js";

async function findOrCreateConversation({ jobId, freelancerId, requesterId }) {
  const job = await Job.findById(jobId);
  if (!job) {
    throw ApiError.notFound("Job not found");
  }

  const clientId = String(job.client);

  const proposal = await Proposal.findOne({
    job: jobId,
    freelancer: freelancerId,
  });
  if (!proposal) {
    throw ApiError.badRequest(
      "No proposal exists between these users for this job",
    );
  }

  const isParticipant =
    requesterId === clientId || requesterId === String(freelancerId);
  if (!isParticipant) {
    throw ApiError.forbidden("You are not part of this conversation");
  }

  let conversation = await Conversation.findOne({
    job: jobId,
    client: clientId,
    freelancer: freelancerId,
  });

  if (!conversation) {
    conversation = await Conversation.create({
      job: jobId,
      client: clientId,
      freelancer: freelancerId,
    });
  }

  return conversation;
}

export const startConversation = asyncHandler(async (req, res) => {
  const { jobId, freelancerId } = req.body;

  const freelancer = freelancerId || req.user.id;

  const conversation = await findOrCreateConversation({
    jobId,
    freelancerId: freelancer,
    requesterId: req.user.id,
  });

  await conversation.populate("job", "title");
  await conversation.populate("client", "name role");
  await conversation.populate("freelancer", "name role");

  res.status(201).json({ success: true, data: conversation });
});

export const listConversations = asyncHandler(async (req, res) => {
  const conversations = await Conversation.find({
    $or: [{ client: req.user.id }, { freelancer: req.user.id }],
  })
    .populate("job", "title")
    .populate("client", "name role")
    .populate("freelancer", "name role")
    .sort({ lastMessageAt: -1, updatedAt: -1 });

  res.json({ success: true, count: conversations.length, data: conversations });
});

export const getMessages = asyncHandler(async (req, res) => {
  const conversation = await Conversation.findById(req.params.id);
  if (!conversation) {
    throw ApiError.notFound("Conversation not found");
  }

  if (!conversationHasUser(conversation, req.user.id)) {
    throw ApiError.forbidden("You are not part of this conversation");
  }

  const messages = await Message.find({ conversation: conversation.id })
    .populate("sender", "name role")
    .sort({ createdAt: 1 });

  res.json({ success: true, count: messages.length, data: messages });
});

export function getConversation(conversationId) {
  return Conversation.findById(conversationId);
}

export function conversationHasUser(conversation, userId) {
  return (
    String(conversation.client) === String(userId) ||
    String(conversation.freelancer) === String(userId)
  );
}

export function otherParticipant(conversation, senderId) {
  const clientId = String(conversation.client);
  const freelancerId = String(conversation.freelancer);
  return String(senderId) === clientId ? freelancerId : clientId;
}

export async function saveMessage({ conversationId, senderId, text }) {
  const message = await Message.create({
    conversation: conversationId,
    sender: senderId,
    text,
  });

  await Conversation.findByIdAndUpdate(conversationId, {
    lastMessage: text,
    lastMessageAt: new Date(),
  });

  await message.populate("sender", "name role");
  return message;
}
