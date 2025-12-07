import { Router } from "express";
import { locationController } from "@controllers/location.controller";

const router = Router();

import { authenticate, authorize } from "@middlewares/auth.middleware";

// Public routes
router.get("/", locationController.getAll);
router.get("/:id", locationController.getOne);

// Protected routes (Admin only)
router.use(authenticate);
router.use(authorize("admin", "super_admin"));

router.post("/", locationController.create);
router.put("/:id", locationController.update);
router.delete("/:id", locationController.delete);

export default router;
