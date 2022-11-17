import { CommentWithPost } from "@customTypes/models";
import { RouteProp, useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import React, { useState, useEffect, useContext } from "react";
import { FlatList, View } from "react-native";
import {
  CommentComponent,
  LoadingComponent,
  ScreenContainer,
} from "../../components";
import { API_URL, colors } from "../../constants";
import { UserContext } from "../../contexts/userContext";
import { StackGeneratorParamList } from "../../navigation/StackGenerator";
import { postData } from "../../util";
import { BoldText } from "../../components/StyledText";

const MyComments = ({
  route,
}: {
  route: RouteProp<StackGeneratorParamList, "MyComments">;
}) => {
  const [comments, setComments] = useState<CommentWithPost[]>();
  const navigation =
    useNavigation<NativeStackNavigationProp<StackGeneratorParamList>>();
  const userContext = useContext(UserContext);

  useEffect(() => {
    (async () => {
      const data = await postData(userContext, API_URL + "user/getComments");
      if (data?.ok && data.comments) {
        setComments(data.comments);
      }
    })();
  }, []);

  return (
    <ScreenContainer>
      {comments ? (
        comments.length ? (
          <FlatList
            style={{ paddingHorizontal: "8%" }}
            data={comments}
            ListHeaderComponent={() => <View style={{ height: 40 }} />}
            ListFooterComponent={() => <View style={{ height: 20 }} />}
            keyExtractor={(comment) => comment.id + ""}
            renderItem={({ item: comment }) => (
              <CommentComponent comment={comment} post={comment.post} />
            )}
          />
        ) : (
          <BoldText style={{ color: colors.mediumThemeColor, fontSize: 20 }}>
            You didn't write any comments yet.
          </BoldText>
        )
      ) : (
        <View
          style={{
            height: 100,
            justifyContent: "center",
          }}
        >
          <LoadingComponent />
        </View>
      )}
    </ScreenContainer>
  );
};

export default MyComments;
