import { User } from "@customTypes/models";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import TimeTable from "../screens/MainTab/TimeTable";
import React from "react";

export type MainTabParamList = {
  TimeTable: undefined;
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
      <BottomTab.Screen name="TimeTable" component={TimeTable} />
    </BottomTab.Navigator>
  );
};

export default MainTab;
