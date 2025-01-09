import React, { useState, useEffect } from 'react';
import api from '../api';

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

const TestRecommendation: React.FC = () => {
  const [query, setQuery] = useState('');
  const [tests, setTests] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [currentPage, setCurrentPage] = useState(1); 
  const [totalTests, setTotalTests] = useState(0); 
  const limit = 10; 

  const debouncedQuery = useDebounce(query, 500); 

  const handleSearch = async () => {
    if (!debouncedQuery.trim()) {
      setTests([]);
      setTotalTests(0);
      return;
    }

    setLoading(true);
    setError('');
    try {
      const response = await api.post('/tests/recommend-tests', { query: debouncedQuery });
      const fetchedTests = response.data.tests.Results;
      setTests(fetchedTests);
      setTotalTests(fetchedTests.length); 
      setCurrentPage(1); 
      console.log(tests)
    } catch (error) {
      setError('Error fetching tests');
      console.error('Error fetching tests', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (debouncedQuery) {
      handleSearch();
    }
  }, [debouncedQuery]);

  const currentTests = tests.slice((currentPage - 1) * limit, currentPage * limit);

  const handleNextPage = () => {
    if (currentPage * limit < totalTests) {
      setCurrentPage(currentPage + 1); 
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1); 
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-3xl font-semibold text-center text-gray-800 mb-4">Test Recommendation</h2>
      <div className="flex items-center mb-4">
        <input
          type="text"
          placeholder="Enter symptom or body part"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full p-3 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          onClick={handleSearch}
          disabled={loading}
          className="ml-2 w-36 p-3 bg-blue-500 text-white rounded-r-md hover:bg-blue-600 focus:outline-none disabled:bg-gray-400"
        >
          {loading ? 'Loading...' : 'Search'}
        </button>
      </div>

      {error && <p className="text-red-500 text-center">{error}</p>}

      <ul className="space-y-4">

        {currentTests.map((test, index) => (
          <li key={index} className="p-4 bg-gray-100 rounded-lg shadow-md hover:shadow-lg transition duration-300">
            <h3 className="text-xl font-semibold text-gray-800">{test.SHORTNAME || test.DisplayName || test.LONG_COMMON_NAME}</h3>
            <p className="text-gray-600"><strong>LOINC Number:</strong> {test.LOINC_NUM}</p>
            <p className="text-gray-600"><strong>Description:</strong> {test.DefinitionDescription || 'No description available.'}</p>
            <p className="text-gray-600"><strong>Status:</strong> {test.STATUS}</p>
            <p className="text-gray-600"><strong>Units:</strong> {test.EXAMPLE_UNITS || 'N/A'}</p>
            <p>
              <a
                href={test.Link}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500 hover:text-blue-700"
              >
                More info
              </a>
            </p>
          </li>
        ))}
      </ul>

      <div className="mt-6 flex justify-between">
        <button
          onClick={handlePrevPage}
          disabled={currentPage === 1}
          className="px-6 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:bg-gray-300"
        >
          Previous
        </button>
        <button
          onClick={handleNextPage}
          disabled={currentPage * limit >= totalTests}
          className="px-6 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:bg-gray-300"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default TestRecommendation;
