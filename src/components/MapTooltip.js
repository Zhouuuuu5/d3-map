import { useRef, useEffect } from 'react';
import { View, Text } from "react-native";

function Tooltip({ visible, position, content }) {
  const { x, y } = position;
  const tooltipRef = useRef(null);

  useEffect(() => {
    if (visible && tooltipRef.current) {
      const { width, height } = tooltipRef.current.getBoundingClientRect();
      tooltipRef.current.style.left = `${x - width / 2}px`;
      tooltipRef.current.style.top = `${y - height - 10}px`;
    }
  }, [visible, x, y]);

  return visible ? (
    <View ref={tooltipRef} style={{ position: "absolute" }}>
      <Text>{content}</Text>
      <Text>Crime: 0</Text>
    </View>
  ) : null;
}

export default Tooltip;