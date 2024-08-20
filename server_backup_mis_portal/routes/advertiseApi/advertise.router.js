const { addAdvertiser,fetchAdvertiser,enableDisableAvertiser,deleteAdvertiser,
    
    editAdvertiser,fetchAdvertiserTraffic,fetchClient,fetchServices,
    fetchAdvertiserSubscription,dummyHit,addPublisherName,fetchPublisherName
} = require("./advertise.controller");

const router = require("express").Router();

router.post("/addAdvertiser", addAdvertiser);
router.post("/fetchAdvertiser", fetchAdvertiser);
router.post("/enableDisableAdvertiser", enableDisableAvertiser);
router.post("/deleteAdvertiser", deleteAdvertiser);
router.post("/editAdvertiser", editAdvertiser);

router.post("/dummyHit", dummyHit);
router.post("/addPublisherName", addPublisherName);
router.post("/fetchPublisherName", fetchPublisherName);
router.post("/fetchClient", fetchClient);
router.post("/fetchServices", fetchServices);
router.post("/fetchAdvertiserTraffic",fetchAdvertiserTraffic );

router.post("/fetchAdvertiserSubscription",fetchAdvertiserSubscription );

module.exports = router;
