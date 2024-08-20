import React from "react";
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import LoginPage from "../Pages/LoginPage";
import DailyRevenuePage from "../Pages/DailyRevenuePage";
import MonthlyRevenuePage from "../Pages/MonthlyRevenuePage";
import AddCountryAndOperatorPage from "../Pages/AddCountryAndOperatorPage";
import PublisherTrafficPage from "../Pages/PublisherTrafficPage";
import PublisherSubscriptionPage from "../Pages/PublisherSubscriptionPage";
import DashboardPage from "../Pages/DashboardPage";
import ServicePage from "../Pages/ServicePage";
import AdvertiserPage from "../Pages/AdvertiserPage";
import AdvertiserTrafficPage from "../Pages/AdvertiserTrafficPage";
import AdvertiserSubscriptionPage from "../Pages/AdvertiserSubscriptionPage";
import DailyRevenueAdminPage from "../Pages/DailyRevenueAdminPage";
import DashboardAdminPage from "../Pages/DashboardAdminPage";
import MonthlyRevenueAdminPage from "../Pages/MonthlyRevenueAdminPage";
import ErrorBoundary from "../Pages/ErrorBoundary";
import Auth from "../NewComponents/Auth/Auth"; 
import UploadVideo from "../Pages/UploadVideo";

// DEFINING THE ROUTES OF THE PAGES....
const router = createBrowserRouter([
  {
    path: "/",
    element: <LoginPage />,
    errorElement: <ErrorBoundary />,
  },
  {
    path: "/dailyRevenue",
    element: (
      <Auth conditionApply={true} condition={localStorage.getItem("hide_data")}>
        <DailyRevenuePage />
      </Auth>
    ),
    errorElement: <ErrorBoundary />,
  },
  {
    path: "/monthlyRevenue",
    element: (
      <Auth conditionApply={true} condition={localStorage.getItem("hide_data")}>
        <MonthlyRevenuePage />
      </Auth>
    ),
    errorElement: <ErrorBoundary />,
  },
  {
    path: "/dashboard",
    element: (
      <Auth
      conditionApply={true}
        condition={
          localStorage.getItem("hide_data") ||
          localStorage.getItem("userName") == "etho_1234"
        }
      >
        <DashboardPage />
      </Auth>
    ),
    errorElement: <ErrorBoundary />,
  },
  {
    path: "/dashboard/:serviceName/:id",
    element: (
      <Auth
      conditionApply={true}
        condition={
          localStorage.getItem("hide_data") ||
          localStorage.getItem("userName") == "etho_1234"
        }
      >
        <ServicePage />
      </Auth>
    ),
    errorElement: <ErrorBoundary />,
  },
  {
    path: "/add-country-and-add-operator",
    element: (
      <Auth
      conditionApply={true}
        condition={
          localStorage.getItem("hide_data") ||
          localStorage.getItem("userName") == "etho_1234"
        }
      >
        <AddCountryAndOperatorPage />
      </Auth>
    ),
    errorElement: <ErrorBoundary />,
  },
  {
    path: "/publisher-traffic",
    element: (
      <Auth
        conditionApply={true}
        condition={localStorage.getItem("userName") == "etho_1234"}
      >
        <PublisherTrafficPage />
      </Auth>
    ),
    errorElement: <ErrorBoundary />,
  },
  {
    path: "/publisher-subscription",
    element: (
      <Auth
        conditionApply={true}
        condition={localStorage.getItem("userName") == "etho_1234"}
      >
        <PublisherSubscriptionPage />
      </Auth>
    ),
    errorElement: <ErrorBoundary />,
  },
  {
    path: "/advertiser",
    element: (
      <Auth
        conditionApply={true}
        condition={localStorage.getItem("userName") != "panz"}
      >
        <AdvertiserPage />
      </Auth>
    ),
    errorElement: <ErrorBoundary />,
  },
  {
    path: "/advertiser-traffic",
    element: (
      <Auth
        conditionApply={true}
        condition={localStorage.getItem("userName") != "panz"}
      >
        <AdvertiserTrafficPage />
      </Auth>
    ),
    errorElement: <ErrorBoundary />,
  },
  {
    path: "/advertiser-subscription",
    element: (
      <Auth
        conditionApply={true}
        condition={localStorage.getItem("userName") != "panz"}
      >
        <AdvertiserSubscriptionPage />
      </Auth>
    ),
    errorElement: <ErrorBoundary />,
  },
  {
    path: "/dailyRevenueAdmin",
    element: (
      <Auth admin={true}>
        <DailyRevenueAdminPage />
      </Auth>
    ),
    errorElement: <ErrorBoundary />,
  },
  {
    path: "/monthlyRevenueAdmin",
    element: (
      <Auth admin={true}>
        <MonthlyRevenueAdminPage />
      </Auth>
    ),
    errorElement: <ErrorBoundary />,
  },
  {
    path: "/dashboardAdmin",
    element: (
      <Auth admin={true}>
        <DashboardAdminPage />
      </Auth>
    ),
    errorElement: <ErrorBoundary />,
    
  },
  {
    path: "/uploadFlowVideo",
    element: (
      <Auth admin={true}>
        <UploadVideo/>
      </Auth>
    ),
    errorElement: <ErrorBoundary />,
    
  },
]);

const Routing = () => {
  return <RouterProvider router={router} />;
};

export default Routing;
