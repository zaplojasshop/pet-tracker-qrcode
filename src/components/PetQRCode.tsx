import { QRCodeSVG } from "qrcode.react";
import { Button } from "@/components/ui/button";
import { saveAs } from 'file-saver';
import jsPDF from 'jspdf';
import Drawing from 'dxf-writer';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { PetInfo } from "./PetForm";

interface PetQRCodeProps {
  petInfo: PetInfo & { qr_id?: string };
  onReset: () => void;
}

export const PetQRCode = ({ petInfo, onReset }: PetQRCodeProps) => {
  const baseUrl = window.location.origin;
  const qrUrl = `${baseUrl}/pet-info?qr_id=${petInfo.qr_id}`;

  const downloadQRCode = async (format: string) => {
    const svg = document.getElementById("qr-code");
    if (!svg) return;

    const svgData = new XMLSerializer().serializeToString(svg);
    const canvas = document.createElement("canvas");
    canvas.width = 1200;
    canvas.height = 1200;
    const ctx = canvas.getContext("2d");
    const img = new Image();

    img.onload = async () => {
      if (!ctx) return;
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

      switch (format) {
        case "png":
          const pngFile = canvas.toDataURL("image/png");
          saveAs(pngFile, `${petInfo.petName}-qr-code.png`);
          break;

        case "svg":
          const blob = new Blob([svgData], { type: "image/svg+xml;charset=utf-8" });
          saveAs(blob, `${petInfo.petName}-qr-code.svg`);
          break;

        case "pdf":
          const pdf = new jsPDF({
            orientation: "portrait",
            unit: "mm",
            format: "a4"
          });
          const pdfImg = canvas.toDataURL("image/png");
          pdf.addImage(pdfImg, "PNG", 10, 10, 190, 190);
          pdf.save(`${petInfo.petName}-qr-code.pdf`);
          break;

        case "dxf":
          const d = new Drawing();
          d.addLayer('QRCode', Drawing.ACI.WHITE, 'CONTINUOUS');
          d.setActiveLayer('QRCode');
          
          const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
          const pixelSize = 0.1;
          
          for (let y = 0; y < canvas.height; y += 10) {
            for (let x = 0; x < canvas.width; x += 10) {
              const i = (y * canvas.width + x) * 4;
              if (imageData.data[i] < 128) {
                d.drawRect(x * pixelSize, y * pixelSize, 10 * pixelSize, 10 * pixelSize);
              }
            }
          }

          const dxfString = d.toDxfString();
          const dxfBlob = new Blob([dxfString], { type: 'application/dxf' });
          saveAs(dxfBlob, `${petInfo.petName}-qr-code.dxf`);
          break;
      }
    };

    img.src = "data:image/svg+xml;base64," + btoa(svgData);
  };

  return (
    <div className="space-y-6 text-center">
      <h2 className="text-2xl font-bold">QR Code Gerado!</h2>
      <div className="flex justify-center">
        <QRCodeSVG
          id="qr-code"
          value={qrUrl}
          size={256}
          level="H"
          includeMargin
          className="border-8 border-white rounded-lg shadow-lg"
        />
      </div>
      <div className="space-y-4">
        <div className="flex flex-col space-y-2">
          <label className="text-sm font-medium">Formato do arquivo</label>
          <Select onValueChange={downloadQRCode}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Selecione o formato para download" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="png">PNG (Alta Resolução)</SelectItem>
              <SelectItem value="svg">SVG (Vetorial)</SelectItem>
              <SelectItem value="pdf">PDF (Vetorial)</SelectItem>
              <SelectItem value="dxf">DXF (Para máquina laser)</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <Button onClick={onReset} variant="outline" className="w-full">
          Gerar Novo QR Code
        </Button>
      </div>
    </div>
  );
};