import { useState } from "react";
import "app/globals.css";
import ServiceStatus from "../../components/ServiceStatus";

export default function StatusPage() {
  const [showDetails, setShowDetails] = useState(null);
  return (
    <div className="min-h-screen bg-gray-900 p-10 text-white flex flex-col items-center">
      <h1 className="text-5xl font-bold mb-6 text-center">Status dos Serviços</h1>
      <p className="text-lg mb-4">Veja abaixo o status dos nossos serviços em tempo real.</p>
      <ServiceStatus showDetails={showDetails} setShowDetails={setShowDetails} />
    </div>
  );
}
