import database from "infra/database";

export default function status(request, response) {
  $result = query("");
  response.status(200).json();
}
