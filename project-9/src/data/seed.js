// This is the starting data for the Kanban board.
// In a real app this would come from a server. Here we keep it simple.

// The board has 3 columns. Each column has an id, a title, and
// a list of card ids (so we know the order of cards inside it).
export const columns = [
  { id: "todo", title: "To Do", cardIds: ["c1", "c2", "c5"] },
  { id: "doing", title: "In Progress", cardIds: ["c3"] },
  { id: "done", title: "Done", cardIds: ["c4"] },
];

// Cards are stored separately in one object, looked up by id.
// This is called a "normalized" shape. It makes moving a card
// between columns easy: we only change the id lists, not the card.
export const cards = {
  c1: {
    id: "c1",
    title: "Design login screen",
    assignee: "Priya",
    priority: "high",
  },
  c2: {
    id: "c2",
    title: "Set up database",
    assignee: "Rao",
    priority: "medium",
  },
  c3: {
    id: "c3",
    title: "Build API routes",
    assignee: "Sam",
    priority: "high",
  },
  c4: {
    id: "c4",
    title: "Write project README",
    assignee: "John",
    priority: "low",
  },
  c5: {
    id: "c5",
    title: "Add unit tests",
    assignee: "Priya",
    priority: "medium",
  },
};

// The people a card can be assigned to (used in the "add card" form).
export const team = ["Priya", "Rao", "Sam", "John"];

// Today's meetings shown in the "Meetings" section.
// Each meeting has a time, a title (what has to be done), and who joins.
// "time" is in 24-hour "HH:MM" format so it is easy to sort and compare.
export const meetings = [
  {
    id: "m1",
    time: "09:30",
    title: "Daily stand-up",
    attendees: ["Priya", "Rao", "Sam"],
  },
  {
    id: "m2",
    time: "11:00",
    title: "Design review: login screen",
    attendees: ["Priya", "John"],
  },
  {
    id: "m3",
    time: "14:00",
    title: "API planning with backend",
    attendees: ["Sam", "Rao"],
  },
  {
    id: "m4",
    time: "16:30",
    title: "Sprint retro",
    attendees: ["Priya", "Rao", "Sam", "John"],
  },
];
