import { PostWithCounts } from "@customTypes/models";
import { RouteProp, useNavigation } from "@react-navigation/native";
import React, { useState, useEffect, useContext } from "react";
import { FlatList, View } from "react-native";
import { postData } from "../../util";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { StackGeneratorParamList } from "../../navigation/StackGenerator";
import { UserContext } from "../../contexts/userContext";
import { Ionicons } from "@expo/vector-icons";
import {
  LoadingComponent,
  MyPressable,
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

  const refetch = async () => {
    const data = await postData(userContext, API_URL + "board/post/getPosts", {
      boardId,
    });
    if (data?.ok) {
      setPosts(data.posts);
    }
  };

  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <MyPressable onPress={() => navigation.push("WritePost", { boardId })}>
          <Ionicons
            name="ios-create-outline"
            size={26}
            color={colors.themeColor}
          />
        </MyPressable>
      ),
      headerTitle: route.params.title,
    });

    navigation.addListener("focus", refetch);
    return () => navigation.removeListener("focus", refetch);
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
            renderItem={({ item: post }) => <PostComponent post={post} />}
          />
        ) : (
          <BoldText style={{ color: colors.mediumThemeColor, fontSize: 20 }}>
            The board is empty.
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

export default BoardScreen;
