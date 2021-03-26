import { StyleProp } from "react-native";
import { CircleLayerStyle } from "@react-native-mapbox-gl/maps";

export const circleLayerStyles: StyleProp<CircleLayerStyle> = {
  circleColor: [
    "case",
    [">", ["get", "total"], 1000],
    "#800026",
    [">", ["get", "total"], 700],
    "#bd0026",
    [">", ["get", "total"], 500],
    "#e31a1c",
    [">", ["get", "total"], 400],
    "#fc4e2a",
    [">", ["get", "total"], 300],
    "#fd8d3c",
    [">", ["get", "total"], 200],
    "#feb24c",
    [">", ["get", "total"], 100],
    "#fed976",
    [">", ["get", "total"], 50],
    "#ffeda0",
    "#ffffcc",
  ],
  circleStrokeWidth: 2,
  circleStrokeColor: "#c9c9c9",
};
