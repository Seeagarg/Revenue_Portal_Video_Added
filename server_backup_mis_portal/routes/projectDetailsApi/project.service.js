const bcrypt = require("bcrypt");
const { poolPromotion } = require("../../database");
const { misportal } = require("../../database");
const { toNumber } = require("lodash");
const saltRounds = 10;
const axios = require('axios');
module.exports = {
 
 
    addProjectTo: (projectName,server,location,IpLink,domain,technology,developer, callback) => {

     const query=process.env.addProj
     .replace('<projName>',`${projectName}`)
     .replace('<server>',`${server}`)
     .replace('<location>',`${location}`)
     .replace('<ipLink>',`${IpLink}`)
     .replace('<domain>',`${domain}`)
     .replace('<technology>',`${technology}`)
     .replace('<developerName>',`${developer}`)
    


      // console.log("checkAdminUser ", checkAdminUser);
      misportal.query(query, [], (err, result) => {
        console.log(err,"mmmmm")
        if (err) return callback(err);
        if (result) {
            return callback('',result)
        }
      });
    },

    fetchProjectTo: (callback) => {

        const query=process.env.fetchProject
        
         misportal.query(query, [], (err, result) => {
           
           if (err) return callback(err);
           if (result) {
               return callback('',result)
           }
         });
    },

    addServerTo: (server, callback) => {

     const query=process.env.addServer.replace('<SERVER>',`${server}`)
     
      misportal.query(query, [], (err, result) => {

        if (err) return callback(err);
        if (result) {
            return callback('',result)
        }
      });
    },

    fetchServerTo: (callback) => {

        const query=process.env.fetchServer
        
         misportal.query(query, [], (err, result) => {
           
           if (err) return callback(err);
           if (result) {
               return callback('',result)
           }
         });
    },

    editProjectTo: (id,projectName,server,location,IpLink,domain,technology,developer, callback) => {

        const query=process.env.editProject
        .replace('<projName>',`${projectName}`)
        .replace('<server>',`${server}`)
        .replace('<location>',`${location}`)
        .replace('<ipLink>',`${IpLink}`)
        .replace('<domain>',`${domain}`)
        .replace('<technology>',`${technology}`)
        .replace('<developerName>',`${developer}`)
        .replace('<id>',id)
   
   
         // console.log("checkAdminUser ", checkAdminUser);
         misportal.query(query, [], (err, result) => {
           console.log(err,"mmmmm")
           if (err) return callback(err);
           if (result) {
               return callback('',result)
           }
         });
    },

    deleteProjectTo: (id, callback) => {

        const query=process.env.deleteProject.replace('<id>',id)
   
         misportal.query(query, [], (err, result) => {
           console.log(err,"mmmmm")
           if (err) return callback(err);
           if (result) {
               return callback('',result)
           }
         });
    },


};
