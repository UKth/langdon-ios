import { TextInput, TextInputProps } from "react-native";
import { Text, TextProps } from "./Themed";

export function MonoText(props: TextProps) {
  return (
    <Text {...props} style={[props.style, { fontFamily: "space-mono" }]} />
  );
}

export const BoldText = (props: TextProps) => {
  return (
    <Text
      {...props}
      style={[props.style, { fontFamily: "Arial Rounded MT Bold" }]}
    />
  );
};

export const RegText = (props: TextProps) => {
  return (
    <Text {...props} style={[props.style, { fontFamily: "Arial Hebrew" }]} />
  );
};

export const BoldTextInput = (props: TextInputProps) => {
  return (
    <TextInput
      autoCorrect={false}
      {...props}
      style={[props.style, { fontFamily: "Arial Rounded MT Bold" }]}
    />
  );
};

export const RegTextInput = (props: TextInputProps) => {
  return (
    <TextInput
      autoCorrect={false}
      {...props}
      style={[props.style, { fontFamily: "Arial Hebrew" }]}
    />
  );
};
