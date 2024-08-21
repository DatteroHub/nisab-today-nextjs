"use client";
import { env } from "process";
import { useEffect, useState } from "react";

type NisabPrices = {
  timestamp: number;
  nisab: {
    [currencyCode: string]: {
      gold: number;
      silver: number;
    };
  };
};

export default function useNisabPrices() {
  const NISAB_API_URL = "https://api.nisabtoday.org/getall";
  const [data, setData] = useState<NisabPrices | null>(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    (async function () {
      try {
        setLoading(true);
        const response = await fetch(NISAB_API_URL, {
          method: 'GET',
          headers: { "x-api-key": process.env.NISAB_API_KEY! },
        });
        const json = await response.json();
        if (json && json.success) {
          setData(json.data);
        } else {
          setError(json.error);
        }
      } catch (err: any) {
        setError(err);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return { data, error, loading };
}
