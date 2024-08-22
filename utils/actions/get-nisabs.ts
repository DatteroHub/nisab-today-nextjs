"use server";

export const getNisabs = async () => {
  const NISAB_API_URL = "https://api.nisabtoday.org/getall";
  try {
    const response = await fetch(NISAB_API_URL, {
      method: "GET",
      headers: { "x-api-key": process.env.NISAB_API_KEY! },
    });
    const json = await response.json();
    if (json && json.success) {
      return json.data;
    } else {
      return json.error;
    }
  } catch (err: any) {
    return err;
  }
};
