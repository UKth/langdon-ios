import { PostWithCounts } from "@customTypes/models";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import React, { useContext } from "react";
import { View } from "react-native";
import { getTimeDifferenceString } from "../util";
import { ANONYMOUS_USERNAME, colors } from "../constants";
import styles, { shadow } from "../constants/styles";
import { StackGeneratorParamList } from "../navigation/StackGenerator";
import MyPressable from "./MyPressable";
import { BoldText } from "./StyledText";

type PostComponentProps = {
  post: PostWithCounts;
};

const PostComponent = ({ post }: PostComponentProps) => {
  // const theme = useContext(ThemeContext);
  const navigation =
    useNavigation<NativeStackNavigationProp<StackGeneratorParamList>>();

  return (
    <MyPressable
      key={post.id}
      style={{
        paddingVertical: 10,
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
      onPress={() => navigation.push("Post", { id: post.id })}
    >
      <View style={{ maxWidth: "75%" }}>
        <BoldText
          numberOfLines={1}
          style={{
            color: colors.themeColor,
            fontSize: 14,
            marginBottom: 7,
          }}
        >
          {post.title}
        </BoldText>
        <BoldText style={{ color: colors.mediumThemeColor, fontSize: 12 }}>
          {post.content.substring(0, 30) +
            (post.content.length > 30 ? "..." : "")}
        </BoldText>
      </View>
      <View
        style={{
          height: 40,
          justifyContent: "space-between",
        }}
      >
        <View
          style={{
            flexDirection: "row",
          }}
        >
          <BoldText
            style={{
              color: colors.mediumThemeColor,
              fontSize: 11,
              alignSelf: "flex-end",
              marginRight: 4,
            }}
          >
            @{post.isAnonymous ? ANONYMOUS_USERNAME : post.createdBy?.netId}
          </BoldText>
          <View style={{ flexDirection: "row", width: 20 }}>
            <Ionicons
              style={{ marginRight: 3 }}
              name="chatbox-outline"
              color={colors.mediumThemeColor}
              size={10}
            />
            <BoldText
              style={{
                color: colors.mediumThemeColor,
                fontSize: 9,
              }}
            >
              {post._count.comments}
            </BoldText>
          </View>
        </View>

        <BoldText
          style={{
            color: colors.lightThemeColor,
            fontSize: 10,
            alignSelf: "flex-end",
          }}
        >
          {getTimeDifferenceString(post.createdAt)}
        </BoldText>
      </View>
    </MyPressable>
  );
};

export default PostComponent;
