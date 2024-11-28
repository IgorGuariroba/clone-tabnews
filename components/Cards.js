import { useRenderObject } from "@hooks/useRenderObject";

export function Cards({ data }) {
  const renderObject = useRenderObject();

  return (
    <div>
      {data.map((item, index) => (
        <div key={index}>{typeof item === "object" ? renderObject(item) : item}</div>
      ))}
    </div>
  );
}
