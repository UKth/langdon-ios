/**
 * Learn more about deep linking with React Navigation
 * https://reactnavigation.org/docs/deep-linking
 * https://reactnavigation.org/docs/configuring-links
 */

import { LinkingOptions } from "@react-navigation/native";
import * as Linking from "expo-linking";
import { MainTabParamList } from "./MainTab";
import { StackGeneratorParamList } from "./StackGenerator";

const linking: LinkingOptions<MainTabParamList> = {
  prefixes: [Linking.createURL("/")],
  config: {
    screens: {
      TimeTableStack: {
        screens: {
          AddFriend: {
            path: "addFriend/:targetId/:code",
            parse: {
              targetId: (targetId) => +targetId ?? 0,
              code: (code) => +code ?? 0,
            },
          },
          Post: {
            path: "post/:id",
            parse: {
              id: (id) => +id ?? 0,
            },
          },
        },
      },
    },
  },
};

export default linking;
