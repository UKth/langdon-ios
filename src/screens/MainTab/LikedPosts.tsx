import { Post, PostWithBoard, PostWithCounts } from "@customTypes/models";
import { RouteProp, useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import React, { useState, useEffect, useContext } from "react";
import { Alert, FlatList, View } from "react-native";
import {
  LoadingComponent,
  PostComponent,
  ScreenContainer,
} from "../../components";
import { API_URL, colors } from "../../constants";
import { UserContext } from "../../contexts/userContext";
import { StackGeneratorParamList } from "../../navigation/StackGenerator";
import { loadData, postData } from "../../util";
import { BoldText } from "../../components/StyledText";

const LikedPosts = ({
  route,
}: {
  route: RouteProp<StackGeneratorParamList, "LikedPosts">;
}) => {
  const [posts, setPosts] = useState<PostWithBoard[]>();
  const navigation =
    useNavigation<NativeStackNavigationProp<StackGeneratorParamList>>();
  const userContext = useContext(UserContext);

  const [refreshing, setRefreshing] = useState(false);

  const fetch = async (lastId?: number) => {
    const data = await postData(userContext, API_URL + "user/getLikedPosts", {
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
            ListHeaderComponent={() => <View style={{ height: 40 }} />}
            ListFooterComponent={() => <View style={{ height: 20 }} />}
            keyExtractor={(post) => post.id + ""}
            renderItem={({ item: post }) => (
              <PostComponent isMine={true} post={post} />
            )}
            refreshing={refreshing}
            onRefresh={refresh}
            onEndReached={() => fetch(posts[posts.length - 1].id)}
            onEndReachedThreshold={0.5}
          />
        ) : (
          <View style={{ paddingHorizontal: "10%", paddingTop: "10%" }}>
            <BoldText style={{ color: colors.mediumThemeColor, fontSize: 16 }}>
              You didn't write any posts yet.
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

export default LikedPosts;
