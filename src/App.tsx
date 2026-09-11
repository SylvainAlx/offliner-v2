import { useEffect, useState } from "react";
import { useOnlineStatus } from "./stores/onlineStatusStore";
import HomePage from "./components/HomePage";
import Header from "./components/layouts/Header";
import Footer from "./components/layouts/Footer";
import Help from "./components/Help";
import Profile from "./components/Profile";
import Tracking from "./components/Tracking";
import Status from "./components/Status";
import Village from "./components/Village";
import "./styles/App.css";

function AppContent() {
  const { isOnline } = useOnlineStatus();

  useEffect(() => useOnlineStatus.getState().initialize(), []);

  return (
    <div className={`app-container ${isOnline ? "online" : "offline"}`}>
      <Header />
      <main className="app-main">
        <Status />
        <Profile />
        <Village />
        <Tracking />
        <Help />
      </main>
      <Footer />
    </div>
  );
}

function App() {
  const [showHomePage, setShowHomePage] = useState(() => {
    if (typeof window === "undefined") return true;
    return !sessionStorage.getItem("offliner:welcome-dismissed");
  });

  if (showHomePage) {
    return (
      <HomePage
        onPlay={() => {
          sessionStorage.setItem("offliner:welcome-dismissed", "1");
          setShowHomePage(false);
        }}
      />
    );
  }

  return <AppContent />;
}

export default App;
