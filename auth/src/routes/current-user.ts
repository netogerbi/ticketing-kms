import express from "express";
import jwt from "jsonwebtoken";

const router = express.Router();

router.get("/api/users/currentuser", (req, res) => {
  if (!req.session?.jwt) {
    return res.send({ currentUser: null });
  }

  try {
    const verifyed = jwt.verify(req.session.jwt, process.env.JWT_KEY!);
    return res.send({ currentUser: verifyed });
  } catch (err) {
    return res.send({ currentUser: null });
  }
});

export { router as currentUserRouter };
