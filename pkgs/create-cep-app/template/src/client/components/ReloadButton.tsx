import { useCallback } from "react";

export const ReloadButton = () => {
  const handleClick = useCallback(() => {
    window.location.reload();
  }, []);

  if (process.env.NODE_ENV !== "development") {
    return null;
  }

  return (
    <div
      css={`
        position: fixed;
        right: 8px;
        bottom: 8px;
        padding: 8px;
      `}
      onClick={handleClick}
    >
      <sp-icon-refresh size="s" />
    </div>
  );
};
