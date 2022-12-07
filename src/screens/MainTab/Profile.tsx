import { RouteProp, useNavigation } from "@react-navigation/native";
import React, { useEffect, useContext } from "react";
import { Linking, View, ViewProps } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { getNameString, logout, postData } from "../../util";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { StackGeneratorParamList } from "../../navigation/StackGenerator";
import { UserContext } from "../../contexts/userContext";
import {
  ErrorComponent,
  Logout,
  MyPressable,
  ProfileCard,
  ScreenContainer,
} from "../../components";
import { colors, styles } from "../../constants";
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
            marginBottom: 10,
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
          }}
          onPress={() => navigation.push("LikedPosts")}
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
              Liked posts
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
            marginBottom: 20,
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
        <View style={{ alignItems: "center", paddingTop: "40%", flex: 1 }}>
          <BoldText
            style={{
              color: colors.mediumThemeColor,
              marginBottom: 5,
              fontSize: 13,
            }}
          >
            If you have any inquiry, please contact us via
          </BoldText>
          <BoldText
            onPress={() => {
              Linking.openURL("mailto:collegetable.dev@gmail.com");
            }}
            style={{ color: colors.themeColor, fontSize: 13 }}
          >
            collegetable.dev@gmail.com.
          </BoldText>
        </View>
      </KeyboardAwareScrollView>
    </ScreenContainer>
  );
};

export default Profile;
