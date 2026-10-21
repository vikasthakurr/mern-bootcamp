let users = [
  {
    id: "u1",
    name: "Alice Client",
    email: "alice@demo.com",
    password: "password123",
    role: "client",
  },
  {
    id: "u2",
    name: "Bob Freelancer",
    email: "bob@demo.com",
    password: "password123",
    role: "freelancer",
  },
];

function nextId() {
  return "u" + (users.length + 1) + "_" + Date.now();
}

export const userModel = {
  findByEmail(email) {
    return users.find((u) => u.email === email);
  },

  findById(id) {
    return users.find((u) => u.id === id);
  },

  create({ name, email, password, role }) {
    const user = { id: nextId(), name, email, password, role };
    users.push(user);
    return user;
  },

  all() {
    return users.map(({ password, ...safe }) => safe);
  },
};
