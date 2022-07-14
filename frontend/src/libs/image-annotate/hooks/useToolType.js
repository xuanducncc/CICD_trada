import { useState, useMemo, useCallback } from "react";

export default function useToolType(tool) {

  const controlType = useMemo(() => {
    const { controls } = tool;
    const [control] = controls;
    return control.type;
  }, [tool]);

  return controlType;
}
