import { FlatList, StyleSheet, Text, TextInput, View } from "react-native";
import "react-native-get-random-values";
import { v4 as uuid } from "uuid";

import { theme } from "../theme";
import { ShoppingListItem } from "../components/ShoppingListItem";
import { useState } from "react";

type ShoppingListItemType = {
  id: string;
  name: string;
  complete: boolean;
};

export default function App() {
  const [newItem, setNewItem] = useState("");
  const [shoppingList, setShoppingList] = useState<ShoppingListItemType[]>([]);

  const handleOnChangeText = (val: string) => setNewItem(val);

  const handleOnSubmit = () => {
    if (Boolean(newItem)) {
      const itemToAdd = { id: uuid(), name: newItem, complete: false };

      setShoppingList((prev) => [...prev, itemToAdd]);
    }
  };

  return (
    <FlatList
      data={shoppingList}
      stickyHeaderIndices={[0]}
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
      ListEmptyComponent={() => (
        <View style={styles.emptyContainer}>
          <Text>The shopping list is empty</Text>
        </View>
      )}
      ListHeaderComponent={
        <TextInput
          style={styles.textInput}
          placeholder="E.g. Coffe"
          value={newItem}
          onChangeText={handleOnChangeText}
          returnKeyType="done"
          onSubmitEditing={handleOnSubmit}
        />
      }
      renderItem={({ item }) => {
        return (
          <ShoppingListItem name={item.name} isCompleted={item.complete} />
        );
      }}
    />
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colorWhite,
    padding: 12,
  },
  contentContainer: {
    paddingBottom: 24,
  },
  textInput: {
    borderColor: theme.colorLightGray,
    borderWidth: 2,
    padding: 12,
    marginHorizontal: 12,
    marginBottom: 12,
    fontSize: 18,
    borderRadius: 50,
    backgroundColor: theme.colorWhite,
  },
  emptyContainer: {
    justifyContent: "center",
    alignItems: "center",
    marginVertical: 18,
  },
});
