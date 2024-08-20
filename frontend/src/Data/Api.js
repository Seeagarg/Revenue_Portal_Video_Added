// const pre=`https://reports.visiontrek.in/`;
// const pre="http://192.168.1.11:4041/"
// const pre=`/`;
const pre =`http://localhost:4041/`

const loginApi = `${pre}open/login`;
export { loginApi };

const sendDataApi = `${pre}secure/sendData`;
export { sendDataApi };

const sendMonthlyDataApi = `${pre}secure/sendMonthlyData`;
export { sendMonthlyDataApi };

const fetchAllServices = `${pre}secure/fetchServices`;
export { fetchAllServices };

const showPublisher = `${pre}secure/showPublisher`;
export { showPublisher };

const addPublisher = `${pre}secure/addPublisher`;
export { addPublisher };

const deletePublisher = `${pre}secure/deletePublisher`;
export { deletePublisher };

const fetchPublisherById = `${pre}secure/fetchPublisherById`;
export { fetchPublisherById };

const editPublisher = `${pre}secure/editPublisher`;
export { editPublisher };

const enableDisablePublisher = `${pre}secure/enableDisablePublisher`;
export { enableDisablePublisher };

const addCountryAndOperator = `${pre}secure/addCountryAndOperator`;
export { addCountryAndOperator };

const fetchCountryAndOperator = `${pre}secure/fetchCountryAndOperator`;
export { fetchCountryAndOperator };

const fetchCountryApi = `${pre}secure/fetchCountry`;
export { fetchCountryApi };

const fetchOperatorApi = `${pre}secure/fetchOperator`;
export { fetchOperatorApi };

const publisherTrafficApi = `${pre}secure/fetchPublisherTraffic`;
export { publisherTrafficApi };

const publisherTrafficServicesApi = `${pre}secure/fetchPublisherTrafficServices`;
export { publisherTrafficServicesApi };

const publisherSubscriptionApi = `${pre}secure/searchPublisherSubscription`;
export { publisherSubscriptionApi };

const publisherSubscriptionServicesApi = `${pre}secure/fetchPublisherSubscriptionServices`;
export { publisherSubscriptionServicesApi };

const loginMasterApi = `${pre}open/loginMasterAdmin`;
export { loginMasterApi };

const fetchClientServices = `${pre}secure/fetchClientServices`;
export { fetchClientServices };

const sendUrlDummyHit = `${pre}secure/dummyHit`;
export { sendUrlDummyHit };

const advertiserApi = `${pre}api/v1/addAdvertiser`;
export { advertiserApi };

const advertiserDataApi = `${pre}api/v1/fetchAdvertiser`;
export { advertiserDataApi };

const enableDisableAdvertiser = `${pre}api/v1/enableDisableAdvertiser`;
export { enableDisableAdvertiser };

const deleteAdvertiser = `${pre}api/v1/deleteAdvertiser`;
export { deleteAdvertiser };

const editAdvertiser = `${pre}api/v1/editAdvertiser`;
export { editAdvertiser };

const advertiserTrafficClientsApi = `${pre}api/v1/fetchClient`;
export { advertiserTrafficClientsApi };

const advertiserTrafficServicesApi = `${pre}api/v1/fetchServices`;
export { advertiserTrafficServicesApi };

const advertiserTrafficApi = `${pre}api/v1/fetchAdvertiserTraffic`;
export { advertiserTrafficApi };

const advertiserSubscriptionApi = `${pre}api/v1/fetchAdvertiserSubscription`;
export { advertiserSubscriptionApi };

const advertiserDummyHit = `${pre}api/v1/dummyHit`;
export { advertiserDummyHit };

const addPublisherInAdvertiser = `${pre}api/v1/addPublisherName`;
export { addPublisherInAdvertiser };

const fetchPublishersInAdvertiser = `${pre}api/v1/fetchPublisherName`;
export { fetchPublishersInAdvertiser };

const fetchClientsServicesData = `${pre}secure/fetchMonthlyRevenue`;
export { fetchClientsServicesData };

const addServerByAdminApi = `${pre}api/v1/addServer`;
export { addServerByAdminApi };

const fetchServerByAdminApi = `${pre}api/v1/fetchServer`;
export { fetchServerByAdminApi };

const addProjectByAdminApi = `${pre}api/v1/addProject`;
export { addProjectByAdminApi };

const fetchProjectDetailsByAdminApi = `${pre}api/v1/fetchProjects`;
export { fetchProjectDetailsByAdminApi };

const editProjectByAdminApi = `${pre}api/v1/editProject`;
export { editProjectByAdminApi };

const deleteProjectByAdminApi = `${pre}api/v1/deleteProject`;
export { deleteProjectByAdminApi };

const fetchClientSubServicesApi = `${pre}secure/fetchClientSubServices`;
export { fetchClientSubServicesApi };


const fetchClientOperatorApi = `${pre}secure/fetchClientOperators`
export {fetchClientOperatorApi};

const searchClickIdTrafficApi=`${pre}secure/searchTrafficByClickId`;
export {searchClickIdTrafficApi};

const searchClickIdSubApi=`${pre}secure/searchPublisherSubscriptionByClickId`;
export {searchClickIdSubApi};


const uploadServiceFlowVideoApi=`${pre}secure/upload`;
export {uploadServiceFlowVideoApi};

const getServiceFlowVideoApi=`${pre}secure/getVideo`;
export {getServiceFlowVideoApi};