

const { poolPromotion } = require("../../database");
const TelegramBot = require('node-telegram-bot-api');
const token = process.env.BOT_TOKEN
 const bot = new TelegramBot(token, {polling: true});
const chatId = -4118693254;

module.exports = {
  
    sendMessage:()=>{
        const query=`SELECT clientName,service ,COUNT(service) AS COUNT
        FROM publishertraffic 
        WHERE DATE(DATE) = CURDATE() 
        GROUP BY service ,clientName
        HAVING COUNT > 500 
        ORDER BY COUNT DESC;`
        poolPromotion.query(query, [], (err, result) => {
        
            if (err) throw err;
            if (result?.length>0) {
               const query2=`SELECT clientName,servicename,ispending,COUNT(1) AS total FROM tbl_partner_callback WHERE DATE(DATE)=CURDATE() AND  servicename IN (SELECT  service 
                FROM publishertraffic 
                WHERE DATE(DATE) = CURDATE() 
                GROUP BY service 
                HAVING COUNT(service) > 500 
                ORDER BY service DESC) GROUP BY 1,2,3`
                const query1=`SELECT clientName,servicename,COUNT(1) AS total FROM tbl_partner_callback WHERE DATE(DATE)=CURDATE() AND  servicename IN (SELECT  service 
                  FROM publishertraffic 
                  WHERE DATE(DATE) = CURDATE() 
                  GROUP BY service 
                  HAVING COUNT(service) > 500 
                  ORDER BY service DESC) GROUP BY 1,2`
                  poolPromotion.query(query1, [], (err, result1) => {
                    
                    if (err) throw err;
                    if (result1) {
                      console.log(result1,"nnnnnnnnn")
                      poolPromotion.query(query2, [], (err, result2) => {
                         console.log(err,"bbbbbbbb")
                        if (err) throw err;
                        if (result2) {
                          console.log(result2,"kkkkkkkkkkk")
                          const res=result1.map((data,i)=>{
                            result2.map((data1,idx)=>{
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

                          const table = result.map(row => `${row.clientName} | ${row.service} | ${row.COUNT}`).join('\n');//.replaceAll("|","-->")
                          const table1 = result1.map(row => `${row.clientName} | ${row.servicename} | ${row.queue==undefined?0:row.queue} | ${row.sent==undefined?0:row.sent} | ${row.skip==undefined?0:row.skip}  |  ${row.total}`).join('\n');//.replaceAll("|","-->")
                            console.log(`Below services are promoting \nclient | service | count\n${table} \n\nPublisher subscription count \nclient | sercice | queue | send | skip | total\n${table1}` )
                           bot.sendMessage(chatId, `Below services are promoting:\n*client | service | count*\n------------------------------------------\n${table}\n\nPublisher subscription count: \n*client | service | queue | send | skip | total*\n--------------------------------------------------------------\n${table1}`,{ parse_mode: 'Markdown' });
                          // bot.sendMessage(chatId, `Publisher subscription count \n${table1}`);
                        }
                      });
                   
                      
                    }
                  });
                  
              //  const table = result.map(row => `${row.clientName} | ${row.service} | ${row.COUNT}`).join('\n').replaceAll("|","-->");
              //  console.log(table)
              //  bot.sendMessage(chatId, `Below services are promoting \n${table}`);
            }
          });
        
    }
  };