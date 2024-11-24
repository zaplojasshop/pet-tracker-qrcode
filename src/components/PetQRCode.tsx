import { QRCodeSVG } from "qrcode.react";
import { Button } from "@/components/ui/button";
import type { PetInfo } from "./PetForm";

interface PetQRCodeProps {
  petInfo: PetInfo;
  onReset: () => void;
}

export const PetQRCode = ({ petInfo, onReset }: PetQRCodeProps) => {
  const qrData = JSON.stringify(petInfo);
  const downloadQRCode = () => {
    const svg = document.getElementById("qr-code");
    if (svg) {
      const svgData = new XMLSerializer().serializeToString(svg);
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      const img = new Image();
      img.onload = () => {
        canvas.width = img.width;
        canvas.height = img.height;
        ctx?.drawImage(img, 0, 0);
        const pngFile = canvas.toDataURL("image/png");
        const downloadLink = document.createElement("a");
        downloadLink.download = `${petInfo.petName}-qr-code.png`;
        downloadLink.href = pngFile;
        downloadLink.click();
      };
      img.src = "data:image/svg+xml;base64," + btoa(svgData);
    }
  };

  return (
    <div className="space-y-6 text-center">
      <h2 className="text-2xl font-bold">QR Code Gerado!</h2>
      <div className="flex justify-center">
        <QRCodeSVG
          id="qr-code"
          value={qrData}
          size={256}
          level="H"
          includeMargin
          className="border-8 border-white rounded-lg shadow-lg"
        />
      </div>
      <div className="space-y-4">
        <Button onClick={downloadQRCode} className="w-full">
          Baixar QR Code
        </Button>
        <Button onClick={onReset} variant="outline" className="w-full">
          Gerar Novo QR Code
        </Button>
      </div>
    </div>
  );
};