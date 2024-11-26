import useSWR from "swr";

async function fetchAPI(key) {
  const response = await fetch(key);
  return await response.json();
}

export default function StatusPage() {
  return (
    <>
      <h1>Status</h1>
      <UpdatedAT />
    </>
  );
}

function UpdatedAT() {
  const { isLoading, data } = useSWR("/api/v1/status", fetchAPI, { refreshInterval: 2000 });
  let updatedAtText = "Carregando...";

  if (!isLoading && data) {
    updatedAtText = new Date(data.updatedAt).toLocaleString("pt-BR");
  }

  return <p>Última atualização: {updatedAtText}</p>;
}
