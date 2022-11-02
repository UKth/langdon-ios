import { FontAwesome } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import {
  NavigationContainer,
  DefaultTheme,
  DarkTheme,
} from "@react-navigation/native";
// import { createNativeStackNavigator } from "@react-navigation/native-stack";

import { useEffect, useContext } from "react";
import { Text } from "react-native";
import {
  ACCESS_TOKEN_KEY,
  REFRESH_TOKEN_KEY,
  USER_KEY,
} from "../constants/storageKeys";
import { UserContext } from "../contexts/userContext";
import useCachedResources from "../hooks/useCachedResources";
// import { ColorSchemeName, Pressable } from "react-native";

import AuthStack from "./AuthStack";
import LinkingConfiguration from "./LinkingConfiguration";
import MainTab from "./MainTab";

const Navigation = () => {
  const isLoadingComplete = useCachedResources();
  const { user } = useContext(UserContext);

  useEffect(() => {
    (async () => {
      console.log("data changed,", user);
      if (user) {
        console.log("storing in storage...");
        // AsyncStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
        // AsyncStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
        AsyncStorage.setItem(USER_KEY, JSON.stringify(user));
      }
      if (!user) {
        // AsyncStorage.setItem(ACCESS_TOKEN_KEY, "");
        // AsyncStorage.setItem(REFRESH_TOKEN_KEY, "");
        AsyncStorage.setItem(USER_KEY, "");
      }
    })();
  }, [user]);

  return isLoadingComplete ? (
    <NavigationContainer
      linking={LinkingConfiguration}
      // theme={colorScheme === "dark" ? DarkTheme : DefaultTheme}
    >
      {user ? <MainTab /> : <AuthStack />}
    </NavigationContainer>
  ) : (
    <Text>Loading...</Text>
  );
};

export default Navigation;

/**
 * A root stack navigator is often used for displaying modals on top of all other content.
 * https://reactnavigation.org/docs/modal
 */
