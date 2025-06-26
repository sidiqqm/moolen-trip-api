import express from "express";
import verifyToken from "../middleware/verifyToken.js";
import { shouldBeAdmin, shouldBeLoggedIn } from "../controller/test.controller.js";

const router = express.Router();

router.get("/should-be-logged-in", verifyToken, shouldBeLoggedIn);

router.get("/should-be-admin", verifyToken, shouldBeAdmin);

export default router;
