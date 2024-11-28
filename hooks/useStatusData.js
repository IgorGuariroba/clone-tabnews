import useSWR from "swr";

async function fetchStatusData(key) {
  const response = await fetch(key);
  return await response.json();
}

export default function useStatusData(apiUrl = "", refreshInterval = 2000) {
  const { data, error, isLoading } = useSWR(apiUrl, fetchStatusData, { refreshInterval });
  return { data, error, isLoading };
}
