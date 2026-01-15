const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "1h",
  });
};

exports.register = async (req, res) => {
  try {
    const { name, username, password, role, pin } = req.body;

    const userExists = await User.findOne({ username });
    if (userExists) {
      return res.status(400).json({ message: "Username already exists" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const hashedPin = await bcrypt.hash(pin, salt);

    const user = await User.create({
      name,
      username,
      password: hashedPassword,
      role,
      pin: hashedPin,
    });

    if (user) {
      res.status(201).json({
        _id: user._id,
        name: user.name,
        username: user.username,
        role: user.role,
        token: generateToken(user._id),
      });
    } else {
      res.status(400).json({ message: "Invalid user data" });
    }
  } catch (error) {
    console.error("Error in register:", error);
    res.status(500).json({ message: "Server error" });
  }
};

exports.login = async (req, res) => {
    try {
    const { username, password } = req.body;

    const user = await User.findOne({ username });
    if (user && (await bcrypt.compare(password, user.password))) {
      res.json({
        _id: user._id,
        name: user.name,
        username: user.username,
        role: user.role,
        token: generateToken(user._id),
      });
    } else {
        res.status(401).json({ message: "Invalid username or password" });  
    }
  } catch (error) {
    console.error("Error in login:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// New Login with PIN method for cashiers
exports.loginWithPin = async (req, res) => {
    const { username, pin } = req.body;

    try {
        const user = await User.findOne({ username });
        if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // CHECK IF LOCKED
    if (user.lockUntil && user.lockUntil > Date.now()) {
      return res.status(403).json({ 
        message: 'Account locked. Ask manager to reset or wait 15 mins.' 
      });
    }

    
    const isMatch = await bcrypt.compare(pin, user.pin);

    if (!isMatch) {
      user.failedLoginAttempts += 1;

      // LOCK IF 5 FAILED TRIES
      if (user.failedLoginAttempts >= 5) {
        user.lockUntil = Date.now() + 15 * 60 * 1000; // Locked for 15 mins
        await user.save();
        return res.status(403).json({ message: 'Too many attempts. Account locked.' });
      }

      await user.save();
      return res.status(401).json({ 
        message: `Invalid PIN. ${5 - user.failedLoginAttempts} attempts remaining.` 
      });
    }

    user.failedLoginAttempts = 0;
    user.lockUntil = undefined;
    await user.save();

    // Send Token
    res.json({
      _id: user.id,
      name: user.name,
      role: user.role,
      token: generateToken(user.id)
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getme = async (req, res) => {
    try {
        const user = await User.findById(req.user).select('-password'); 
        if (user) {
            res.json({
                id: user._id,
                name: user.name,
                username: user.username,
                role: user.role,
            });
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        console.error("Error in getme:", error);
        res.status(500).json({ message: 'Server error' });
    }

};