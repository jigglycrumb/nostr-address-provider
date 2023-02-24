import QRCode from "react-qr-code";

export const AstroQRCode = ({ lnUrl }: { lnUrl: string }) => {
  return (
    <QRCode
      className="lnqr text-gradient"
      level="M"
      size={300}
      fgColor="var(--text)"
      value={`lightning:${lnUrl}`}
    />
  );
};
