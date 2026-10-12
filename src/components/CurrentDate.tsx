"use client";

import { useSyncExternalStore } from "react";

const subscribe = () => () => {};
const getCurrentDate = () =>
  new Date().toLocaleDateString("bn-BD", { dateStyle: "full" });
const getServerDate = () => "";

export default function CurrentDate() {
  return useSyncExternalStore(subscribe, getCurrentDate, getServerDate);
}
