import { useNavigate } from "react-router-dom";
import { XCircle } from "lucide-react";

export default function CheckoutCancel() {
  const nav = useNavigate();
  return (
    <div className="min-h-screen bg-nexbg flex items-center justify-center px-6">
      <div className="bg-white rounded-[28px] shadow-xl shadow-ink/5 p-8 max-w-md w-full text-center">
        <span className="inline-grid place-items-center w-20 h-20 rounded-full bg-orange-50 mb-4">
          <XCircle size={44} className="text-orange-400" />
        </span>
        <h1 className="text-2xl font-extrabold text-ink">Paiement annulé</h1>
        <p className="text-sub mt-2">
          Aucun montant n'a été débité. Votre panier est conservé, vous pouvez réessayer quand vous voulez.
        </p>
        <div className="flex flex-col gap-2 mt-6">
          <button onClick={() => nav("/cart")}
            className="h-12 rounded-xl2 bg-nex-grad text-white font-bold">
            Retour au panier
          </button>
          <button onClick={() => nav("/")}
            className="h-12 rounded-xl2 bg-white border border-silver text-ink font-bold">
            Retour à l'accueil
          </button>
        </div>
      </div>
    </div>
  );
}