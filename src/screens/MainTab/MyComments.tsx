import { CommentWithPost } from "@customTypes/models";
import { RouteProp, useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import React, { useState, useEffect, useContext } from "react";
import { Alert, FlatList, View } from "react-native";
import {
  CommentComponent,
  LoadingComponent,
  ScreenContainer,
} from "../../components";
import { API_URL, colors } from "../../constants";
import { UserContext } from "../../contexts/userContext";
import { StackGeneratorParamList } from "../../navigation/StackGenerator";
import { loadData, postData } from "../../util";
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

  const [refreshing, setRefreshing] = useState(false);

  const fetch = async (lastId?: number) => {
    const data = await postData(userContext, API_URL + "user/getComments", {
      lastId,
    });
    if (data?.ok && data.comments) {
      loadData({
        data: comments,
        setData: setComments,
        loadedData: data.comments,
        lastId: data.lastId,
      });
    } else {
      Alert.alert(data?.error ?? "Failed to load posts.");
    }
  };

  const refresh = async () => {
    setRefreshing(true);
    await fetch();
    setRefreshing(false);
  };

  useEffect(() => {
    refresh();
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
            refreshing={refreshing}
            onRefresh={refresh}
            onEndReached={() => fetch(comments[comments.length - 1].id)}
            onEndReachedThreshold={0.5}
          />
        ) : (
          <View style={{ paddingHorizontal: "10%", paddingTop: "10%" }}>
            <BoldText style={{ color: colors.mediumThemeColor, fontSize: 16 }}>
              You didn't write any comments yet.
            </BoldText>
          </View>
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
