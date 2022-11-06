import { useNavigation, useRoute } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import {
  Board,
  Boards,
  Post,
  TimeTable,
  WritePost,
} from "../screens/MainTab/index";

import React, { useContext, useEffect } from "react";
import { colors } from "../constants";
import EnrollClasses from "../screens/MainTab/EnrollClasses";
import { HeaderBackButton } from "../components";

export type StackGeneratorParamList = {
  TimeTable: undefined;
  Boards: undefined;
  Board: { id: number; title: string };
  Post: { id: number };
  WritePost: { boardId: number };
  EnrollClasses: undefined;
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
    <Stack.Navigator
      screenOptions={({ route, navigation }) => {
        return {
          headerTintColor: colors.themeColor,
          headerTitleStyle: {
            fontFamily: "Arial Rounded MT Bold",
          },
          headerLeft: () =>
            navigation.getState().routes.length > 1 ? (
              <HeaderBackButton onPress={() => navigation.pop()} />
            ) : null,
        };
      }}
    >
      {screenName === "TimeTableStack" ? (
        <Stack.Screen name="TimeTable" component={TimeTable} />
      ) : null}
      {screenName === "TimeTableStack" ? (
        <Stack.Screen name="EnrollClasses" component={EnrollClasses} />
      ) : null}

      {screenName === "BoardsStack" ? (
        <Stack.Screen name="Boards" component={Boards} />
      ) : null}
      <Stack.Screen name="Board" component={Board} />
      <Stack.Screen name="Post" component={Post} />
      <Stack.Screen name="WritePost" component={WritePost} />
    </Stack.Navigator>
  );
};

export default StackGenerator;
