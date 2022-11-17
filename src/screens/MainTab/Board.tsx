import { PostWithCounts } from "@customTypes/models";
import { RouteProp, useNavigation } from "@react-navigation/native";
import React, { useState, useEffect, useContext } from "react";
import { Alert, FlatList, View } from "react-native";
import { loadData, postData } from "../../util";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { StackGeneratorParamList } from "../../navigation/StackGenerator";
import { UserContext } from "../../contexts/userContext";
import {
  LoadingComponent,
  PostComponent,
  ScreenContainer,
} from "../../components";
import { API_URL, colors } from "../../constants";
import { BoldText } from "../../components/StyledText";

const BoardScreen = ({
  route,
}: {
  route: RouteProp<StackGeneratorParamList, "Board">;
}) => {
  const [posts, setPosts] = useState<PostWithCounts[]>();
  const navigation =
    useNavigation<NativeStackNavigationProp<StackGeneratorParamList>>();
  const userContext = useContext(UserContext);
  const boardId = route.params.id;
  const [refreshing, setRefreshing] = useState(false);

  const fetch = async (lastId?: number) => {
    const data = await postData(userContext, API_URL + "board/post/getPosts", {
      boardId,
      lastId,
    });
    if (data?.ok && data.posts) {
      loadData({
        data: posts,
        setData: setPosts,
        loadedData: data.posts,
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
      {posts ? (
        posts.length ? (
          <FlatList
            style={{ paddingHorizontal: "8%" }}
            data={posts}
            refreshing={refreshing}
            onRefresh={refresh}
            ListHeaderComponent={() => <View style={{ height: 40 }} />}
            ListFooterComponent={() => <View style={{ height: 20 }} />}
            keyExtractor={(post) => post.id + ""}
            renderItem={({ item: post }) => <PostComponent post={post} />}
            onEndReached={() => fetch(posts[posts.length - 1].id)}
            onEndReachedThreshold={0.5}
          />
        ) : (
          <View style={{ paddingHorizontal: "10%", paddingTop: "10%" }}>
            <BoldText
              style={{
                color: colors.mediumThemeColor,
                fontSize: 18,
              }}
            >
              The board is empty.
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

export default BoardScreen;
