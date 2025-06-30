import prisma from "../lib/prisma.js";
import bcrypt from "bcrypt";

export const getUsers = async (req, res) => {
  try {
    const users = await prisma.user.findMany();
    res.status(200).json(users);
  } catch (err) {
    res.status(401).json({ message: "Not authorized" });
  }
};

export const getUserById = async (req, res) => {
  const id = req.params.id;

  try {
    const user = await prisma.user.findUnique({
      where: { id },
    });
    res.status(200).json(user);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "User not found" });
  }
};

export const updateUser = async (req, res) => {
  const id = req.params.id;
  const userId = req.userId;
  const { password, avatar, ...inputs } = req.body;

  if (id !== userId) return res.status(401).json({ message: "Not authorized" });

  let hashedPassword = null;

  try {
    if (password) {
      hashedPassword = await bcrypt.hash(password, 10);
    }

    const updatedUser = await prisma.user.update({
      where: { id },
      data: {
        ...inputs,
        ...(hashedPassword && { password: hashedPassword }),
        ...(avatar && { avatar }),
      },
    });

    const { password: userPassword, ...rest } = updatedUser;

    res.status(200).json(rest);
  } catch (err) {
    console.log(err);
    res.status(401).json({ message: "" });
  }
};

export const deleteUser = async (req, res) => {
  const id = req.params.id;
  const userId = req.userId;

  if (id !== userId)
    return res.status(401).json({ message: "Not authorized" });

  try {
    const user = await prisma.user.delete({
      where: { id },
    });
    res.status(200).json({ message: "User deleted" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Failed delete user" });
  }
};
