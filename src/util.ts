import { userContextType } from "./contexts/userContext";
import { API_URL } from "./constants/urls";
import { Alert } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  ACCESS_TOKEN_KEY,
  REFRESH_TOKEN_KEY,
  USER_KEY,
} from "./constants/storageKeys";
import { classWithSections } from "@customTypes/models";

export const logout = (ctx: userContextType) => {
  ctx.setUser(undefined);
  AsyncStorage.setItem(USER_KEY, "");
};

export const sendPostRequest = async (url = "", data = {}) => {
  try {
    const rawResponse = await fetch(url, {
      method: "POST",
      mode: "cors",
      cache: "no-cache",
      credentials: "same-origin",
      headers: {
        "Content-Type": "application/json",
      },
      redirect: "follow",
      referrerPolicy: "no-referrer",
      body: JSON.stringify(data),
    });
    // console.log(rawResponse);
    return await rawResponse.json();
  } catch (error) {
    console.log("Error in sendPostRequest:", url, data, error);
  }
};

const refreshAccessToken = async (ctx: userContextType) => {
  // const refreshToken = await AsyncStorage.getItem(REFRESH_TOKEN_KEY);
  const res = await sendPostRequest(API_URL + "user/refreshAccessToken", {
    refreshToken: refreshToken,
  });

  if (!res?.ok) {
    console.log(res.error);
    Alert.alert(res.error);
    logout(ctx);
    return;
  }
  if (res.accessToken) {
    accessToken = res.accessToken;
    AsyncStorage.setItem(ACCESS_TOKEN_KEY, res.accessToken);
  }
  if (res.refreshToken) {
    console.log("REFRESH TOKEN EXPIRED, REFRESHING TOKEN...");
    refreshToken = res.refreshToken;
    AsyncStorage.setItem(REFRESH_TOKEN_KEY, res.refreshToken);
  }
  return res;
};

export const postData: any = async (
  ctx: userContextType,
  url = "",
  data = {}
) => {
  try {
    // const accessToken = (await AsyncStorage.getItem(ACCESS_TOKEN_KEY)) ?? "";

    const res = await sendPostRequest(url, {
      ...data,
      accessToken,
    });

    if (res?.tokenExpired) {
      console.log("TOKEN EXPIRED, REFRESHING TOKEN...");
      const refreshResponse = await refreshAccessToken(ctx);
      if (refreshResponse?.ok) {
        const res = await sendPostRequest(url, {
          ...data,
          accessToken,
        });
        return res;
      } else {
        logout(ctx);
        return;
      }
    }

    return res;
  } catch (err) {
    console.log(err);
    // logout(ctx);
  }
};

export const getData = async (url: string) => {
  const res = await fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });
  try {
    return res.json();
  } catch (error) {
    console.log(res);
    console.log(error);
  }
};

export const debounce = (callback: Function, delay: number) => {
  let timer: number;
  return (...args: any) => {
    if (timer) clearTimeout(timer);
    timer = setTimeout(callback, delay, ...args);
  };
};

export type meetingDayChar = "M" | "T" | "W" | "R" | "F";

export const dayCharToInt = (c: meetingDayChar) => {
  const dict = {
    M: 0,
    T: 1,
    W: 2,
    R: 3,
    F: 4,
  };
  return dict[c];
};

export const sum = (arr: number[]) => {
  return arr.reduce((partialSum, i) => partialSum + i, 0);
};

export type nestedSection = {
  code: string;
  value: classWithSections | nestedSection[];
};

const nestedSectionCompare = (a: nestedSection, b: nestedSection) =>
  a.code.localeCompare(b.code);

export const sectionMapper = (classes: classWithSections[]) => {
  const level = classes[0].sections.length; // <= 3

  // for level 1
  const primarySections: nestedSection[] = [];
  for (let i = 0; i < classes.length; i++) {
    const cls = classes[i];
    const sectionCode =
      cls.sections[0].type + " " + cls.sections[0].sectionNumber;
    if (!primarySections.map((section) => section.code).includes(sectionCode)) {
      primarySections.push({ code: sectionCode, value: cls });
    }
  }
  primarySections.sort(nestedSectionCompare);

  if (level === 1) {
    return primarySections;
  }

  // for level 2
  for (let i = 0; i < classes.length; i++) {
    const cls = classes[i];
    let primarySectionsIdx = -1;
    const primarySectionCode =
      cls.sections[0].type + " " + cls.sections[0].sectionNumber;

    for (let j = 0; j < primarySections.length; j++) {
      const section = primarySections[j];
      if (section.code === primarySectionCode) {
        primarySectionsIdx = j;
        break;
      }
    }
    if (primarySectionsIdx === -1) {
      return [];
    }
    const primarySection = primarySections[primarySectionsIdx];
    if (Array.isArray(primarySection.value)) {
      primarySection.value.push({
        code: cls.sections[1].type + " " + cls.sections[1].sectionNumber,
        value: cls,
      });
    } else {
      primarySection.value = [
        {
          code: cls.sections[1].type + " " + cls.sections[1].sectionNumber,
          value: cls,
        },
      ];
    }
  }

  for (let i = 0; i < primarySections.length; i++) {
    const sections = primarySections[i].value;
    if (Array.isArray(sections)) {
      sections.sort(nestedSectionCompare);
    }
    // primarySections[i].value = sections;
  }

  if (level === 2) {
    return primarySections;
  }

  // for level 3
  for (let i = 0; i < classes.length; i++) {
    const cls = classes[i];

    let primarySectionsIdx = -1;
    const primarySectionCode =
      cls.sections[0].type + " " + cls.sections[0].sectionNumber;

    for (let j = 0; j < primarySections.length; j++) {
      const section = primarySections[j];
      if (section.code === primarySectionCode) {
        primarySectionsIdx = j;
        break;
      }
    }

    let secondarySectionsIdx = -1;
    const secondarySectionCode =
      cls.sections[1].type + " " + cls.sections[1].sectionNumber;

    const secondarySections = primarySections[primarySectionsIdx].value;

    if (!Array.isArray(secondarySections)) {
      return [];
    }

    for (let j = 0; j < secondarySections.length; j++) {
      const section = secondarySections[j];
      if (section.code === secondarySectionCode) {
        secondarySectionsIdx = j;
        break;
      }
    }

    if (primarySectionsIdx === -1 || secondarySectionsIdx === -1) {
      return [];
    }

    const primarySection = primarySections[primarySectionsIdx];
    if (!Array.isArray(primarySection.value)) {
      return [];
    }

    const secondarySection = primarySection.value[secondarySectionsIdx];

    if (Array.isArray(secondarySection.value)) {
      secondarySection.value.push({
        code: cls.sections[1].type + " " + cls.sections[1].sectionNumber,
        value: cls,
      });
    } else {
      secondarySection.value = [
        {
          code: cls.sections[1].type + " " + cls.sections[1].sectionNumber,
          value: cls,
        },
      ];
    }
  }

  for (let i = 0; i < primarySections.length; i++) {
    const secondarySections = primarySections[i].value;
    if (Array.isArray(secondarySections)) {
      for (let j = 0; j < secondarySections.length; j++) {
        const sections = secondarySections[j].value;
        if (Array.isArray(sections)) {
          sections.sort(nestedSectionCompare);
        }
        // secondarySections[j].value = sections;
      }
    }
  }
  return primarySections;
};

export const logJSON = (o: Object) => {
  console.log(JSON.stringify(o, null, 4));
};

export const formatTimeString = (hour: number, min: number) => {
  return (hour >= 10 ? "" : "0") + hour + ":" + (min >= 10 ? "" : "0") + min;
};
