import React, { useState } from "react";
import { StyleSheet, View } from "react-native";
import { SwipeablePanel } from "rn-swipeable-panel";
import Graphs from "../components/Graphs";

const SwipePanel = () => {
  const [panelProps, setPanelProps] = useState({
    fullWidth: true,
    onlySmall: true,
    showCloseButton: true,
    noBackgroundOpacity: true,
    onClose: () => closePanel(),
    onPressCloseButton: () => closePanel(),
    // ...or any prop you want
  });
  const [isPanelActive, setIsPanelActive] = useState(true);

  const openPanel = () => {
    setIsPanelActive(true);
  };

  const closePanel = () => {
    setIsPanelActive(false);
  };

  return (
    <SwipeablePanel {...panelProps} isActive={isPanelActive}>
      <Graphs id={9} />
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
