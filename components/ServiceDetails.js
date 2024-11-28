import React from "react";

function renderInnerValues(subValue) {
  return (
    <ul className="ml-4 list-disc">
      {Object.entries(subValue).map(([innerKey, innerValue]) => (
        <li key={innerKey}>
          <strong>{innerKey}:</strong> {innerValue}
        </li>
      ))}
    </ul>
  );
}

function renderTableRow(subKey, subValue, index) {
  return (
    <tr key={subKey} className={`bg-gray-${index % 2 === 0 ? "800" : "700"} hover:bg-gray-600`}>
      <td className="border border-gray-600 px-4 py-2">{subKey}</td>
      <td className="border border-gray-600 px-4 py-2">
        {typeof subValue === "object" ? renderInnerValues(subValue) : <span className="text-gray-300">{subValue}</span>}
      </td>
    </tr>
  );
}

function renderServiceDetails(serviceData) {
  return Object.entries(serviceData).map(([subKey, subValue], index) => renderTableRow(subKey, subValue, index));
}

function ServiceDetails({ serviceData }) {
  return (
    <div className="mt-4 transition-all duration-300 ease-in-out">
      <table className="w-full text-left table-auto border-collapse rounded-lg overflow-hidden">
        <thead className="bg-gray-700 sticky top-0">
          <tr>
            <th className="px-4 py-2 border border-gray-600">Serviço</th>
            <th className="px-4 py-2 border border-gray-600">Informações</th>
          </tr>
        </thead>
        <tbody>{renderServiceDetails(serviceData)}</tbody>
      </table>
    </div>
  );
}

export default ServiceDetails;
