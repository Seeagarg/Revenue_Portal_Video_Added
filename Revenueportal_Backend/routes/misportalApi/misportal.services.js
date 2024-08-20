const bcrypt = require("bcrypt");
const { poolPromotion } = require("../../database");
const { misportal,kidzmania_kenya,game_hub } = require("../../database");
const { toNumber } = require("lodash");
const saltRounds = 10;
const axios = require('axios');


module.exports = {
 

  checkAdminUserExist:(username, password, callback) => {
    

    const checkAdminUser = process.env.LOGIN_USER;
    
    misportal.query(checkAdminUser, [username], (err, result) => {
      if (err) return callback(err);
      if (result) {
        try {
          if (password === result[0].password) {
            const checkAdminUser = process.env.GET_SERVICES;
            misportal.query(checkAdminUser, [result[0].id], (err, data) => {
              if(err){
                return callback(err);
              }
              const checkAdminUser = process.env.GET_COUNTRIES;
              misportal.query(checkAdminUser, [result[0].id,], (err, data1) => {
                if(err){
                  return callback(err);
                }
               
                return callback("", result, {data},data1);
              });
            });
            
          }else{
            return callback("Invalid Username or Password");
          }
        } catch (err) {
          console.log("User not found");
          return callback(err);
        }
      }
    });
  },


  checkMasterAdminUserExist: (username, password, callback) => {
    const checkAdminUser = process.env.LOGIN_ADMIN;
    misportal.query(checkAdminUser, [username], (err, result) => {
      if (err) return callback(err);
      if (result) {
        try {
          if (password === result[0].password) {
            const selectUserName = process.env.GET_CLIENT_INFO;
            misportal.query(selectUserName, [], (err, data) => {
              if(err){
                return callback(err);
              }
              const checkAdminUser = process.env.GET_SERVICE_INFO_ADMIN;
              misportal.query(checkAdminUser, [], (err, data1) => {
                if(err){
                  return callback(err);
                }
                
               data?.map((d,i)=>{
                const arr=[]
                  data1.map((d1,i1)=>{
                      if(d.id==d1.clientInfoId){
                        if(d1.country==null || d1.country==''){
                         return ;
                        }
                          if(!arr.includes(d1.country)){
                            arr.push(d1.country)
                          }
                        
                       
                       
                      }
                  })
                  d.countries=arr
               })
               return callback("", result, { data });
              });
              
            });
          }else{
            return callback("Invalid Username or Password");
          }
        } catch (err) {
          console.log("User not found");
          return callback(err);
        }
      }
    });
  },

  fetchClientServicesTo: (clientId, callback) => {
    

    const checkAdminUser = process.env.GET_SERVICES;
    misportal.query(checkAdminUser, [clientId], (err, data) => {
      if(err){
        return callback(err);
      }
      return callback("",data);
    });
  },

  fetchClientSubServicesTo: (operator,mainServiceId,client_id, callback) => {
    console.log(operator,'operator',client_id)
    let checkAdminUser;
    if(mainServiceId == null || mainServiceId == undefined){
       checkAdminUser = process.env.GET_SUBSERVICES_BY_OPERATOR
       .replace('<operator>',operator)
       .replace('<client_id>',client_id)
       ;
    }
    else if(operator == null || operator == undefined){
       checkAdminUser = process.env.GET_SUB_SERVICES
       .replace('<mainServiceId>',mainServiceId)
    }
   
    misportal.query(checkAdminUser, [], (err, data) => {
      if(err){
        return callback(err);
      }
      // let dataArray=[{id:0,subServiceName:'All'}];
      let dataArray=[]
      for(row of data){
        dataArray.push(row);
      }
      return callback("",{dataArray});
     
    });
  },


  fetchClientOperatorsTo:(country,client_id,callback)=>{
    console.log(country,'000000000000')
    const fetch_operator_query = process.env.GET_OPERATORS

    misportal.query(fetch_operator_query,[country,client_id],(err,result)=>{
      if(err){
        console.log(err)
        return callback(err);
      }
      else{
      //   let dataArray=[{id:0,operator:'All'}];
      // for(row of result){
      //   dataArray.push(row);
      // }
      return callback("",{result});
      }
    })

  },


  sendDataTo: (from, to, serviceName, callback) => {
  
    const fetchDataQuery = `select * from MainService where service='${serviceName}' and misDate BETWEEN '${from}' and '${to}'`;
    // console.log("checkAdminUser ", checkAdminUser);
    misportal.query(fetchDataQuery, [], (err, result) => {
      if (err) return callback(err);
      if (result) {
        console.log(result);
        try {
          return callback("", result);
        } catch (err) {
          console.log("Data not found");
          return callback(err);
        }
      }
    });
  },
  sendDataTo1: (from, to, serviceName, callback) => {
    
    let currentDate = new Date(from)
    let firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
    let originalDate = new Date(firstDayOfMonth)
    let year = originalDate.getUTCFullYear();
    let month = (originalDate.getUTCMonth() + 1).toString().padStart(2, '0');
    let day = originalDate.getUTCDate().toString().padStart(2, '0');
    let formattedDateString = `${year}-${month}-${day}`;


  

    let currentDate1 = new Date(to)
    let firstDayOfMonth1 = new Date(currentDate1.getFullYear(), currentDate1.getMonth()+1, 1);
    let originalDate1 = new Date(firstDayOfMonth1)
    let year1 = originalDate1.getUTCFullYear();
    let month1 = (originalDate1.getUTCMonth() + 1).toString().padStart(2, '0');
    let day1 = originalDate1.getUTCDate().toString().padStart(2, '0');
    let formattedDateString1 = `${year1}-${month1}-${day1}`;



    const fetchDataQuery = `select * from MainService where service='${serviceName}' and misDate BETWEEN '${from}' and '${to}'`;

    const monthQuery=`SELECT YEAR(misDate) as year,MONTH(misDate) AS month, SUM(totalRevenue) AS Total
    FROM MainService
    WHERE service = '${serviceName}' AND misDate BETWEEN '${formattedDateString}' and '${formattedDateString1}'
    GROUP BY YEAR(misDate),MONTH(misDate)
    ORDER BY YEAR(misDate),MONTH(misDate)`
    
    
    misportal.query(fetchDataQuery, [], (err, result) => {

      if (err) return callback(err);
      if (result) {
        console.log(result,"result")
        misportal.query(monthQuery, [], (err, result1) => {
           console.log(err)
          if (err) return callback(err);
          if (result1) {
            try {
              result.map((data,i)=>{
                result1.map((data1,idx)=>{
                
                  if(data.misDate.getFullYear()===data1.year && (data.misDate.getMonth()+1)===data1.month){
                    data.totalMonthlyRevenue=data1.Total
                  }
                  
                })    
              })
              return callback("", result);
            } catch (err) {
              console.log("Data not found");
              return callback(err);
            }
           
          }
        });
       
      }
    });
  },
  
  sendDataTo2: (from, to, serviceName,subServiceName, callback) => {
    
    let currentDate = new Date(from)
    let firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
    let originalDate = new Date(firstDayOfMonth)
    let year = originalDate.getUTCFullYear();
    let month = (originalDate.getUTCMonth() + 1).toString().padStart(2, '0');
    let day = originalDate.getUTCDate().toString().padStart(2, '0');
    let formattedDateString = `${year}-${month}-${day}`;


  

    let currentDate1 = new Date(to)
    let firstDayOfMonth1 = new Date(currentDate1.getFullYear(), currentDate1.getMonth()+1, 1);
    let originalDate1 = new Date(firstDayOfMonth1)
    let year1 = originalDate1.getUTCFullYear();
    let month1 = (originalDate1.getUTCMonth() + 1).toString().padStart(2, '0');
    let day1 = originalDate1.getUTCDate().toString().padStart(2, '0');
    let formattedDateString1 = `${year1}-${month1}-${day1}`;


   let monthQuery=''
    // const fetchDataQuery = `select * from MainService where service='${serviceName}' and misDate BETWEEN '${from}' and '${to}'`;
   if(subServiceName=='All'){

     monthQuery=process.env.SEND_ALL_DATA
     .replace('<serviceName>',serviceName)
     .replace('<from>',from)
     .replace('<to>',to)
   }else{
     monthQuery=process.env.SEND_DATA
     .replace('<subServiceName>',subServiceName)
     .replace('<from>',from)
     .replace('<to>',to)
   }
    
    
    
    misportal.query(monthQuery, [], (err, result) => {

      if (err) return callback(err);
      if (result) {
      
        return callback('',result);
       
      }
    });
  },

  sendMonthlyDataTo: (interval, service, callback) => {
    
    const fetchDataQuery = process.env.SEND_MONTHLY_DATA;
    // console.log("checkAdminUser ", checkAdminUser);

    misportal.query(fetchDataQuery, [service,interval], (err, result) => {
      if (err) return callback(err);
      if (result) {
        console.log(result);
        try {
          return callback("", result);
        } catch (err) {
          console.log("Data not found");
          return callback(err);
        }
      }
    });
  },


 fetchAllServicesTo: (id, callback) => {
  
    const fetchDataQuery = process.env.FETCH_ALL_SERVICES;
    // console.log("checkAdminUser ", checkAdminUser);
    misportal.query(fetchDataQuery, [id], (err, result) => {
      if (err) return callback(err);
      if (result) {
        console.log(result);
        try {
          return callback("", result);
        } catch (err) {
          console.log("Data not found");
          return callback(err);
        }
      }
    });
  },

fetchPublisherData: (service, callback) => {
    const fetchDataQuery = process.env.FETCH_PUBLISHER_DATA;
    // console.log("checkAdminUser ", checkAdminUser);
    poolPromotion.query(fetchDataQuery, [service], (err, result) => {
      if (err) return callback(err);
      if (result) {
        console.log(result);
        try {
          return callback("", result);
        } catch (err) {
          console.log("Data not found");
          return callback(err);
        }
      }
    });
  },

  addPublisherTo: (id,name,client,postbackUrl,operator,country,service,serviceUrl,skip,promotionUrl,dailyCap,amount, callback) => {
  
    const fetchDataQuery = process.env.ADD_PUBLISHER;
    // console.log("checkAdminUser ", checkAdminUser);
    poolPromotion.query(fetchDataQuery, [client,name,postbackUrl,operator,country,service,serviceUrl,skip,id,promotionUrl,dailyCap,amount], (err, result) => {
      if (err) return callback(err);
      if (result) {
        console.log(result);
        try {
          return callback("", result);
        } catch (err) {
          console.log("Data not found");
          return callback(err);
        }
      }
    });
  },
 fetchPublisherTo: (id, callback) => {
  
    const fetchDataQuery = process.env.FETCH_PUBLISHER;
    // console.log("checkAdminUser ", checkAdminUser);
    poolPromotion.query(fetchDataQuery, [id], (err, result) => {
      if (err) return callback(err);
      if (result) {
        console.log(result);
        try {
          return callback("", result);
        } catch (err) {
          console.log("Data not found");
          return callback(err);
        }
      }
    });
  },

  deletePublisherTo: (id, callback) => {
  
    const fetchDataQuery = process.env.DELETE_PUBLISHER;
    // console.log("checkAdminUser ", checkAdminUser);
    poolPromotion.query(fetchDataQuery, [id], (err, result) => {
      if (err) return callback(err);
      if (result) {
        console.log(result);
        try {
          return callback("", result);
        } catch (err) {
          console.log("Data not found");
          return callback(err);
        }
      }
    });
  },

  editPublisherTo: (id,name,client, postbackUrl,operator,country,service,serviceUrl,skip,promotionUrl,dailyCap,amount, callback) => {
  
    const updateDataQuery = process.env.UPDATE_PUBLISHER;
    // console.log("checkAdminUser ", checkAdminUser);
    poolPromotion.query(updateDataQuery, [client,name,postbackUrl,operator,country,service,serviceUrl,skip,promotionUrl,dailyCap,amount,id], (err, result) => {
      if (err) return callback(err);
      if (result) {
        console.log(result);
        try {
          return callback("", result);
        } catch (err) {
          console.log("Data not found");
          return callback(err);
        }
      }
    });
  },



   enableDisablePublisherTo: (id,status, callback) => {
  
    const updateDataQuery = process.env.ENABLE_DISABLE_PUBLISHER;
    // console.log("checkAdminUser ", checkAdminUser);
    poolPromotion.query(updateDataQuery, [status,id], (err, result) => {
      if (err) return callback(err);
      if (result) {
        console.log(result);
        try {
          return callback("", result);
        } catch (err) {
          console.log("Data not found");
          return callback(err);
        }
      }
    });
  },

  dummyHitTo: async(postbackUrl,service,partnerName, callback) => {
  

    const fetchDataQuery = process.env.DUMMY_HIT;
    
    poolPromotion.query(fetchDataQuery, [partnerName,service], async(err, result) => {
      console.log(result,"hhhhhhhhhhhss")
      if (err) return callback(err);
      if (result.length>0) {
         const postbackUrl1=postbackUrl.replace('<CLICK_ID>',result[0].media)
         console.log(postbackUrl1,"postbck")
        try {
          const data=await axios.get(`${postbackUrl1}`)
          
          if(data?.status==200){
            return callback("", "Ok");
          } 
        } catch (err) {
          console.log("Data not found");
          return callback(err);
        }
      }else{
        return callback("No data in publisher traffic");
      }
    })
  },
  
  addCountryAndOperatorTo: (country,operator,client, callback) => {
    const checkCountry=process.env.CHECK_COUNTRY;
    const insertDataQuery = process.env.ADD_OPERATOR_COUNTRY;
    // console.log("checkAdminUser ", checkAdminUser);
    poolPromotion.query(checkCountry, [country,operator,client], (err, result) => {
      if (err) return callback(err);
      if (result.length==0) {
        try {
          poolPromotion.query(insertDataQuery, [country,operator,client], (err, result) => {
            if (err) return callback(err);
            if (result) {
              try {
                return callback("", result);
              } catch (err) {
                console.log("Data not found");
                return callback(err);
              }
            }
          })
        } catch (err) {
          console.log("Data not found");
          return callback(err);
        }
      }else{
        return callback("country already exists");
      }
    });
  },

  fetchCountryAndOperatorTo: (client, callback) => {
  
    const fetchDataQuery = process.env.FETCH_COUNTRY_OPERATOR;
    
    poolPromotion.query(fetchDataQuery, [client], (err, result) => {
      if (err) return callback(err);
      if (result) {
        console.log(result);
        try {
          return callback("", result);
        } catch (err) {
          console.log("Data not found");
          return callback(err);
        }
      }
    });
  },
  fetchCountryTo: (client, callback) => {
  
    const fetchDataQuery = process.env.FETCH_COUNTRY;
    
    poolPromotion.query(fetchDataQuery, [client], (err, result) => {
      if (err) return callback(err);
      if (result) {
        console.log(result);
        try {
          return callback("", result);
        } catch (err) {
          console.log("Data not found");
          return callback(err);
        }
      }
    });
  },

  fetchOperatorTo: (client,country, callback) => {
  
    const fetchDataQuery = process.env.FETCH_OPERATOR;
    
    poolPromotion.query(fetchDataQuery, [country,client], (err, result) => {
      if (err) return callback(err);
      if (result) {
        console.log(result);
        try {
          return callback("", result);
        } catch (err) {
          console.log("Data not found");
          return callback(err);
        }
      }
    });
  },

  fetchPublisherTrafficTo: (client,service,publisher,startDate,endDate, callback) => {
  let fetchDataQuery=''
  if(client=='bobble'){ 
    if(service=='All' && (publisher=='All' || publisher=="")){
      fetchDataQuery = process.env.FETCH_PUBLISHER_TRAFFIC_BOBBLE_ALL_SUB_PUB
      .replace('<startDate>',startDate)
      .replace('<endDate>',endDate)

    }else if(publisher=='All' || publisher==""){
      fetchDataQuery = process.env.FETCH_PUBLISHER_TRAFFIC_BOBBLE_BY_SVC
      .replace('<service>',service)
      .replace('<startDate>',startDate)
      .replace('<endDate>',endDate)

    } else if((service=='All' || service=="")){
      fetchDataQuery = process.env.FETCH_PUBLISHER_TRAFFIC_BOBBLE_BY_PUB
      .replace('<publisher>',publisher)
      .replace('<startDate>',startDate)
      .replace('<endDate>',endDate)
    }
    else{
      fetchDataQuery = process.env.FETCH_PUBLISHER_TRAFFIC_BOBBLE
      .replace('<client>',client)
      .replace('<service>',service)
      .replace('<publisher>',publisher)
      .replace('<startDate>',startDate)
      .replace('<endDate>',endDate);
    }

  }else{
    if(service=='All' && (publisher=='All' || publisher=="")){
      fetchDataQuery = process.env.FETCH_PUBLISHER_TRAFFIC_BY_CLIENT
      .replace('<client>',client)
      .replace('<startDate>',startDate)
      .replace('<endDate>',endDate)

    }else if(publisher=='All' || publisher==""){
      fetchDataQuery =   fetchDataQuery = process.env.FETCH_PUBLISHER_TRAFFIC_BY_CLIENT_SERVICE
      .replace('<client>',client)
      .replace('<service>',service)
      .replace('<startDate>',startDate)
      .replace('<endDate>',endDate)

    } else if((service=='All' || service=="")){
      fetchDataQuery = process.env.FETCH_PUBLISHER_TRAFFIC_BY_CLIENT_PUBLISHER
      .replace('<client>',client)
      .replace('<publisher>',publisher)
      .replace('<startDate>',startDate)
      .replace('<endDate>',endDate)
    }
    else{
      fetchDataQuery =  process.env.FETCH_PUBLISHER_TRAFFIC_BY_ALL
      .replace('<client>',client)
      .replace('service',service)
      .replace('<publisher>',publisher)
      .replace('<startDate>',startDate)
      .replace('<endDate>',endDate);
    }
  }
    
    
    poolPromotion.query(fetchDataQuery, [], (err, result) => {
      if (err) return callback(err);
      if (result) {
        console.log(result);
        try {
          return callback("", result);
        } catch (err) {
          console.log("Data not found");
          return callback(err);
        }
      }
    });
  },

  fetchPublisherSubscriptionTo: (client, callback) => {
  
    const fetchDataQuery = process.env.FETCH_PUBLISHER_SUBSCRIPTION;
    // console.log("checkAdminUser ", checkAdminUser);
    poolPromotion.query(fetchDataQuery, [client], (err, result) => {
      if (err) return callback(err);
      if (result) {
        console.log(result);
        try {
          return callback("", result);
        } catch (err) {
          console.log("Data not found");
          return callback(err);
        }
      }
    });
  },

  searchPublisherSubscriptionTo: (client,startDate,endDate, callback) => {
  let fetchDataQuery=``;
  let fetchQuery=``
  if(client=='panz'){
    fetchDataQuery=process.env.SEARCH_PUBLISHER_SUBSCRIPTION
    .replace('<startDate>',startDate)
    .replace('<endDate>',endDate)

  }else{
    fetchDataQuery =  fetchDataQuery=process.env.SEARCH_PUBLISHER_SUBSCRIPTION_BY_CLIENT
    .replace('<startDate>',startDate)
    .replace('<endDate>',endDate)
    .replace('<client>',client)
  }
  
    // console.log("checkAdminUser ", checkAdminUser);
    poolPromotion.query(fetchDataQuery, [], (err, result) => {
      if (err) return callback(err);
      if (result) {
        try {
          return callback("", result);
        } catch (err) {
          console.log("Data not found");
          return callback(err);
        }
      }
    });
  },
  
  searchPublisherSubscriptionTo1: (client,service,publisher,startDate,endDate, callback) => {
    let fetchDataQuery=``;
    let fetchQuery=``
    if(client=='panz'){
        if(service=='All' && (publisher=='All' || publisher=="")){
          fetchDataQuery=`SELECT partner,servicename,ispending,COUNT(1) AS total FROM tbl_partner_callback WHERE DATE(DATE) BETWEEN  '${startDate}' AND '${endDate}' AND clientName IN ('panz','visiontrek') GROUP BY 1,2,3`
          fetchQuery=`SELECT partner,servicename,COUNT(1) AS total FROM tbl_partner_callback WHERE DATE(DATE) BETWEEN  '${startDate}' AND '${endDate}' AND clientName IN ('panz','visiontrek') GROUP BY 1,2`
      
        }else if(publisher=='All' || publisher==""){
          fetchDataQuery=`SELECT partner,servicename,ispending,COUNT(1) AS total FROM tbl_partner_callback WHERE DATE(DATE) BETWEEN  '${startDate}' AND '${endDate}' AND clientName IN ('panz','visiontrek') AND servicename='${service}' GROUP BY 1,2,3`
          fetchQuery=`SELECT partner,servicename,COUNT(1) AS total FROM tbl_partner_callback WHERE DATE(DATE) BETWEEN  '${startDate}' AND '${endDate}' AND clientName IN ('panz','visiontrek') AND servicename='${service}' GROUP BY 1,2`
  
        } else if((service=='All' || service=="")){
          fetchDataQuery=`SELECT partner,servicename,ispending,COUNT(1) AS total FROM tbl_partner_callback WHERE DATE(DATE) BETWEEN  '${startDate}' AND '${endDate}' AND clientName IN ('panz','visiontrek') AND partner='${publisher}' GROUP BY 1,2,3`
          fetchQuery=`SELECT partner,servicename,COUNT(1) AS total FROM tbl_partner_callback WHERE DATE(DATE) BETWEEN  '${startDate}' AND '${endDate}' AND clientName IN ('panz','visiontrek') AND partner='${publisher}' GROUP BY 1,2`
        } else{
          fetchDataQuery=`SELECT partner,servicename,ispending,COUNT(1) AS total FROM tbl_partner_callback WHERE DATE(DATE) BETWEEN  '${startDate}' AND '${endDate}' AND clientName IN ('panz','visiontrek') AND partner='${publisher}' AND servicename='${service}' GROUP BY 1,2,3`
          fetchQuery=`SELECT partner,servicename,COUNT(1) AS total FROM tbl_partner_callback WHERE DATE(DATE) BETWEEN  '${startDate}' AND '${endDate}' AND clientName IN ('panz','visiontrek') AND partner='${publisher}' AND servicename='${service}' GROUP BY 1,2`
         }
    }else if(client=='bobble'){
          if(service=='All' && (publisher=='All' || publisher=="")){
            fetchDataQuery = `SELECT partner,servicename,ispending,COUNT(1) AS total FROM tbl_partner_callback WHERE DATE(DATE) BETWEEN  '${startDate}' AND '${endDate}' AND  clientName in ('bobble','panz') and servicename IN ('Diski Chat','Mad Funny','Meme World','RaceDay TV','TT Mbha TV','BubbobGames','McFunny-Trivia','BubboTV') GROUP BY 1,2,3`;
            fetchQuery=`SELECT partner,servicename,COUNT(1) AS total FROM tbl_partner_callback WHERE DATE(DATE) BETWEEN  '${startDate}' AND '${endDate}' AND  clientName in ('bobble','panz') and servicename IN ('Diski Chat','Mad Funny','Meme World','RaceDay TV','TT Mbha TV','BubbobGames','McFunny-Trivia','BubboTV') GROUP BY 1,2`
        
          }else if(publisher=='All' || publisher==""){
            fetchDataQuery = `SELECT partner,servicename,ispending,COUNT(1) AS total FROM tbl_partner_callback WHERE DATE(DATE) BETWEEN  '${startDate}' AND '${endDate}' AND clientName='${client}' AND servicename='${service}' GROUP BY 1,2,3`;
            fetchQuery=`SELECT partner,servicename,COUNT(1) AS total FROM tbl_partner_callback WHERE DATE(DATE) BETWEEN  '${startDate}' AND '${endDate}' AND clientName='${client}' AND servicename='${service}' GROUP BY 1,2`
        
          } else if(service=='All' || service==""){
            fetchDataQuery = `SELECT partner,servicename,ispending,COUNT(1) AS total FROM tbl_partner_callback WHERE DATE(DATE) BETWEEN  '${startDate}' AND '${endDate}' clientName='${client}' AND partner='${publisher}' GROUP BY 1,2,3`;
            fetchQuery=`SELECT partner,servicename,COUNT(1) AS total FROM tbl_partner_callback WHERE DATE(DATE) BETWEEN  '${startDate}' AND '${endDate}' AND  clientName='${client}' AND partner='${publisher}' GROUP BY 1,2`
          } else{
              fetchDataQuery = `SELECT partner,servicename,ispending,COUNT(1) AS total FROM tbl_partner_callback WHERE DATE(DATE) BETWEEN  '${startDate}' AND '${endDate}'  AND clientName='${client}' AND partner='${publisher}' AND servicename='${service}' GROUP BY 1,2,3`;
              fetchQuery=`SELECT partner,servicename,COUNT(1) AS total FROM tbl_partner_callback WHERE DATE(DATE) BETWEEN  '${startDate}' AND '${endDate}' AND  clientName='${client}' AND partner='${publisher}' AND servicename='${service}' GROUP BY 1,2`
          }
     }else{
      if(service=='All' && (publisher=='All' || publisher=="")){
        fetchDataQuery = `SELECT partner,servicename,ispending,COUNT(1) AS total FROM tbl_partner_callback WHERE DATE(DATE) BETWEEN  '${startDate}' AND '${endDate}' AND  clientName='${client}' GROUP BY 1,2,3`;
        fetchQuery=`SELECT partner,servicename,COUNT(1) AS total FROM tbl_partner_callback WHERE DATE(DATE) BETWEEN  '${startDate}' AND '${endDate}' AND clientName='${client}' GROUP BY 1,2`
    
      }else if(publisher=='All' || publisher==""){
        fetchDataQuery = `SELECT partner,servicename,ispending,COUNT(1) AS total FROM tbl_partner_callback WHERE DATE(DATE) BETWEEN  '${startDate}' AND '${endDate}' AND clientName='${client}' AND servicename='${service}' GROUP BY 1,2,3`;
        fetchQuery=`SELECT partner,servicename,COUNT(1) AS total FROM tbl_partner_callback WHERE DATE(DATE) BETWEEN  '${startDate}' AND '${endDate}' AND clientName='${client}' AND servicename='${service}' GROUP BY 1,2`
    
      } else if(service=='All' || service==""){
        fetchDataQuery = `SELECT partner,servicename,ispending,COUNT(1) AS total FROM tbl_partner_callback WHERE DATE(DATE) BETWEEN  '${startDate}' AND '${endDate}' AND clientName='${client}' AND partner='${publisher}' GROUP BY 1,2,3`;
        fetchQuery=`SELECT partner,servicename,COUNT(1) AS total FROM tbl_partner_callback WHERE DATE(DATE) BETWEEN  '${startDate}' AND '${endDate}' AND  clientName='${client}' AND partner='${publisher}' GROUP BY 1,2`
      } else{
          fetchDataQuery = `SELECT partner,servicename,ispending,COUNT(1) AS total FROM tbl_partner_callback WHERE DATE(DATE) BETWEEN  '${startDate}' AND '${endDate}'  AND clientName='${client}' AND partner='${publisher}' AND servicename='${service}' GROUP BY 1,2,3`;
          fetchQuery=`SELECT partner,servicename,COUNT(1) AS total FROM tbl_partner_callback WHERE DATE(DATE) BETWEEN  '${startDate}' AND '${endDate}' AND  clientName='${client}' AND partner='${publisher}' AND servicename='${service}' GROUP BY 1,2`
      }

     }
    
      // console.log("checkAdminUser ", checkAdminUser);
      poolPromotion.query(fetchQuery, [], (err, result) => {

        if (err) return callback(err);
        if (result) {
          
          try {
            poolPromotion.query(fetchDataQuery, [], (err, result1) => {
              if (err) return callback(err);
              if (result1) {
                try {

                  const res=result.map((data,i)=>{
                    result1.map((data1,idx)=>{
                      if(data.partner===data1.partner && data.servicename===data1.servicename){
                        if(data1.ispending==1){
                          data.queue=data1.total
                        }
                        if(data1.ispending==2){
                          data.sent=data1.total
                        }
                        if(data1.ispending==3){
                          data.skip=data1.total
                        }if(data1.ispending==5){
                          data.duplicateRec=data1.total
                        }
                      }
                      
                    })    
                  })
                  return callback("",result);
                } catch (err) {
                  console.log("Data not found");
                  return callback(err);
                }
              }
            });
            
          } catch (err) {
            console.log("Data not found");
            return callback(err);
          }
        }
        
      });
    },

    fetchPublisherTrafficservicesTo: (client, callback) => {
  
      const fetchservices = process.env.FETCH_PUBLISHER_TRAFFIC_SERVICES;

      // console.log("checkAdminUser ", checkAdminUser);
      poolPromotion.query(fetchservices, [client], (err, result) => {
        if (err) return callback(err);
        if (result) {
          const fetchpublisher = process.env.FETCH_PUBLISHER_NAME;

            // console.log("checkAdminUser ", checkAdminUser);
            poolPromotion.query(fetchpublisher, [client], (err, result1) => {
              if (err) return callback(err);
              if (result1) {
              return callback('',result,result1)
              }
      });
        }
      });
    },

    fetchPublisherSubscriptionServicesTo: (client, callback) => {
      let fetchservices=''
      let fetchpublisher=''
      if(client=='panz'){
         fetchservices = process.env.FETCH_PUBLISHER_SUBSCRIPTION_SERVICE;
         fetchpublisher = process.env.FETCH_PUBLISHER_SUBSCRIPTION_PARTNER;
      }else{
         fetchservices = process.env.FETCH_PUBLISHER_SUBSCRIPTION_SERVICE_BY_CLIENT.replace('<client>',client)
         fetchpublisher = process.env.FETCH_PUBLISHER_SUBSCRIPTION_PARTNER_BY_CLIENT.replace('<client>',client)
      }

      // console.log("checkAdminUser ", checkAdminUser);
      poolPromotion.query(fetchservices, [], (err, result) => {
        if (err) return callback(err);
        if (result) {
         
            // console.log("checkAdminUser ", checkAdminUser);
            poolPromotion.query(fetchpublisher, [], (err, result1) => {
              if (err) return callback(err);
              if (result1) {
              return callback('',result,result1)
              }
      });
        }
      });
    },


    fetchMonthlyDataTo: (month,year,clientId, callback) => {

      const fetchDataQuery = process.env.FETCH_MONTHLY_REVENUE;

      misportal.query(fetchDataQuery, [clientId,year,month], (err, result) => {
        if (err) return callback(err);
        if (result) {
          try {
            return callback("", result);
          } catch (err) {
            console.log("Data not found");
            return callback(err);
          }
        }
      });
    },

    searchTrafficByClickIdTo: (clickId, callback) => {

      const fetchDataQuery = process.env.SEARCH_TRAFFIC_BY_CLICK_ID;
       console.log(fetchDataQuery);
       poolPromotion.query(fetchDataQuery, [clickId,clickId], (err, result) => {
        console.log("hhhhhh",err)
        if (err) return callback(err);
        if (result) {
          try {
            console.log(result)
            return callback("", result);
          } catch (err) {
            console.log("Data not found");
            return callback(err);
          }
        }
      });
    },

    searchPubSubByClickIdTo: (clickId, callback) => {

      const fetchDataQuery = process.env.SEARCH_PUBLISHER_SUBSCRIPTION_BY_CLICK_ID;

      poolPromotion.query(fetchDataQuery, [clickId,clickId], (err, result) => {
        if (err) return callback(err);
        if (result) {
          try {
            return callback("", result);
          } catch (err) {
            console.log("Data not found");
            return callback(err);
          }
        }
      });
    },


    fetchKenyaDataTo: (startDate,endDate, callback) => {

      
      const fetchDataQuery = process.env.FETCH_KENYA_DATA;

      kidzmania_kenya.query(fetchDataQuery, [startDate,endDate], (err, result) => {
        if (err) return callback(err);
        if (result) {
          try {
            return callback("", result);
          } catch (err) {
            console.log("Data not found");
            return callback(err);
          }
        }
      });
    },

    fetchGameHubDataTo: (startDate,endDate,callback) => {

      
      const fetchDataQuery = process.env.FETCH_GAMEHUB_DATA;

      
  
      game_hub.query(fetchDataQuery, [startDate,endDate], (err, result) => {
        if (err) return callback(err);
        if (result) {
          try {
            return callback("", result);
          } catch (err) {
            console.log("Data not found");
            return callback(err);
          }
        }
      });
    },

    saveVideoUrl:(videoUrl,subServiceId,subServiceName,callback)=>{
      const query = process.env.SAVE_VIDEO_URL;
      console.log(query)
      misportal.query(query,[subServiceName,subServiceId,videoUrl],(err,result)=>{
        if(err){
          console.log(err)
          return callback(err);
        }
        else{
          return callback('',result)
        }
      })
    },

    checkVideoExistence:(subServiceId,subServiceName,callback)=>{
      const checkquery = process.env.CHECK_VIDEO_EXISTENCE;
      
      misportal.query(checkquery,[subServiceId,subServiceName],(err,result)=>{
        if(err){
          return callback(err);
        }
        else{
          return callback('',result)
        }
      })
    },

    getServiceFlowVideo:(subServiceId,subServiceName,callback)=>{
      const checkquery = process.env.GET_VIDEO;
      misportal.query(checkquery,[subServiceId,subServiceName],(err,result)=>{
        if(err){
          return callback(err);
        }
        else{
          return callback('',result)
        }
      })
    }
};
