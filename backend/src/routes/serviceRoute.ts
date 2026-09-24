import { Request, Response, Router } from "express";
import { authenticateToken } from "../middlewares/authMiddleware";
import { pool } from "../config/db";
import { validateResource } from "../validators/validate";
import {
  createMicroserviceSchema,
  patchMicroserviceSchema,
} from "../schema/schema";
import { Microservice } from "../types/types";

const router = Router();

router.get("/", authenticateToken, async (req: Request, res: Response) => {
  try {
    const { search } = req.query;
    const result = await pool.query(
      `
          SELECT * 
          FROM microservice
          WHERE name ILIKE $1 
          ORDER BY id ASC
          `,
      ["%" + (search ?? "") + "%"],
    );
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});

router.post(
  "/",
  authenticateToken,
  validateResource(createMicroserviceSchema),
  async (req: Request, res: Response) => {
    const { name, endpointUrl, environment, status, version }: Microservice =
      req.body;
    try {
      const result = await pool.query(
        `INSERT INTO microservice (name, endpointUrl, environment, status, version)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`,
        [
          name,
          endpointUrl,
          environment ?? "DEVELOPMENT",
          status ?? "HEALTHY",
          version,
        ],
      );
      res.status(201).json(result.rows[0]);
    } catch (error) {
      res.status(500).json({ error: (error as Error).message });
    }
  },
);

router.patch(
  "/:id",
  authenticateToken,
  validateResource(patchMicroserviceSchema),
  async (req: Request, res: Response) => {
    const { id } = req.params;
    const { name, endpointUrl, environment, status, version } = req.body;
    try {
      const result = await pool.query(
        `UPDATE pies
       SET name = $1, endpointUrl = $2, environment = $3, status = $4, version = $5
       WHERE id = $6
       RETURNING *`,
        [name, endpointUrl, environment, status, version, id],
      );
      if (result.rows.length === 0) {
        return res.status(404).json({ error: "Pie not found" });
      }
      res.json(result.rows[0]);
    } catch (error) {
      res.status(500).json({ error: (error as Error).message });
    }
  },
);

router.delete(
  "/:id",
  authenticateToken,
  async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
      const result = await pool.query(
        `DELETE FROM microservice
        WHERE id = $1
        RETURNING *`,
        [id],
      );
      if (result.rows.length === 0) {
        return res.status(404).json({ error: "Microservice not found" });
      }
      res.json(result.rows[0]);
    } catch (error) {
      res.status(500).json({ error: (error as Error).message });
    }
  },
);

export default router;
