import "@app/globals.css";
import useStatusData from "@hooks/useStatusData";
import { useState } from "react";
import { Accordion } from "@components/Accordion";
import { Modal } from "@components/Modal";
import { Cards } from "@components/Cards";
import { Table } from "@components/Table";

const viewComponents = {
  Accordion: Accordion,
  Modal: Modal,
  Cards: Cards,
  Table: Table,
};

const viewNames = {
  Accordion: "Lista de serviços",
  Modal: "Modais de serviços",
  Cards: "Cartões de serviços",
  Table: "Tabela de serviços",
};

function ViewSelector({ viewType, setViewType }) {
  return (
    <div className="mb-4 flex border-b border-gray-700">
      {Object.keys(viewComponents).map((view) => (
        <button
          key={view}
          onClick={() => setViewType(view)}
          className={`px-4 py-2 ${viewType === view ? "border-b-2 border-blue-500 text-blue-500" : "text-gray-400"} focus:outline-none`}
        >
          {viewNames[view]}
        </button>
      ))}
    </div>
  );
}

function ViewContent({ viewType, data }) {
  const ViewComponent = viewComponents[viewType];
  return <ViewComponent data={data.dependencies} />;
}

export default function StatusPage() {
  const { data, error, isLoading } = useStatusData("/api/v1/status");
  const [viewType, setViewType] = useState("Accordion");

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading data</div>;

  return (
    <div className="min-h-screen bg-gray-900 p-10 text-white flex flex-col items-center">
      <ViewSelector viewType={viewType} setViewType={setViewType} />
      <ViewContent viewType={viewType} data={data} />
    </div>
  );
}
