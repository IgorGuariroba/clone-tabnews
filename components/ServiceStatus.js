import React, { useMemo, useCallback } from "react";
import useStatusData from "../hooks/useStatusData";
import ServiceItem from "./ServiceItem";

function ServiceStatus({ showDetails, setShowDetails }) {
  const { isLoading, data } = useStatusData();

  const handleToggleDetails = useCallback(
    (serviceName) => {
      setShowDetails((prev) => (prev === serviceName ? null : serviceName));
    },
    [setShowDetails],
  );

  const renderServices = useMemo(() => {
    if (!data) return null;
    return (
      <ul className="space-y-4 w-full max-w-4xl mx-auto">
        {Object.entries(data).map(([serviceName, serviceData]) => (
          <ServiceItem
            key={serviceName}
            serviceName={serviceName}
            serviceData={serviceData}
            showDetails={showDetails}
            onToggleDetails={handleToggleDetails}
          />
        ))}
      </ul>
    );
  }, [data, showDetails, handleToggleDetails]);

  return (
    <div className="w-full">
      {isLoading ? <p className="text-gray-400 text-center">Carregando...</p> : renderServices}
    </div>
  );
}

export default ServiceStatus;
