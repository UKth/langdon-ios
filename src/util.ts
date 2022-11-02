import { userContextType } from "./contexts/userContext";
import { API_URL } from "./constants/urls";
import { Alert } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { ACCESS_TOKEN_KEY, REFRESH_TOKEN_KEY } from "./constants/storageKeys";

const logout = (ctx: userContextType) => {
  ctx.setUser(undefined);
};

export const sendPostRequest = async (url = "", data = {}) => {
  console.log("URL:", url);
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
};

const refreshAccessToken = async (ctx: userContextType) => {
  // const refreshToken = await AsyncStorage.getItem(REFRESH_TOKEN_KEY);
  const res = await sendPostRequest(API_URL + "user/refreshAccessToken", {
    refreshToken: refreshToken,
  });

  if (!res?.ok) {
    console.log("ERROR!", res.error);
    Alert.alert(res.error);
    logout(ctx);
    return;
  }
  if (res.accessToken) {
    accessToken = res.accessToken;
    AsyncStorage.setItem(ACCESS_TOKEN_KEY, res.accessToken);
  }
  if (res.refreshToken) {
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
        console.log("RETURN:", res);
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
