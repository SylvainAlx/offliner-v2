import { UserProvider } from "./providers/UserProvider";
import { OnlineStatusProvider } from "./providers/OnlineStatusProvider";
import { useOnlineStatusContext } from "./hooks/useOnlineStatusContext";
import { useDeviceType } from "./hooks/useDeviceType";
import DesktopGate from "./components/DesktopGate";
import Header from "./components/layouts/Header";
import Footer from "./components/layouts/Footer";
import Help from "./components/Help";
import Tracking from "./components/Tracking";
import Status from "./components/Status";
import "./styles/App.css";

function AppContent() {
  const { isOnline } = useOnlineStatusContext();

  return (
    <div className={`app-container ${isOnline ? "online" : "offline"}`}>
      <Header />
      <main className="app-main">
        <Status />
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

  return (
    <UserProvider>
      <OnlineStatusProvider>
        <AppContent />
      </OnlineStatusProvider>
    </UserProvider>
  );
}

export default App;
