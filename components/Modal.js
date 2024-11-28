import { useRenderObject } from "@hooks/useRenderObject";

export function Modal({ data }) {
  const renderObject = useRenderObject();

  return (
    <div className="modal">
      {data.map((item, index) => (
        <div key={index}>{typeof item === "object" ? renderObject(item) : item}</div>
      ))}
    </div>
  );
}
