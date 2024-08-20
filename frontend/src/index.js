import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import PublisherDummyHitModalContextProvider from "./Context/Publisher-Modal-Context/PublisherDummyHitModalContext";
import PublisherModalContextProvider from "./Context/Publisher-Modal-Context/PublisherModalContext";
import EditPublisherModalContextProvider from "./Context/Publisher-Modal-Context/EditPublisherModalContext";
import AdvertiserModalProvider from "./Context/Advertiser-Modal-Context/AdvertiserModalContext";
import EditAdvertiserProvider from "./Context/Advertiser-Modal-Context/EditAdvertiserContext";
import AdvertiserDummyHitProvider from "./Context/Advertiser-Modal-Context/AdvertiserDummyHitContext";
import { PrimeReactProvider } from "primereact/api";
import "primereact/resources/primereact.css";
import "primereact/resources/themes/lara-light-indigo/theme.css";
import "primeicons/primeicons.css";
import "./index.css";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
    <AdvertiserDummyHitProvider>
      <PublisherDummyHitModalContextProvider>
        <EditPublisherModalContextProvider>
          <PublisherModalContextProvider>
            <AdvertiserModalProvider>
              <EditAdvertiserProvider>
                <PrimeReactProvider>
                  <App />
                </PrimeReactProvider>
              </EditAdvertiserProvider>
            </AdvertiserModalProvider>
          </PublisherModalContextProvider>
        </EditPublisherModalContextProvider>
      </PublisherDummyHitModalContextProvider>
    </AdvertiserDummyHitProvider>
);

reportWebVitals();
