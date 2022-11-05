import React, { useState, useEffect, useContext } from "react";

import { useNavigation } from "@react-navigation/core";
import tw from "twrnc";
import { Pressable, Text, TextInput, View } from "react-native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { AuthStackParamList } from "../../navigation/AuthStack";
// import { debounce, getData } from "@util";
import { debounce, getData } from "../../util";
import { API_URL } from "../../constants/urls";
import { College } from "../../types/models";
import ScreenContainer from "../../components/ScreenContainer";
import { BoldText, BoldTextInput } from "../../components/StyledText";
import { colors } from "../../constants/Colors";

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
            color: colors.themeColor,
            marginBottom: "13%",
          }}
        >
          Search Your College
        </BoldText>
        <BoldTextInput
          style={{
            paddingHorizontal: 20,
            fontSize: 20,
            backgroundColor: colors.lightThemeColor,
            borderRadius: 50,
            height: 50,
            color: "white",
            marginBottom: 10,
          }}
          onChangeText={(text) => setKeyword(text.trim())}
          placeholder="ex. University of Wisconsin - Madison"
          placeholderTextColor={colors.placeHolerTextColor}
        />
        {searchedCollege?.length ? (
          <View
            style={{
              backgroundColor: colors.lightThemeColor,
              paddingVertical: 20,
              borderRadius: 28,
            }}
          >
            {searchedCollege.map((college) => (
              <Pressable
                key={college.id}
                onPress={() => navigation.push("Enter", { college })}
                style={({ pressed }) => [
                  {
                    opacity: pressed ? 0.5 : 1,
                  },
                  {
                    paddingHorizontal: 20,
                  },
                ]}
              >
                <BoldText
                  style={{
                    fontSize: 17,
                    color: "white",
                  }}
                >
                  {college.name}
                </BoldText>
              </Pressable>
            ))}
          </View>
        ) : null}
      </View>
    </ScreenContainer>
  );
};

export default SearchCollege;
