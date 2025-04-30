import { Pressable, StyleProp, ViewStyle } from "react-native";
import { ReactNode } from "react";

type Props = {
  onPress?: () => void;
  style: StyleProp<ViewStyle>;
  children: ReactNode;
};

export const PressableButton = ({ onPress, style, children }: Props) => {
  return <Pressable onPress={onPress} style={style}>{children}</Pressable>;
};
