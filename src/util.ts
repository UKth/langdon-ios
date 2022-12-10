import { userContextType } from "./contexts/userContext";
import { Alert } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  ClassMeeting,
  ClassWithSections,
  TargetUser,
  User,
} from "@customTypes/models";
import {
  ACCESS_TOKEN_KEY,
  API_URL,
  REFRESH_TOKEN_KEY,
  USER_KEY,
} from "./constants";
import { StackGeneratorParamList } from "./navigation/StackGenerator";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import * as Notifications from "expo-notifications";

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
    return await rawResponse.json();
  } catch (error) {
    console.error("Error in sendPostRequest:", url, data, error);
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

export const postData = async (ctx: userContextType, url = "", data = {}) => {
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
    console.error("Error in postData: ", err);
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
  value: ClassWithSections | nestedSection[];
};

const nestedSectionCompare = (a: nestedSection, b: nestedSection) =>
  a.code.localeCompare(b.code);

export const sectionMapper = (classes: ClassWithSections[]) => {
  const level = classes[0].sections.length; // <= 3

  if (![1, 2, 3].includes(level)) {
    return [];
  }

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
        code: cls.sections[2].type + " " + cls.sections[2].sectionNumber,
        value: cls,
      });
    } else {
      secondarySection.value = [
        {
          code: cls.sections[2].type + " " + cls.sections[2].sectionNumber,
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

const format2Digits = (n: number) => (n >= 10 ? "" : "0") + n;

export const getMeetingTimeString = (meeting: ClassMeeting) => {
  if (!meeting.meetingTimeStart || !meeting.meetingTimeEnd) {
    return "";
  }
  return (
    formatTimeString(meeting.meetingTimeStart) +
    " ~ " +
    formatTimeString(meeting.meetingTimeEnd)
  );
};

export const formatTimeString = (dateValue: Date | number) => {
  const date = new Date(dateValue.valueOf());
  return (
    format2Digits(date.getHours()) + ":" + format2Digits(date.getMinutes())
  );
};

export const getTimeDifferenceString = (createdAt: Date) => {
  const diff = new Date().valueOf() - createdAt.valueOf();

  let value = 0;
  let unit = "";
  if (diff < 60 * 60 * 1000) {
    value = Math.floor(diff / 60000);
    unit = "min";
    if (value === 0) {
      return "now";
    }
    // return min !== 0 ? min + "min(s) ago" : "방금 전";
  } else if (Math.floor(diff / (60 * 60000)) < 24) {
    value = Math.floor(diff / (60 * 60000));
    unit = "hour";
  } else if (Math.floor(diff / (60 * 60000 * 24)) < 7) {
    value = Math.floor(diff / (60 * 60000 * 24));
    unit = "day";
    // return Math.floor(diff / (60 * 60000 * 24)) + "day(s) ago";
  } else if (diff / (60 * 60000 * 24) < 30) {
    value = Math.floor(diff / (60 * 60000 * 24 * 7));
    unit = "week";
    // return Math.floor(diff / (60 * 60000 * 24 * 7)) + "week(s) ago";
  } else if (diff / (60 * 60000 * 24) < 365) {
    value = Math.floor(diff / (60 * 60000 * 24 * 30));
    unit = "week";
    // return Math.floor(diff / (60 * 60000 * 24 * 30)) + "month(s) ago";
  } else {
    value = Math.floor(diff / (60 * 60000 * 24 * 365));
    unit = "year";
    // return Math.floor(diff / (60 * 60000 * 24 * 365)) + "year(s) ago";
  }
  return value + " " + unit + (value > 1 ? "s" : "") + " ago";
};

export const getTimeString = (dateValue: Date | number) => {
  const date = new Date(dateValue.valueOf());
  return (
    date.getFullYear() +
    "-" +
    format2Digits(date.getMonth() + 1) +
    "-" +
    format2Digits(date.getDate()) +
    " " +
    format2Digits(date.getHours()) +
    ":" +
    format2Digits(date.getMinutes())
  );
};

export const getNameString = (user: {
  firstName: string;
  middleName: string | null;
  lastName: string;
}) => {
  return (
    user.firstName +
    " " +
    (user.middleName ? user.middleName + " " : "") +
    user.lastName
  );
};

export type pushNotificationData = {
  route: string;
  params: StackGeneratorParamList[keyof StackGeneratorParamList];
};

export const handleNotification = ({
  navigation,
  notification,
}: {
  navigation: NativeStackNavigationProp<StackGeneratorParamList>;
  notification: Notifications.Notification;
}) => {
  const data = notification.request.content.data as pushNotificationData;
  sendPostRequest(API_URL + "recordPushClicked", {
    pushString: getPushString(notification.request.content),
    accessToken,
  });

  if (["Post", "Chatrooms"].includes(data.route)) {
    if (data.route === "Post") {
      const params = data.params as StackGeneratorParamList["Post"];
      if (params.id) {
        navigation.navigate("Post", params);
      }
    } else if (data.route === "Chatrooms") {
      navigation.navigate("Chatrooms");
    }
  }
};

export const loadData = ({
  data,
  loadedData,
  setData,
  lastId,
}: {
  data: any[] | undefined;
  loadedData: any[];
  setData: (prop: any[]) => void;
  lastId: number | undefined;
}) => {
  if (!lastId || !data) {
    setData(loadedData);
    return;
  }

  if (!loadedData.length) return;

  const oldData = [...data];

  if (oldData[oldData.length - 1].id === lastId) {
    setData([...oldData, ...loadedData]);
  }
};

export const getPushString = (content: Notifications.NotificationContent) => {
  let str = "";
  str += content.subtitle ?? "";
  str += content.body ?? "";
  str += JSON.stringify(content.data);
  return str;
};
