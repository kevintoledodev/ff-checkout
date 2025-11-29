import React from "react";
import "../../styles/pixpayment.css";

export default function PixPayment({
  pixCode,
  qrCodeBase64,
  amount,
  merchantName,
  merchantCnpj,
  onBack
}) {
  return (
    <div className="pix-container">

      <h2 className="pix-title">Pague com Pix</h2>

      <img
        src={`data:image/png;base64,${qrCodeBase64}`}
        alt="QR Code"
        className="pix-qrcode"
      />

      <div className="pix-merchant">
        <strong>{merchantName}</strong><br />
        CNPJ: {merchantCnpj}
      </div>

      <textarea
        readOnly
        className="pix-code-box"
        value='00020101021226830014br.gov.bcb.pix2561api.pagseguro.com/pix/v2/E3E3F421-E521-4E81-9B24-A3EB6DED60E05204601253039865802BR5922PAGSEGURO TECNOLOGIA L6009SAO PAULO62070503***63042C54'
      />

      <button
      style={{fontWeight: 'bold'}}
        className="pix-copy-btn"
        onClick={() => {
          navigator.clipboard.writeText(pixCode);
        }}
      >
        Copiar Código
      </button>

      <div className="pix-instructions">
        <p>Para realizar o pagamento siga os passos abaixo:</p>



        <ol>
          <li> 1) Abra o app ou o site da sua instituição financeira e selecione o Pix</li>
          <li> 2) Utilize as informações acima para realizar o pagamento</li>
          <li> 3) Revise as informações e pronto!</li>
        </ol>

        <p className="pix-status">
          Seu pedido está sendo processado pelo nosso parceiro PagSeugro.<br/>
          Você receberá seus diamantes após recebermos a confirmação do pagamento. <br />
          Isso ocorre geralmente em alguns minutos após a realização do pagamento na sua instituição financeira.<br />
          Em caso de dúvidas entre em contato com o PagSeguro através do link
        </p>

        <a href="https://customer.international.pagseguro.com/pt-br">https://customer.international.pagseguro.com/pt-br</a>
      </div>

      <button className="pix-back-btn" onClick={onBack}>
        Voltar
      </button>

    </div>
  );
}
