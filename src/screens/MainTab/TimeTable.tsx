import { RouteProp } from "@react-navigation/native";
import React, { useState, useEffect, useContext } from "react";
import { Pressable, Text, View } from "react-native";
import { UserContext } from "../../contexts/userContext";
import { MainTabParamList } from "../../navigation/MainTab";

const TimeTable = ({
  route,
}: {
  route: RouteProp<MainTabParamList, "TimeTable">;
}) => {
  const { user, setUser, setAccessToken, setRefreshToken } =
    useContext(UserContext);

  return (
    <View style={{ paddingTop: 100, display: "flex", alignItems: "center" }}>
      <Text>
        login as {user?.firstName} {user?.lastName}
      </Text>
      <Pressable
        style={({ pressed }) => [
          {
            backgroundColor: pressed ? "rgb(210, 230, 255)" : "white",
          },
          {
            marginTop: 30,
            padding: 10,
          },
        ]}
        onPress={() => {
          setUser(undefined);
          setAccessToken("");
          setRefreshToken("");
        }}
      >
        <Text>logout</Text>
      </Pressable>
    </View>
  );
};

export default TimeTable;
