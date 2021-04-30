import React, { useState, useEffect } from "react";
import { SwipeablePanel } from "rn-swipeable-panel";
import Graphs from "./Graphs";

import { Sensor } from "../container/Sensor";

const SwipePanel = () => {
  const sensor = Sensor.useContainer();

  const [panelProps, setPanelProps] = useState({
    fullWidth: true,
    onlySmall: true,
    showCloseButton: false,
    noBackgroundOpacity: true,
    allowTouchOutside: true,
    onClose: () => closePanel(),
  });
  const [isPanelActive, setIsPanelActive] = useState(true);

  useEffect(() => {
    if (!isPanelActive) {
      setIsPanelActive(true);
    }
  }, [sensor]);

  const openPanel = () => {
    setIsPanelActive(true);
  };

  const closePanel = () => {
    setIsPanelActive(false);
  };

  useEffect(() => {
    if (!isPanelActive) {
      setIsPanelActive(true);
    }
  }, [sensor]);

  return (
    <SwipeablePanel {...panelProps} isActive={isPanelActive}>
      <Graphs id={sensor.data.id} />
    </SwipeablePanel>
  );
};

export default SwipePanel;
