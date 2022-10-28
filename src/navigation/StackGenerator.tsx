import { useNavigation, useRoute } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Board from "../screens/MainTab/Board";
import Boards from "../screens/MainTab/Boards";
import TimeTable from "../screens/MainTab/TimeTable";
import React, { useContext, useEffect } from "react";

export type StackGeneratorParamList = {
  TimeTable: undefined;
  Boards: undefined;
  Board: { id: number; title: string };
};

export interface StackGeneratorProps {
  screenName: string;
}

const Stack = createNativeStackNavigator<StackGeneratorParamList>();

const StackGenerator = ({ screenName }: StackGeneratorProps) => {
  const navigation = useNavigation();
  const route = useRoute();

  // const focused = getFocusedRouteNameFromRoute(route) ?? screenName;
  // const { width } = useWindowDimensions();

  return (
    <Stack.Navigator>
      {screenName === "TimeTable" ? (
        <Stack.Screen name="TimeTable" component={TimeTable} />
      ) : null}
      {screenName === "Boards" ? (
        <Stack.Screen name="Boards" component={Boards} />
      ) : null}
      <Stack.Screen name="Board" component={Board} />
    </Stack.Navigator>
  );
};

export default StackGenerator;
