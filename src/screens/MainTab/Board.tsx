import { PostWithCounts } from "@customTypes/models";
import { RouteProp, useNavigation } from "@react-navigation/native";
import React, { useState, useEffect, useContext } from "react";
import { View } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
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
import { ProgressContext } from "../../contexts/progressContext";

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
  const { spinner } = useContext(ProgressContext);

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
  }, []);

  const refetch = async () => {
    const data = await postData(userContext, API_URL + "board/post/getPosts", {
      boardId,
    });
    if (data?.ok) {
      setPosts(data.posts);
    }
  };

  useEffect(() => {
    navigation.addListener("focus", refetch);
    return () => navigation.removeListener("focus", refetch);
  }, []);

  return (
    <ScreenContainer style={{ backgroundColor: "rgba(255,255,255,1)" }}>
      <KeyboardAwareScrollView
        style={{
          paddingTop: "20%",
          paddingHorizontal: "8%",
        }}
      >
        {posts ? (
          posts.length ? (
            posts.map((post) => <PostComponent post={post} />)
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
      </KeyboardAwareScrollView>
    </ScreenContainer>
  );
};

export default BoardScreen;
