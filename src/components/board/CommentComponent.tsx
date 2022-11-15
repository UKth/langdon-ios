import { Comment, Post } from "@customTypes/models";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import React, { useContext } from "react";
import { ActionSheetIOS, Alert, View } from "react-native";
import { reportIssue } from "../../apiFunctions";
import { ANONYMOUS_USERNAME, colors } from "../../constants";
import { UserContext } from "../../contexts/userContext";
import { getTimeDifferenceString } from "../../util";
import styles, { shadow } from "../../constants/styles";
import { StackGeneratorParamList } from "../../navigation/StackGenerator";
import { MyPressable } from "../shared";
import { BoldText } from "../StyledText";

type CommentComponentProps = {
  comment: Comment;
  deleteComment?: (id: number) => void;
  post: Post;
};

const CommentComponent = ({
  comment,
  deleteComment,
  post,
}: CommentComponentProps) => {
  const navigation =
    useNavigation<NativeStackNavigationProp<StackGeneratorParamList>>();
  const userContext = useContext(UserContext);

  return (
    <View
      style={{
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",

        ...shadow.md,
        backgroundColor: "white",

        borderRadius: styles.borderRadius.sm,
        paddingHorizontal: 10,
        paddingVertical: 7,
        marginBottom: 7,
      }}
    >
      <View style={{ maxWidth: "90%" }}>
        <View
          style={{
            flexDirection: "row",
            marginBottom: 5,
            alignItems: "center",
          }}
        >
          <BoldText
            style={{
              fontSize: 12,
              color: colors.mediumThemeColor,
              marginRight: 3,
            }}
          >
            @
            {comment.isAnonymous ? ANONYMOUS_USERNAME : comment.createdBy.netId}
          </BoldText>
          <BoldText
            style={{
              fontSize: 8,
              color: colors.lightThemeColor,
            }}
          >
            {getTimeDifferenceString(comment.createdAt)}
          </BoldText>
        </View>
        <BoldText
          style={{
            color: colors.mediumThemeColor,
            fontSize: 11,
          }}
        >
          {comment.content}
        </BoldText>
      </View>
      {deleteComment ? (
        <MyPressable
          onPress={() => {
            const isMine = comment.userId === userContext.user?.id;
            ActionSheetIOS.showActionSheetWithOptions(
              {
                options: [
                  "Cancel",
                  isMine ? "Delete the comment" : "Report the comment",
                  ...(isMine ? [] : ["Send message to writer."]),
                ],
                destructiveButtonIndex: 1,
                cancelButtonIndex: 0,
                // userInterfaceStyle: 'dark',
              },
              (buttonIndex) => {
                if (buttonIndex === 0) {
                  // cancel action
                } else if (buttonIndex === 1) {
                  if (isMine) {
                    Alert.alert(
                      "Delete post",
                      "Are you sure to delete this post?",
                      [
                        {
                          text: "Yes",
                          onPress: () => deleteComment(comment.id),
                        },
                        {
                          text: "cancel",
                          style: "cancel",
                        },
                      ]
                    );
                  } else {
                    reportIssue(userContext, {
                      content: "comment report",
                      targetId: comment.id,
                      targetType: "comment",
                    });
                  }
                } else if (!isMine && buttonIndex === 2) {
                  navigation.push("SendFirstMessage", {
                    targetId: comment.createdBy.id,
                    postId: post.id,
                  });
                }
              }
            );
          }}
        >
          <MaterialCommunityIcons
            name="dots-horizontal"
            size={24}
            color={colors.mediumThemeColor}
          />
        </MyPressable>
      ) : (
        <MyPressable
          style={{
            marginBottom: 20,
            position: "absolute",
            top: 10,
            right: 10,
          }}
          hitSlop={{
            top: 20,
            bottom: 20,
            right: 20,
            left: 20,
          }}
          onPress={() => navigation.push("Post", { id: post.id })}
        >
          <BoldText
            style={{
              color: colors.mediumThemeColor,
              fontSize: 10,
              maxWidth: 200,
            }}
            numberOfLines={1}
          >
            {post.title}
          </BoldText>
        </MyPressable>
      )}
    </View>
  );
};

export default CommentComponent;
