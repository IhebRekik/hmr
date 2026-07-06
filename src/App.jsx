import { useState } from "react";
import Home from "./components/Home";
import Login from "./components/Login";
import Devis from "./pages/Devis";
import Facture from "./pages/Facture";
import { isAuthenticated, logout } from "./utils/auth";

function App() {
  const [authenticated, setAuthenticated] = useState(isAuthenticated);
  const [page, setPage] = useState("home");

  const handleLogout = () => {
    logout();
    setAuthenticated(false);
    setPage("home");
  };

  if (!authenticated) {
    return <Login onSuccess={() => setAuthenticated(true)} />;
  }

  const renderPage = () => {
    switch (page) {
      case "devis":
        return <Devis onBack={() => setPage("home")} onLogout={handleLogout} />;

      case "facture":
        return <Facture onBack={() => setPage("home")} onLogout={handleLogout} />;

      default:
        return (
          <Home
            onDevis={() => setPage("devis")}
            onFacture={() => setPage("facture")}
            onLogout={handleLogout}
          />
        );
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {renderPage()}
    </div>
  );
}

export default App;
