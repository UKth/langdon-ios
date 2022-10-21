import { StatusBar } from "expo-status-bar";
import { useContext } from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { UserContext, UserProvider } from "./contexts/userContext";

// import useCachedResources from './hooks/useCachedResources';
// import useColorScheme from './hooks/useColorScheme';
import Navigation from "./navigation";

export default function App() {
  // const colorScheme = useColorScheme();

  return (
    <SafeAreaProvider>
      <UserProvider>
        <Navigation />
      </UserProvider>
      <StatusBar />
    </SafeAreaProvider>
  );
}
