import { useState } from "react";
import useSWR from "swr";
import "app/globals.css";

async function fetchAPI(key) {
  const response = await fetch(key);
  return await response.json();
}

export default function StatusPage() {
  const [showDetails, setShowDetails] = useState(null);

  return (
    <div className="min-h-screen bg-gray-900 p-10 text-white flex flex-col items-center">
      <h1 className="text-5xl font-bold mb-6 text-center">Status dos Serviços</h1>
      <p className="text-lg mb-4">Veja abaixo o status dos nossos serviços em tempo real.</p>
      <UpdatedAT showDetails={showDetails} setShowDetails={setShowDetails} />
    </div>
  );
}

function UpdatedAT({ showDetails, setShowDetails }) {
  const { isLoading, data } = useSWR("/api/v1/status", fetchAPI, { refreshInterval: 2000 });

  function showServices(value) {
    return (
      <ul className="space-y-4 w-full max-w-4xl mx-auto">
        {Object.entries(value).map(([key, value]) => (
          <li key={key} className="flex flex-col p-6 bg-gray-800 rounded-lg shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <strong className="text-xl">{key}</strong>
                <p className="text-gray-400 mt-1">{typeof value === "object" ? "" : value}</p>
              </div>
              {typeof value === "object" && (
                <button
                  className="bg-blue-600 px-4 py-2 rounded text-white hover:bg-blue-700 transition"
                  onClick={() => setShowDetails((prev) => (prev === key ? null : key))}
                >
                  {showDetails === key ? "Esconder Detalhes" : "Ver Detalhes"}
                </button>
              )}
            </div>
            {showDetails === key && (
              <div className="mt-4 transition-all duration-300 ease-in-out">
                <table className="w-full text-left table-auto border-collapse rounded-lg overflow-hidden">
                  <thead className="bg-gray-700 sticky top-0">
                    <tr>
                      <th className="px-4 py-2 border border-gray-600">Serviço</th>
                      <th className="px-4 py-2 border border-gray-600">Informações</th>
                    </tr>
                  </thead>
                  <tbody>
                    {Object.entries(value).map(([subKey, subValue], index) => (
                      <tr key={subKey} className={`bg-gray-${index % 2 === 0 ? "800" : "700"} hover:bg-gray-600`}>
                        <td className="border border-gray-600 px-4 py-2">{subKey}</td>
                        <td className="border border-gray-600 px-4 py-2">
                          {typeof subValue === "object" ? (
                            <ul className="ml-4 list-disc">
                              {Object.entries(subValue).map(([innerKey, innerValue]) => (
                                <li key={innerKey}>
                                  <strong>{innerKey}:</strong> {innerValue}
                                </li>
                              ))}
                            </ul>
                          ) : (
                            <span className="text-gray-300">{subValue}</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </li>
        ))}
      </ul>
    );
  }

  return (
    <div className="w-full">
      {isLoading ? <p className="text-gray-400 text-center">Carregando...</p> : showServices(data)}
    </div>
  );
}
