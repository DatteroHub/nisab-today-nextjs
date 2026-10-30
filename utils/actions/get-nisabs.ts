"use server";

import { fetchNisabApi, NisabSnapshot } from "@/lib/nisab-api";

export const getNisabs = async (): Promise<NisabSnapshot> => {
  return fetchNisabApi<NisabSnapshot>("/getall");
};
