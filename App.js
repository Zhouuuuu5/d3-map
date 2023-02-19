import React, { useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Dimensions } from 'react-native';

import StateChart from "./src/components/StateMap.js";
import Map from "./src/components/Map.js";

import data from "./src/constants/us-states.json";

export default function App() {
  const [property, setProperty] = useState("pop_est");
  const dimensions = Dimensions.get("window");

  return (
    <View style={styles.container}>
      {/* uncomment the below line to show state map. */}
      {/* <StateChart data={data} property={property}/> */}
      <Map dimensions={dimensions}/>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
