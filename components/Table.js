import { useRenderObject } from "@hooks/useRenderObject";

export function Table({ data }) {
  const renderObject = useRenderObject();

  return (
    <table>
      <thead>
        <tr>
          <th>Key</th>
          <th>Value</th>
        </tr>
      </thead>
      <tbody>
        {data.map((item, index) =>
          typeof item === "object" ? (
            renderObject(item)
          ) : (
            <tr key={index}>
              <td>{index}</td>
              <td>{item}</td>
            </tr>
          ),
        )}
      </tbody>
    </table>
  );
}
