import React, { useEffect, useState } from "react";
import confetti from "canvas-confetti";

interface UpsellItem {
  id: string;
  title: string;
  price: number;
  image: string;
}

interface UpsellModalProps {
  visible: boolean;
  onClose: () => void;
  onAdd: (item: UpsellItem | null) => void;
  onContinue: () => void;
}

const upsellProducts: UpsellItem[] = [
  { id: "upsell1", title: "Assinatura Semanal", price: 9.99, image: "https://cdn-gop.garenanow.com/gop/app/0000/100/067/rebate/0000/000/002/logo.png" },
  { id: "upsell2", title: "Assinatura Mensal", price: 29.99, image: "https://cdn-gop.garenanow.com/gop/app/0000/100/067/rebate/0000/081/041/logo.png" },
  { id: "upsell3", title: "Passe Booyah Premium Plus", price: 14.90, image: "https://cdn-gop.garenanow.com/gop/app/0000/100/067/item/0801/039/054/pt/logo.png" },
  { id: "upsell4", title: "Trilha da Evolução – 3 dias", price: 4.90, image: "https://cdn-gop.garenanow.com/gop/app/0000/100/067/rebate/0000/004/608/logo.png" },
  { id: "upsell5", title: "Trilha da Evolução – 7 dias", price: 9.90, image: "https://cdn-gop.garenanow.com/gop/app/0000/100/067/rebate/0000/004/609/logo.png" },
  { id: "upsell6", title: "Trilha da Evolução – 30 dias", price: 19.90, image: "https://cdn-gop.garenanow.com/gop/app/0000/100/067/rebate/0000/004/610/logo.png" },
  { id: "upsell7", title: "Semanal Econômica", price: 7.99, image: "https://cdn-gop.garenanow.com/gop/app/0000/100/067/rebate/0000/004/007/logo.png" },
  { id: "upsell8", title: "Passe Booyah", price: 14.90, image: "https://cdn-gop.garenanow.com/gop/app/0000/100/067/item/0803/000/000/logo.png" }
];

export default function UpsellModal({ visible, onClose, onAdd, onContinue }: UpsellModalProps) {
  const [timer, setTimer] = useState(15);
  const [selected, setSelected] = useState<UpsellItem | null>(null);

  const basePrice = 19.90;

  const [pendingItem, setPendingItem] = useState<UpsellItem | null>(null);
  const [showSwapModal, setShowSwapModal] = useState(false);

  useEffect(() => {
    if (!visible) return;

    setTimer(15);
    setSelected(null);

    const interval = setInterval(() => {
      setTimer(prev => {
        if (prev <= 1) {
          clearInterval(interval);
          onContinue();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [visible]);

  const fireConfetti = () => {
    confetti({
      particleCount: 150,
      spread: 90,
      origin: { y: 0.6 },
    });
  };

  const spawnSparks = (cardId: string) => {
    const card = document.getElementById(cardId);
    if (!card) return;

    for (let i = 0; i < 12; i++) {
      const spark = document.createElement("div");
      spark.className = "spark";
      spark.style.left = `${50 + (Math.random() * 40 - 20)}%`;
      spark.style.top = `40%`;
      card.appendChild(spark);
      setTimeout(() => spark.remove(), 900);
    }
  };

  const handleAdd = (item: UpsellItem) => {
    if (!selected) {
      spawnSparks(item.id);
      fireConfetti();
      setSelected(item);
      onAdd(item);
      return;
    }

    if (selected.id === item.id) return;

    setPendingItem(item);
    setShowSwapModal(true);
  };

  const confirmSwap = () => {
    if (!pendingItem) return;

    spawnSparks(pendingItem.id);
    fireConfetti();

    setSelected(pendingItem);
    onAdd(pendingItem);

    setShowSwapModal(false);
  };

  const handleRemove = () => {
    setSelected(null);
  };

  const totalPrice = (basePrice + (selected?.price ?? 0)).toFixed(2);

  if (!visible) return null;

  return (
    <>
      {showSwapModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-[999]">
          <div className="bg-white p-6 rounded-lg shadow-xl w-[90%] max-w-[360px] text-center animate-popup">

            <h3 className="text-lg font-bold mb-2">Substituir item?</h3>

            <p className="text-gray-700 mb-4 text-sm leading-relaxed">
              Você já adicionou um item.<br />
              Remova o atual para escolher outro.
            </p>

            <div className="flex justify-center gap-3">
              <button
                onClick={() => setShowSwapModal(false)}
                className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400 text-sm"
              >
                Cancelar
              </button>

              <button
                onClick={confirmSwap}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 text-sm"
              >
                Trocar item
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL PRINCIPAL */}
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
        <div className="bg-white rounded-xl shadow-2xl max-w-3xl w-full p-6 animate-fade-in relative upsell-modal">

          {/* TIMER */}
          <div
            className={`absolute -top-6 right-4 text-white px-4 py-1.5 rounded-lg shadow-lg text-sm font-bold bg-red-700 upsell-timer
              ${timer <= 3 ? "animate-[shake_0.15s_infinite]" : ""}`}
          >
            Oferta expira em {timer}s ⏳
          </div>

          <h2 className="text-2xl font-bold text-center text-yellow-600">
            Oferta Exclusiva Antes de Finalizar 🎁
          </h2>

          <p className="text-center text-gray-700 mt-2 mb-6">
            Aproveite uma oferta imperdível disponível só agora!
          </p>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 max-h-96 overflow-y-auto pr-2 upsell-grid">
            {upsellProducts.map(item => {
              const isSelected = selected?.id === item.id;

              return (
                <div
                  key={item.id}
                  id={item.id}
                  className={`border rounded-lg p-3 bg-white transition relative upsell-card
                    ${isSelected ? "gold-selected shadow-xl" : "hover:shadow-lg cursor-pointer"}`}
                >
                  <img src={item.image} className="w-full h-28 object-contain" />

                  <p className="text-center font-bold mt-2 upsell-title">
                    {item.title}
                  </p>

                  <p className="text-center text-green-600 font-semibold upsell-price">
                    R$ {item.price.toFixed(2)}
                  </p>

                  {!isSelected ? (
                    <button
                      onClick={() => handleAdd(item)}
                      className="mt-2 w-full bg-yellow-500 text-white font-bold py-1 rounded hover:bg-yellow-600 upsell-btn"
                    >
                      Adicionar ao pedido
                    </button>
                  ) : (
                    <button
                      onClick={handleRemove}
                      className="mt-2 w-full bg-red-600 text-white font-bold py-1 rounded hover:bg-red-700 upsell-btn"
                    >
                      Remover
                    </button>
                  )}
                </div>
              );
            })}
          </div>

          <div className="mt-6 text-center">
            <p className="text-lg font-bold text-gray-800">
              Total: R$ {totalPrice}
            </p>

            {selected && (
              <p className="text-sm text-gray-600">
                (R$ {basePrice.toFixed(2)} + R$ {selected.price.toFixed(2)})
              </p>
            )}
          </div>

          <div className="flex justify-between mt-6 upsell-footer">
            <button
              onClick={() => {
                onAdd(null);
                onContinue();
              }}
              className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400 font-semibold"
            >
              Não, obrigado
            </button>

            <button
              disabled={!selected}
              onClick={onContinue}
              className={`
                px-6 py-2 rounded font-bold
                ${selected
                  ? "bg-red-600 text-white hover:bg-red-700"
                  : "bg-gray-300 text-gray-600 cursor-not-allowed"}
              `}
            >
              Continuar para pagamento →
            </button>
          </div>

        </div>
      </div>
    </>
  );
}
