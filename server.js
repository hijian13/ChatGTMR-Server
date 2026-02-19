const express = require("express");
const jwt = require("jsonwebtoken");

const app = express();
app.use(express.json());

let users = [];

// ================= REGISTER =================
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

// ================= LOGIN =================
app.post("/login", (req, res) => {
  const { username, password } = req.body;

  const user = users.find(
    u => u.username === username && u.password === password
  );

  if (!user) {
    return res.status(400).json({ message: "Invalid credentials" });
  }

  // 🔐 Create JWT Token
  const token = jwt.sign(
    { username: user.username },
    process.env.JWT_SECRET,
    { expiresIn: "1h" }
  );

  res.json({
    message: "Login successful",
    token: token
  });
});

// ================= PROTECTED ROUTE =================
app.get("/profile", (req, res) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ message: "No token provided" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    res.json({
      message: "Protected profile data",
      user: decoded
    });
  } catch (error) {
    res.status(401).json({ message: "Invalid token" });
  }
});

app.get("/", (req, res) => {
  res.send("ChatGTMR Server is running 🚀");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
