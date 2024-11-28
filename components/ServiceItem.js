import React from "react";
import ServiceDetails from "./ServiceDetails";

function ServiceItem({ serviceName, serviceData, showDetails, onToggleDetails }) {
  return (
    <li className="flex flex-col p-6 bg-gray-800 rounded-lg shadow-lg">
      <div className="flex items-center justify-between">
        <div>
          <strong className="text-xl">{serviceName}</strong>
          <p className="text-gray-400 mt-1">{typeof serviceData === "object" ? "" : serviceData}</p>
        </div>
        {typeof serviceData === "object" && (
          <button
            className="bg-blue-600 px-4 py-2 rounded text-white hover:bg-blue-700 transition"
            onClick={() => onToggleDetails(serviceName)}
          >
            {showDetails === serviceName ? "Esconder Detalhes" : "Ver Detalhes"}
          </button>
        )}
      </div>
      {showDetails === serviceName && <ServiceDetails serviceData={serviceData} />}
    </li>
  );
}

export default ServiceItem;
