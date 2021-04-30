import React from "react";

import { Sensor } from "./src/container/Sensor";
import { Slider } from "./src/container/Slider";
import MainScreen from "./src/screens/MainScreen";

export default function App() {
  return (
    <Sensor.Provider>
      <Slider.Provider>
        <MainScreen />
      </Slider.Provider>
    </Sensor.Provider>
  );
}
