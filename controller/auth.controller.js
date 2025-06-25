import bcrypt from "bcrypt";
import prisma from "../lib/prisma.js";
import jwt from "jsonwebtoken";

export const register = async (req, res) => {
  const { username, email, password } = req.body;

  const hashedPassword = await bcrypt.hash(password, 10);

  try {
    const newUser = await prisma.user.create({
      data: {
        username,
        email,
        password: hashedPassword,
      },
    });

    res.status(201).json({
      message: "User created successfully",
    });
  } catch (err) {
    res.status(500).json({
      message: "Failed to create user!",
    });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;

  // Check user available
  try {
    const user = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (!user) return res.status(401).json({ message: "Invalid Credential" });

    // Check password incorrect
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword)
      return res.status(401).json({ message: "Password incorrect" });

    // Generate cookie token and send it to user
    const age = 1000 * 60 * 60 * 24 * 7;

    const token = jwt.sign(
      {
        id: user.id,
      },
      process.env.JWT_SECRET_KEY,
      { expiresIn: age }
    );

    const { password: userPassword, ...userInfo } = user;

    res.cookie("token", token, {
      httpOnly: true,
      //secure: true,
      maxAge: age,
    });
    res.status(200).json(userInfo);
  } catch (err) {
    console.log(err);
    res.status(401).json({ message: "Login failed" });
  }
};

export const logout = (req, res) => {
  res.clearCookie("token").status(200).json({ message: "Logout successful" });
};
