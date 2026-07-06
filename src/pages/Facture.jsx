import DocumentEditor from "../components/DocumentEditor";

function Facture({ onBack }) {
  return <DocumentEditor type="facture" onBack={onBack} />;
}

export default Facture;
