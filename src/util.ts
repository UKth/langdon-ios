export const postData = async (url = "", data = {}) => {
  const response = await fetch(url, {
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
  return response.json();
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
