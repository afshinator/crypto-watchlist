import { useThemeColor } from "@/hooks/use-theme-color";
import { StyleSheet, Text, type TextProps } from "react-native";
// Assuming you have a file for your app settings/context
// This is a placeholder for your app's actual setting retrieval
import { useFontScale } from "@/hooks/use-font-scale";

export type ThemedTextProps = TextProps & {
  lightColor?: string;
  darkColor?: string;
  type?:
    | "default"
    | "title"
    | "defaultSemiBold"
    | "subtitle"
    | "link"
    | "small"
    | "large";
};

// --- Base Styles (No Change Needed Here) ---
// Keep the base styles for a scale factor of 1.0
const baseStyles = StyleSheet.create({
  default: {
    fontSize: 16,
    lineHeight: 24,
  },
  small: {
    fontSize: 12,
    lineHeight: 14,
  },
  large: {
    fontSize: 18,
    lineHeight: 20,
  },
  defaultSemiBold: {
    fontSize: 16,
    lineHeight: 24,
    fontWeight: "600",
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    lineHeight: 32,
  },
  subtitle: {
    fontSize: 20,
    fontWeight: "bold",
  },
  link: {
    lineHeight: 30,
    fontSize: 16,
    color: "#0a7ea4",
  },
});

// --- Utility function to apply the scale ---
function getScaledStyle(type: ThemedTextProps['type'] = 'default', scale: number) {
    const style = baseStyles[type];

    // If style doesn't have fontSize or lineHeight, return as is.
    if (!style || (style.fontSize === undefined && style.lineHeight === undefined)) {
        return style;
    }

    // Apply the scaling factor to fontSize and lineHeight
    return {
        ...style,
        fontSize: style.fontSize ? Math.round(style.fontSize * scale) : undefined,
        lineHeight: style.lineHeight ? Math.round(style.lineHeight * scale) : undefined,
    };
}


export function ThemedText({
  style,
  lightColor,
  darkColor,
  type = "default",
  ...rest
}: ThemedTextProps) {
  const color = useThemeColor({ light: lightColor, dark: darkColor }, "text");
  
  // 1. Get the current font scale factor
  const fontScale = useFontScale(); 

  // 2. Get the dynamically scaled style
  const scaledStyle = getScaledStyle(type, fontScale);

  return (
    <Text
      style={[
        { color },
        scaledStyle, // Apply the single scaled style
        style,       // Apply any user-passed custom styles last
      ]}
      {...rest}
    />
  );
}

// ------------------------------------------------------------------
// Example Placeholder for "@/hooks/use-font-scale" (You will implement this)
// ------------------------------------------------------------------
/*
// Your app's settings context would hold the active size setting (e.g., 'Medium')
type FontSizeSetting = 'Small' | 'Medium' | 'Large';

// You would likely get this value from a React Context or a Redux store.
const activeFontSizeSetting: FontSizeSetting = 'Large'; // Example active setting

export function useFontScale() {
    switch (activeFontSizeSetting) {
        case 'Small':
            return 0.85; // 15% smaller
        case 'Large':
            return 1.25; // 25% larger
        case 'Medium':
        default:
            return 1.0;  // Default
    }
}
*/