"use client";

import { useState, FormEvent } from "react";
import dynamic from "next/dynamic";
import { useCreateProductsMutation } from "@/state/api";
import { CheckCircle, AlertCircle, QrCode } from "lucide-react";

// ✅ Fixed dynamic import — using <any> removes mismatched type error
const QrReader = dynamic<any>(
  () =>
    import("react-qr-reader").then((mod: any) => {
      return mod.QrReader || mod.default;
    }),
  { ssr: false }
);

export default function AddProductPage() {
  const [createProduct, { isLoading }] = useCreateProductsMutation();

  const [name, setName] = useState("");
  const [price, setPrice] = useState<number | "">("");
  const [quantity, setQuantity] = useState<number | "">("");
  const [expiryDate, setExpiryDate] = useState("");
  const [showScanner, setShowScanner] = useState(false);

  const [message, setMessage] = useState<string | null>(null);
  const [messageType, setMessageType] = useState<"success" | "error" | "">("");

  // ✅ QR Scan Success
  const handleScan = (data: string | null) => {
    if (!data) return;
    try {
      const product = JSON.parse(data);
      setName(product.name || "");
      setPrice(product.price || "");
      setQuantity(product.stockQuantity || "");
      setExpiryDate(product.expiryDate || "");
      setShowScanner(false);
      setMessageType("success");
      setMessage("QR code scanned successfully!");
    } catch (error) {
      console.error("Invalid QR data:", error);
      setMessageType("error");
      setMessage("Invalid QR code format.");
    }
  };

  // ✅ QR Scan Error
  const handleError = (err: unknown) => {
    console.error("QR scan error:", err);
    setMessageType("error");
    setMessage("Camera error. Please allow camera access or try again.");
  };

  // ✅ Submit Form
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!name.trim()) {
      setMessageType("error");
      setMessage("Product name is required.");
      return;
    }
    if (!price || Number(price) <= 0) {
      setMessageType("error");
      setMessage("Price must be greater than 0.");
      return;
    }
    if (!quantity || Number(quantity) <= 0) {
      setMessageType("error");
      setMessage("Quantity must be at least 1.");
      return;
    }
    if (!expiryDate) {
      setMessageType("error");
      setMessage("Please select an expiry date.");
      return;
    }

    try {
      await createProduct({
        name,
        price: Number(price),
        stockQuantity: Number(quantity),
        expiryDate,
      }).unwrap();

      setMessageType("success");
      setMessage("Product added successfully!");
      setName("");
      setPrice("");
      setQuantity("");
      setExpiryDate("");
    } catch (error) {
      console.error(error);
      setMessageType("error");
      setMessage("Failed to add product. Try again.");
    }
  };

  return (
    <div className="max-w-xl mx-auto mt-12 p-8 backdrop-blur-lg bg-white/60 border border-gray-200 shadow-2xl rounded-2xl animate-fadeIn">
      <h1 className="text-3xl font-bold text-gray-900 mb-2">Add New Product</h1>
      <p className="text-gray-500 text-sm mb-8">
        Keep track of inventory, expiry and stock level effortlessly.
      </p>

      {/* ✅ QR Scanner Toggle Button */}
      <button
        type="button"
        onClick={() => setShowScanner((prev) => !prev)}
        className="flex items-center justify-center gap-2 w-full mb-6 py-3 rounded-xl text-white font-semibold
                   bg-gradient-to-r from-green-600 to-emerald-600 hover:opacity-90 
                   active:scale-[0.98] shadow-lg transition-all"
      >
        <QrCode className="w-5 h-5" />
        {showScanner ? "Close Scanner" : "Scan QR Code"}
      </button>

      {/* ✅ QR Scanner View */}
      {showScanner && (
        <div className="mb-6 border rounded-xl overflow-hidden">
          <QrReader
            {...({
              constraints: { facingMode: "environment" },
              onResult: (result: any, error: any) => {
                if (result) handleScan(result.getText());
                if (error) handleError(error);
              },
              style: { width: "100%" },
            } as any)}
          />
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Product Name */}
        <div className="relative group">
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="peer w-full border border-gray-300 rounded-lg px-3 py-3 bg-white
                       focus:ring-2 focus:ring-blue-500 focus:border-blue-500 
                       outline-none transition-all"
            required
          />
          <label
            className="absolute left-3 top-3 text-gray-500 text-sm 
                       transition-all peer-focus:-top-3 peer-focus:text-xs peer-focus:text-blue-600
                       peer-valid:-top-3 peer-valid:text-xs peer-valid:text-blue-600
                       bg-white px-1"
          >
            Product Name
          </label>
        </div>

        {/* Price */}
        <div className="relative group">
          <input
            type="number"
            min={0.01}
            step="0.01"
            value={price}
            onChange={(e) => setPrice(parseFloat(e.target.value) || "")}
            className="peer w-full border border-gray-300 rounded-lg px-3 py-3 bg-white
                       focus:ring-2 focus:ring-blue-500 focus:border-blue-500 
                       outline-none transition-all"
            required
          />
          <label
            className="absolute left-3 top-3 text-gray-500 text-sm 
                       transition-all peer-focus:-top-3 peer-focus:text-xs peer-focus:text-blue-600
                       peer-valid:-top-3 peer-valid:text-xs peer-valid:text-blue-600
                       bg-white px-1"
          >
            Price (£)
          </label>
        </div>

        {/* Quantity */}
        <div className="relative group">
          <input
            type="number"
            min={1}
            value={quantity}
            onChange={(e) => setQuantity(parseInt(e.target.value) || "")}
            className="peer w-full border border-gray-300 rounded-lg px-3 py-3 bg-white
                       focus:ring-2 focus:ring-blue-500 focus:border-blue-500 
                       outline-none transition-all"
            required
          />
          <label
            className="absolute left-3 top-3 text-gray-500 text-sm 
                       transition-all peer-focus:-top-3 peer-focus:text-xs peer-focus:text-blue-600
                       peer-valid:-top-3 peer-valid:text-xs peer-valid:text-blue-600
                       bg-white px-1"
          >
            Quantity
          </label>
        </div>

       {/* Expiry Date */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Expiry Date
          </label>
          <input
            type="date"
            className="w-full border border-slate-200 px-3 py-2 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            value={expiryDate}
            onChange={(e) => setExpiryDate(e.target.value)}
          />
        </div>
        {/* Submit Button */}
        <button
          type="submit"
          disabled={isLoading}
          className="w-full py-3 rounded-xl text-white font-semibold
                     bg-gradient-to-r from-blue-600 to-indigo-600 
                     hover:opacity-90 active:scale-[0.98] shadow-lg
                     transition-all disabled:opacity-50"
        >
          {isLoading ? "Adding..." : "Add Product"}
        </button>
      </form>

      {/* Feedback Message */}
      {message && (
        <div
          className={`mt-6 flex items-center gap-3 px-4 py-3 rounded-lg text-sm border animate-fadeIn
          ${
            messageType === "success"
              ? "bg-emerald-50 text-emerald-700 border-emerald-200"
              : "bg-rose-50 text-rose-700 border-rose-200"
          }`}
        >
          {messageType === "success" ? (
            <CheckCircle className="w-5 h-5" />
          ) : (
            <AlertCircle className="w-5 h-5" />
          )}
          {message}
        </div>
      )}
    </div>
  );
}
