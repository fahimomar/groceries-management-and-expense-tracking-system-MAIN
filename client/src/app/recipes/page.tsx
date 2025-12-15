"use client";

import { useState } from "react";
import {
  useGetAiRecipeSuggestionsMutation,
  useGetExpiringSoonProductsQuery,
} from "@/state/api";
import { Loader2, ChefHat, ListChecks, Clock } from "lucide-react";

export default function RecipesPage() {
  const [ingredients, setIngredients] = useState("");
  const [recipes, setRecipes] = useState<any[]>([]);
  const [error, setError] = useState("");

  const [getRecipes, { isLoading }] = useGetAiRecipeSuggestionsMutation();
  const {
    data: expiringProducts,
    isLoading: expiringLoading,
    isError: expiringError,
  } = useGetExpiringSoonProductsQuery();

  const handleGenerate = async () => {
    if (!ingredients.trim()) return;
    const list = ingredients.split(",").map((i) => i.trim()).filter(Boolean);
    try {
      const res = await getRecipes(list).unwrap();
      setRecipes(res.recipes || []);
      setError("");
    } catch {
      setError("⚠️ Failed to generate recipes. Please try again.");
    }
  };

  return (
    <div className="flex flex-col lg:flex-row gap-8 max-w-7xl mx-auto py-12 px-6">
      {/* LEFT SIDE — Recipe Generator */}
      <div className="flex-1 space-y-10">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-bold text-gray-900 flex justify-center items-center gap-2">
            <ChefHat className="w-8 h-8 text-green-600" />
            AI Recipe Generator
          </h1>
          <p className="text-gray-500">
            Enter your ingredients and let AI cook up some delicious ideas 🍳
          </p>
        </div>

        {/* Input Section */}
        <div className="bg-white/80 backdrop-blur-lg p-6 rounded-2xl shadow-lg border border-gray-200 space-y-5">
          <input
            type="text"
            placeholder="Enter ingredients (comma separated, e.g. tomato, onion, garlic)"
            value={ingredients}
            onChange={(e) => setIngredients(e.target.value)}
            className="border border-gray-300 p-3 rounded-xl w-full focus:ring-2 focus:ring-green-500 outline-none transition-all text-gray-800 placeholder-gray-400"
          />

          <button
            onClick={handleGenerate}
            disabled={isLoading}
            className="w-full bg-gradient-to-r from-green-600 to-emerald-600 text-white font-semibold py-3 rounded-xl 
                       hover:opacity-90 active:scale-[0.98] transition-all flex justify-center items-center gap-2"
          >
            {isLoading ? (
              <>
                <Loader2 className="animate-spin w-5 h-5" /> Generating Recipes...
              </>
            ) : (
              "Generate Recipes"
            )}
          </button>
        </div>

        {/* Error */}
        {error && (
          <div className="text-red-700 bg-red-100 border border-red-200 px-4 py-3 rounded-xl text-center font-medium">
            {error}
          </div>
        )}

        {/* Loading Skeleton */}
        {isLoading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 animate-pulse">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-40 bg-gray-200 rounded-2xl shadow-inner"></div>
            ))}
          </div>
        )}

        {/* Recipes */}
        {recipes.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {recipes.map((recipe, index) => (
              <div
                key={index}
                className="bg-white border shadow-lg rounded-2xl overflow-hidden hover:shadow-2xl transition-all duration-300"
              >
                <div className="bg-gradient-to-r from-green-500 to-emerald-600 p-4">
                  <h2 className="text-xl font-semibold text-white text-center">{recipe.name}</h2>
                </div>

                <div className="p-5 space-y-4 text-gray-800">
                  <div>
                    <h3 className="font-semibold flex items-center gap-2 mb-1 text-gray-700">
                      <ListChecks className="w-4 h-4 text-green-600" /> Ingredients
                    </h3>
                    <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
                      {recipe.ingredients.map((item: string, i: number) => (
                        <li key={i}>{item}</li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <h3 className="font-semibold text-gray-700 mb-1">Steps</h3>
                    <ol className="list-decimal list-inside text-sm text-gray-600 space-y-1">
                      {recipe.steps.map((step: string, i: number) => (
                        <li key={i}>{step}</li>
                      ))}
                    </ol>
                  </div>

                  {recipe.difficulty && (
                    <p className="text-sm text-gray-500 italic">
                      Difficulty: <strong>{recipe.difficulty}</strong>
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {!isLoading && recipes.length === 0 && !error && (
          <div className="text-center text-gray-500 text-sm bg-gray-50 p-6 rounded-xl border">
            No recipes yet. Try entering some ingredients to generate tasty ideas!
          </div>
        )}
      </div>

      {/* RIGHT SIDE — Expiring Products */}
      <div className="w-full lg:w-80 shrink-0 bg-white/80 backdrop-blur-lg border border-gray-200 shadow-xl rounded-2xl p-5 h-fit">
        <div className="flex items-center gap-2 mb-4">
          <Clock className="w-5 h-5 text-orange-600" />
          <h2 className="text-lg font-semibold text-gray-800">Expiring Soon</h2>
        </div>

        {expiringLoading && (
          <p className="text-gray-500 text-sm animate-pulse">Loading...</p>
        )}

        {expiringError && (
          <p className="text-red-600 text-sm">Could not load expiring products.</p>
        )}

        {!expiringLoading && expiringProducts && expiringProducts.length > 0 ? (
          <ul className="space-y-3 max-h-[75vh] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-gray-300">
            {expiringProducts.map((item) => (
              <li
                key={item.productId}
                className="flex justify-between items-center bg-orange-50 border border-orange-100 rounded-lg px-3 py-2 hover:bg-orange-100 transition"
              >
                <div>
                  <p className="font-medium text-gray-800 text-sm">{item.name}</p>
                  {item.expiryDate && (
                    <p className="text-xs text-gray-500">
                      Exp: {new Date(item.expiryDate).toLocaleDateString("en-GB")}
                    </p>
                  )}
                </div>
                <span className="text-xs font-semibold text-orange-700">
                  {item.stockQuantity} pcs
                </span>
              </li>
            ))}
          </ul>
        ) : (
          !expiringLoading && (
            <p className="text-gray-500 text-sm">No products expiring soon 🎉</p>
          )
        )}
      </div>
    </div>
  );
}
