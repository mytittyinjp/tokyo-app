import React, { useState, useEffect } from "react";
import { StyleSheet, View } from "react-native";
import { SwipeablePanel } from "rn-swipeable-panel";
import Graphs from "../components/Graphs";

import { Sensor } from "../container/Sensor";

const SwipePanel = () => {
  const sensor = Sensor.useContainer();

  const [panelProps, setPanelProps] = useState({
    fullWidth: true,
    onlySmall: true,
    showCloseButton: true,
    noBackgroundOpacity: true,
    allowTouchOutside: true,
    onClose: () => closePanel(),
    onPressCloseButton: () => closePanel(),
    // ...or any prop you want
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

const styles = StyleSheet.create({
  graph: {
    position: "absolute",
    bottom: 150,
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
    flex: 1,
  },
});

export default SwipePanel;
