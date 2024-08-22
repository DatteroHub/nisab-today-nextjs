import { useQuery } from "@tanstack/react-query";
import { getNisabs } from "@/utils/actions/get-nisabs";

export const useGetNisabs = () => {
  return useQuery({
    queryKey: ["get_nisabs"],
    queryFn: () => getNisabs(),
  });
};
