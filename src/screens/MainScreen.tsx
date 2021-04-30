import React from "react";
import { StyleSheet, View } from "react-native";

import Map from "../components/Map";
import SwipePanel from "../components/SwipePanel";

const MainScreen = () => {
  return (
    <View style={styles.page}>
      <Map />
      <SwipePanel />
    </View>
  );
};

const styles = StyleSheet.create({
  page: {
    flex: 1,
  },
});

export default MainScreen;
