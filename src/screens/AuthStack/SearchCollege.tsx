import React, { useState, useEffect, useContext } from "react";

import { useNavigation } from "@react-navigation/core";
import tw from "twrnc";
import { Pressable, Text, TextInput, View } from "react-native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { AuthStackParamList } from "../../navigation/AuthStack";
// import { debounce, getData } from "@util";
import { debounce, getData } from "../../util";
import { API_URL, colors } from "../../constants";
import { College } from "../../types/models";
import { MyPressable, ScreenContainer } from "../../components";
import { BoldText, BoldTextInput } from "../../components/StyledText";
import styles, { shadow } from "../../constants/styles";

const searchCollege = debounce(
  async (
    keyword: string,
    setSearchedCollege: React.Dispatch<
      React.SetStateAction<College[] | undefined>
    >
  ) => {
    if (keyword !== "") {
      const data = await getData(API_URL + "college/getCollege/" + keyword);
      if (data?.ok) {
        setSearchedCollege(data.collegeData);
      }
    }
  },
  220
);

const SearchCollege = () => {
  const navigation =
    useNavigation<NativeStackNavigationProp<AuthStackParamList>>();
  const [keyword, setKeyword] = useState("");
  const [searchedCollege, setSearchedCollege] = useState<College[]>();

  useEffect(() => {
    searchCollege(keyword, setSearchedCollege);
  }, [keyword]);

  return (
    <ScreenContainer>
      <View
        style={{
          paddingHorizontal: 30,
          paddingTop: "45%",
        }}
      >
        <BoldText
          style={{
            fontSize: 24,
            color: colors.mediumThemeColor,
            marginBottom: 1,
          }}
        >
          Welcome,
        </BoldText>
        <BoldText
          style={{
            fontSize: 24,
            color: colors.mediumThemeColor,
            marginBottom: "20%",
          }}
        >
          Search Your College
        </BoldText>
        <BoldTextInput
          style={{
            paddingHorizontal: 20,
            fontSize: 18,
            backgroundColor: colors.lightThemeColor,
            borderRadius: styles.borderRadius.md,
            height: 50,
            color: "white",
            marginBottom: 15,
            ...shadow.md,
          }}
          onChangeText={(text) => setKeyword(text.trim())}
          placeholder="ex. University of Wisconsin - Madison"
          placeholderTextColor={colors.placeHolerTextColor}
        />
        {searchedCollege?.length ? (
          <View
            style={{
              backgroundColor: "white",
              paddingVertical: 20,
              borderRadius: 15,

              ...shadow.md,
            }}
          >
            {searchedCollege.map((college) => (
              <MyPressable
                key={college.id}
                onPress={() => navigation.push("Enter", { college })}
                style={{
                  paddingHorizontal: 20,
                }}
              >
                <BoldText
                  style={{
                    fontSize: 17,
                    color: colors.mediumThemeColor,
                  }}
                >
                  {college.name}
                </BoldText>
              </MyPressable>
            ))}
          </View>
        ) : null}
      </View>
    </ScreenContainer>
  );
};

export default SearchCollege;
