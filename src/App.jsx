import { useState } from "react";
import Home from "./components/Home";
import Devis from "./pages/Devis";
import Facture from "./pages/Facture";

function App() {
  const [page, setPage] = useState("home");

  const renderPage = () => {
    switch (page) {
      case "devis":
        return <Devis onBack={() => setPage("home")} />;

      case "facture":
        return <Facture onBack={() => setPage("home")} />;

      default:
        return (
          <Home
            onDevis={() => setPage("devis")}
            onFacture={() => setPage("facture")}
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