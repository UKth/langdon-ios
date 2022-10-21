import React, { useState, useEffect, useContext } from "react";

import { useNavigation } from "@react-navigation/core";
import tw from "twrnc";
import { Pressable, Text, TextInput, View } from "react-native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { AuthStackParamList } from "../../navigation/AuthStack";
// import { debounce, getData } from "@util";
import { debounce, getData } from "../../util";
import { API_URL } from "../../constants/urls";
import { College } from "@customTypes/models";

const searchCollege = debounce(
  async (
    keyword: string,
    setSearchedCollege: React.Dispatch<React.SetStateAction<string>>
  ) => {
    if (keyword !== "") {
      const data = await getData(API_URL + "college/getCollege/" + keyword);
      if (data?.ok) {
        setSearchedCollege(data.collegeData);
      }
    }
  },
  400
);

const SearchCollege = () => {
  const [backgroundIndex, setBackgroundIndex] = useState(-1);
  const navigation =
    useNavigation<NativeStackNavigationProp<AuthStackParamList>>();
  const [keyword, setKeyword] = useState("");
  const [searchedCollege, setSearchedCollege] = useState<College[]>();

  useEffect(() => {
    searchCollege(keyword, setSearchedCollege);
  }, [keyword]);

  return (
    <View>
      <TextInput
        style={{
          marginTop: 200,
          paddingVertical: 10,
          backgroundColor: "#ffffff",
        }}
        onChangeText={(text) => setKeyword(text.trim())}
      />
      {searchedCollege?.length ? (
        <View
          style={{
            marginTop: 20,
            height: 500,
            width: "100%",
            backgroundColor: "#ffffff",
          }}
        >
          {searchedCollege.map((college) => (
            <Pressable
              key={college.id}
              onPress={() => navigation.push("Enter", { college })}
              style={({ pressed }) => [
                {
                  backgroundColor: pressed ? "rgb(210, 230, 255)" : "white",
                },
                {
                  padding: 10,
                },
              ]}
            >
              <Text style={{ fontSize: 17 }}>{college.name}</Text>
            </Pressable>
          ))}
        </View>
      ) : null}
    </View>
  );
};

export default SearchCollege;
