import DocumentEditor from "../components/DocumentEditor";

function Facture({ onBack, onLogout }) {
  return <DocumentEditor type="facture" onBack={onBack} onLogout={onLogout} />;
}

export default Facture;
