import { PostWithCounts } from "@customTypes/models";
import { RouteProp, useNavigation } from "@react-navigation/native";
import React, { useState, useEffect, useContext } from "react";
import { Pressable, RefreshControl, Text, View, ViewProps } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import {
  getNameString,
  getTimeDifferenceString,
  logout,
  postData,
} from "../../util";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { StackGeneratorParamList } from "../../navigation/StackGenerator";
import { UserContext } from "../../contexts/userContext";
import { Ionicons } from "@expo/vector-icons";
import {
  ErrorComponent,
  LoadingComponent,
  MyPressable,
  ScreenContainer,
} from "../../components";
import { ANONYMOUS_USERNAME, API_URL, colors, styles } from "../../constants";
import { BoldText } from "../../components/StyledText";
import { shadow } from "../../constants/styles";

const ProfileIcon = (
  props: ViewProps & {
    size: number;
  }
) => (
  <View
    style={[
      {
        backgroundColor: colors.lightThemeColor,
        width: props.size,
        height: props.size,
        borderRadius: styles.borderRadius.sm,
        alignItems: "center",
        justifyContent: "center",
      },
      props.style,
    ]}
  >
    <Ionicons name="person" size={props.size * 0.7} color={"white"} />
  </View>
);

const Profile = ({
  route,
}: {
  route: RouteProp<StackGeneratorParamList, "Profile">;
}) => {
  const [posts, setPosts] = useState<PostWithCounts[]>();
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
        <View
          style={{
            backgroundColor: "white",
            borderRadius: styles.borderRadius.md,
            padding: 25,
            marginBottom: 50,
            ...shadow.md,
          }}
        >
          <View style={{ flexDirection: "row", marginBottom: 20 }}>
            <ProfileIcon size={50} style={{ marginRight: 10 }} />
            <View style={{ paddingRight: 50 }}>
              <BoldText
                style={{
                  color: colors.mediumThemeColor,
                  fontSize: 15,
                  marginBottom: 5,
                }}
              >
                {getNameString(user)}
                <BoldText
                  style={{
                    color: colors.lightThemeColor,
                    fontSize: 15,
                  }}
                >
                  {"  @"}
                  {user.netId}
                </BoldText>
              </BoldText>
              <BoldText
                style={{
                  color: colors.mediumThemeColor,
                  fontSize: 15,
                }}
              >
                {user.email}
              </BoldText>
            </View>
          </View>
          <BoldText
            style={{
              color: colors.mediumThemeColor,
              fontSize: 17,
            }}
          >
            {user.college.name}
          </BoldText>
        </View>
        <MyPressable
          style={{
            padding: 10,
            borderRadius: 20,
            backgroundColor: colors.lightThemeColor,
            width: "30%",
            alignSelf: "center",
            alignItems: "center",

            ...shadow.md,
          }}
          onPress={() => logout(userContext)}
        >
          <BoldText>logout</BoldText>
        </MyPressable>
      </KeyboardAwareScrollView>
    </ScreenContainer>
  );
};

export default Profile;
