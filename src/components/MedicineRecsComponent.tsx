import React, { useState, useEffect } from "react";
import api from "../api";

const useDebounce = (value: string, delay: number) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};

const MedicineRecommendation: React.FC = () => {
  const [query, setQuery] = useState("");
  const [medicines, setMedicines] = useState<any[]>([]);
  const [currentChunkIndex, setCurrentChunkIndex] = useState(0);
  const [chunkedMedicines, setChunkedMedicines] = useState<any[][]>([]);
  const limit = 10;
  const [loading, setLoading] = useState(false);

  const debouncedQuery = useDebounce(query, 500);

  const handleSearch = async (page: number = 1) => {
    if (!debouncedQuery) return;

    setLoading(true);
    try {
      const response = await api.post("/medicines/recommend-medicines", {
        query: debouncedQuery,
        page,
        limit,
      });

      const newMedicines = response.data.medicines.medicines;

      const chunks = [];
      for (let i = 0; i < newMedicines.length; i += limit) {
        chunks.push(newMedicines.slice(i, i + limit));
      }

      setMedicines(newMedicines); 
      setChunkedMedicines(chunks); 
      setCurrentChunkIndex(0); 
      console.log(medicines)
    } catch (error) {
      console.error("Error fetching medicines", error);
    } finally {
      setLoading(false);
    }
  };

  const handleNextPage = () => {
    if (currentChunkIndex < chunkedMedicines.length - 1) {
      setCurrentChunkIndex(currentChunkIndex + 1); 
    }
  };

  const handlePrevPage = () => {
    if (currentChunkIndex > 0) {
      setCurrentChunkIndex(currentChunkIndex - 1); 
    }
  };

  useEffect(() => {
    if (debouncedQuery) {
      handleSearch();
    }
  }, [debouncedQuery]);

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-3xl font-semibold text-center text-gray-800 mb-6">
        Medicine Recommendation
      </h2>
      <div className="flex items-center mb-4">
        <input
          type="text"
          placeholder="Enter symptom or body part"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full p-3 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          onClick={() => handleSearch(1)}
          disabled={loading}
          className="ml-2 w-36 p-3 bg-blue-500 text-white rounded-r-md hover:bg-blue-600 focus:outline-none disabled:bg-gray-400"
        >
          {loading ? 'Loading...' : 'Search'}
        </button>
      </div>

      {chunkedMedicines.length > 0 && (
        <div className="mt-6">
          <ul className="space-y-4">
            {chunkedMedicines[currentChunkIndex].map((medicine, index) => (
              <li
                key={index}
                className="p-6 bg-gray-50 rounded-lg shadow-md border border-gray-300 hover:shadow-xl transition duration-300"
              >
                <h4 className="text-2xl font-bold text-gray-800">
                  {medicine.brand_name}
                </h4>
                <p className="text-gray-700 mt-2">
                  <strong>Generic Name:</strong> {medicine.generic_name}
                </p>
                <p className="text-gray-700">
                  <strong>Manufacturer:</strong>{" "}
                  {medicine.labeler_name || "N/A"}
                </p>
                <p className="text-gray-700">
                  <strong>Dosage Form:</strong> {medicine.dosage_form}
                </p>
                <p className="text-gray-700">
                  <strong>Route:</strong> {(medicine.route || []).join(", ")}
                </p>

                <div className="mt-4">
                  <h5 className="font-semibold text-gray-800">
                    Active Ingredients:
                  </h5>
                  <ul className="list-disc list-inside pl-5">
                    {medicine.active_ingredients?.map(
                      (ingredient: any, idx: number) => (
                        <li key={idx}>
                          {ingredient.name} - {ingredient.strength}
                        </li>
                      )
                    )}
                  </ul>
                </div>

                <div className="mt-4">
                  <h5 className="font-semibold text-gray-800">Packaging:</h5>
                  <ul className="list-disc list-inside pl-5">
                    {medicine.packaging?.map((pack: any, idx: number) => (
                      <li key={idx}>{pack.description}</li>
                    ))}
                  </ul>
                </div>

                <p className="text-gray-700 mt-4">
                  <strong>Marketing Category:</strong>{" "}
                  {medicine.marketing_category}
                </p>
                <p className="text-gray-700">
                  <strong>Product Type:</strong> {medicine.product_type}
                </p>
              </li>
            ))}
          </ul>

          <div className="mt-6 flex justify-between">
            <button
              onClick={handlePrevPage}
              disabled={currentChunkIndex === 0}
              className="px-6 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:bg-gray-300"
            >
              Previous
            </button>
            <button
              onClick={handleNextPage}
              disabled={currentChunkIndex === chunkedMedicines.length - 1}
              className="px-6 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:bg-gray-300"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default MedicineRecommendation;
