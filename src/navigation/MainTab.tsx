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
  BoardsStack: NavigatorScreenParams<StackGeneratorParamList>;
  MessageStack: NavigatorScreenParams<StackGeneratorParamList>;
  ProfileStack: NavigatorScreenParams<StackGeneratorParamList>;
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
      <BottomTab.Screen
        name="MessageStack"
        options={{
          tabBarIcon: ({ focused, color, size }) => (
            <Ionicons
              name={focused ? "ios-chatbubble" : "ios-chatbubble-outline"}
              size={size}
              color={color}
            />
          ),
        }}
      >
        {() => {
          return <StackGenerator screenName="MessageStack" />;
        }}
      </BottomTab.Screen>
      <BottomTab.Screen
        name="ProfileStack"
        options={{
          tabBarIcon: ({ focused, color, size }) => (
            <Ionicons
              name={focused ? "ios-person" : "ios-person-outline"}
              size={size}
              color={color}
            />
          ),
        }}
      >
        {() => {
          return <StackGenerator screenName="ProfileStack" />;
        }}
      </BottomTab.Screen>
    </BottomTab.Navigator>
  );
};

export default MainTab;
