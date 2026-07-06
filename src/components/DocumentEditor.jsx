import { useRef, useState } from "react";
import DocumentPreview from "./DocumentPreview";
import { DEFAULT_TIMBRE, DEFAULT_TVA } from "../constants/company";
import { formatTND, generateDocNumber } from "../utils/format";

function DocumentEditor({ type, onBack, onLogout }) {
  const previewRef = useRef(null);
  const [exporting, setExporting] = useState(false);
  const [mobileTab, setMobileTab] = useState("form");

  const prefix = type === "devis" ? "DV" : "FC";
  const label = type === "devis" ? "Devis" : "Facture";

  const [docInfo, setDocInfo] = useState({
    numero: generateDocNumber(prefix),
    date: new Date().toISOString().substring(0, 10),
  });

  const [client, setClient] = useState({
    nom: "",
    mf: "",
  });

  const [items, setItems] = useState([
    { description: "", qte: 1, prix: 0 },
  ]);

  const [remise, setRemise] = useState(0);
  const [tauxTVA, setTauxTVA] = useState(DEFAULT_TVA);
  const [timbre, setTimbre] = useState(DEFAULT_TIMBRE);

  const handleClientChange = (e) => {
    setClient({ ...client, [e.target.name]: e.target.value });
  };

  const handleItemChange = (index, field, value) => {
    const data = [...items];
    data[index][field] =
      field === "description" ? value : Number(value);
    setItems(data);
  };

  const addItem = () => {
    setItems([...items, { description: "", qte: 1, prix: 0 }]);
  };

  const removeItem = (index) => {
    if (items.length === 1) return;
    setItems(items.filter((_, i) => i !== index));
  };

  const totalHT = items.reduce(
    (sum, item) => sum + item.qte * item.prix,
    0
  );
  const montantRemise = totalHT * (remise / 100);
  const totalApresRemise = totalHT - montantRemise;
  const montantTVA = totalApresRemise * (tauxTVA / 100);
  const totalTTC = totalApresRemise + montantTVA + Number(timbre);

  const totals = {
    totalHT,
    remise,
    montantRemise,
    totalApresRemise,
    tauxTVA,
    montantTVA,
    timbre,
    totalTTC,
  };

  const previewProps = { type, docInfo, client, items, totals };

  const handleExportPdf = async () => {
    if (!previewRef.current || exporting) return;

    if (!client.nom.trim()) {
      alert("Veuillez saisir le nom du client.");
      return;
    }

    setExporting(true);
    try {
      const { exportToPdf } = await import("../utils/exportPdf");
      await exportToPdf(
        previewRef.current,
        `${label}-${docInfo.numero}.pdf`
      );
    } catch (err) {
      if (err?.name === "AbortError") return;
      console.error("Erreur export PDF:", err);
      alert("Erreur lors de l'export PDF. Veuillez réessayer.");
    } finally {
      setExporting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-200 pb-24 xl:pb-0">
      {/* En-tête */}
      <div className="sticky top-0 z-20 bg-white border-b shadow-sm px-4 sm:px-6 py-3 sm:py-4 safe-top">
        <div className="max-w-[1400px] mx-auto flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
          <h1 className="text-xl sm:text-2xl font-bold text-blue-700">
            Nouveau {label}
          </h1>
          <div className="hidden sm:flex gap-3 items-center">
            {onLogout && (
              <button
                onClick={onLogout}
                className="px-4 py-2.5 rounded-lg text-gray-500 hover:text-red-600 hover:bg-red-50 font-medium min-h-[44px] text-sm"
              >
                Déconnexion
              </button>
            )}
            <button
              onClick={onBack}
              className="px-5 py-2.5 rounded-lg border border-gray-300 hover:bg-gray-50 font-medium min-h-[44px]"
            >
              Retour
            </button>
            <button
              onClick={handleExportPdf}
              disabled={exporting}
              className="px-5 py-2.5 rounded-lg bg-blue-700 hover:bg-blue-800 disabled:opacity-60 text-white font-medium flex items-center gap-2 min-h-[44px]"
            >
              {exporting ? (
                <>
                  <span className="inline-block w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Export…
                </>
              ) : (
                <>Exporter PDF</>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Onglets mobile */}
      <div className="xl:hidden sticky top-[60px] z-10 bg-white border-b px-4 py-2">
        <div className="flex gap-2 max-w-[1400px] mx-auto">
          <button
            onClick={() => setMobileTab("form")}
            className={`flex-1 py-2.5 rounded-lg font-medium text-sm min-h-[44px] ${
              mobileTab === "form"
                ? "bg-blue-700 text-white"
                : "bg-gray-100 text-gray-600"
            }`}
          >
            Formulaire
          </button>
          <button
            onClick={() => setMobileTab("preview")}
            className={`flex-1 py-2.5 rounded-lg font-medium text-sm min-h-[44px] ${
              mobileTab === "preview"
                ? "bg-blue-700 text-white"
                : "bg-gray-100 text-gray-600"
            }`}
          >
            Aperçu
          </button>
        </div>
      </div>

      <div className="max-w-[1400px] mx-auto p-4 sm:p-6 grid xl:grid-cols-[1fr_820px] gap-6 xl:gap-8 items-start">
        {/* Formulaire */}
        <div
          className={`space-y-4 sm:space-y-6 ${
            mobileTab === "form" ? "block" : "hidden xl:block"
          }`}
        >
          <section className="bg-white rounded-xl shadow p-4 sm:p-6">
            <h2 className="text-base sm:text-lg font-semibold text-gray-800 mb-4">
              Informations {label}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">
                  N° {label}
                </label>
                <input
                  type="text"
                  value={docInfo.numero}
                  readOnly
                  className="w-full border rounded-lg p-3 bg-gray-50 text-base"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">
                  Date
                </label>
                <input
                  type="date"
                  value={docInfo.date}
                  onChange={(e) =>
                    setDocInfo({ ...docInfo, date: e.target.value })
                  }
                  className="w-full border rounded-lg p-3 text-base"
                />
              </div>
            </div>
          </section>

          <section className="bg-white rounded-xl shadow p-4 sm:p-6">
            <h2 className="text-base sm:text-lg font-semibold text-gray-800 mb-4">
              Client
            </h2>
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">
                  Nom du client <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="nom"
                  placeholder="Ex: Fany Ariana"
                  value={client.nom}
                  onChange={handleClientChange}
                  className="w-full border rounded-lg p-3 text-base"
                />
              </div>

              {type === "facture" && (
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">
                    MF du client
                  </label>
                  <input
                    type="text"
                    name="mf"
                    placeholder="Ex: 1234567X/A/M/000"
                    value={client.mf}
                    onChange={handleClientChange}
                    className="w-full border rounded-lg p-3 text-base"
                  />
                </div>
              )}

              {type === "devis" && (
                <p className="text-xs text-gray-500">
                  Sur un devis, seul le nom du client est affiché.
                </p>
              )}
            </div>
          </section>

          <section className="bg-white rounded-xl shadow p-4 sm:p-6">
            <h2 className="text-base sm:text-lg font-semibold text-gray-800 mb-4">
              Articles / Prestations
            </h2>

            <div className="space-y-4">
              {items.map((item, index) => (
                <div
                  key={index}
                  className="border rounded-lg p-4 bg-gray-50 relative"
                >
                  {items.length > 1 && (
                    <button
                      onClick={() => removeItem(index)}
                      className="absolute top-2 right-2 w-10 h-10 flex items-center justify-center text-red-500 hover:text-red-700 text-lg"
                      title="Supprimer"
                    >
                      ✕
                    </button>
                  )}

                  <textarea
                    placeholder="Description de la prestation"
                    value={item.description}
                    onChange={(e) =>
                      handleItemChange(index, "description", e.target.value)
                    }
                    rows={2}
                    className="w-full border rounded-lg p-3 mb-3 resize-none text-base"
                  />

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="block text-xs text-gray-500 mb-1">
                        Qté
                      </label>
                      <input
                        type="number"
                        min="1"
                        inputMode="numeric"
                        value={item.qte}
                        onChange={(e) =>
                          handleItemChange(index, "qte", e.target.value)
                        }
                        className="w-full border rounded-lg p-3 text-center text-base"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-500 mb-1">
                        PU HT (TND)
                      </label>
                      <input
                        type="number"
                        min="0"
                        step="0.001"
                        inputMode="decimal"
                        value={item.prix}
                        onChange={(e) =>
                          handleItemChange(index, "prix", e.target.value)
                        }
                        className="w-full border rounded-lg p-3 text-right text-base"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-500 mb-1">
                        Total HTVA
                      </label>
                      <div className="border rounded-lg p-3 text-right bg-white font-semibold text-sm min-h-[48px] flex items-center justify-end">
                        {formatTND(item.qte * item.prix)}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <button
              onClick={addItem}
              className="mt-4 w-full py-3 border-2 border-dashed border-blue-300 text-blue-600 rounded-lg hover:bg-blue-50 font-medium min-h-[48px]"
            >
              + Ajouter une ligne
            </button>
          </section>

          <section className="bg-white rounded-xl shadow p-4 sm:p-6">
            <h2 className="text-base sm:text-lg font-semibold text-gray-800 mb-4">
              Calculs
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm text-gray-600 mb-1">
                  Remise (%)
                </label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  inputMode="numeric"
                  value={remise}
                  onChange={(e) => setRemise(Number(e.target.value))}
                  className="w-full border rounded-lg p-3 text-center text-base"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">
                  TVA (%)
                </label>
                <input
                  type="number"
                  min="0"
                  inputMode="numeric"
                  value={tauxTVA}
                  onChange={(e) => setTauxTVA(Number(e.target.value))}
                  className="w-full border rounded-lg p-3 text-center text-base"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">
                  Timbre (TND)
                </label>
                <input
                  type="number"
                  min="0"
                  step="0.001"
                  inputMode="decimal"
                  value={timbre}
                  onChange={(e) => setTimbre(Number(e.target.value))}
                  className="w-full border rounded-lg p-3 text-center text-base"
                />
              </div>
            </div>

            <div className="mt-4 pt-4 border-t flex justify-between items-center">
              <span className="text-base sm:text-lg font-bold text-blue-700">
                Total TTC
              </span>
              <span className="text-lg sm:text-xl font-bold text-blue-700">
                {formatTND(totalTTC)}
              </span>
            </div>
          </section>
        </div>

        {/* Aperçu */}
        <div
          className={`xl:sticky xl:top-24 ${
            mobileTab === "preview" ? "block" : "hidden xl:block"
          }`}
        >
          <div className="flex items-center justify-between mb-3">
            <p className="text-sm text-gray-600 font-medium uppercase tracking-wide">
              Aperçu du document
            </p>
            <span className="text-xs text-gray-400 bg-white px-2 py-1 rounded border">
              Format A4
            </span>
          </div>

          <div className="preview-wrapper preview-wrapper--mobile">
            <div className="a4-page a4-page--scaled">
              <DocumentPreview {...previewProps} />
            </div>
          </div>
        </div>
      </div>

      {/* Source PDF pleine taille (hors écran) */}
      <div className="pdf-export-source" aria-hidden="true">
        <div ref={previewRef} className="a4-page">
          <DocumentPreview {...previewProps} />
        </div>
      </div>

      {/* Barre fixe mobile */}
      <div className="xl:hidden fixed bottom-0 left-0 right-0 z-30 bg-white border-t shadow-lg px-4 py-3 safe-bottom">
        <div className="flex gap-3 max-w-[1400px] mx-auto">
          <button
            onClick={onBack}
            className="px-4 py-3 rounded-lg border border-gray-300 font-medium min-h-[48px] shrink-0"
          >
            Retour
          </button>
          <button
            onClick={handleExportPdf}
            disabled={exporting}
            className="flex-1 py-3 rounded-lg bg-blue-700 disabled:opacity-60 text-white font-semibold flex items-center justify-center gap-2 min-h-[48px]"
          >
            {exporting ? (
              <>
                <span className="inline-block w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Export…
              </>
            ) : (
              <>Exporter PDF</>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

export default DocumentEditor;
