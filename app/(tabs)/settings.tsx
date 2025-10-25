import { ThemedText } from "@/components/themed-text";
// New ThemedView import
import { ThemedView } from "@/components/themed-view";
import { FontSizeSetting } from "@/constants/misc";
import { useFontScaleState } from "@/hooks/use-font-scale";
import React from "react";
import { StyleSheet, TouchableOpacity } from "react-native"; // View is no longer needed here

// Array of options to iterate over
const FONT_OPTIONS: FontSizeSetting[] = ["Small", "Medium", "Large"];

export default function SettingsScreen() {
  // Use the stateful hook to get the current setting and the setter function
  const { activeSetting, setFontSize, isLoading } = useFontScaleState();

  if (isLoading) {
    // Simple loading state
    return (
      // Use ThemedView for the main container
      <ThemedView style={styles.container}>
        <ThemedText type="default">Loading Settings...</ThemedText>
      </ThemedView>
    );
  }

  return (
    // Use ThemedView for the main container
    <ThemedView style={styles.container}>
      <ThemedText type="title" style={styles.header}>
        App Settings
      </ThemedText>

      {/* Use ThemedView for setting rows */}
      <ThemedView style={styles.settingRow}>
        <ThemedText type="subtitle" style={styles.label}>
          Font Size Preference
        </ThemedText>

        {/* Use ThemedView for the option container (was backgroundColor: #f0f0f0) */}
        <ThemedView 
            style={styles.optionContainer}
            // Optional: You can explicitly set a custom background color 
            // for light mode if you want a subtle gray tint managed by the theme.
            // lightColor="#f0f0f0" 
        >
          {FONT_OPTIONS.map((option) => (
            <TouchableOpacity
              key={option}
              style={[
                styles.optionButton,
                activeSetting === option && styles.optionSelected,
                // Removed redundant/misleading fontSize style as it was ineffective on TouchableOpacity
              ]}
              onPress={() => setFontSize(option)}
            >
              <ThemedText
                // Use 'default' type but override the size for the button label
                type="default"
                style={[
                  styles.optionText,
                  activeSetting === option && styles.textSelected,
                ]}
              >
                {option}
              </ThemedText>
            </TouchableOpacity>
          ))}
        </ThemedView>
      </ThemedView>

      {/* Use ThemedView for the preview container */}
      <ThemedView style={styles.previewContainer}>
        {/* Added key prop tied to activeSetting to force ThemedText to re-render and pick up the new scale factor */}
        <ThemedText type="subtitle" key={`preview-subtitle-${activeSetting}`}>Preview:</ThemedText>
        <ThemedText 
            type="default" 
            key={`preview-text-${activeSetting}`} // Key forces re-initialization of internal hooks
        >
          This text will scale automatically to the size you select above. The
          current setting is: **{activeSetting}**.
        </ThemedText>
      </ThemedView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    // Removed backgroundColor: "#fff" to let ThemedView handle the background
  },
  header: {
    marginBottom: 30,
  },
  settingRow: {
    marginBottom: 40,
  },
  label: {
    marginBottom: 15,
  },
  optionContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    // Removed backgroundColor: "#f0f0f0" to let ThemedView handle a subtle background tint
    borderRadius: 10,
    padding: 5,
  },
  optionButton: {
    flex: 1,
    alignItems: "center",
    paddingVertical: 12,
    borderRadius: 8,
    marginHorizontal: 4,
  },
  optionSelected: {
    backgroundColor: "#0a7ea4", // Primary accent color
  },
  optionText: {
    fontWeight: "500",
    // Removed hardcoded color: "#333" to rely on ThemedText default color
  },
  textSelected: {
    color: "#fff", // White text on selected background
    fontWeight: "bold",
  },
  previewContainer: {
    padding: 15,
    // Border color should probably be themed too, but keeping static for now
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
  },
});