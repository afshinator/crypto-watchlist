import { ThemedText } from "@/components/themed-text";
// New ThemedView import
import { ThemedView } from "@/components/themed-view";
import { FontSizeSetting } from "@/constants/misc";
import { useFontScaleState } from "@/hooks/use-font-scale";
import { getItem, setItem } from "@/utils/asyncStorage";
import React, { useEffect, useState } from "react";
import { StyleSheet, TouchableOpacity } from "react-native"; // View is no longer needed here

// Array of options to iterate over
const FONT_OPTIONS: FontSizeSetting[] = ["Small", "Medium", "Large"];

const CURRENCY_OPTIONS = [
  // Major Fiats
  { code: 'usd', label: 'USD ($)' },
  { code: 'eur', label: 'EUR (€)' },
  { code: 'gbp', label: 'GBP (£)' },
  { code: 'jpy', label: 'JPY (¥)' },
  { code: 'cad', label: 'CAD' },
  { code: 'aud', label: 'AUD' },
  { code: 'chf', label: 'CHF' }, // Swiss Franc
  { code: 'cny', label: 'CNY (¥)' }, // Chinese Yuan
  { code: 'inr', label: 'INR (₹)' }, // Indian Rupee
  { code: 'brl', label: 'BRL (R$)' }, // Brazilian Real
  { code: 'sgd', label: 'SGD' }, // Singapore Dollar
  { code: 'hkd', label: 'HKD' }, // Hong Kong Dollar
  { code: 'sek', label: 'SEK' }, // Swedish Krona
  { code: 'nzd', label: 'NZD' }, // New Zealand Dollar
  // Crypto
  { code: 'btc', label: 'BTC' },
  { code: 'eth', label: 'ETH' },
];

const CURRENCY_STORAGE_KEY = '@CurrencyPreference:v1';
const DEFAULT_CURRENCY = 'usd';

const useCurrencyPreference = () => {
  const [activeCurrency, setActiveCurrency] = useState(DEFAULT_CURRENCY);
  const [isLoading, setIsLoading] = useState(true);

  // Load currency preference from AsyncStorage on mount
  useEffect(() => {
    const loadCurrency = async () => {
      try {
        const storedCurrency = await getItem(CURRENCY_STORAGE_KEY);
        if (storedCurrency !== null) {
          setActiveCurrency(storedCurrency);
        }
      } catch (e) {
        console.error("Failed to load currency setting.", e);
      } finally {
        setIsLoading(false);
      }
    };
    loadCurrency();
  }, []);

  // Function to set new currency and save it
  const setCurrency = async (currencyCode) => {
    try {
      setActiveCurrency(currencyCode);
      await setItem(CURRENCY_STORAGE_KEY, currencyCode);
    } catch (e) {
      console.error("Failed to save currency setting.", e);
    }
  };

  return { activeCurrency, setCurrency, isLoading };
};


export default function SettingsScreen() {
  const fontScale = useFontScaleState();

  // NEW currency hook
  const currencyPref = useCurrencyPreference();

  // Combine loading states
  const isLoading = fontScale.isLoading || currencyPref.isLoading;

  if (isLoading) {
    // Simple loading state
    return (
      <ThemedView style={[styles.container, styles.loadingContainer]}>
        <ThemedText type="default">Loading Settings...</ThemedText>
      </ThemedView>
    );
  }

  return (
    <ThemedView style={styles.container}>
      <ThemedText type="title" style={styles.header}>
        App Settings
      </ThemedText>

      {/* 1. Font Size Preference Setting */}
      <ThemedView style={styles.settingRow}>
        <ThemedText type="subtitle" style={styles.label}>
          Font Size Preference
        </ThemedText>

        <ThemedView 
            style={styles.optionContainer}
        >
          {FONT_OPTIONS.map((option) => (
            <TouchableOpacity
              key={option}
              style={[
                styles.optionButton,
                fontScale.activeSetting === option && styles.optionSelected,
              ]}
              onPress={() => fontScale.setFontSize(option)}
            >
              <ThemedText
                type="default"
                style={[
                  styles.optionText,
                  fontScale.activeSetting === option && styles.textSelected,
                ]}
              >
                {option}
              </ThemedText>
            </TouchableOpacity>
          ))}
        </ThemedView>
      </ThemedView>
      
      {/* Preview Container */}
      <ThemedView style={styles.previewContainer}>
        {/* Note: The key prop is used to simulate re-rendering based on state change */}
        <ThemedText type="subtitle" key={`preview-subtitle-${fontScale.activeSetting}`}>Preview:</ThemedText>
        <ThemedText 
            type="default" 
            key={`preview-text-${fontScale.activeSetting}`}
        >
          The current price data currency is **{currencyPref.activeCurrency.toUpperCase()}**.
          This text will scale automatically to the size you select above. The
          current font setting is: **{fontScale.activeSetting}**.
        </ThemedText>
      </ThemedView>


      {/* 2. Currency Preference Setting */}
      <ThemedView style={[styles.settingRow, styles.topMarg]}>
        <ThemedText type="subtitle" style={styles.label}>
          Currency Preference
        </ThemedText>

        <ThemedView 
            style={[styles.optionContainer, styles.currencyOptionContainer]}
        >
          {CURRENCY_OPTIONS.map((option) => (
            <TouchableOpacity
              key={option.code}
              style={[
                styles.optionButton,
                styles.currencyOptionButton,
                currencyPref.activeCurrency === option.code && styles.optionSelected,
              ]}
              onPress={() => currencyPref.setCurrency(option.code)}
            >
              <ThemedText
                type="default"
                style={[
                  styles.optionText,
                  currencyPref.activeCurrency === option.code && styles.textSelected,
                  styles.currencyOptionText
                ]}
              >
                {option.label}
              </ThemedText>
            </TouchableOpacity>
          ))}
        </ThemedView>
      </ThemedView>



    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,

  },
  loadingContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    marginBottom: 30,
    fontSize: 24, // Mock title size
    fontWeight: 'bold',
  },
  settingRow: {
    marginBottom: 40,
  },
  topMarg: {
    marginTop: 40,
  },
  label: {
    marginBottom: 15,
    fontSize: 16, // Mock subtitle size
    fontWeight: '600',
  },
  optionContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    borderRadius: 10,
    padding: 5,
    flexWrap: 'wrap', 
    backgroundColor: '#f0f0f0', // Mock subtle background tint
  },
  currencyOptionContainer: {
    paddingHorizontal: 0,
  },
  optionButton: {
    flex: 1,
    alignItems: "center",
    paddingVertical: 12,
    borderRadius: 8,
    marginHorizontal: 4,
  },
  currencyOptionButton: {
    flexBasis: '22%',
    minWidth: 70, 
    marginVertical: 4,
    paddingVertical: 8, 
    marginHorizontal: 2,
  },
  optionSelected: {
    backgroundColor: "#0a7ea4", 
  },
  optionText: {
    fontWeight: "500",
    color: '#333', // Mock default text color
  },
  currencyOptionText: {
    fontSize: 12,
  },
  textSelected: {
    color: "#fff", 
    fontWeight: "bold",
  },
  previewContainer: {
    padding: 15,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
  },
  // Mock styles for Themed components
  mockedText: {
    fontSize: 14,
    color: '#333',
  },
  mockedView: {
    // Default style for View container
  }
});
