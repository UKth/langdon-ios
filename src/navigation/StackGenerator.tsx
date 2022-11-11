import { useNavigation, useRoute } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import {
  Board,
  Boards,
  Post,
  TimeTable,
  WritePost,
  Friends,
  FriendTable,
  AddFriend,
  Profile,
  SendFirstMessage,
  Chatrooms,
} from "../screens/MainTab";

import React, { useContext, useEffect } from "react";
import { colors } from "../constants";
import EnrollClasses from "../screens/MainTab/EnrollClasses";
import { HeaderBackButton, MyPressable } from "../components";
import { Ionicons } from "@expo/vector-icons";

export type StackGeneratorParamList = {
  TimeTable: undefined;
  Boards: undefined;
  Board: { id: number; title: string };
  Post: { id: number };
  WritePost: { boardId: number };
  EnrollClasses: undefined;
  Friends: undefined;
  FriendTable: { id: number; nameString: string };
  AddFriend: { targetId?: number; code?: number };
  SendFirstMessage: { targetId: number; postId?: number };
  Chatrooms: undefined;
  Profile: undefined;
};

export interface StackGeneratorProps {
  screenName:
    | "TimeTableStack"
    | "BoardsStack"
    | "MessageStack"
    | "ProfileStack";
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
          headerTintColor: colors.mediumThemeColor,
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
      <Stack.Group>
        {screenName === "TimeTableStack" ? (
          <Stack.Screen name="TimeTable" component={TimeTable} />
        ) : null}
        {screenName === "TimeTableStack" ? (
          <Stack.Screen name="EnrollClasses" component={EnrollClasses} />
        ) : null}

        {screenName === "BoardsStack" ? (
          <Stack.Screen name="Boards" component={Boards} />
        ) : null}
        {screenName === "MessageStack" ? (
          <Stack.Screen name="Chatrooms" component={Chatrooms} /> // TODO
        ) : null}
        {screenName === "ProfileStack" ? (
          <Stack.Screen name="Profile" component={Profile} />
        ) : null}
        <Stack.Screen name="Board" component={Board} />
        <Stack.Screen name="Post" component={Post} />
        <Stack.Screen
          name="WritePost"
          component={WritePost}
          options={{ title: "New post" }}
        />
        <Stack.Screen name="Friends" component={Friends} />
        <Stack.Screen
          name="FriendTable"
          component={FriendTable}
          options={({ route }) => ({ title: route.params.nameString })}
        />
        <Stack.Screen name="AddFriend" component={AddFriend} />
      </Stack.Group>
      <Stack.Group screenOptions={{ presentation: "modal" }}>
        <Stack.Screen
          name="SendFirstMessage"
          component={SendFirstMessage}
          options={({ navigation }) => ({
            headerLeft: () => (
              <MyPressable onPress={() => navigation.pop()}>
                <Ionicons name="close" size={20} />
              </MyPressable>
            ),
          })}
        />
      </Stack.Group>
    </Stack.Navigator>
  );
};

export default StackGenerator;
