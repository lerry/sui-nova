"use client";

import { useEffect, useState } from "react";
import "@mysten/dapp-kit/dist/index.css";
import {
  CircularProgress,
  Card,
  Button,
  CardBody,
  CardFooter,
  Chip,
  Snippet,
  Breadcrumbs,
  BreadcrumbItem,
  Divider,
} from "@nextui-org/react";

import Link from "next/link";
import { IconBack } from "@/components/icons";
import { title } from "@/components/primitives";

const beginTime = Date.now();
const totalAmount = 1000;
const currentAmount = 385.2546;
// 2天
const willEndSeconds = 1000 * 60 * 60 * 24 * 2;

const fakeInfo = [
  {
    label: "Stream ID",
    value: "9DeT6..VqWM",
  },
  {
    label: "From Address",
    value: "0x123e...789d",
  },
  {
    label: "To Address",
    value: "0x456c...186c",
  },
  {
    label: "Token",
    value: "SUI",
  },
  {
    label: "Total Amount",
    value: totalAmount,
  },
  {
    label: "Status",
    value: "In Progress",
  },
  {
    label: "Cancelable",
    value: "No",
  },
  {
    label: "Started From",
    value: "22 Aug 2024",
  },
];

export default function CreatePage() {
  const [value, setValue] = useState(currentAmount);

  useEffect(() => {
    const interval = setInterval(() => {
      const timeDiff = Date.now() - beginTime;
      const percentage =
        (currentAmount / totalAmount) * 100 + (timeDiff / willEndSeconds) * 100;
      console.log(percentage);
      setValue(percentage);
    }, 500);
    return () => clearInterval(interval);
  }, []);
  return (
    <section className="gap-8 md:py-10">
      <div className="show-stream flex gap-4 flex-col lg:flex-row">
        <div className="show-graph bg-[#26262c] rounded-lg p-4 flex justify-center items-center relative flex-1 bg-gradient-to-r from-background/10 to-background">
          <CircularProgress
            classNames={{
              svg: "lg:w-96 lg:h-96 w-64 h-64 md:w-72 md:h-72",
              indicator: "stroke-primary",
              track: "stroke-primary/10",
              value: "text-3xl font-semibold text-primary",
            }}
            value={value}
            strokeWidth={2}
            aria-label="current value"
          />
          <div
            className="show-value absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex flex-col items-center  font-mono"
            aria-live="polite"
          >
            <div className="icon">
              <img src="/tokens/SUI.svg" alt="sui-icon" className="w-8" />
            </div>
            <div className="text-2xl font-semibold mt-4">
              {((totalAmount * value) / 100).toFixed(4)}
            </div>
            <div className="text-sm text-foreground/50 mt-2">
              Out of 1000 SUI
            </div>
          </div>
        </div>

        <div className="show-info basis-1/3 rounded-lg border border-b-none border-box border-background/50">
          <div className="flex gap-2 items-center text-2xl py-6 pl-4 ">
            <IconBack className="w-8 h-8 bg-gray-700 rounded-full" />
            <Breadcrumbs>
              <BreadcrumbItem>
                <Link href="/app">Streams</Link>
              </BreadcrumbItem>
              <BreadcrumbItem>
                <span className="text-foreground">9DeT6..VqWM</span>
              </BreadcrumbItem>
            </Breadcrumbs>
          </div>
          <div className="show-info  bg-background/80 rounded-lg p-4 ">
            <div className="header text-2xl font-semibold flex justify-between items-center">
              <span>Attributes</span>
            </div>
            <Divider className="my-4" />
            <div className="content ">
              {fakeInfo.map((item) => (
                <div
                  className="item text-sm text-foreground/70 flex items-center justify-between h-10"
                  key={item.label}
                >
                  <div className="label ">{item.label} </div>
                  {item.label === "Stream ID" ||
                  item.label === "From Address" ||
                  item.label === "To Address" ? (
                    <Snippet className="text-sm" size="sm" hideSymbol={true}>
                      {item.value}
                    </Snippet>
                  ) : (
                    <div className="value text-sm font-semibold text-foreground">
                      {item.value}
                    </div>
                  )}
                </div>
              ))}
            </div>
            <Divider className="my-4" />
            <div className="show-actions flex justify-between">
              <Button>Cancel</Button>
              <Button>Withdraw</Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
