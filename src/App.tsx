import "./App.css";
import MedicineRecommendation from "./components/MedicineRecsComponent";
import TestRecommendation from "./components/TestRecsComponent";

function App() {
  return (
    <div className="min-h-screen w-[100%] bg-gray-50">
      <header className="w-[100%] bg-blue-500 py-6 text-white text-center shadow-lg">
        <h1 className="text-4xl font-bold">Medical Recommendation App</h1>
        <p className="text-xl mt-2">
          Find the best medical recommendations for symptoms and conditions
        </p>
      </header>

      <main className="w-[100%] px-6 py-8">
        <div className="space-y-8 flex flex-col sm:space-y-0 sm:flex-row sm:justify-between sm:items-start sm:gap-10">
          {/* Medicine Recommendation Section */}
          <div className="w-full sm:w-[48%] flex-shrink-0 bg-white shadow-md p-4 rounded-md min-h-[300px]">
            <MedicineRecommendation />
          </div>

          {/* Test Recommendation Section */}
          <div className="w-full sm:w-[48%] flex-shrink-0 bg-white shadow-md p-4 rounded-md min-h-[300px]">
            <TestRecommendation />
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;
