const Project = require("../models/Project");
const User = require("../models/User");

// Create a Project (Manager Only)
exports.createProject = async (req, res) => {
  try {
    const { title, description } = req.body;
    const project = new Project({
      title,
      description,
      managers: [req.user._id],
    });

    await project.save();
    res.status(201).json({ message: "Project created successfully", project });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server Error" });
  }
};

// Get All Projects (Managers/QAs)
exports.getAllProjects = async (req, res) => {
  try {
    const projects = await Project.find().populate(
      "developers qas managers",
      "name email"
    );
    res.status(200).json({ projects });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server Error" });
  }
};

// Get Single Project
exports.getProjectById = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id).populate(
      "developers qas managers",
      "name email"
    );
    if (!project) {
      return res.status(404).json({ error: "Project not found" });
    }
    res.status(200).json({ project });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server Error" });
  }
};

// Update Project
exports.updateProject = async (req, res) => {
  try {
    const { title, description } = req.body;
    const project = await Project.findByIdAndUpdate(
      req.params.id,
      { title, description },
      { new: true }
    );

    if (!project) {
      return res.status(404).json({ error: "Project not found" });
    }

    res.status(200).json({ message: "Project updated successfully", project });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server Error" });
  }
};

// Delete Project
exports.deleteProject = async (req, res) => {
  try {
    const project = await Project.findByIdAndDelete(req.params.id);

    if (!project) {
      return res.status(404).json({ error: "Project not found" });
    }

    res.status(200).json({ message: "Project deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server Error" });
  }
};

// Assign Developers/QAs to Project
exports.assignUsersToProject = async (req, res) => {
  try {
    const { developers, qas } = req.body;

    const project = await Project.findById(req.params.id);
    if (!project) {
      return res.status(404).json({ error: "Project not found" });
    }

    if (developers) {
      project.developers = developers;
    }
    if (qas) {
      project.qas = qas;
    }

    await project.save();
    res.status(200).json({ message: "Users assigned successfully", project });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server Error" });
  }
};

exports.getAllProjectsForUser = async (req, res) => {
  try {
    let projects;

    if (req.user.role === "Manager") {
      projects = await Project.find({ managers: { $in: [req.user._id] } });
    } else if (req.user.role === "QA") {
      projects = await Project.find({ qas: { $in: [req.user._id] } });
    } else if (req.user.role === "Developer") {
      projects = await Project.find({ developers: { $in: [req.user._id] } });
    }
    if (projects.length === 0) {
      return res.status(404).json({ error: "No projects found" });
    }

    return res.status(200).json({ projects });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Server error" });
  }
};
