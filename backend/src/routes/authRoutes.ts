import { Request, Response, Router } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { createAuthSchema } from "../schema/schema";
import { validateResource } from "../validators/validate";
import { pool } from "../config/db";

const router = Router();
const JWT_SECRET = process.env.JWT_SECRET || "Fallback_secret";

router.post(
  "/register",
  validateResource(createAuthSchema),
  async (req: Request, res: Response) => {
    const { email, password } = req.body;

    try {
      const userCheck = await pool.query(
        `SELECT email FROM users WHERE email = $1`,
        [email],
      );
      if (userCheck.rows.length > 0) {
        return res.status(409).json({ error: "email already exist." });
      }

      const saltsRounds = 10;
      const passwordHash = await bcrypt.hash(password, saltsRounds);

      const result = await pool.query(
        `
            INSERT INTO users (email, password_hash)
            VALUES ($1, $2)`,
        [email, passwordHash],
      );
      res.status(201).json({
        message: "User registered successfully!",
        user: result.rows[0],
      });
    } catch (error) {
      res.status(500).json({ error: (error as Error).message });
    }
  },
);
router.post(
  "/login",
  validateResource(createAuthSchema),
  async (req: Request, res: Response) => {
    const { email, password } = req.body;
    try {
      const result = await pool.query(
        `
            SELECT * FROM users WHERE email = $1`,
        [email],
      );

      const user = result.rows[0];
      if (!user) {
        return res.status(401).json({ error: "Invalid email or password." });
      }

      const isValidPassword = await bcrypt.compare(
        password,
        user.password_hash,
      );
      if (isValidPassword) {
        const token = jwt.sign(
          { userId: user.id, email: user.email },
          JWT_SECRET,
          { expiresIn: "1h" },
        );
        return res.json({ message: "Login successful", token, user });
      }

      res.status(401).json({ error: "Invalid email or password." });
    } catch (error) {
      res.status(500).json({ error: (error as Error).message });
    }
  },
);

export default router;
