import { useCallback } from "react";

export function useRenderObject() {
  const renderObject = useCallback((obj) => {
    return Object.entries(obj).map(([key, value]) => (
      <div key={key}>
        <strong>{key}:</strong> {typeof value === "object" ? renderObject(value) : JSON.stringify(value)}
      </div>
    ));
  }, []);

  return renderObject;
}
