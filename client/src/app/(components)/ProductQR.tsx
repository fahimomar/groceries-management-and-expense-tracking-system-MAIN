"use client";

import { QRCodeSVG } from "qrcode.react";

interface ProductQRProps {
  product: {
    id: string;
    name: string;
    price: number;
    stockQuantity: number;
    expiryDate: string;
  };
}

export default function ProductQR({ product }: ProductQRProps) {
  // 👇 The QR will open this URL when scanned
  const qrData = `https://yourdomain.com/product/${product.id}`;

  const handleDownload = () => {
    const svg = document.querySelector(`#qr-${product.id} svg`);
    if (!svg) return;

    const serializer = new XMLSerializer();
    const svgString = serializer.serializeToString(svg);
    const blob = new Blob([svgString], { type: "image/svg+xml" });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = `${product.name}-qr.svg`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div
      id={`qr-${product.id}`}
      className="flex flex-col items-center space-y-2 p-4 border rounded-xl bg-white shadow-sm"
    >
      <QRCodeSVG
        value={qrData}
        size={160}
        bgColor="#ffffff"
        fgColor="#1e293b"
        level="M"
        includeMargin={true}
      />

      <p className="text-xs text-slate-600 text-center">
        {product.name} • ${product.price}
      </p>

      <button
        onClick={handleDownload}
        className="text-xs text-blue-600 hover:underline"
      >
        Download QR
      </button>
    </div>
  );
}
