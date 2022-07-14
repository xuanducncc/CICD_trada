

import { useState, useMemo, useCallback } from "react";

export default function useDrawerManager() {
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [instructionDrawerVisible, setInstructionDrawerVisible] = useState(false)

  return {
    drawerVisible,
    setDrawerVisible,
    instructionDrawerVisible,
    setInstructionDrawerVisible
  };
}
