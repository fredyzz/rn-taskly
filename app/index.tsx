import {
  FlatList,
  StyleSheet,
  Text,
  TextInput,
  View,
  LayoutAnimation,
} from "react-native";
import "react-native-get-random-values";
import { v4 as uuid } from "uuid";
import * as Haptics from "expo-haptics";
import { theme } from "../theme";
import { ShoppingListItem } from "../components/ShoppingListItem";
import { useEffect, useState } from "react";
import { ShoppingListItemType } from "../types/shoppingListItem";
import { orderShoppingList } from "../utils/orderShoppingList";
import { getFromStorage, saveToStorage } from "../utils/storage";
import { STORAGE_KEY } from "../consts/storage";

export default function App() {
  const [newItem, setNewItem] = useState("");
  const [shoppingList, setShoppingList] = useState<ShoppingListItemType[]>([]);

  useEffect(() => {
    const getInitialData = async () => {
      const data = await getFromStorage(STORAGE_KEY);
      if (data) {
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
        setShoppingList(data);
      }
    };

    getInitialData();
  }, []);

  const handleOnChangeText = (val: string) => setNewItem(val);

  const handleOnSubmit = () => {
    if (Boolean(newItem)) {
      const itemToAdd = {
        id: uuid(),
        name: newItem,
        lastUpdatedTimestamp: Date.now(),
      };

      const updatedShoppingList = [...shoppingList, itemToAdd];

      setShoppingList(updatedShoppingList);
      saveToStorage(STORAGE_KEY, updatedShoppingList);
      LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
      setNewItem("");
    }
  };

  const handleOnDelete = (itemId: string) => {
    const updatedShoppingList = shoppingList.filter(
      (item) => item.id !== itemId
    );

    setShoppingList(updatedShoppingList);
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    saveToStorage(STORAGE_KEY, updatedShoppingList);
  };

  const handleOnToggleComplete = (itemId: string) => {
    const updatedShoppingList = shoppingList.map((item) => {
      if (item.id === itemId) {
        if (item.completedAtTimestamp) {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        } else {
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        }
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
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    saveToStorage(STORAGE_KEY, updatedShoppingList);
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
