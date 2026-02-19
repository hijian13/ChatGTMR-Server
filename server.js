const express = require("express");
const app = express();

app.use(express.json());

let users = [];

// Register
app.post("/register", (req, res) => {
  const { username, password } = req.body;

  if (users.length >= 100) {
    return res.status(400).json({ message: "User limit reached (100 max)" });
  }

  const userExists = users.find(u => u.username === username);
  if (userExists) {
    return res.status(400).json({ message: "User already exists" });
  }

  users.push({ username, password });
  res.json({ message: "User registered successfully" });
});

// Login
app.post("/login", (req, res) => {
  const { username, password } = req.body;

  const user = users.find(
    u => u.username === username && u.password === password
  );

  if (!user) {
    return res.status(400).json({ message: "Invalid credentials" });
  }

  res.json({ message: "Login successful" });
});

app.get("/", (req, res) => {
  res.send("ChatGTMR Server is running 🚀");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
