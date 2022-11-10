import { User } from "@customTypes/models";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import TimeTable from "../screens/MainTab/TimeTable";
import React from "react";
import StackGenerator, { StackGeneratorParamList } from "./StackGenerator";
import { Ionicons } from "@expo/vector-icons";
import { colors } from "../constants";
import { NavigatorScreenParams } from "@react-navigation/native";

export type MainTabParamList = {
  TimeTableStack: NavigatorScreenParams<StackGeneratorParamList>;
  BoardsStack: undefined;
};

const BottomTab = createBottomTabNavigator<MainTabParamList>();

const MainTab = () => {
  return (
    <BottomTab.Navigator
      initialRouteName="TimeTableStack"
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        tabBarActiveTintColor: colors.mediumThemeColor,
        tabBarInactiveTintColor: "black",
      }}
    >
      <BottomTab.Screen
        name="TimeTableStack"
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="ios-calendar-sharp" size={size} color={color} />
          ),
        }}
      >
        {() => {
          return <StackGenerator screenName="TimeTableStack" />;
        }}
      </BottomTab.Screen>
      <BottomTab.Screen
        name="BoardsStack"
        options={{
          tabBarIcon: ({ focused, color, size }) => (
            <Ionicons
              name={focused ? "ios-reader" : "ios-reader-outline"}
              size={size}
              color={color}
            />
          ),
        }}
      >
        {() => {
          return <StackGenerator screenName="BoardsStack" />;
        }}
      </BottomTab.Screen>
    </BottomTab.Navigator>
  );
};

export default MainTab;
