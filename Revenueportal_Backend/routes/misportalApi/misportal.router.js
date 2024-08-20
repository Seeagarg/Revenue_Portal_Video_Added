const upload = require("../../middleware/Upload");
const {  sendData, loginUser,sendMonthlyData,fetchAllServces,
    addPublisher,showPublisher,deletePublisher, fetchPublisher,
    editPublisher,enableDisablePublisher,addCountryAndOperator,
    fetchCountryAndOperator,fetchOperator,fetchCountry,
    fetchPublisherTraffic,fetchPublisherSubscription,dummyHit,
    searchPublisherSubscription,fetchClientServices,fetchClientSubServices,fetchPublisherTrafficservices,
    fetchPublisherSubscriptionServices,fetchMonthlyRevenue,fetchKenyaData,fetchGameHubData,searchTrafficByClickId,
    searchPubSubByClickId,
    loginMasterAdmin,
    fetchClientOperators,
    uploadVideo,
    getVideo} = require("./misportal.controller");

const router = require("express").Router();

router.post("/login", loginUser);
router.post("/loginMasterAdmin",loginMasterAdmin);
router.post("/fetchClientServices", fetchClientServices);
router.post("/fetchClientSubServices", fetchClientSubServices);
router.post("/fetchClientOperators",fetchClientOperators)

router.post("/sendData", sendData);
router.get("/sendMonthlyData", sendMonthlyData);

router.post("/fetchServices", fetchAllServces);

router.post("/showPublisher", showPublisher);
router.post("/addPublisher", addPublisher);
router.post("/fetchPublisherById", fetchPublisher);
router.post("/deletePublisher", deletePublisher);
router.post("/editPublisher", editPublisher);
router.post("/enableDisablePublisher", enableDisablePublisher);
router.post("/dummyHit", dummyHit);

router.post("/addCountryAndOperator", addCountryAndOperator);
router.post("/fetchCountryAndOperator", fetchCountryAndOperator);
router.post("/fetchCountry", fetchCountry);
router.post("/fetchOperator", fetchOperator);


router.post("/fetchPublisherTraffic", fetchPublisherTraffic);
router.post("/fetchPublisherSubscription", fetchPublisherSubscription);
router.post("/searchPublisherSubscription", searchPublisherSubscription);

router.post("/fetchPublisherTrafficservices", fetchPublisherTrafficservices);
router.post("/fetchPublisherSubscriptionServices", fetchPublisherSubscriptionServices);

router.post("/fetchMonthlyRevenue", fetchMonthlyRevenue);
router.post("/searchTrafficByClickId", searchTrafficByClickId);
router.post("/searchPublisherSubscriptionByClickId", searchPubSubByClickId);
//used for fetching new subscribers charged

router.post("/fetchKenyaData", fetchKenyaData);
router.post("/fetchGameHubData",fetchGameHubData);


router.post('/upload',upload.single('file'),uploadVideo)

router.post('/getVideo',getVideo)

module.exports = router;
