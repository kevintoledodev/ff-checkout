import React, { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_ANON = import.meta.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON);

interface Props {
  localOrderId: string;
  onPaid?: (order: any) => void;
}

export default function WaitingForPayment({ localOrderId, onPaid }: Props) {
  const [status, setStatus] = useState<string>('pending');

  useEffect(() => {
    let mounted = true;
    const interval = setInterval(async () => {
      try {
        const { data, error } = await supabase
          .from('orders')
          .select('*')
          .eq('id', localOrderId)
          .single();

        if (error) {
          console.error('Erro consultando order:', error);
          return;
        }

        if (!mounted) return;
        setStatus(data.status);

        if (data.status === 'paid') {
          clearInterval(interval);
          if (onPaid) onPaid(data);
        }
      } catch (err) {
        console.error(err);
      }
    }, 3000);

    return () => {
      mounted = false;
      clearInterval(interval);
    };
  }, [localOrderId, onPaid]);

  return (
    <div className="waiting-modal">
      <div className="waiting-content">
        <h3>Aguardando pagamento</h3>
        <p>Status atual: <strong>{status}</strong></p>
        <div className="spinner" />
        <p>Escaneie o QR Code com seu app bancário. Atualizando automaticamente...</p>
      </div>
      <style jsx>{`
        .waiting-modal { position: fixed; inset: 0; display:flex; align-items:center; justify-content:center; background: rgba(0,0,0,0.35); z-index: 9999;}
        .waiting-content { background:#fff; padding:24px; border-radius:10px; width:360px; text-align:center;}
        .spinner { width:36px; height:36px; margin: 12px auto; border-radius:50%; border:4px solid #eee; border-top-color:#f97316; animation:spin 1s linear infinite; }
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}
