import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { useEffect, useState } from "react";
import { ActivityIndicator, FlatList, Image, StyleSheet, TouchableOpacity, View } from "react-native";

// The base URL for the CoinGecko API
const BASE_API_URL = "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&page=1";

// Type definition (unchanged)
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

// Available options for the "Show" buttons
const COIN_LIMIT_OPTIONS = [10, 20, 30];

export default function TabTwoScreen() {
  const [coins, setCoins] = useState<Coin[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [coinLimit, setCoinLimit] = useState(10);
  const [error, setError] = useState<string | null>(null);

  const fetchCoinData = async (limit: number) => {
    setIsLoading(true);
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

  useEffect(() => {
    fetchCoinData(coinLimit);
  }, [coinLimit]); 

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

  // --- Render Logic ---

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
        {/* Changed style prop to lightColor for error text */}
        <ThemedText lightColor="red">{error}</ThemedText>
      </ThemedView>
    );
  }

  return (
    <ThemedView style={styles.container}>
      {/* Changed style prop to type="subtitle" for the main header */}
      <ThemedText type="subtitle" style={styles.header}>
        Top {coinLimit} Crypto Markets (USD)
      </ThemedText>
      
      {/* Button Row for Coin Limit */}
      <View style={styles.buttonRowContainer}>
        {/* Changed style prop to type="defaultSemiBold" */}
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
            {/* Changed style prop to type="defaultSemiBold" on active state */}
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
      
      {/* Header Row for FlatList */}
      <View style={[styles.coinItem, styles.headerRow]}>
          {/* Using type="defaultSemiBold" for column headers */}
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
              {/* 1. Market Cap Rank - Using type="defaultSemiBold" */}
              <ThemedText type="defaultSemiBold" style={styles.rank}>{item.market_cap_rank}</ThemedText>
              
              {/* 2. Coin Image and Name */}
              <View style={styles.nameContainer}>
                <Image source={{ uri: item.image }} style={styles.coinImage} />
                {/* Coin Name - Using type="defaultSemiBold" */}
                <ThemedText type="defaultSemiBold" style={styles.coinName}>
                  {item.name}
                </ThemedText>
              </View>

              {/* 3. 24h Price Change Percentage - Using light/darkColor prop */}
              <ThemedText 
                type="defaultSemiBold" 
                lightColor={change.lightColor}
                darkColor={change.darkColor}
                style={styles.change}
              >
                {change.text}
              </ThemedText>

              {/* 4. Current Price - Using type="defaultSemiBold" */}
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
  // Keep the header style for specific alignment/margins not covered by type="subtitle"
  header: {
    marginBottom: 10,
    textAlign: "center",
  },
  // --- Button Row Styles (Unchanged) ---
  buttonRowContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
    paddingHorizontal: 5,
  },
  // Keep the button label style for specific margins/alignment
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
  // We keep this style to override the color of the active text to white
  limitButtonText: {
    // No font size/weight here, relying on type prop
  },
  limitButtonTextActive: {
    color: '#fff',
  },
  // --- List Item Styles ---
  headerRow: {
    paddingVertical: 10,
    borderBottomWidth: 2,
    borderBottomColor: '#aaa',
  },
  // Removed headerText style, relying on type="defaultSemiBold"
  coinItem: {
    flexDirection: "row",
    alignItems: 'center',
    paddingVertical: 15,
  },
  // Keep these styles for layout (width/alignment)
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
  coinName: {
    // No style props needed here, relying on type="defaultSemiBold"
  },
  change: {
    width: 80,
    textAlign: 'right',
  },
  price: {
    width: 90,
    textAlign: 'right',
  },
  errorText: {
    // No style props needed here, relying on lightColor="red"
  },
});