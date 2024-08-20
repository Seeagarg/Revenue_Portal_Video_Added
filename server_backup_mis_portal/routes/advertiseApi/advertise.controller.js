const { addAdvertiserTo,fetchAdvertiserTo,enableDisableAvertiserTo,deleteAdvertiserTo,
    editAdvertiserTo,fetchAdvertiserTrafficTo,fetchAdvertiserSubscriptionTo,
    fetchClientTo,fetchServicesTo,dummyHitTo,addPublisherNameTo,
    fetchPublisherNameTo,checkPublisherNameTo} = require("./advertise.servie");

  var jwt = require('jsonwebtoken');
  const { v4: uuidv4 } = require("uuid");
  module.exports = {
  
    addAdvertiser: (req, res) => {
      
      const {client,service,amount,serviceUrl,postbackUrl,country,operator,skip,dailyCap,publisher}=req.body
      const userId=req.user.id;
      addAdvertiserTo(client,service,amount,serviceUrl,postbackUrl,country,operator,skip,dailyCap,publisher,(err, result) => {
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

    fetchAdvertiser: (req, res) => {
      
        const userId=req.user.id;
        fetchAdvertiserTo((err, result) => {
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

    enableDisableAvertiser: (req, res) => {

      const {status,id}=req.body;
      console.log(status,"status")
        const userId=req.user.id;
        enableDisableAvertiserTo(status,id,(err, result) => {
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

    deleteAdvertiser: (req, res) => {

        const {id}=req.query;
        console.log(id,"status")
          const userId=req.user.id;
          deleteAdvertiserTo(id,(err, result) => {
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

    editAdvertiser: (req, res) => {

        const {id,client,country,operator,amount,service,serviceUrl,postbackUrl,skip,dailyCap,publisher}=req.body;
        console.log(id,"status")
          const userId=req.user.id;
          editAdvertiserTo(id,client,country,operator,amount,service,serviceUrl,postbackUrl,skip,dailyCap,publisher,(err, result) => {
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

    fetchClient: (req, res) => {
      
      const userId=req.user.id;
      fetchClientTo((err, result) => {
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

  fetchServices: (req, res) => {
      const {client}=req.body
    const userId=req.user.id;
    fetchServicesTo(client,(err, result) => {
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
    fetchAdvertiserTraffic: (req, res) => {
      const {client,service,startDate,endDate}=req.body;
      const userId=req.user.id;
      fetchAdvertiserTrafficTo(client,service,startDate,endDate,(err, result) => {
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

  fetchAdvertiserSubscription: (req, res) => {
    const {client,service,startDate,endDate}=req.body;
    const userId=req.user.id;
    fetchAdvertiserSubscriptionTo(client,service,startDate,endDate,(err, result) => {
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

dummyHit: (req, res) => {
  const {postbackUrl,service,client}=req.body
  // const userId=req.user.id;
  dummyHitTo(postbackUrl,service,client,(err, result,) => {
    if (err) {
      console.log("insid eeeror");
      return res.status(400).json({message:err});
      // throw err;
    }
    console.log("result is ", result);
    if (result) {
      
      return res.json({
        data:result,
      });
    } else {
    return  res
        .status(400)
        .json({ result: 0, message: "Something Went Wrong" });
    }
  });
},

addPublisherName: (req, res) => {
      
  const {publisher}=req.body
  const userId=req.user.id;
  checkPublisherNameTo(publisher,(err, result) => {
    if (err) {
      return res.status(400).json({message:"Some Error Occured"});
    }
    console.log("result is ", result);
    if (result.length==0) {
      addPublisherNameTo(publisher,(err, result) => {
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
    } else {
    return  res
        .status(400)
        .json({ result: 0, message: "Publisher alredy exist" });
    }
  });

  
},

fetchPublisherName: (req, res) => {
      
  
  const userId=req.user.id;
  fetchPublisherNameTo((err, result) => {
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
  