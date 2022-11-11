import { RouteProp, useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import React, { useState, useEffect, useContext } from "react";
import { Alert } from "react-native";
import { API_URL } from "../../constants";
import { postData } from "../../util";
import { LoadingComponent, ScreenContainer } from "../../components";
import { BoldText } from "../../components/StyledText";
import { UserContext } from "../../contexts/userContext";
import { StackGeneratorParamList } from "../../navigation/StackGenerator";

const AddFriend = ({
  route,
}: {
  route: RouteProp<StackGeneratorParamList, "AddFriend">;
}) => {
  const userContext = useContext(UserContext);
  const navigation =
    useNavigation<NativeStackNavigationProp<StackGeneratorParamList>>();

  const { targetId, code } = route.params;

  useEffect(() => {
    (async () => {
      if (targetId && code) {
        const data = await postData(userContext, API_URL + "friend/addFriend", {
          targetId,
          code,
        });
        if (data?.ok) {
          navigation.replace("TimeTable");
          Alert.alert("Friend added.");
        } else {
          navigation.replace("TimeTable");
          Alert.alert(data?.error ?? "Friend add failed.");
        }
      } else {
        navigation.replace("TimeTable");
        Alert.alert("Invalid access");
      }
    })();
  }, []);

  return (
    <ScreenContainer
      style={{ flex: 1, alignItems: "center", justifyContent: "center" }}
    >
      <LoadingComponent />
    </ScreenContainer>
  );
};

export default AddFriend;
