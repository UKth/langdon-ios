import { User } from "@customTypes/models";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import TimeTable from "../screens/MainTab/TimeTable";
import React from "react";
import StackGenerator from "./StackGenerator";

export type MainTabParamList = {
  TimeTable: undefined;
  Boards: undefined;
};

const BottomTab = createBottomTabNavigator<MainTabParamList>();

const MainTab = () => {
  return (
    <BottomTab.Navigator
      initialRouteName="TimeTable"
      screenOptions={{
        headerShown: false,
      }}
    >
      <BottomTab.Screen name="TimeTable">
        {() => {
          return <StackGenerator screenName="TimeTable" />;
        }}
      </BottomTab.Screen>
      <BottomTab.Screen name="Boards">
        {() => {
          return <StackGenerator screenName="Boards" />;
        }}
      </BottomTab.Screen>
    </BottomTab.Navigator>
  );
};

export default MainTab;
