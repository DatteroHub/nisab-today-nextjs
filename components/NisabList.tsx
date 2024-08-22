"use client";
import { Search, Weight } from "lucide-react";
import { Button } from "./ui/button";
import { Separator } from "./ui/separator";
import { useEffect, useMemo, useState } from "react";
import { detailedCurrencies, orderedCurrencies } from "@/lib/currencies";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Badge } from "./ui/badge";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Input } from "./ui/input";
import { useGetNisabs } from "@/utils/hooks/useGetNisabs";
import { Skeleton } from "./ui/skeleton";

type SingleNisab = {
  currency_name: string;
  currency_code: string;
  currency_symbol: string;
  countries: string[];
  gold: number;
  silver: number;
};

const NisabList = () => {
  const { data, isPending } = useGetNisabs();

  const [nisabs, setNisabs] = useState<SingleNisab[]>([]);
  const [selectedMetal, setSelectedMetal] = useState("gold");
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    // format data
    const nisabs: SingleNisab[] = [];
    if (data && data.nisab !== undefined) {
      orderedCurrencies.forEach((currency) => {
        if (
          data.nisab[currency] !== undefined &&
          detailedCurrencies[currency] !== undefined
        ) {
          nisabs.push({
            ...detailedCurrencies[currency],
            gold: data.nisab[currency].gold,
            silver: data.nisab[currency].silver,
          });
        }
      });
      setNisabs(nisabs);
    }
  }, [data]);

  // filter on search input
  const filteredData = useMemo(() => {
    return nisabs.filter((item) => {
      const searchString = searchTerm.toLowerCase();
      return (
        item.currency_name.toLowerCase().includes(searchString) ||
        item.currency_code.toLowerCase().includes(searchString) ||
        item.currency_symbol.toLowerCase().includes(searchString) ||
        item.countries.some((country) =>
          country.toLowerCase().includes(searchString)
        )
      );
    });
  }, [nisabs, searchTerm]);

  const formatPrice = (price: number) => {
    // TODO add support to other locals
    return price.toLocaleString("de-DE");
  };

  return (
    <div className="w-full grid gap-8">
      <div className="relative ml-auto w-full lg:w-2/5">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          type="search"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search by country, currency code or symbol"
          className="text-gray-800 rounded-2xl bg-background pl-8 focus-visible:ring-transparent border-gray-600"
        />
      </div>
      <div className="grid lg:flex gap-8 items-start">
        <div className="lg:sticky top-8 flex lg:grid gap-4 mx-auto">
          <Button
            variant="outline"
            className={`h-16 lg:h-32 w-32 rounded-3xl text-lg text-amber-500 hover:text-amber-500 hover:bg-gray-50 border-2 ${
              selectedMetal == "gold" ? "border-amber-500" : ""
            }`}
            onClick={() => setSelectedMetal("gold")}
          >
            <Weight className="mr-3 h-5 w-5" />
            Gold
          </Button>
          <Button
            variant="outline"
            className={`h-16 lg:h-32 w-32 rounded-3xl text-lg text-stone-500 hover:text-stone-500 hover:bg-gray-50 border-2 ${
              selectedMetal == "silver" ? "border-stone-500" : ""
            }`}
            onClick={() => setSelectedMetal("silver")}
          >
            <Weight className="mr-3 h-5 w-5" />
            Silver
          </Button>
        </div>
        <Separator
          orientation="vertical"
          className="sticky hidden lg:block top-10 mx-4 mt-2 h-64 w-0.5 rounded-full bg-slate-200"
        />
        {isPending || !nisabs.length ? (
          <div className="w-full grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {Array.from(Array(8)).map((_, index) => {
              return <Skeleton key={index} className="h-56 rounded-3xl" />;
            })}
          </div>
        ) : (
          <div className="w-full grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filteredData.map((currency, index) => {
              return (
                <Card
                  key={index}
                  className={`rounded-3xl h-full border-2 ${
                    selectedMetal == "gold"
                      ? "border-amber-500"
                      : "border-stone-500"
                  }`}
                >
                  <CardHeader className="relative">
                    <Badge variant="outline" className="absolute top-4 right-4">
                      {currency.currency_symbol}
                    </Badge>
                    <CardTitle className="flex text-sm">
                      {currency.currency_code}
                    </CardTitle>
                    <CardDescription>{currency.currency_name}</CardDescription>
                  </CardHeader>
                  <CardContent className="text-center text-2xl font-semibold">
                    {currency.currency_symbol}{" "}
                    {selectedMetal == "gold"
                      ? formatPrice(currency.gold)
                      : formatPrice(currency.silver)}
                  </CardContent>
                  <CardFooter className="justify-center">
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="link"
                          className="text-xs text-muted-foreground underline"
                        >
                          Countries
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-fit max-w-60 text-sm text-muted-foreground border-gray-600">
                        {currency.countries.join(", ")}
                      </PopoverContent>
                    </Popover>
                  </CardFooter>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default NisabList;
