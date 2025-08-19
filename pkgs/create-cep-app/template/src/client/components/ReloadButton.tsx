import { useCallback } from "react";

export const ReloadButton = () => {
  const handleClick = useCallback(() => {
    window.location.reload();
  }, []);

  if (process.env.NODE_ENV !== "development") {
    return null;
  }

  return (
    <div className="fixed right-2 b-2 p-2" onClick={handleClick}>
      <sp-icon-refresh size="s" />
    </div>
  );
};
