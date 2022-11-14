import { ReportTargetType, Table } from "@customTypes/models";
import { Alert } from "react-native";
import { API_URL, messages } from "./constants";
import { userContextType } from "./contexts/userContext";
import { postData } from "./util";

export const addClass = async (ctx: userContextType, classId: number) => {
  const data = await postData(ctx, API_URL + "course/class/enrollClass", {
    classId,
  });
  if (!data?.ok) {
    Alert.alert("Add failed.\n" + data?.error);
  } else {
    Alert.alert(messages.messages.class.added);
  }
};

export const deleteClass = async (ctx: userContextType, classId: number) => {
  const data = await postData(ctx, API_URL + "course/class/dropClass", {
    classId,
  });
  if (!data?.ok) {
    Alert.alert("Delete failed.\n" + data?.error);
  } else {
    Alert.alert(messages.messages.class.deleted);
  }
};

export const getEnrolledClasses = async (
  ctx: userContextType,
  targetId?: number
) => {
  const data = await postData(
    ctx,
    API_URL + "course/class/getEnrolledClasses",
    targetId ? { targetId } : {}
  );
  if (!data?.ok) {
    Alert.alert("Failed with fetching enrolled classes.\n" + data?.error);
    return [];
  }
  return data?.enrolledClasses;
};

export const getTable = async (
  ctx: userContextType,
  params?: { targetId?: number; tableId?: number }
): Promise<Table | undefined> => {
  const { targetId, tableId } = params ?? {};
  const data = await postData(ctx, API_URL + "table/getTable", {
    ...(targetId ? { targetId } : {}),
    ...(tableId ? { tableId } : {}),
  });
  if (data?.ok) {
    return data?.table;
  } else {
    Alert.alert("Failed with fetching table.");
    console.error(data?.error);
  }
};

export const reportIssue = async (
  ctx: userContextType,
  params: {
    content: string;
    targetId: number;
    targetType: ReportTargetType;
  }
) => {
  const data = await postData(ctx, API_URL + "report/createReport", params);
  if (!data?.ok) {
    Alert.alert("Failed to send report.\n" + data?.error);
    return;
  }
  Alert.alert(messages.messages.report.reportCreated);
};
