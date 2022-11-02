import { User } from "@customTypes/models";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import TimeTable from "../screens/MainTab/TimeTable";
import React from "react";
import StackGenerator from "./StackGenerator";

export type MainTabParamList = {
  TimeTableStack: undefined;
  BoardsStack: undefined;
};

const BottomTab = createBottomTabNavigator<MainTabParamList>();

const MainTab = () => {
  return (
    <BottomTab.Navigator
      initialRouteName="TimeTableStack"
      screenOptions={{
        headerShown: false,
      }}
    >
      <BottomTab.Screen name="TimeTableStack">
        {() => {
          return <StackGenerator screenName="TimeTableStack" />;
        }}
      </BottomTab.Screen>
      <BottomTab.Screen name="BoardsStack">
        {() => {
          return <StackGenerator screenName="BoardsStack" />;
        }}
      </BottomTab.Screen>
    </BottomTab.Navigator>
  );
};

export default MainTab;
