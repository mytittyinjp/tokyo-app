import React from "react";

import { Sensor } from "./src/container/Sensor";
import { Slider } from "./src/container/Slider";

import Map from "./src/screens/Map";
import SwipePanel from "./src/screens/SwipePanel";

export default function App() {
  return (
    <Sensor.Provider>
      <Slider.Provider>
        <Map />
        <SwipePanel />
      </Slider.Provider>
    </Sensor.Provider>
  );
}
