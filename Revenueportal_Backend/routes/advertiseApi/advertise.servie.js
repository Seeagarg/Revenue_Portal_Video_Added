const bcrypt = require("bcrypt");
const { poolPromotion } = require("../../database");
const { misportal } = require("../../database");
const { toNumber } = require("lodash");
const saltRounds = 10;
const axios = require('axios');
module.exports = {
 
 
    addAdvertiserTo: (client,service,amount,serviceUrl,postbackUrl,country,operator,skip,dailyCap,publisher, callback) => {

     const promotion_url=process.env.promotion_url_advertiser
     .replace('<client>',client)
     .replace('<service>',service)
     .replace('<publisher>',publisher)
     
     const postbackForClient=process.env.postback_url_advertiser
     .replace('<client>',client)
     .replace('<service>',service)
     .replace('<publisher>',publisher)
     

     const query=process.env.addAdvertiser
     .replace('<client>',`${client}`)
     .replace('<country>',`${country}`)
     .replace('<operator>',`${operator}`)
     .replace('<service>',`${service}`)
     .replace('<amount>',`${amount}`)
     .replace('<service_url>',`${serviceUrl}`)
     .replace('<postback_url>',`${postbackUrl}`)
     .replace('<promotion_url>',`${promotion_url}`)
     .replace('<skip>',skip)
     .replace('<dailyCap>',dailyCap)
     .replace('<postbackForClient>',postbackForClient)
     .replace('<publisher>',publisher)


      // console.log("checkAdminUser ", checkAdminUser);
      poolPromotion.query(query, [], (err, result) => {
        console.log(err,"mmmmm")
        if (err) return callback(err);
        if (result) {
            return callback('',result)
        }
      });
    },

    fetchAdvertiserTo: ( callback) => {

        const query=process.env.fetchAdvertiser
    
         poolPromotion.query(query, [], (err, result) => {
           if (err) return callback(err);
           if (result) {
   
               return callback('',result)
           }
         });
       },


    enableDisableAvertiserTo: ( status,id,callback) => {

        const query=process.env.enableDisableAdvertiser
        .replace('<status>',status)
        .replace('<id>',id)
    
         poolPromotion.query(query, [], (err, result) => {
           if (err) return callback(err);
           if (result) {
   
               return callback('',result)
           }
         });
       },

    deleteAdvertiserTo: (id,callback) => {

        const query=process.env.deleteAdvertiser
        .replace('<id>',id)
    
         poolPromotion.query(query, [], (err, result) => {
           if (err) return callback(err);
           if (result) {
   
               return callback('',result)
           }
         });
       },

    editAdvertiserTo: (id,client,country,operator,amount,service,serviceUrl,postbackUrl,skip,dailyCap,publisher,callback) => {

      const promotion_url=process.env.promotion_url_advertiser
      .replace('<client>',client)
      .replace('<service>',service)
      .replace('<publisher>',publisher)

      const postbackForClient=process.env.postback_url_advertiser
      .replace('<client>',client)
      .replace('<service>',service)
      .replace('<publisher>',publisher)


      const query=process.env.editAdvertiser
     .replace('<id>',id)
     .replace('<client>',`${client}`)
     .replace('<country>',`${country}`)
     .replace('<operator>',`${operator}`)
     .replace('<service>',`${service}`)
     .replace('<amount>',`${amount}`)
     .replace('<service_url>',`${serviceUrl}`)
     .replace('<postback_url>',`${postbackUrl}`)
     .replace('<promotion_url>',`${promotion_url}`)
     .replace('<skip>',skip)
     .replace('<dailyCap>',dailyCap)
     .replace('<postbackForClient>',postbackForClient)
     .replace('<publisher>',publisher)
     
         poolPromotion.query(query, [], (err, result) => {
           if (err) return callback(err);
           if (result) {
   
               return callback('',result)
           }
         });
       },

fetchClientTo: ( callback) => {

        const query=process.env.fetchClient
        
             poolPromotion.query(query, [], (err, result) => {
               if (err) return callback(err);
               if (result) {
       
                   return callback('',result)
               }
             });
   },

 fetchServicesTo: ( client,callback) => {

 const query=process.env.fetchService.replace('<clientName>',client)
            
     poolPromotion.query(query, [], (err, result) => {
       if (err) return callback(err);
          if (result) {
           
             return callback('',result)
              }
        });
   },


fetchAdvertiserTrafficTo: (client,service,startDate,endDate, callback) => {
  let query=''
   if(client=='All' && service=='All'){

     query=process.env.fetchAdevrtiserTraffic.replace('<startDate>',startDate).replace('<endDate>',endDate)
   }else{
    query=process.env.fetchAdvertiserTraffic1.replace('<startDate>',startDate).replace('<endDate>',endDate).replace('<client>',client).replace('<service>',service)
   }
    
         poolPromotion.query(query, [], (err, result) => {
           if (err) return callback(err);
           if (result) {
   
               return callback('',result)
           }
         });
},

fetchAdvertiserSubscriptionTo: (client,service,startDate,endDate, callback) => {
  let fetchDataQuery=``;
  let fetchQuery=``
   if(client=='All' && service=='All'){
    fetchDataQuery = `SELECT clientName,serviceName,publisher,ispending,COUNT(1) AS total FROM tbl_advertiser_callback WHERE DATE(DATE) BETWEEN  '${startDate}' AND '${endDate}'  GROUP BY 1,2,3,4`;
    fetchQuery=`SELECT clientName,serviceName,publisher,COUNT(1) AS total FROM tbl_advertiser_callback WHERE DATE(DATE) BETWEEN  '${startDate}' AND '${endDate}' GROUP BY 1,2,3`

   }else{

     fetchDataQuery = `SELECT clientName,serviceName,publisher,ispending,COUNT(1) AS total FROM tbl_advertiser_callback WHERE DATE(DATE) BETWEEN  '${startDate}' AND '${endDate}' AND clientName='${client}' AND serviceName='${service}'  GROUP BY 1,2,3,4`;
    fetchQuery=`SELECT clientName,serviceName,publisher,COUNT(1) AS total FROM tbl_advertiser_callback WHERE DATE(DATE) BETWEEN  '${startDate}' AND '${endDate}' AND clientName='${client}' AND serviceName='${service}' GROUP BY 1,2,3`
 }
    
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
                if(data.clientName===data1.clientName && data.servicename===data1.servicename){
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

dummyHitTo: async(postbackUrl,service,client, callback) => {
  

  const fetchDataQuery = process.env.dummy_hit;
  
  poolPromotion.query(fetchDataQuery, [client,service], async(err, result) => {
    console.log(result,"hhhhhhhhhhhss")
    if (err) return callback(err);
    if (result.length>0) {
       const postbackUrl1=postbackUrl.replace('<CLICK_ID>',result[0].mediaId)
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

checkPublisherNameTo: (publisher, callback) => {

  const query=process.env.checkPublisherName
  
  .replace('<publisher>',publisher)


   // console.log("checkAdminUser ", checkAdminUser);
   poolPromotion.query(query, [], (err, result) => {
     console.log(err,"mmmmm")
     if (err) return callback(err);
     if (result) {
         return callback('',result)
     }
   });
 },
addPublisherNameTo: (publisher, callback) => {

  const query=process.env.addPublisherName
  
  .replace('<publisher>',publisher)


   // console.log("checkAdminUser ", checkAdminUser);
   poolPromotion.query(query, [], (err, result) => {
     console.log(err,"mmmmm")
     if (err) return callback(err);
     if (result) {
         return callback('',result)
     }
   });
 },

 fetchPublisherNameTo:( callback) => {

  const query=process.env.fetchPublisherName
  
   // console.log("checkAdminUser ", checkAdminUser);
   poolPromotion.query(query, [], (err, result) => {
     console.log(err,"mmmmm")
     if (err) return callback(err);
     if (result) {
         return callback('',result)
     }
   });
 },

};
