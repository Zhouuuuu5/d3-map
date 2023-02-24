import React, { useState } from "react";
import { StyleSheet, View, Dimensions } from "react-native";

import StateChart from "./src/components/StateMap.js";

import data from "./src/constants/us-states.json";

export default function App() {
  const [property, setProperty] = useState("pop_est");
  const dimensions = Dimensions.get("window");

  return (
    <View style={styles.container}>
      <StateChart data={data} property={property} dimensions={dimensions} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
