import { Post, PostWithBoard, PostWithCounts } from "@customTypes/models";
import { RouteProp, useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import React, { useState, useEffect, useContext } from "react";
import { FlatList, View } from "react-native";
import {
  LoadingComponent,
  PostComponent,
  ScreenContainer,
} from "../../components";
import { API_URL, colors } from "../../constants";
import { UserContext } from "../../contexts/userContext";
import { StackGeneratorParamList } from "../../navigation/StackGenerator";
import { postData } from "../../util";
import { BoldText } from "../../components/StyledText";

const MyPosts = ({
  route,
}: {
  route: RouteProp<StackGeneratorParamList, "MyPosts">;
}) => {
  const [posts, setPosts] = useState<PostWithBoard[]>();
  const navigation =
    useNavigation<NativeStackNavigationProp<StackGeneratorParamList>>();
  const userContext = useContext(UserContext);

  useEffect(() => {
    (async () => {
      const data = await postData(userContext, API_URL + "user/getPosts");
      if (data?.ok && data.posts) {
        setPosts(data.posts);
      }
    })();
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
          />
        ) : (
          <BoldText style={{ color: colors.mediumThemeColor, fontSize: 20 }}>
            You didn't write any posts yet.
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

export default MyPosts;
