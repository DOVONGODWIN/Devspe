import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { CheckCircle2 } from "lucide-react";
import { useCart } from "../../context/CartContext";

export default function CheckoutSuccess() {
  const nav = useNavigate();
  const { clear } = useCart();

  useEffect(() => {
    clear();
    
  }, []);

  return (
    <div className="min-h-screen bg-nexbg flex items-center justify-center px-6">
      <div className="bg-white rounded-[28px] shadow-xl shadow-ink/5 p-8 max-w-md w-full text-center">
        <span className="inline-grid place-items-center w-20 h-20 rounded-full bg-green-50 mb-4">
          <CheckCircle2 size={44} className="text-green-500" />
        </span>
        <h1 className="text-2xl font-extrabold text-ink">Paiement réussi</h1>
        <p className="text-sub mt-2">
          Merci pour votre achat ! Votre commande a bien été enregistrée et le vendeur a été notifié.
        </p>
        <div className="flex flex-col gap-2 mt-6">
          <button onClick={() => nav("/orders")}
            className="h-12 rounded-xl2 bg-nex-grad text-white font-bold">
            Voir mes commandes
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