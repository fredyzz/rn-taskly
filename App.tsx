import { StyleSheet, Text, View } from "react-native";
import { theme } from "./theme";

export default function App() {
  return (
    <View style={styles.container}>
      <View style={styles.itemContainer}>
        <Text style={styles.itemText}>Coffe</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colorWhite,
    justifyContent: "center",
  },
  itemContainer: {
    paddingHorizontal: 8,
    paddingVertical: 16,
    borderBottomColor: theme.colorCerulen,
    borderBottomWidth: 1,
  },
  itemText: { fontSize: 18, fontWeight: 200 },
});
