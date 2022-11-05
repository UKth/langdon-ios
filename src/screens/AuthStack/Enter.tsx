import React, { useState, useEffect, useContext } from "react";

import { RouteProp, useNavigation } from "@react-navigation/core";
import tw from "twrnc";
import { Keyboard, Pressable, Text, TextInput, View } from "react-native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { AuthStackParamList } from "../../navigation/AuthStack";
import { sendPostRequest } from "../../util";
import { API_URL } from "../../constants/urls";
import { Alert } from "react-native";
import { UserContext } from "../../contexts/userContext";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  ACCESS_TOKEN_KEY,
  REFRESH_TOKEN_KEY,
  USER_KEY,
} from "../../constants/storageKeys";
import ScreenContainer from "../../components/ScreenContainer";
import { BoldText, BoldTextInput } from "../../components/StyledText";
import { colors } from "../../constants/Colors";
import { ProgressContext } from "../../contexts/Progress";
import { messages } from "../../constants/messages";

const sendCode = async (email: string) => {
  const data = await sendPostRequest(API_URL + "user/sendCode", { email });
  if (!data?.ok) {
    Alert.alert(data?.error);
  }
  return data;
};

const getTokens = async (registerData: {
  email: string;
  firstName?: string;
  lastName?: string;
  code: number;
  userId?: number;
}) => {
  const data = await sendPostRequest(API_URL + "user/enter", registerData);

  return data;
};

const Enter = ({
  route,
}: {
  route: RouteProp<AuthStackParamList, "Enter">;
}) => {
  const { college } = route.params;
  const [netId, setNetId] = useState("");
  const [codeSent, setCodeSent] = useState(false);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [code, setCode] = useState("");
  const [userId, setUserId] = useState();

  const { setUser } = useContext(UserContext);
  const { spinner } = useContext(ProgressContext);

  return (
    <ScreenContainer>
      <View
        style={{
          paddingHorizontal: 30,
          paddingTop: "25%",
        }}
      >
        <BoldText
          style={{
            fontSize: 24,
            color: colors.themeColor,
            marginBottom: "13%",
          }}
        >
          Enter your email
        </BoldText>
        <View style={{ alignItems: "center" }}>
          <View
            style={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              paddingHorizontal: 20,
              backgroundColor: colors.lightThemeColor,
              borderRadius: 50,
              height: 50,
              marginBottom: 30,
              width: "80%",
            }}
          >
            <BoldTextInput
              style={{
                flex: 1,
                fontSize: 20,
                color: "white",
                marginRight: 5,
              }}
              onChangeText={(text) => setNetId(text.trim())}
              autoCapitalize="none"
              textAlign="right"
            />
            <BoldText style={{ flex: 1, fontSize: 18, color: "white" }}>
              @{college.mailFooter}
            </BoldText>
          </View>

          <Pressable
            style={({ pressed }) => [
              {
                opacity: pressed ? 0.5 : 0.8,
              },
              {
                backgroundColor: colors.themeColor,
                padding: 10,
                width: "40%",
                borderRadius: 20,
                alignItems: "center",
                marginBottom: "20%",
              },
            ]}
            onPress={async () => {
              if (netId.length) {
                spinner.start();
                const data = await sendCode(netId + "@" + college.mailFooter);
                spinner.stop();
                if (data?.ok) {
                  Alert.alert(messages.messages.login.mailSent);
                  setCodeSent(true);
                  if (data?.user) {
                    setUserId(data.user.id);
                  }
                  Keyboard.dismiss();
                } else {
                  Alert.alert(data.error);
                }
              }
            }}
          >
            <BoldText style={{ paddingHorizontal: 10 }}>Send Token</BoldText>
          </Pressable>

          {codeSent ? (
            <View style={{ alignItems: "center", width: "70%" }}>
              {!userId ? (
                <BoldTextInput
                  style={{
                    width: "100%",
                    paddingHorizontal: 20,
                    fontSize: 20,
                    backgroundColor: colors.lightThemeColor,
                    borderRadius: 50,
                    height: 50,
                    color: "white",
                    marginBottom: 10,
                  }}
                  onChangeText={(text) => setFirstName(text.trim())}
                  placeholder="first name"
                  placeholderTextColor={colors.placeHolerTextColor}
                />
              ) : null}
              {!userId ? (
                <BoldTextInput
                  style={{
                    width: "100%",
                    paddingHorizontal: 20,
                    fontSize: 20,
                    backgroundColor: colors.lightThemeColor,
                    borderRadius: 50,
                    height: 50,
                    color: "white",
                    marginBottom: 10,
                  }}
                  onChangeText={(text) => setLastName(text.trim())}
                  placeholder="last name"
                  placeholderTextColor={colors.placeHolerTextColor}
                />
              ) : null}
              <BoldTextInput
                style={{
                  width: "100%",
                  paddingHorizontal: 20,
                  fontSize: 20,
                  backgroundColor: colors.lightThemeColor,
                  borderRadius: 50,
                  height: 50,
                  color: "white",
                  marginBottom: 30,
                }}
                onChangeText={(text) => setCode(text.trim())}
                keyboardType="number-pad"
                placeholder="Verification code"
                placeholderTextColor={colors.placeHolerTextColor}
              />

              <Pressable
                style={({ pressed }) => [
                  {
                    opacity: pressed ? 0.5 : 0.8,
                  },
                  {
                    backgroundColor: colors.themeColor,
                    padding: 10,
                    width: "50%",
                    borderRadius: 20,
                    alignItems: "center",
                  },
                ]}
                onPress={async () => {
                  if (netId.length) {
                    spinner.start();
                    const data = await getTokens({
                      email: netId + "@" + college.mailFooter,
                      code: +code,
                      ...(userId
                        ? {
                            userId,
                          }
                        : { firstName, lastName }),
                    });
                    spinner.stop();
                    if (data?.ok) {
                      if (data.refreshToken && data.accessToken && data.user) {
                        accessToken = data.accessToken;
                        refreshToken = data.refreshToken;
                        await AsyncStorage.setItem(
                          ACCESS_TOKEN_KEY,
                          data.accessToken
                        );
                        await AsyncStorage.setItem(
                          REFRESH_TOKEN_KEY,
                          data.refreshToken
                        );
                        setUser(data.user);
                      }
                    } else {
                      Alert.alert(data.error);
                    }
                  }
                }}
              >
                <BoldText>{userId ? "Enter" : "Register"}</BoldText>
              </Pressable>
            </View>
          ) : null}
        </View>
      </View>
    </ScreenContainer>
  );
};

export default Enter;
