import { useEffect } from "react";
import { useOnlineStatus } from "./stores/onlineStatusStore";
import { useDeviceType } from "./hooks/useDeviceType";
import DesktopGate from "./components/DesktopGate";
import Header from "./components/layouts/Header";
import Footer from "./components/layouts/Footer";
import Help from "./components/Help";
import Profile from "./components/Profile";
import Tracking from "./components/Tracking";
import Status from "./components/Status";
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
        <Tracking />
        <Help />
      </main>
      <Footer />
    </div>
  );
}

function App() {
  const device = useDeviceType();

  if (device.isDesktop && !sessionStorage.getItem("offliner:bypass-desktop")) {
    return (
      <DesktopGate
        onContinue={() => {
          sessionStorage.setItem("offliner:bypass-desktop", "1");
          window.dispatchEvent(new Event("resize"));
        }}
      />
    );
  }

  return <AppContent />;
}

export default App;
