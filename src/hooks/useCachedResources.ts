import { FontAwesome } from "@expo/vector-icons";
import * as Font from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import { useContext, useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { UserContext } from "../contexts/userContext";
import {
  ACCESS_TOKEN_KEY,
  REFRESH_TOKEN_KEY,
  USER_KEY,
} from "../constants/storageKeys";

export default function useCachedResources() {
  const [isLoadingComplete, setLoadingComplete] = useState(false);
  const { setUser } = useContext(UserContext);

  // Load any resources or data that we need prior to rendering the app
  useEffect(() => {
    async function loadResourcesAndDataAsync() {
      try {
        SplashScreen.preventAutoHideAsync();

        accessToken =
          (await AsyncStorage.getItem(ACCESS_TOKEN_KEY)) || undefined;

        refreshToken =
          (await AsyncStorage.getItem(REFRESH_TOKEN_KEY)) || undefined;

        const userString = await AsyncStorage.getItem(USER_KEY);
        console.log("storage userString:", userString);
        if (userString) {
          setUser(JSON.parse(userString));
        }

        // Load fonts
        await Font.loadAsync({
          ...FontAwesome.font,
          "space-mono": require("../../assets/fonts/SpaceMono-Regular.ttf"),
        });
      } catch (e) {
        // We might want to provide this error information to an error reporting service
        console.warn(e);
      } finally {
        setLoadingComplete(true);
        SplashScreen.hideAsync();
      }
    }

    loadResourcesAndDataAsync();
  }, []);

  return isLoadingComplete;
}
