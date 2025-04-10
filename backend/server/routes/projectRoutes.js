const express = require("express");
const router = express.Router();
const projectController = require("../controllers/projectController");
const {
  protect,
  managerOnly,
  managerOrQAOnly,
} = require("../middleware/authMiddleware");

router.post("/", protect, managerOnly, projectController.createProject);
router.get("/", protect, managerOrQAOnly, projectController.getAllProjects);
router.get("/myprojects", protect, projectController.getAllProjectsForUser);
router.get("/:id", protect, managerOrQAOnly, projectController.getProjectById);
router.put("/:id", protect, managerOnly, projectController.updateProject);
router.delete("/:id", protect, managerOnly, projectController.deleteProject);
router.put(
  "/assign/:id",
  protect,
  managerOnly,
  projectController.assignUsersToProject
);

module.exports = router;
