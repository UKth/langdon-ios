import React, { useState, useContext, useEffect } from "react";
import { RouteProp, useNavigation } from "@react-navigation/core";
import { View } from "react-native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { AuthStackParamList } from "../../navigation/AuthStack";
import { sendPostRequest } from "../../util";
import { Alert } from "react-native";
import { API_URL, colors, messages } from "../../constants";
import { ProgressContext } from "../../contexts/progressContext";
import { MyPressable, ScreenContainer } from "../../components";
import { BoldText, BoldTextInput } from "../../components/StyledText";
import { shadow } from "../../constants/styles";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import * as Notifications from "expo-notifications";

const RequestCollegeSupport = ({
  route,
}: {
  route: RouteProp<AuthStackParamList, "RequestCollegeSupport">;
}) => {
  const [collegeName, setCollegeName] = useState("");
  const [email, setEmail] = useState("");
  const [pushToken, setPushToken] = useState("");

  const { spinner } = useContext(ProgressContext);

  const navigation =
    useNavigation<NativeStackNavigationProp<AuthStackParamList>>();

  const setPushNotificationToken = async () => {
    const token = (await Notifications.getExpoPushTokenAsync()).data;
    setPushToken(token);
  };

  const registerForPushNotificationsAsync = async () => {
    const { status: existingStatus } =
      await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== "granted") {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    if (finalStatus !== "granted") {
      Alert.alert(
        `If you don't grant permission, you will not be notified when your college support begins.
        Restart the app if you want to grant`,
        "",
        [
          {
            text: "Cancel",
            onPress: () => console.log("Cancel Pressed"),
            style: "cancel",
          },
          {
            text: "Grant permission",
            onPress: async () => {
              const { status } = await Notifications.requestPermissionsAsync();
              if (status === "granted") {
                setPushNotificationToken();
              }
            },
          },
        ]
      );
      return;
    } else {
      setPushNotificationToken();
    }
  };

  useEffect(() => {
    registerForPushNotificationsAsync();
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
        <View style={{}}>
          <BoldText
            style={{
              fontSize: 18,
              color: colors.mediumThemeColor,
              marginBottom: 10,
              marginLeft: 10,
            }}
          >
            Enter your email
          </BoldText>
          <BoldTextInput
            style={{
              backgroundColor: "white",
              color: colors.mediumThemeColor,
              paddingHorizontal: 20,
              fontSize: 15,
              borderRadius: 50,
              height: 50,
              marginBottom: "10%",

              ...shadow.md,
            }}
            onChangeText={(text) => setEmail(text.trim())}
            placeholder="ex. badger@wisc.edu"
            placeholderTextColor={colors.lightThemeColor}
            autoCapitalize="none"
          />

          <BoldText
            style={{
              fontSize: 18,
              color: colors.mediumThemeColor,
              marginBottom: 10,
              marginLeft: 10,
            }}
          >
            Enter your college name
          </BoldText>
          <BoldTextInput
            style={{
              backgroundColor: "white",
              color: colors.mediumThemeColor,
              paddingHorizontal: 20,
              fontSize: 15,
              borderRadius: 50,
              height: 50,
              marginBottom: 30,

              ...shadow.md,
            }}
            onChangeText={(text) => setCollegeName(text.trim())}
            placeholder="ex. University of Wisconsin - Madison"
            placeholderTextColor={colors.lightThemeColor}
          />
          <View style={{ alignItems: "center" }}>
            <MyPressable
              style={{
                backgroundColor: colors.mediumThemeColor,
                padding: 10,
                width: "50%",
                borderRadius: 20,
                alignItems: "center",

                marginBottom: 400,

                ...shadow.md,
              }}
              onPress={async () => {
                if (email.length && collegeName.length) {
                  spinner.start();
                  const data = await sendPostRequest(
                    API_URL + "college/requestCollegeSupport",
                    {
                      email,
                      name: collegeName,
                      pushToken,
                    }
                  );
                  spinner.stop();
                  if (data?.ok) {
                    navigation.pop();
                    Alert.alert(
                      "Request sent.",
                      "We'll notice you if we start to support your college."
                    );
                  } else {
                    Alert.alert(
                      "Request Failed.",
                      data?.error ?? "Please try again"
                    );
                  }
                } else {
                  Alert.alert("You have to enter both value");
                }
              }}
            >
              <BoldText style={{ color: "white" }}>{"Request"}</BoldText>
            </MyPressable>
          </View>
        </View>
      </KeyboardAwareScrollView>
    </ScreenContainer>
  );
};

export default RequestCollegeSupport;
