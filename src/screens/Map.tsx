import React, { useState, useEffect, useRef } from "react";
import { StyleSheet, View } from "react-native";
import MapboxGL, { CameraProps } from "@react-native-mapbox-gl/maps";
import * as d3 from "d3";
import GeoJSON from "geojson";
import { polygon, featureCollection } from "@turf/turf";
import { addMinutes, isValid } from "date-fns";

import TimeSlider from "../components/TimeSlider";
import { sensorLatLon } from "../constants";
import { fillExtrusionLayerStyles } from "../layers/styles";

const MAPBOX_ACCESS_TOKEN =
  "pk.eyJ1IjoibmFuZGVtbyIsImEiOiJja2R5Z21qZ2swMjRtMnlueWo1cm9zbGl0In0.pQdWOAinK4tNCUCr7U4oKQ";
const DATA =
  "https://www.geospatial.jp/ckan/dataset/9796489e-0a34-4d84-8c46-eb576daa1ded/resource/d51df612-7f5d-44e1-ac86-bfe2c57596bc/download/20210101.csv";

MapboxGL.setAccessToken(MAPBOX_ACCESS_TOKEN);

const initialCameraState: CameraProps = {
  centerCoordinate: [133.0637379, 35.4639893],
  zoomLevel: 16,
  pitch: 24,
  animationMode: "moveTo",
};

const Map = () => {
  const [cameraState, setCameraState] = useState<CameraProps>(
    initialCameraState
  );

  const [geojson, setGeojson] = useState<GeoJSON.Feature[]>();
  const [
    filteredGeojson,
    setFilteredGeojson,
  ] = useState<GeoJSON.FeatureCollection>();
  const [sliderValue, setSliderValue] = React.useState(
    new Date("2021-01-01T05:00:00")
  );

  useEffect(() => {
    d3.text(DATA)
      .then((text: string) => {
        const features = d3.csvParseRows(text).map((row) => {
          let dateTime = new Date(`${row[1]}T${row[2]}:00`);
          if (!isValid(dateTime)) {
            const date = row[1].split("-");
            const time = row[2].split(":");
            dateTime = new Date(
              Number(date[0]),
              Number(date[1]) - 1,
              Number(date[2]),
              Number(time[0]),
              Number(time[1])
            );
          }
          const hexBoundary = sensorLatLon[Number(row[0]) - 1].hexBoundary.map(
            (c) => {
              return [c[1], c[0]];
            }
          );
          return polygon([hexBoundary], {
            id: Number(row[0]),
            dateTime: dateTime,
            in: Number(row[3]),
            out: Number(row[4]),
            inSum: Number(row[5]),
            outSum: Number(row[6]),
            total: Number(row[5]) + Number(row[6]),
          });
        });
        const newFeatures = filterFeatures(
          features,
          sliderValue,
          addMinutes(sliderValue, 9)
        );
        setGeojson(features);
        setFilteredGeojson(featureCollection(newFeatures));
      })
      .catch((error: string) => {
        console.log("error", error);
      });
  }, []);

  const sliderValuesChange = (values: number[]) => {
    const newDate = new Date(values[0]);
    setSliderValue(newDate);
    const newFeatures = filterFeatures(
      geojson!,
      sliderValue,
      addMinutes(sliderValue, 9)
    );
    setFilteredGeojson(featureCollection(newFeatures));
  };

  const filterFeatures = (
    features: GeoJSON.Feature[],
    startDateTime: Date,
    endDateTime: Date
  ) => {
    const newFeatures = features!.filter((feature) => {
      const targetUnixTime = feature.properties!.dateTime.getTime();
      const startUnixTime = startDateTime.getTime();
      const endUnixTime = endDateTime.getTime();
      if (startUnixTime <= targetUnixTime && targetUnixTime <= endUnixTime) {
        return true;
      }
    });
    return newFeatures;
  };

  const handlePress = (event: any) => {
    setCameraState({
      ...cameraState,
      centerCoordinate: [
        event.coordinates.longitude,
        event.coordinates.latitude,
      ],
      zoomLevel: 17,
      animationMode: "flyTo",
    });
  };

  return (
    <View style={styles.page}>
      <View style={styles.container}>
        <MapboxGL.MapView
          style={styles.map}
          styleURL={MapboxGL.StyleURL.Street}
          logoEnabled={false}
        >
          {filteredGeojson ? (
            <MapboxGL.Animated.ShapeSource
              id="shapeSource"
              shape={filteredGeojson}
              onPress={handlePress}
            >
              <MapboxGL.Animated.FillExtrusionLayer
                id="hexagonLayer"
                style={fillExtrusionLayerStyles}
              />
            </MapboxGL.Animated.ShapeSource>
          ) : (
            <View></View>
          )}
          <MapboxGL.Camera {...cameraState} />
        </MapboxGL.MapView>
        <View style={styles.slider}>
          <TimeSlider
            dateTime={sliderValue}
            handleChange={sliderValuesChange}
          />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  page: {
    flex: 1,
  },
  container: {
    height: "100%",
    width: "100%",
  },
  map: {
    flex: 1,
  },
  slider: {
    position: "absolute",
    bottom: 10,
    height: "15%",
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
    flex: 1,
  },
});

export default Map;
