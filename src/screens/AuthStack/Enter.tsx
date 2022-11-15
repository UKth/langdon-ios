import React, { useState, useContext, useEffect } from "react";

import { RouteProp } from "@react-navigation/core";
import { Keyboard, KeyboardAvoidingView, Pressable, View } from "react-native";
import { AuthStackParamList } from "../../navigation/AuthStack";
import { sendPostRequest } from "../../util";
import { Alert } from "react-native";
import { UserContext } from "../../contexts/userContext";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  ACCESS_TOKEN_KEY,
  API_URL,
  colors,
  messages,
  REFRESH_TOKEN_KEY,
} from "../../constants";
import { ProgressContext } from "../../contexts/progressContext";
import { ScreenContainer } from "../../components";
import { BoldText, BoldTextInput } from "../../components/StyledText";
import { shadow } from "../../constants/styles";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import * as Notifications from "expo-notifications";

const sendCode = async (email: string) => {
  const data = await sendPostRequest(API_URL + "user/sendCode", { email });
  if (!data?.ok) {
    Alert.alert("Failed to send verification code.\n" + data?.error);
  }
  return data;
};

const getTokens = async (registerData: {
  email: string;
  firstName?: string;
  lastName?: string;
  code: number;
  userId?: number;
  pushToken: string;
}) => {
  const data = await sendPostRequest(API_URL + "user/enter", registerData);

  return data;
};

// Notifications.setNotificationHandler({
//   handleNotification: async () => ({
//     shouldShowAlert: true,
//     shouldPlaySound: false,
//     shouldSetBadge: false,
//   }),
// });

const Enter = ({
  route,
}: {
  route: RouteProp<AuthStackParamList, "Enter">;
}) => {
  const { college } = route.params;
  const [netId, setNetId] = useState("");
  const [codeSent, setCodeSent] = useState(false);
  const [firstName, setFirstName] = useState("");
  const [middleName, setMiddleName] = useState("");
  const [lastName, setLastName] = useState("");
  const [code, setCode] = useState("");
  const [userId, setUserId] = useState();
  const [pushToken, setPushToken] = useState("");

  const { setUser } = useContext(UserContext);
  const { spinner } = useContext(ProgressContext);

  useEffect(() => {
    (async () => {
      const token = (await Notifications.getExpoPushTokenAsync()).data;
      setPushToken(token);
    })();
  }, []);

  return (
    <ScreenContainer>
      <KeyboardAwareScrollView
        extraScrollHeight={80}
        style={{
          paddingHorizontal: 30,
          paddingTop: "25%",
        }}
      >
        <BoldText
          style={{
            fontSize: 24,
            color: colors.mediumThemeColor,
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

              ...shadow.md,
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
            <BoldText style={{ color: "white", flex: 1, fontSize: 18 }}>
              @{college.mailFooter}
            </BoldText>
          </View>

          <Pressable
            style={({ pressed }) => [
              {
                opacity: pressed ? 0.5 : 0.8,
              },
              {
                backgroundColor: colors.mediumThemeColor,
                padding: 10,
                width: "40%",
                borderRadius: 20,
                alignItems: "center",
                marginBottom: "20%",

                ...shadow.md,
              },
            ]}
            onPress={async () => {
              if (netId.length) {
                spinner.start();
                const data = await sendCode(netId + "@" + college.mailFooter);
                spinner.stop();
                if (data?.ok) {
                  Alert.alert(
                    messages.messages.login.mailSent[0],
                    messages.messages.login.mailSent[1]
                  );
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
            <BoldText style={{ color: "white", paddingHorizontal: 10 }}>
              Send Code
            </BoldText>
          </Pressable>

          {codeSent ? (
            <View style={{ alignItems: "center", width: "75%" }}>
              {!userId ? (
                <BoldTextInput
                  style={{
                    width: "100%",
                    paddingHorizontal: 20,
                    fontSize: 17,
                    backgroundColor: colors.lightThemeColor,
                    borderRadius: 50,
                    height: 50,
                    color: "white",
                    marginBottom: 10,

                    ...shadow.md,
                  }}
                  onChangeText={(text) =>
                    setFirstName(text.trim().toLowerCase())
                  }
                  placeholder="First name"
                  placeholderTextColor={colors.placeHolerTextColor}
                />
              ) : null}
              {!userId ? (
                <BoldTextInput
                  style={{
                    width: "100%",
                    paddingHorizontal: 20,
                    fontSize: 17,
                    backgroundColor: colors.lightThemeColor,
                    borderRadius: 50,
                    height: 50,
                    color: "white",
                    marginBottom: 10,

                    ...shadow.md,
                  }}
                  onChangeText={(text) =>
                    setMiddleName(text.trim().toLowerCase())
                  }
                  placeholder="Middle name(optional)"
                  placeholderTextColor={colors.placeHolerTextColor}
                />
              ) : null}
              {!userId ? (
                <BoldTextInput
                  style={{
                    width: "100%",
                    paddingHorizontal: 20,
                    fontSize: 17,
                    backgroundColor: colors.lightThemeColor,
                    borderRadius: 50,
                    height: 50,
                    color: "white",
                    marginBottom: 10,

                    ...shadow.md,
                  }}
                  onChangeText={(text) =>
                    setLastName(text.trim().toLowerCase())
                  }
                  placeholder="Last name"
                  placeholderTextColor={colors.placeHolerTextColor}
                />
              ) : null}
              <BoldTextInput
                style={{
                  width: "100%",
                  paddingHorizontal: 20,
                  fontSize: 17,
                  backgroundColor: colors.lightThemeColor,
                  borderRadius: 50,
                  height: 50,
                  color: "white",
                  marginBottom: 30,

                  ...shadow.md,
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
                    backgroundColor: colors.mediumThemeColor,
                    padding: 10,
                    width: "50%",
                    borderRadius: 20,
                    alignItems: "center",

                    marginBottom: 400,

                    ...shadow.md,
                  },
                ]}
                onPress={async () => {
                  if (netId.length) {
                    spinner.start();
                    const data = await getTokens({
                      email: netId + "@" + college.mailFooter,
                      code: +code,
                      pushToken,
                      ...(userId
                        ? {
                            userId,
                          }
                        : { firstName, middleName, lastName }),
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
                <BoldText style={{ color: "white" }}>
                  {userId ? "Enter" : "Register"}
                </BoldText>
              </Pressable>
            </View>
          ) : null}
        </View>
      </KeyboardAwareScrollView>
    </ScreenContainer>
  );
};

export default Enter;
