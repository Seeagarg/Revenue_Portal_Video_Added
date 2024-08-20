const bcrypt = require("bcrypt");
const { poolPromotion } = require("../../database");
const { misportal,kidzmania_kenya,game_hub } = require("../../database");
const { toNumber } = require("lodash");
const saltRounds = 10;
const axios = require('axios');


module.exports = {
 

  checkAdminUserExist:(username, password, callback) => {
    

    const checkAdminUser = `select * from ClientInfo where username='${username}' and status=1`;
    
    misportal.query(checkAdminUser, [], (err, result) => {
      if (err) return callback(err);
      if (result) {
        try {
          if (password === result[0].password) {
            const checkAdminUser = `select id,serviceName,country from MainServiceInfo where clientInfoId='${result[0].id}'`;
            misportal.query(checkAdminUser, [], (err, data) => {
              if(err){
                return callback(err);
              }
              const checkAdminUser = `select DISTINCT country from MainServiceInfo where clientInfoId='${result[0].id}' AND country IS NOT NULL `;
              misportal.query(checkAdminUser, [], (err, data1) => {
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
    

    const checkAdminUser = `select * from MasterAdminInfo where username='${username}'`;
    misportal.query(checkAdminUser, [], (err, result) => {
      if (err) return callback(err);
      if (result) {
        try {
          if (password === result[0].password) {
            const selectUserName = `select id,username,clientName from ClientInfo `;
            misportal.query(selectUserName, [], (err, data) => {
              if(err){
                return callback(err);
              }
              const checkAdminUser = `select id,clientInfoId,serviceName,country from MainServiceInfo `;
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
    

    const checkAdminUser = `select id,serviceName,country from MainServiceInfo where clientInfoId='${clientId}'`;
    misportal.query(checkAdminUser, [], (err, data) => {
      if(err){
        return callback(err);
      }
      return callback("",data);
    });
  },

  fetchClientSubServicesTo: (mainServiceId, callback) => {
    

    const checkAdminUser = `SELECT id,subServiceName,mainServiceInfoId FROM SubServiceInfo WHERE mainserviceInfoId=${mainServiceId}`;
    misportal.query(checkAdminUser, [], (err, data) => {
      if(err){
        return callback(err);
      }
      let dataArray=[{id:0,subServiceName:'All'}];
      for(row of data){
        dataArray.push(row);
      }
      return callback("",{dataArray});
     
    });
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

     monthQuery=`SELECT
    id,
    misDate,
    renewals,
    renewalsRevenue,
    subscriptionRevenue,
    subscriptions,
    totalActiveBase,totalBase,totalRevenue,unsubscriptions,service,fame,SubFailed,callbackcount,revenueShare,
    YEAR(misDate) AS YEAR,
    MONTH(misDate) AS MONTH,
    DAY(misDate) AS DAY,
    totalRevenue AS Total,
    
    SUM(COALESCE(totalRevenue, 0)) OVER (PARTITION BY YEAR(misDate), MONTH(misDate) ORDER BY DAY(misDate)) AS DailyIncreaseAccumulated
FROM
    (
        SELECT
        id,
        renewals,
    renewalsRevenue,
    subscriptionRevenue,
    subscriptions,
    totalActiveBase,totalBase,totalRevenue,unsubscriptions,service,fame,SubFailed,callbackcount,revenueShare,
            misDate,
            
            LAG(totalRevenue) OVER (ORDER BY misDate) AS lagTotalRevenue
        FROM
            MainService
        WHERE
        service='${serviceName}' and misDate BETWEEN '${from}' and '${to}'
    ) AS subquery
    ORDER BY
    YEAR(misDate),
    MONTH(misDate),
    DAY(misDate)`
   }else{
     monthQuery=`SELECT
     id,
     misDate,
     renewals,
     renewalRevenue as renewalsRevenue,
     subscriptionRevenue,
     subscriptions,totalActiveBase,totalBase,unsubscription as unsubscriptions ,
   totalRevenue,
     YEAR(misDate) AS YEAR,
     MONTH(misDate) AS MONTH,
     DAY(misDate) AS DAY,
     totalRevenue AS Total,
     
     SUM(COALESCE(totalRevenue, 0)) OVER (PARTITION BY YEAR(misDate), MONTH(misDate) ORDER BY DAY(misDate)) AS DailyIncreaseAccumulated
 FROM
     (
         SELECT
         id,
         renewals,
     renewalRevenue,
     subscriptionRevenue,
     subscriptions,totalActiveBase,totalBase,unsubscription,
     totalRevenue,
             misDate,
             
             LAG(totalRevenue) OVER (ORDER BY misDate) AS lagTotalRevenue
         FROM
             SubService
         WHERE
         subServiceName='${subServiceName}' AND misDate BETWEEN '${from}' and '${to}'
     ) AS subquery
     ORDER BY
     YEAR(misDate),
     MONTH(misDate),
     DAY(misDate)`
   }
    
    
    
    misportal.query(monthQuery, [], (err, result) => {

      if (err) return callback(err);
      if (result) {
      
        return callback('',result);
       
      }
    });
  },

  sendMonthlyDataTo: (interval, service, callback) => {
    
    const fetchDataQuery = `SELECT MONTH(misDate)AS MONTH,YEAR(misDate) AS YEAR,SUM(renewals) AS renewals,
    SUM(renewalsRevenue) AS renewalsRevenue, SUM(subscriptions) AS subscription,
    SUM(subscriptionRevenue) AS subscriptionRevenue,
    SUM(totalRevenue) AS totalRevenue FROM MainService 
    WHERE service='${service}' AND DATE(misDate) BETWEEN 
    SUBDATE(ADDDATE(CURDATE(),INTERVAL -(SELECT DAY(CURDATE())-1) DAY), INTERVAL ${interval} MONTH) AND CURDATE()
    GROUP BY MONTH(misDate),YEAR(misDate) ORDER BY YEAR(misDate) ASC,MONTH(misDate) ASC`;
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


 fetchAllServicesTo: (id, callback) => {
  
    const fetchDataQuery = `select distinct m.serviceName as service ,
    s.subServiceName as subService, s.id AS id,s.serviceId as serviceId
     from ClientInfo c join MainServiceInfo m on c.id=m.clientInfoId join SubServiceInfo s on m.id=s.mainServiceInfoId where c.id=${id}`;
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

fetchPublisherData: (service, callback) => {
    const fetchDataQuery = `select *
     from tbl_publisher_table where service='${service}'`;
    // console.log("checkAdminUser ", checkAdminUser);
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

  addPublisherTo: (id,name,client,postbackUrl,operator,country,service,serviceUrl,skip,promotionUrl,dailyCap,amount, callback) => {
  
    const fetchDataQuery = `INSERT INTO tbl_publisher_table (datetime,client,status,name,postbackUrl,operator,country,service,serviceUrl,skipValue,serviceId,promotionUrl,dailyCap,amount) VALUE (NOW(),"${client}",1,"${name}","${postbackUrl}","${operator}","${country}","${service}","${serviceUrl}","${skip}",${id},"${promotionUrl}",${dailyCap},${amount})`;
    // console.log("checkAdminUser ", checkAdminUser);
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
 fetchPublisherTo: (id, callback) => {
  
    const fetchDataQuery = `select * from tbl_publisher_table where id=${id}`;
    // console.log("checkAdminUser ", checkAdminUser);
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

  deletePublisherTo: (id, callback) => {
  
    const fetchDataQuery = `DELETE FROM tbl_publisher_table WHERE id=${id}`;
    // console.log("checkAdminUser ", checkAdminUser);
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

  editPublisherTo: (id,name,client, postbackUrl,operator,country,service,serviceUrl,skip,promotionUrl,dailyCap,amount, callback) => {
  
    const updateDataQuery = `UPDATE tbl_publisher_table SET client="${client}",name='${name}',postbackUrl='${postbackUrl}' ,operator='${operator}',country='${country}',service='${service}',serviceUrl='${serviceUrl}',skipValue=${skip},promotionUrl='${promotionUrl}',dailyCap=${dailyCap},amount=${amount} WHERE id=${id}`;
    // console.log("checkAdminUser ", checkAdminUser);
    poolPromotion.query(updateDataQuery, [], (err, result) => {
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
  
    const updateDataQuery = `UPDATE tbl_publisher_table SET status=${status} WHERE id=${id}`;
    // console.log("checkAdminUser ", checkAdminUser);
    poolPromotion.query(updateDataQuery, [], (err, result) => {
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
  

    const fetchDataQuery = `SELECT * FROM publishertraffic WHERE DATE(DATE)=DATE(SUBDATE(NOW(),0)) AND partnerid='${partnerName}' AND service='${service}' ORDER BY DATE DESC`;
    
    poolPromotion.query(fetchDataQuery, [], async(err, result) => {
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
    const checkCountry=`select * from tbl_county_operator where country_name="${country}" and operator_name="${operator}" and clientName='${client}'`
    const insertDataQuery = `INSERT INTO tbl_county_operator (country_name,operator_name,STATUS,clientName) VALUE ('${country}',"${operator}",1,"${client}")`;
    // console.log("checkAdminUser ", checkAdminUser);
    poolPromotion.query(checkCountry, [], (err, result) => {
      if (err) return callback(err);
      if (result.length==0) {
        try {
          poolPromotion.query(insertDataQuery, [], (err, result) => {
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
  
    const fetchDataQuery = `select * from tbl_county_operator where clientName="${client}"`;
    
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
  fetchCountryTo: (client, callback) => {
  
    const fetchDataQuery = `select DISTINCT country_name from tbl_county_operator where clientName="${client}"`;
    
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

  fetchOperatorTo: (client,country, callback) => {
  
    const fetchDataQuery = `select operator_name as operator from tbl_county_operator where country_name='${country}' and clientName="${client}" `;
    
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

  fetchPublisherTrafficTo: (client,service,publisher,startDate,endDate, callback) => {
  let fetchDataQuery=''
  if(client=='bobble'){
    if(service=='All' && (publisher=='All' || publisher=="")){
      fetchDataQuery = `SELECT MAX(DATE) AS latest_date,clientName,partnerid,service,country,operator,COUNT(1) as count FROM publishertraffic WHERE clientName in ('bobble','panz') and service IN ('Diski Chat','Mad Funny','Meme World','RaceDay TV','TT Mbha TV','BubbobGames','McFunny-Trivia','BubboTV') AND DATE(DATE) BETWEEN  '${startDate}' AND '${endDate}' GROUP BY 2,3,4,5,6`;

    }else if(publisher=='All' || publisher==""){
      fetchDataQuery = `SELECT MAX(DATE) AS latest_date,clientName,partnerid,service,country,operator,COUNT(1) as count FROM publishertraffic WHERE clientName in ('bobble','panz')  AND service='${service}' AND DATE(DATE) BETWEEN  '${startDate}' AND '${endDate}' GROUP BY 2,3,4,5,6`;

    } else if((service=='All' || service=="")){
      fetchDataQuery = `SELECT MAX(DATE) AS latest_date,clientName,partnerid,service,country,operator,COUNT(1) as count FROM publishertraffic WHERE clientName in ('bobble','panz') AND partnerid='${publisher}' AND DATE(DATE) BETWEEN  '${startDate}' AND '${endDate}' GROUP BY 2,3,4,5,6`;
    }
    else{
      fetchDataQuery = `SELECT MAX(DATE) AS latest_date,clientName,partnerid,service,country,operator,COUNT(1) as count FROM publishertraffic WHERE clientName='${client}'AND service='${service}' AND partnerid='${publisher}' AND DATE(DATE) BETWEEN  '${startDate}' AND '${endDate}' GROUP BY 2,3,4,5,6`;
    }

  }else{
    if(service=='All' && (publisher=='All' || publisher=="")){
      fetchDataQuery = `SELECT MAX(DATE) AS latest_date,clientName,partnerid,service,country,operator,COUNT(1) as count FROM publishertraffic WHERE clientName='${client}' AND DATE(DATE) BETWEEN  '${startDate}' AND '${endDate}' GROUP BY 2,3,4,5,6`;

    }else if(publisher=='All' || publisher==""){
      fetchDataQuery = `SELECT MAX(DATE) AS latest_date,clientName,partnerid,service,country,operator,COUNT(1) as count FROM publishertraffic WHERE clientName='${client}'AND service='${service}' AND DATE(DATE) BETWEEN  '${startDate}' AND '${endDate}' GROUP BY 2,3,4,5,6`;

    } else if((service=='All' || service=="")){
      fetchDataQuery = `SELECT MAX(DATE) AS latest_date,clientName,partnerid,service,country,operator,COUNT(1) as count FROM publishertraffic WHERE clientName='${client}'AND partnerid='${publisher}' AND DATE(DATE) BETWEEN  '${startDate}' AND '${endDate}' GROUP BY 2,3,4,5,6`;
    }
    else{
      fetchDataQuery = `SELECT MAX(DATE) AS latest_date,clientName,partnerid,service,country,operator,COUNT(1) as count FROM publishertraffic WHERE clientName='${client}'AND service='${service}' AND partnerid='${publisher}' AND DATE(DATE) BETWEEN  '${startDate}' AND '${endDate}' GROUP BY 2,3,4,5,6`;
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
  
    const fetchDataQuery = `SELECT partner,servicename,ispending,COUNT(1) AS total FROM tbl_partner_callback WHERE DATE(DATE)=DATE(SUBDATE(NOW(),0)) AND partnercallbackUrl IS NOT NULL AND clientName='${client}' GROUP BY 1,2,3`;
    // console.log("checkAdminUser ", checkAdminUser);
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

  searchPublisherSubscriptionTo: (client,startDate,endDate, callback) => {
  let fetchDataQuery=``;
  let fetchQuery=``
  if(client=='panz'){
    fetchDataQuery=`SELECT clientName ,partner,servicename,ispending,COUNT(1) AS total FROM tbl_partner_callback WHERE DATE(DATE) BETWEEN  '${startDate}' AND '${endDate}' AND clientName IN ('panz','visiontrek') GROUP BY 1,2,3`

  }else{
    fetchDataQuery = `SELECT partner,servicename,ispending,COUNT(1) AS total FROM tbl_partner_callback WHERE DATE(DATE) BETWEEN  '${startDate}' AND '${endDate}' AND partnercallbackUrl  IS NOT NULL AND clientName='${client}' GROUP BY 1,2,3`;
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
  
      const fetchservices = `SELECT DISTINCT service FROM tbl_publisher_table WHERE CLIENT='${client}'`;

      // console.log("checkAdminUser ", checkAdminUser);
      poolPromotion.query(fetchservices, [], (err, result) => {
        if (err) return callback(err);
        if (result) {
          const fetchpublisher = `SELECT DISTINCT NAME AS publisher FROM tbl_publisher_table WHERE CLIENT='${client}'`;

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

    fetchPublisherSubscriptionServicesTo: (client, callback) => {
      let fetchservices=''
      let fetchpublisher=''
      if(client=='panz'){
         fetchservices = ` SELECT DISTINCT servicename FROM tbl_partner_callback WHERE clientName IN ('panz','visiontrek')`;
         fetchpublisher = ` SELECT DISTINCT partner FROM tbl_partner_callback WHERE clientName IN ('panz','visiontrek')`;
      }else{
         fetchservices = ` SELECT DISTINCT servicename FROM tbl_partner_callback WHERE clientName='${client}'`;
         fetchpublisher = ` SELECT DISTINCT partner FROM tbl_partner_callback WHERE clientName='${client}'`;
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

      const fetchDataQuery = `SELECT MONTH(misDate)AS MONTH,YEAR(misDate) AS YEAR,SUM(renewals) AS renewals,
      SUM(renewalsRevenue) AS renewalsRevenue, SUM(subscriptions) AS subscription,
      SUM(subscriptionRevenue) AS subscriptionRevenue,
      SUM(totalRevenue) AS totalRevenue,service FROM MainService 
      WHERE service IN (select serviceName from  MainServiceInfo where clientInfoId=${clientId}) AND YEAR(misDate)=${year} AND MONTH(misDate)=${month}
      GROUP BY MONTH(misDate),YEAR(misDate),service ORDER BY service,YEAR(misDate) ASC,MONTH(misDate) ASC`;

      misportal.query(fetchDataQuery, [], (err, result) => {
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

      const fetchDataQuery = `SELECT * FROM publishertraffic WHERE refId='${clickId}' OR media='${clickId}'`;
       console.log(fetchDataQuery);
       poolPromotion.query(fetchDataQuery, [], (err, result) => {
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

      const fetchDataQuery = `SELECT * FROM tbl_partner_callback WHERE ext_id='${clickId}' OR clickId='${clickId}'
`;

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


    fetchKenyaDataTo: (startDate,endDate, callback) => {

      
      const fetchDataQuery = `SELECT subDate, COUNT(*) AS newSubCharged FROM tbl_subscription WHERE subDate BETWEEN '${startDate}' AND '${endDate}' AND DATE(nextBillingDate) > DATE(SUBDATE(NOW(),0)) AND STATUS='SUB' AND nextBillingDate IS NOT NULL GROUP BY 1`;

      kidzmania_kenya.query(fetchDataQuery, [], (err, result) => {
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

      
      const fetchDataQuery = `SELECT subDate, COUNT(*) AS newSubCharged FROM tbl_subscription WHERE subDate BETWEEN '${startDate}' AND '${endDate}' AND DATE(nextBillingDate) > DATE(SUBDATE(NOW(),0)) AND STATUS='SUB' AND nextBillingDate IS NOT NULL GROUP BY 1`;

      
  
      game_hub.query(fetchDataQuery, [], (err, result) => {
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
};
