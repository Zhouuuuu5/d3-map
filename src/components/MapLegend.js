import { Svg, Rect, G, Text } from "react-native-svg";

const Legend = ({ colorScale }) => {
  const domain = colorScale.domain();

  const itemWidth = 20;
  const gap = 20;

  // Map the domain to a list of {color, label} objects
  const items = domain.map((d, i) => ({
    color: colorScale(d),
    label: i === 0 ? "0" : `${d - 1}-${d}`,
  }));

  return (
    <Svg width="100" height="200">
      {items.map((item, i) => (
        <G key={i}>
          <Rect
            x="10"
            y={i * (itemWidth + gap)}
            width={itemWidth}
            height="20"
            fill={item.color}
          />
          <Text
            x="50"
            y={i * (itemWidth + gap) + 18}
            textAnchor="middle"
            fill="black"
          >
            {item.label}
          </Text>
        </G>
      ))}
    </Svg>
  );
};

export default Legend;
