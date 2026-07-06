import DocumentEditor from "../components/DocumentEditor";

function Devis({ onBack, onLogout }) {
  return <DocumentEditor type="devis" onBack={onBack} onLogout={onLogout} />;
}

export default Devis;
