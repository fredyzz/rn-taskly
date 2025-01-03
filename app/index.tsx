import { FlatList, StyleSheet, Text, TextInput, View } from "react-native";
import "react-native-get-random-values";
import { v4 as uuid } from "uuid";

import { theme } from "../theme";
import { ShoppingListItem } from "../components/ShoppingListItem";
import { useState } from "react";
import { ShoppingListItemType } from "../types/shoppingListItem";
import { orderShoppingList } from "../utils/orderShoppintList";

export default function App() {
  const [newItem, setNewItem] = useState("");
  const [shoppingList, setShoppingList] = useState<ShoppingListItemType[]>([]);

  const handleOnChangeText = (val: string) => setNewItem(val);

  const handleOnSubmit = () => {
    if (Boolean(newItem)) {
      const itemToAdd = {
        id: uuid(),
        name: newItem,
        lastUpdatedTimestamp: Date.now(),
      };

      setShoppingList((prev) => [...prev, itemToAdd]);
    }
  };

  const handleOnDelete = (itemId: string) => {
    const updatedShoppingList = shoppingList.filter(
      (item) => item.id !== itemId
    );

    setShoppingList(updatedShoppingList);
  };

  const handleOnToggleComplete = (itemId: string) => {
    const updatedShoppingList = shoppingList.map((item) => {
      if (item.id === itemId) {
        return {
          ...item,
          lastUpdatedTimestamp: Date.now(),
          completedAtTimestamp: item?.completedAtTimestamp
            ? undefined
            : Date.now(),
        };
      }

      return item;
    });

    setShoppingList(updatedShoppingList);
  };

  return (
    <FlatList
      data={orderShoppingList(shoppingList)}
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
          <ShoppingListItem
            name={item.name}
            isCompleted={Boolean(item.completedAtTimestamp)}
            onDelete={() => handleOnDelete(item.id)}
            onToggleComplete={() => handleOnToggleComplete(item.id)}
          />
        );
      }}
    />
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colorWhite,
    paddingVertical: 12,
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
