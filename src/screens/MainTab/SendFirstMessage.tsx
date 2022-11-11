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

const SendFirstMessage = ({
  route,
}: {
  route: RouteProp<StackGeneratorParamList, "SendFirstMessage">;
}) => {
  const userContext = useContext(UserContext);
  const navigation =
    useNavigation<NativeStackNavigationProp<StackGeneratorParamList>>();

  const { targetId } = route.params;

  useEffect(() => {}, []);

  return (
    <ScreenContainer
      style={{ flex: 1, alignItems: "center", justifyContent: "center" }}
    >
      <LoadingComponent />
    </ScreenContainer>
  );
};

export default SendFirstMessage;
