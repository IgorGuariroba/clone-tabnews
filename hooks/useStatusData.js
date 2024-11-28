import useSWR from "swr";

const STATUS_API_URL = "/api/v1/status";
const REFRESH_INTERVAL = 2000;

async function fetchStatusData(key) {
  const response = await fetch(key);
  return await response.json();
}

export default function useStatusData() {
  return useSWR(STATUS_API_URL, fetchStatusData, { refreshInterval: REFRESH_INTERVAL });
}
