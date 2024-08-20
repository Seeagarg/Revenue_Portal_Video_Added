const {
    generateEncryptedPassword,
    savePassword,
    checkAdminUserExist,
    checkMasterAdminUserExist,
    validatePassword,
    filterServiceName,
    fetchClientServicesTo,
    fetchClientSubServicesTo,
    sendDataTo,sendDataTo1,sendDataTo2,
    sendMonthlyDataTo,
    fetchAllServicesTo,
    fetchPublisherData,
    addPublisherTo,
    deletePublisherTo,
    fetchPublisherTo,
    editPublisherTo,
    enableDisablePublisherTo,addCountryAndOperatorTo,fetchCountryAndOperatorTo,
    fetchCountryTo,dummyHitTo,
    fetchOperatorTo,fetchPublisherTrafficTo,fetchPublisherSubscriptionTo,
    searchPublisherSubscriptionTo,searchPublisherSubscriptionTo1,fetchPublisherTrafficservicesTo,
    fetchPublisherSubscriptionServicesTo,fetchMonthlyDataTo,fetchKenyaDataTo,fetchGameHubDataTo,
    searchTrafficByClickIdTo,searchPubSubByClickIdTo
  } = require("./misportal.services");

  var jwt = require('jsonwebtoken');
  const { v4: uuidv4 } = require("uuid");
  module.exports = {
    loginUser: (req, res) => {
      const { username, password } = req.body;
      if(username=='Evander' || username=='evander'){
        checkAdminUserExist('ndoto',password,(err, result,data,country) => {
          if (err) {
            return res.status(400).json({message:"Invalid Username or Password"})
          }
          if (result) {
           var token = jwt.sign({ id: result[0].id }, process.env.JWT_SECRET,{ expiresIn: '6h' });
            return res.json({
              token,
              username:'ndoto',
              data,country,
              hide_data:true
            });
          } else {
            return res
              .status(400)
              .json({ result: 0, message: "Invalid UserId or password" });
              
          }
        });
      }else{
        checkAdminUserExist(username,password,(err, result,data,country) => {
          if (err) {
            return res.status(400).json({message:"Invalid Username or Password"})
          }
          if (result) {
           var token = jwt.sign({ id: result[0].id }, process.env.JWT_SECRET,{ expiresIn: '6h' });
            return res.json({
              token,
              username,
              data,country
            });
          } else {
            return res
              .status(400)
              .json({ result: 0, message: "Invalid UserId or password" });
              
          }
        });
      }
      
    },

    loginMasterAdmin: (req, res) => {
      const { username, password } = req.body;
    
      checkMasterAdminUserExist(username,password,(err, result,data) => {
        if (err) {
          return res.status(400).json({message:"Invalid Username or Password"})
        }
        if (result) {
         var token = jwt.sign({ id: result[0].id }, process.env.JWT_SECRET,{ expiresIn: '6h' });
          return res.json({
            token,
            username,
            data
          });
        } else {
          return res
            .status(400)
            .json({ result: 0, message: "Invalid UserId or password" });
            
        }
      });
    },

    fetchClientServices: (req, res) => {
      const {clientId}=req.query
      const userId=req.user.id;
      fetchClientServicesTo(clientId,(err, result,) => {
        if (err) {
          return res.status(400).json({message:"Some Error Occured"});
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

    fetchClientSubServices: (req, res) => {
      const {mainServiceId}=req.query
      const userId=req.user.id;
      console.log(mainServiceId,"llllll")
      fetchClientSubServicesTo(mainServiceId,(err, result,) => {
        if (err) {
          return res.status(400).json({message:"Some Error Occured"});
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

    sendData: (req, res) => {
      const { from,to,serviceName,subServiceName } = req.body;
      sendDataTo2(from,to,serviceName,subServiceName,(err, result) => {
        if (err) {
         return res
            .status(400)
            .json({ result: 0, message: "Something Went Wrong" });
        }
        if (result) {
          return res.json({
            data:result,
            service:serviceName
          });
        } else {
         return res
            .status(400)
            .json({ result: 0, message: "Something Went Wrong" });
        }
      });
    },

    sendMonthlyData: (req, res) => {
      
      const {interval,service}=req.query
      sendMonthlyDataTo(interval,service,(err, result,) => {
        if (err) {
          return res.status(400).json({message:"Some Error Occured"});
        }
        if (result) {
          return res.json({
            data:result,
            serviceName:service
          });
        } else {
        return  res
            .status(400)
            .json({ result: 0, message: "Something Went Wrong" });
        }
      });
    },

    fetchAllServces: (req, res) => {
      const {interval,service}=req.query
      const userId=req.user.id;
      fetchAllServicesTo(userId,(err, result,) => {
        if (err) {
          return res.status(400).json({message:"Some Error Occured"});
        }
        if (result) {
          return res.json({
            data:result,
            serviceName:service
          });
        } else {
        return  res
            .status(400)
            .json({ result: 0, message: "Something Went Wrong" });
        }
      });
    },

    showPublisher: (req, res) => {
      const {service}=req.query
      const id=req.user.id;
      fetchPublisherData(service,(err, result,) => {
        if (err) {
          return res.status(400).json({message:"Some Error Occured"});
        }
        if (result) {
          return res.json({
            data:result,
            serviceName:service
          });
        } else {
        return  res
            .status(400)
            .json({ result: 0, message: "Something Went Wrong" });
        }
      });
    },

    addPublisher: (req, res) => {
      const {id,name,client,postbackUrl,operator,country,service,serviceUrl,skip,dailyCap,amount}=req.body;
      const name1=encodeURIComponent(name)
      const service1=encodeURIComponent(service)
      const promotionUrl=process.env.promotion_url_ndoto.replace('<partner>',name1).replace('<service>',service1)
    
      const userId=req.user.id;
      addPublisherTo(id,name,client,postbackUrl,operator,country,service,serviceUrl,skip,promotionUrl,dailyCap,amount,(err, result,) => {
        if (err) {
          return res.status(400).json({message:"Some Error Occured"});
        }
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
    fetchPublisher: (req, res) => {
      const {id}=req.query
      const userId=req.user.id;
      fetchPublisherTo(id,(err, result,) => {
        if (err) {
          return res.status(400).json({message:"Some Error Occured"});
        }
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

    deletePublisher: (req, res) => {
      const {id}=req.query
      const userId=req.user.id;
      deletePublisherTo(id,(err, result,) => {
        if (err) {
          return res.status(400).json({message:"Some Error Occured"});
        }
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

   editPublisher: (req, res) => {
      const {id,name,client, postbackUrl,operator,country,service,serviceUrl,skip,dailyCap,amount}=req.body
      const userId=req.user.id;
      const name1=encodeURIComponent(name)
      const service1=encodeURIComponent(service)
      const promotionUrl=process.env.promotion_url_ndoto.replace('<partner>',name1).replace('<service>',service1)
      
      editPublisherTo(id,name,client, postbackUrl,operator,country,service,serviceUrl,skip,promotionUrl,dailyCap,amount,(err, result,) => {
        if (err) {
          return res.status(400).json({message:"Some Error Occured"});
        }
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

    enableDisablePublisher: (req, res) => {
      const {id,status}=req.body
      const userId=req.user.id;
      enableDisablePublisherTo(id,status,(err, result,) => {
        if (err) {
          return res.status(400).json({message:"Some Error Occured"});
        }
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

    dummyHit: (req, res) => {
      const {postbackUrl,service,partnerName}=req.body

      dummyHitTo(postbackUrl,service,partnerName,(err, result,) => {
        if (err) {
          return res.status(400).json({message:err});
        }
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

    addCountryAndOperator: (req, res) => {
      const {country,operator,client}=req.body
      const userId=req.user.id;
      addCountryAndOperatorTo(country,operator,client,(err, result,) => {
        if (err) {
          return res.status(400).json({message:err});
        }
        if (result) {       
          return res.json({
            message:"Data added successfully",
            data:result,
          });
        } else {
        return  res
            .status(400)
            .json({ result: 0, message: "Something Went Wrong" });
        }
      });
    },

    fetchCountryAndOperator: (req, res) => {
      const {client}=req.body
      const userId=req.user.id;
      fetchCountryAndOperatorTo(client,(err, result,) => {
        if (err) {
          return res.status(400).json({message:"Some Error Occured"});
        }
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
    
    fetchCountry: (req, res) => {
      const {client}=req.body
      const userId=req.user.id;
      fetchCountryTo(client,(err, result,) => {
        if (err) {
          return res.status(400).json({message:"Some Error Occured"});
        }
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

    fetchOperator: (req, res) => {
      const {client,country}=req.body
      const userId=req.user.id;
      fetchOperatorTo(client,country,(err, result,) => {
        if (err) {
          return res.status(400).json({message:"Some Error Occured"});
        }
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

    fetchPublisherTraffic: (req, res) => {
      const {client,service,publisher,startDate,endDate}=req.body
      const userId=req.user.id;
      console.log(client,startDate)
      fetchPublisherTrafficTo(client,service,publisher,startDate,endDate,(err, result,) => {
        if (err) {
          return res.status(400).json({message:"Some Error Occured"});
        }
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

    fetchPublisherSubscription: (req, res) => {
      const {client}=req.body
      const userId=req.user.id;
      fetchPublisherSubscriptionTo(client,(err, result,) => {
        if (err) {
          return res.status(400).json({message:"Some Error Occured"});
        }
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

    searchPublisherSubscription: (req, res) => {
      
      const {client,service,publisher,startDate,endDate}=req.body
      const userId=req.user.id;
      searchPublisherSubscriptionTo1(client,service,publisher,startDate,endDate,(err, result,) => {
        if (err) {
          return res.status(400).json({message:"Some Error Occured"});
        }
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
    fetchPublisherTrafficservices: (req, res) => {
      
      const {client}=req.body
      const userId=req.user.id;
      fetchPublisherTrafficservicesTo(client,(err, result,result1) => {
        if (err) {
          return res.status(400).json({message:"Some Error Occured"});
        }
        if (result) {
          return res.json({
            services:result,
            publisher:result1
          });
        } else {
        return  res
            .status(400)
            .json({ result: 0, message: "Something Went Wrong" });
        }
      });
    },

    fetchPublisherSubscriptionServices: (req, res) => {
      
      const {client}=req.body
      const userId=req.user.id;
      fetchPublisherSubscriptionServicesTo(client,(err, result,result1) => {
        if (err) {
          return res.status(400).json({message:"Some Error Occured"});
        }
        if (result) {
          return res.json({
            services:result,
            publisher:result1
          });
        } else {
        return  res
            .status(400)
            .json({ result: 0, message: "Something Went Wrong" });
        }
      });
    },

    fetchMonthlyRevenue: (req, res) => {
      
      const {month,year,clientId}=req.query
      console.log(month,year,clientId)
      fetchMonthlyDataTo(month,year,clientId,(err,result) => {
        if (err) {
          return res.status(400).json({message:"Some Error Occured"});
        }
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

    searchTrafficByClickId: (req, res) => {
      
      const {clickId}=req.body
      console.log(clickId)
      searchTrafficByClickIdTo(clickId,(err,result) => {
        if (err) {
          return res.status(400).json({message:"Some Error Occured"});
        }
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

    searchPubSubByClickId: (req, res) => {
      
      const {clickId}=req.body
      console.log(clickId)
      searchPubSubByClickIdTo(clickId,(err,result) => {
        if (err) {
          return res.status(400).json({message:"Some Error Occured"});
        }
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

    fetchKenyaData: (req, res) => {
      
      const {startDate,endDate}=req.query  
      fetchKenyaDataTo(startDate,endDate,(err,result) => {
        if (err) {
          return res.status(400).json({message:"Some Error Occured"});
        }
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

    fetchGameHubData: (req, res) => {
      
      const {startDate,endDate}=req.query
      console.log(startDate,endDate)
      fetchGameHubDataTo(startDate,endDate,(err,result) => {
        if (err) {
          return res.status(400).json({message:"Some Error Occured"});
        }
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
  };
  