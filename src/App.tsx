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
import Sidebar, { type AppSection } from "./components/layouts/Sidebar";
import "./styles/App.css";

function AppContent() {
  const { isOnline } = useOnlineStatus();
  const [activeSection, setActiveSection] = useState<AppSection>("account");
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => useOnlineStatus.getState().initialize(), []);

  useEffect(() => {
    document.body.style.overflow = isMenuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isMenuOpen]);

  const renderSection = () => {
    switch (activeSection) {
      case "village":
        return <Village />;
      case "help":
        return <Help />;
      case "account":
      default:
        return (
          <>
            <Profile />
            <Status />
            <Tracking />
          </>
        );
    }
  };

  return (
    <div className={`app-container ${isOnline ? "online" : "offline"}`}>
      <Header
        isMenuOpen={isMenuOpen}
        onMenuOpen={() => setIsMenuOpen(true)}
      />
      <div className="app-layout">
        <Sidebar
          activeSection={activeSection}
          isOpen={isMenuOpen}
          onClose={() => setIsMenuOpen(false)}
          onSelect={setActiveSection}
        />
        <main className="app-main">{renderSection()}</main>
      </div>
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
