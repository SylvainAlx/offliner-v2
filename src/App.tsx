import { useOnlineStatus } from "./hooks/useOnlineStatus";
import { useDeviceType } from "./hooks/useDeviceType";
import DesktopGate from "./components/DesktopGate";
import Header from "./components/layouts/Header";
import Footer from "./components/layouts/Footer";
import Help from "./components/Help";
import Tracking from "./components/Tracking";
import Status from "./components/Status";
import "./styles/App.css";

function App() {
  const device = useDeviceType();
  const {
    isOnline,
    lastChecked,
    offlinePeriods,
    totalOfflineMs,
    resetTracking,
  } = useOnlineStatus();

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

  return (
    <div className={`app-container ${isOnline ? "online" : "offline"}`}>
      <Header />
      <main className="app-main">
        <Status
          isOnline={isOnline}
          lastChecked={lastChecked}
          totalOfflineMs={totalOfflineMs}
        />
        <Tracking
          offlinePeriods={offlinePeriods}
          lastChecked={lastChecked}
          resetTracking={resetTracking}
        />
        <Help />
      </main>
      <Footer />
    </div>
  );
}

export default App;
