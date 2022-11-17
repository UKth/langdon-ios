import { RouteProp, useNavigation } from "@react-navigation/native";
import React, { useEffect, useContext } from "react";
import { View, ViewProps } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { getNameString, logout, postData } from "../../util";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { StackGeneratorParamList } from "../../navigation/StackGenerator";
import { UserContext } from "../../contexts/userContext";
import { Ionicons } from "@expo/vector-icons";
import {
  ErrorComponent,
  Logout,
  MyPressable,
  ProfileCard,
  ScreenContainer,
} from "../../components";
import { API_URL, colors, styles } from "../../constants";
import { BoldText } from "../../components/StyledText";
import { shadow } from "../../constants/styles";

const Profile = () => {
  const navigation =
    useNavigation<NativeStackNavigationProp<StackGeneratorParamList>>();

  const userContext = useContext(UserContext);
  const user = userContext.user;

  if (!user) {
    return <ErrorComponent />;
  }

  return (
    <ScreenContainer style={{ backgroundColor: "rgba(255,255,255,1)" }}>
      <KeyboardAwareScrollView
        style={{
          paddingTop: "5%",
          paddingHorizontal: "5%",
        }}
      >
        <ProfileCard user={user} />
        <MyPressable
          style={{
            paddingVertical: 13,
            paddingHorizontal: 15,
            backgroundColor: "white",

            ...shadow.md,

            borderColor: colors.themeColor,
            borderRadius: styles.borderRadius.md,
            marginBottom: 10,
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
          }}
          onPress={() => navigation.push("MyPosts")}
        >
          <View style={{ maxWidth: "75%" }}>
            <BoldText
              numberOfLines={1}
              style={{
                color: colors.themeColor,
                fontSize: 14,
                marginBottom: 2,
              }}
            >
              My posts
            </BoldText>
          </View>
        </MyPressable>
        <MyPressable
          style={{
            paddingVertical: 13,
            paddingHorizontal: 15,
            backgroundColor: "white",

            ...shadow.md,

            borderColor: colors.themeColor,
            borderRadius: styles.borderRadius.md,
            marginBottom: 15,
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
          }}
          onPress={() => navigation.push("MyComments")}
        >
          <View style={{ maxWidth: "75%" }}>
            <BoldText
              numberOfLines={1}
              style={{
                color: colors.themeColor,
                fontSize: 14,
                marginBottom: 2,
              }}
            >
              My comments
            </BoldText>
          </View>
        </MyPressable>
        <Logout />
      </KeyboardAwareScrollView>
    </ScreenContainer>
  );
};

export default Profile;
