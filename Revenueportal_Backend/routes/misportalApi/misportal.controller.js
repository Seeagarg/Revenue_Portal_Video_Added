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
    searchTrafficByClickIdTo,searchPubSubByClickIdTo,
    fetchClientOperatorsTo,
    saveVideoUrl,
    checkVideoExistence,
    getServiceFlowVideo
  } = require("./misportal.services");

  const path = require('path')
  const fs = require('fs-extra');
  const ffmpeg = require('fluent-ffmpeg');
  const { S3Client } = require('@aws-sdk/client-s3');
  const { Upload } = require('@aws-sdk/lib-storage');
  const ffmpegPath = require('@ffmpeg-installer/ffmpeg').path;
  const ffprobePath = require('@ffprobe-installer/ffprobe').path;


  ffmpeg.setFfmpegPath(ffmpegPath);
  ffmpeg.setFfprobePath(ffprobePath);

  const subfolder = process.env.AWS_SUBFOLDER
  const bucket_name = process.env.AWS_BUCKET_NAME


  const s3Client= new S3Client({
    region:process.env.AWS_REGION,
    credentials:{
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey:process.env.AWS_SECRET_ACCESS_KEY
    },
  })

  
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
      console.log(clientId,'--000---',userId,'---')
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
      const {operator}=req.query
      const {mainServiceId} = req.query
      const client_id=req.user.id;
      console.log(operator,"llllll")
      fetchClientSubServicesTo(operator,mainServiceId,client_id,(err, result,) => {
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

    fetchClientOperators:(req,res)=>{
      const {country} = req.body;
      const client_id=req.user.id;
      console.log(client_id)
      fetchClientOperatorsTo(country,client_id,(err,result)=>{
        if(err){
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
      })

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

    
    uploadVideo:async(req,res)=>{
      const file = req.file;

      if (!file) {
        console.error('File missing');
        return res.status(400).json({ error: 'File is required.' });
      }

      const name = req.file.filename;
      const {subServiceId,subServiceName} = req.body;
      const outputName = name.split('.mp4')[0];
      console.log(file)

      checkVideoExistence(subServiceId,subServiceName,async(err,result)=>{
        if(err){
          return res.status(500).json({error:err,message:'INTERNAL SERVER ERROR!!'})
        }
        else{
          if(result.length > 0){
            return res.json({message:'Video Already Exist!!'})
          }
          else{

            
      const outputDir = path.join(__dirname,'../../public/videos',outputName);
      console.log(outputDir,'--------');

      // const inputDir = path.join(__dirname,'../../public/videos',name)
      try{
        await convertToHLS(file.path,outputDir,outputName);

        const hlsFiles = await fs.readdir(outputDir);

        // res.send("success")
        const uploadPromises = hlsFiles.map(async (file) => {
          const filePath = path.join(outputDir, file);
          const s3Key = `${subfolder}/${outputName}/${file}`;
          return uploadFileToS3(bucket_name, s3Key, filePath, file.endsWith('.m3u8') ? 'application/vnd.apple.mpegurl' : 'video/MP2T');
        });

        const hlsUrls = await Promise.all(uploadPromises);
        console.log(hlsUrls)

        const videoUrl = hlsUrls.find(url => url.endsWith('.m3u8'));

        saveVideoUrl(videoUrl,subServiceId,subServiceName,(err,result)=>{
          if(err){
            return res.status(500).json({error:err,message:"Video Not Uploaded!!"})
          }
          else{
            return res.json({result:result,message:"Video Uploaded Successfully!!"});
          }
        })

        

      }
      catch(err){
        console.log(err);
        res.status(500).json({error:err,message:"Video Not Uploaded"})
      }
      finally {
        await fs.remove(outputDir);
        await fs.remove(file.path);
    }


          }
        }
      })

      
     
  },
  getVideo:(req,res)=>{
    const {subServiceId,subServiceName} = req.body;
    
    getServiceFlowVideo(subServiceId,subServiceName,(err,result)=>{
      if(err){
        console.log(err);
        return res.status(500).json({error:err,message:"INTERNAL SERVER ERROR!!"})
      }
      else{
        return res.json({result:result})
      }
    })
  }
}





  const convertToHLS=(inputPath,outputPath,outputName)=>{
    console.log(outputName,'--------------')
    console.log(inputPath,'-===================')
    return new Promise((resolve, reject) => {
      console.log('Starting HLS conversion:', inputPath);
      ffmpeg.ffprobe(inputPath, (err, metadata) => {
        if (err) {
          console.error('Error getting video metadata:', err);
          reject(err);
          return;
        }
  
        const duration = metadata.format.duration;
        const segmentDuration = Math.ceil(duration / 10); // Example: Divide into segments of 10 seconds

        console.log(segmentDuration,';;;;;;;;')


        fs.ensureDirSync(outputPath);

        ffmpeg(inputPath)
          .outputOptions([
            '-codec copy',
            '-start_number 0',
            `-hls_time 10`,
            '-hls_list_size 0',
            '-f hls'
          ])
          .output(path.join(outputPath,`${outputName}.m3u8`))
          .on('start', commandLine => {
            console.log('\nFFmpeg command:', commandLine);
            console.log('xgsafcVHSIUVGCFXDHCVSBNIQGCSFXBVBANXOIUQ\ngfcwqefgjwhdb\ndwgvdadusqh\nqdwfctygdqv\nxcfuhi')
          })
          .on('progress', progress => {
            console.log(`\nProcessing: ${progress.percent}% done`);
          })
          .on('end', () => {
            console.log('\nHLS conversion completed');
            resolve();
          })
          .on('error', (err) => {
            console.log(path.join(outputPath,`${outputName}.m3u8`),'pathj=-gfdgh')
            console.error('Error converting to HLS:', err);
            reject(err);
          })
          .run();
      });
    });
  }


  const uploadFileToS3=async(bucketName,key,filePath, contentType )=>{
    const fileStream = fs.createReadStream(filePath);
    const fileSize = fs.statSync(filePath).size;
    const partSize = 5*1024*1024;
    try{
      console.log('Starting upload content');

      const upload = new Upload({
        client:s3Client,
        params: {
        Bucket: bucketName,
        Key: key,
        Body: fileStream,
        ContentType: contentType,
        ACL: 'public-read',
      },
      partSize,
      leavePartsOnError: false,
      })

      upload.on('httpUploadProgress', (progress) => {
        console.log(`Uploaded ${progress.loaded} of ${progress.total} bytes`);
      });

      await upload.done();
    const uploadedUrl = `https://${bucketName}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`;
    console.log(`File uploaded successfully: ${uploadedUrl}`);
    return uploadedUrl;
    }
    catch(err){
      console.error('Error uploading file:', err);
      throw err;
    }
  }
  