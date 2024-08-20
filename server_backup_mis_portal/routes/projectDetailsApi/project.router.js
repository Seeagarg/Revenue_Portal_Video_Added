const { addProject,addServer,fetchServer,
    fetchProject,editProject,deleteProject
} = require("./project.controller");

const router = require("express").Router();

router.post("/addProject", addProject);
router.post("/fetchProjects",fetchProject);
router.post("/addServer", addServer);
router.post("/fetchServer", fetchServer);
router.post("/editProject", editProject);
router.post("/deleteProject", deleteProject);
module.exports = router;
