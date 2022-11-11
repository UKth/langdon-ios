import { PostWithCounts } from "@customTypes/models";
import { RouteProp, useNavigation } from "@react-navigation/native";
import React, { useState, useEffect, useContext } from "react";
import { Pressable, RefreshControl, Text, View } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { getNameString, getTimeDifferenceString, postData } from "../../util";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { StackGeneratorParamList } from "../../navigation/StackGenerator";
import { UserContext } from "../../contexts/userContext";
import { Ionicons } from "@expo/vector-icons";
import {
  LoadingComponent,
  MyPressable,
  ScreenContainer,
} from "../../components";
import { ANONYMOUS_USERNAME, API_URL, colors, styles } from "../../constants";
import { BoldText } from "../../components/StyledText";
import ErrorComponent from "../../components/ErrorComponent";

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
          paddingTop: "20%",
          paddingHorizontal: "8%",
        }}
      >
        <BoldText
          style={{
            color: colors.mediumThemeColor,
            fontSize: 20,
          }}
        >
          {getNameString(user)}
        </BoldText>
        <BoldText
          style={{
            color: colors.mediumThemeColor,
            fontSize: 20,
          }}
        >
          @{user.netId}
        </BoldText>
        <BoldText
          style={{
            color: colors.mediumThemeColor,
            fontSize: 20,
          }}
        >
          {user.email}
        </BoldText>
        <BoldText
          style={{
            color: colors.mediumThemeColor,
            fontSize: 20,
          }}
        >
          {user.college.name}
        </BoldText>
      </KeyboardAwareScrollView>
    </ScreenContainer>
  );
};

export default Profile;
