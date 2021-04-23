import { useState } from "react";
import { createContainer } from "unstated-next";

import { sensorLatLon } from "../constants";

type SensorType = {
  id: number;
  latitude: number;
  longitude: number;
};

const defaultSensor: SensorType = {
  id: 9,
  latitude: sensorLatLon[10].latitude,
  longitude: sensorLatLon[10].longitude,
};

const useSensor = (initialState = defaultSensor) => {
  let [data, setData] = useState<SensorType>(initialState);
  let onChange = (newId: number) => {
    setData({
      id: newId,
      latitude: sensorLatLon[newId - 1].latitude,
      longitude: sensorLatLon[newId - 1].longitude,
    });
  };
  return { data, onChange };
};

export const Sensor = createContainer(useSensor);
