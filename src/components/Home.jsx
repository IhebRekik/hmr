import { FaFileAlt, FaReceipt, FaSignOutAlt } from "react-icons/fa";

function Home({ onDevis, onFacture, onLogout }) {
  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center px-4 py-8 sm:py-12">
      <div className="max-w-5xl w-full">
        <div className="flex justify-end mb-4 max-w-5xl mx-auto">
          <button
            onClick={onLogout}
            className="flex items-center gap-2 px-4 py-2 text-sm text-gray-600 hover:text-red-600 hover:bg-white rounded-lg border border-transparent hover:border-gray-200 transition min-h-[44px]"
          >
            <FaSignOutAlt />
            Déconnexion
          </button>
        </div>

        <div className="text-center mb-8 sm:mb-12">
          <img
            src="/logo.jpg"
            alt="HMR Froid"
            className="w-20 h-20 sm:w-24 sm:h-24 object-contain mx-auto mb-4"
          />
          <h1 className="text-3xl sm:text-5xl font-bold text-blue-700">
            HMR Facturation
          </h1>
          <p className="text-gray-500 mt-2 sm:mt-3 text-base sm:text-lg">
            Création de Devis et Factures
          </p>
        </div>

        <div className="grid sm:grid-cols-2 gap-4 sm:gap-8">
          <div
            onClick={onDevis}
            className="bg-white rounded-2xl shadow-lg active:scale-[0.98] transition cursor-pointer p-6 sm:p-10 border hover:border-blue-500"
          >
            <div className="flex justify-center">
              <FaFileAlt size={64} className="text-blue-600 sm:hidden" />
              <FaFileAlt size={90} className="text-blue-600 hidden sm:block" />
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-center mt-4 sm:mt-6">
              Nouveau Devis
            </h2>
            <p className="text-center text-gray-500 mt-2 sm:mt-3 text-sm sm:text-base">
              Créer rapidement un devis professionnel.
            </p>
            <button className="mt-6 sm:mt-8 w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl text-base sm:text-lg font-semibold min-h-[48px]">
              Créer un devis
            </button>
          </div>

          <div
            onClick={onFacture}
            className="bg-white rounded-2xl shadow-lg active:scale-[0.98] transition cursor-pointer p-6 sm:p-10 border hover:border-green-500"
          >
            <div className="flex justify-center">
              <FaReceipt size={64} className="text-green-600 sm:hidden" />
              <FaReceipt size={90} className="text-green-600 hidden sm:block" />
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-center mt-4 sm:mt-6">
              Nouvelle Facture
            </h2>
            <p className="text-center text-gray-500 mt-2 sm:mt-3 text-sm sm:text-base">
              Générer une facture avec calcul automatique.
            </p>
            <button className="mt-6 sm:mt-8 w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-xl text-base sm:text-lg font-semibold min-h-[48px]">
              Créer une facture
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;
