import { StatusBar } from "expo-status-bar";
import { useContext } from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { ProgressProvider } from "./contexts/Progress";
import { UserContext, UserProvider } from "./contexts/userContext";

// import useCachedResources from './hooks/useCachedResources';
// import useColorScheme from './hooks/useColorScheme';
import Navigation from "./navigation";

export default function App() {
  // const colorScheme = useColorScheme();

  return (
    <SafeAreaProvider>
      <StatusBar style="dark" />
      <ProgressProvider>
        <UserProvider>
          <Navigation />
        </UserProvider>
      </ProgressProvider>
    </SafeAreaProvider>
  );
}
