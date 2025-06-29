import prisma from "../lib/prisma";

export const getAllUsers = async (req, res) => {
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
    const user = prisma.user.findUnique({
      where: { id },
    });
    res.status(200).json(user);
  } catch (err) {
    res.status(500).json({ message: "Failed to get user" });
  }
};

export const updateUser = async (req, res) => {};

export const deleteUser = async (req, res) => {};
