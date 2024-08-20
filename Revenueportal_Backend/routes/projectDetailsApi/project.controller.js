const { addProjectTo,addServerTo,fetchServerTo,
    fetchProjectTo,editProjectTo,deleteProjectTo} = require("./project.service");

  var jwt = require('jsonwebtoken');
  const { v4: uuidv4 } = require("uuid");
  module.exports = {
  
    addProject: (req, res) => {
      
      const {projectName,server,location,IpLink,domain,technology,developer}=req.body
      const userId=req.user.id;
      addProjectTo(projectName,server,location,IpLink,domain,technology,developer,(err, result) => {
        if (err) {
          return res.status(400).json({message:"Some Error Occured"});
        }
        console.log("result is ", result);
        if (result) {
          return res.json({
            result
            
          });
        } else {
        return  res
            .status(400)
            .json({ result: 0, message: "Something Went Wrong" });
        }
      });
    },

    fetchProject: (req, res) => {
      
        const userId=req.user.id;
        fetchProjectTo((err, result) => {
          if (err) {
            return res.status(400).json({message:"Some Error Occured"});
          }
          console.log("result is ", result);
          if (result) {
            return res.json({
              result
              
            });
          } else {
          return  res
              .status(400)
              .json({ result: 0, message: "Something Went Wrong" });
          }
        });
    },

    addServer: (req, res) => {
      
        const {server}=req.body
        const userId=req.user.id;
        addServerTo(server,(err, result) => {
          if (err) {
            return res.status(400).json({message:"Some Error Occured"});
          }
          console.log("result is ", result);
          if (result) {
            return res.json({
              result
              
            });
          } else {
          return  res
              .status(400)
              .json({ result: 0, message: "Something Went Wrong" });
          }
        });
    },

    fetchServer: (req, res) => {
      
        const userId=req.user.id;
        fetchServerTo((err, result) => {
          if (err) {
            return res.status(400).json({message:"Some Error Occured"});
          }
          console.log("result is ", result);
          if (result) {
            return res.json({
              result
              
            });
          } else {
          return  res
              .status(400)
              .json({ result: 0, message: "Something Went Wrong" });
          }
        });
    },

    editProject: (req, res) => {
      
        const {id,projectName,server,location,IpLink,domain,technology,developer}=req.body
        const userId=req.user.id;
        editProjectTo(id,projectName,server,location,IpLink,domain,technology,developer,(err, result) => {
          if (err) {
            return res.status(400).json({message:"Some Error Occured"});
          }
          console.log("result is ", result);
          if (result) {
            return res.json({
              result
              
            });
          } else {
          return  res
              .status(400)
              .json({ result: 0, message: "Something Went Wrong" });
          }
        });
    },

    deleteProject: (req, res) => {
      
        const {id}=req.query
        const userId=req.user.id;
        deleteProjectTo(id,(err, result) => {
          if (err) {
            return res.status(400).json({message:"Some Error Occured"});
          }
          console.log("result is ", result);
          if (result) {
            return res.json({
              result
              
            });
          } else {
          return  res
              .status(400)
              .json({ result: 0, message: "Something Went Wrong" });
          }
        });
    },

  

  
  };
  