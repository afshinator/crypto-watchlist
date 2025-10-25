import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { useFocusEffect } from '@react-navigation/native';
import { useCallback, useState } from "react";
import { ActivityIndicator, FlatList, Image, StyleSheet, TouchableOpacity, View } from "react-native";

// The base URL for the CoinGecko API
const BASE_API_URL = "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&page=1";

type Coin = {
  id: string;
  symbol: string;
  name: string;
  image: string;
  current_price: number;
  market_cap: number;
  market_cap_rank: number;
  fully_diluted_valuation: number | null;
  total_volume: number;
  high_24h: number;
  low_24h: number;
  price_change_24h: number;
  price_change_percentage_24h: number;
  market_cap_change_24h: number;
  market_cap_change_percentage_24h: number;
  circulating_supply: number;
  total_supply: number | null;
  max_supply: number | null;
  ath: number;
  ath_change_percentage: number;
  ath_date: string;
  atl: number;
  atl_change_percentage: number;
  atl_date: string;
  roi: {
    times: number;
    currency: string;
    percentage: number;
  } | null;
  last_updated: string;
};


const COIN_LIMIT_OPTIONS = [10, 20, 30];

export default function TabTwoScreen() {
  const [coins, setCoins] = useState<Coin[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [coinLimit, setCoinLimit] = useState(10);
  const [error, setError] = useState<string | null>(null);

  const fetchCoinData = async (limit: number) => {
    // Only set loading/error states if we are not already loading
    if (!isLoading) setIsLoading(true);
    setError(null);
    
    const url = `${BASE_API_URL}&per_page=${limit}`;

    try {
      const response = await fetch(url);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const json: Coin[] = await response.json();
      setCoins(json);
    } catch (e) {
      console.error(e);
      setError("Failed to fetch crypto data.");
    } finally {
      setIsLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      // This will run when the screen is focused AND when coinLimit changes.
      fetchCoinData(coinLimit);
      
      // The return function is cleanup (runs when blurred). We don't need cleanup
      // for this async fetch, so we just return nothing.
    }, [coinLimit]) 
  ); 

  // Function to determine the color of the 24h change text
  const getChangeColors = (percentage: number) => {
    const isPositive = percentage >= 0;
    const sign = percentage > 0 ? '+' : '';
    
    return { 
      text: `${sign}${percentage.toFixed(2)}%`, 
      // Use explicit light/dark colors for positive/negative state
      lightColor: isPositive ? 'green' : 'red',
      darkColor: isPositive ? 'lightgreen' : 'red',
    };
  };

  // --- Render Logic (Unchanged) ---

  if (isLoading) {
    return (
      <ThemedView style={[styles.container, styles.center]}>
        <ActivityIndicator size="large" color="#0000ff" />
        <ThemedText>Loading top {coinLimit} coins...</ThemedText>
      </ThemedView>
    );
  }

  if (error) {
    return (
      <ThemedView style={[styles.container, styles.center]}>
        <ThemedText lightColor="red">{error}</ThemedText>
      </ThemedView>
    );
  }

  return (
    <ThemedView style={styles.container}>
      <ThemedText type="subtitle" style={styles.header}>
        Top {coinLimit} Crypto Markets (USD)
      </ThemedText>
      
      <View style={styles.buttonRowContainer}>
        <ThemedText type="defaultSemiBold" style={styles.buttonLabel}>Show:</ThemedText>
        {COIN_LIMIT_OPTIONS.map((limit) => (
          <TouchableOpacity
            key={limit}
            style={[
              styles.limitButton,
              coinLimit === limit && styles.limitButtonActive,
            ]}
            onPress={() => setCoinLimit(limit)}
          >
            <ThemedText
              type={coinLimit === limit ? "defaultSemiBold" : "default"}
              style={[
                styles.limitButtonText,
                coinLimit === limit && styles.limitButtonTextActive,
              ]}
            >
              {limit}
            </ThemedText>
          </TouchableOpacity>
        ))}
      </View>
      
      <View style={[styles.coinItem, styles.headerRow]}>
          <ThemedText type="defaultSemiBold" style={styles.rank}>#</ThemedText>
          <ThemedText type="defaultSemiBold" style={[styles.nameContainer, { marginLeft: 0 }]}>Coin</ThemedText>
          <ThemedText type="defaultSemiBold" style={styles.change}>24h %</ThemedText>
          <ThemedText type="defaultSemiBold" style={styles.price}>Price</ThemedText>
      </View>

      <FlatList
        data={coins}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => {
          const change = getChangeColors(item.price_change_percentage_24h);
          return (
            <ThemedView style={styles.coinItem}>
              <ThemedText type="defaultSemiBold" style={styles.rank}>{item.market_cap_rank}</ThemedText>
              
              <View style={styles.nameContainer}>
                <Image source={{ uri: item.image }} style={styles.coinImage} />
                <ThemedText type="defaultSemiBold" style={styles.coinName}>
                  {item.name}
                </ThemedText>
              </View>

              <ThemedText 
                type="defaultSemiBold" 
                lightColor={change.lightColor}
                darkColor={change.darkColor}
                style={styles.change}
              >
                {change.text}
              </ThemedText>

              <ThemedText type="defaultSemiBold" style={styles.price}>
                ${item.current_price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </ThemedText>
            </ThemedView>
          );
        }}
      />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 22,
    paddingHorizontal: 10,
  },
  center: {
    justifyContent: "center",
    alignItems: "center",
  },
  header: {
    marginBottom: 10,
    textAlign: "center",
  },
  buttonRowContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
    paddingHorizontal: 5,
  },
  buttonLabel: {
    marginRight: 10,
  },
  limitButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: '#ccc',
    marginRight: 8,
  },
  limitButtonActive: {
    backgroundColor: '#007AFF',
    borderColor: '#007AFF',
  },
  limitButtonText: {},
  limitButtonTextActive: {
    color: '#fff',
  },
  headerRow: {
    paddingVertical: 10,
    borderBottomWidth: 2,
    borderBottomColor: '#aaa',
  },
  coinItem: {
    flexDirection: "row",
    alignItems: 'center',
    paddingVertical: 15,
  },
  rank: {
    width: 30,
    textAlign: 'left',
  },
  coinImage: {
    width: 20,
    height: 20,
    marginRight: 8,
    borderRadius: 10,
  },
  nameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    minWidth: 100,
  },
  coinName: {},
  change: {
    width: 80,
    textAlign: 'right',
  },
  price: {
    width: 90,
    textAlign: 'right',
  },
  errorText: {},
});