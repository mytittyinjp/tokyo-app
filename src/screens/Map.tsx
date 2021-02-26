import React from "react";
import { StyleSheet, Text, View } from "react-native";
import MapboxGL from "@react-native-mapbox-gl/maps";

const MAPBOX_ACCESS_TOKEN =
  "pk.eyJ1IjoibmFuZGVtbyIsImEiOiJja2R5Z21qZ2swMjRtMnlueWo1cm9zbGl0In0.pQdWOAinK4tNCUCr7U4oKQ";

MapboxGL.setAccessToken(MAPBOX_ACCESS_TOKEN);

const Map = () => {
  return (
    <View style={styles.page}>
      <View style={styles.container}>
        <MapboxGL.MapView
          style={styles.map}
          styleURL={MapboxGL.StyleURL.Street}
          logoEnabled={false}
        >
          <MapboxGL.Camera
            centerCoordinate={[133.0637379, 35.4639893]}
            zoomLevel={17}
          />
        </MapboxGL.MapView>
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
});

export default Map;
