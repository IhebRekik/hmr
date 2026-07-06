import { HMR_COMPANY } from "../constants/company";
import { formatAmount, formatDateFR, formatTND } from "../utils/format";

function DocumentPreview({ type, docInfo, client, items, totals }) {
  const title = type === "devis" ? "DEVIS" : "FACTURE";
  const isFacture = type === "facture";

  return (
    <div className="document-preview bg-white text-gray-900 font-sans">
      <div className="doc-header">
        <div className="doc-header__company">
          <img
            src="/logo.jpg"
            alt="HMR Froid"
            className="company-logo shrink-0"
          />

          <div className="doc-header__info">
            <p className="font-bold text-[15px] text-gray-900 mb-0.5">
              {HMR_COMPANY.nom}
            </p>
            <p>{HMR_COMPANY.forme}</p>
            <p>MF : {HMR_COMPANY.matriculeFiscal}</p>
            <p>Adresse : {HMR_COMPANY.adresse}</p>
          </div>
        </div>

        <div className="doc-header__title-block">
          <h1 className="doc-title">{title}</h1>
          <p className="text-[13px] text-gray-600 mt-1">N° {docInfo.numero}</p>
          <p className="text-[13px] text-gray-600">
            Date : {formatDateFR(docInfo.date)}
          </p>
        </div>
      </div>

      <div className="client-block mb-7">
        {client.nom ? (
          <>
            <p className="font-semibold text-[14px]">
              Client : {client.nom}
            </p>
            {isFacture && client.mf && (
              <p className="text-[13px] text-gray-700 mt-0.5">
                MF : {client.mf}
              </p>
            )}
          </>
        ) : (
          <p className="text-[13px] text-gray-400 italic">Client : —</p>
        )}
      </div>

      <div className="doc-table-wrapper">
        <table className="doc-table w-full">
        <thead>
          <tr>
            <th className="text-left w-[46%]">Description</th>
            <th className="text-center w-[8%]">Qté</th>
            <th className="text-right w-[23%]">PU HT</th>
            <th className="text-right w-[23%]">Total HTVA</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item, index) => {
            const lineTotal = item.qte * item.prix;
            const hasContent = item.description || item.prix > 0;

            return (
              <tr key={index}>
                <td className="align-top">
                  {hasContent ? item.description || "—" : "—"}
                </td>
                <td className="text-center align-top">{item.qte}</td>
                <td className="text-right align-top tabular-nums">
                  {item.prix > 0 ? formatAmount(item.prix) : "—"}
                </td>
                <td className="text-right align-top tabular-nums font-medium">
                  {lineTotal > 0 ? formatAmount(lineTotal) : "—"}
                </td>
              </tr>
            );
          })}
        </tbody>
        </table>
      </div>

      <div className="flex justify-end mb-10">
        <div className="totals-box">
          <div className="totals-row">
            <span className="font-semibold">Total HTVA</span>
            <span className="tabular-nums">{formatTND(totals.totalHT)}</span>
          </div>

          {totals.remise > 0 && (
            <>
              <div className="totals-row">
                <span>Remise ({totals.remise}%)</span>
                <span className="tabular-nums text-red-600">
                  -{formatTND(totals.montantRemise)}
                </span>
              </div>
              <div className="totals-row">
                <span>Total HT après remise</span>
                <span className="tabular-nums">
                  {formatTND(totals.totalApresRemise)}
                </span>
              </div>
            </>
          )}

          <div className="totals-row">
            <span className="font-semibold">Total TVA ({totals.tauxTVA}%)</span>
            <span className="tabular-nums">{formatTND(totals.montantTVA)}</span>
          </div>

          <div className="totals-row">
            <span className="font-semibold">Timbre Fiscale</span>
            <span className="tabular-nums">{formatTND(totals.timbre)}</span>
          </div>

          <div className="totals-row totals-row--final">
            <span>Total TTC</span>
            <span className="tabular-nums">{formatTND(totals.totalTTC)}</span>
          </div>
        </div>
      </div>

      <div className="doc-footer">
        <p className="doc-footer__contact">
          Tel : {HMR_COMPANY.telephone} &nbsp;|&nbsp; Fax: {HMR_COMPANY.fax}{" "}
          &nbsp;|&nbsp; E-mail : {HMR_COMPANY.email}
        </p>
        <p className="doc-footer__legal">{HMR_COMPANY.footer}</p>
      </div>
    </div>
  );
}

export default DocumentPreview;
