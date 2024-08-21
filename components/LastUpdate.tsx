"use client";
import { Alert, AlertDescription, AlertTitle } from "./ui/alert";
import { BadgeCheck } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./ui/tooltip";
import useNisabPrices from "@/utils/hooks/useNisabPrices";
import { Skeleton } from "./ui/skeleton";
import { format, formatDistanceToNow } from "date-fns";

const LastUpdate = () => {
  const { data, loading } = useNisabPrices();

  return (
    <>
      {loading || !data ? (
        <Skeleton className="h-20 w-full lg:w-44 rounded-3xl" />
      ) : (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Alert className="pr-6 text-green-600 border-green-600 rounded-3xl">
                <BadgeCheck className="h-5 w-5" color="#16a34a" />
                <AlertTitle>Last update</AlertTitle>
                <AlertDescription>
                  {formatDistanceToNow(new Date(data.timestamp * 1000), {
                    addSuffix: true,
                  })}
                </AlertDescription>
              </Alert>
            </TooltipTrigger>
            <TooltipContent>
              Updated: {format(new Date(data.timestamp * 1000), "d MMMM y")} at{" "}
              {format(new Date(data.timestamp * 1000), "kk:mm a")}
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      )}
    </>
  );
};

export default LastUpdate;
