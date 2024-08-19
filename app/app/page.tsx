"use client";
import { title } from "@/components/primitives";
import { WalletStatus } from "@/components/WalletStatus";
import { cn } from "@/utils";
import { Tabs, Tab } from "@nextui-org/react";
import { Button } from "@nextui-org/react";
import { useRouter } from "next/navigation";
import { Link } from "@nextui-org/react";

const tabs = [
  {
    label: "All Streams",
    value: "all",
  },
  {
    label: "As recipient",
    value: "recipient",
  },
  {
    label: "As sender",
    value: "sender",
  },
];

export default function AppPage() {
  const router = useRouter();
  const handleSelectionChange = (key: any) => {
    router.push(`/app?type=${key}`);
  };
  return (
    <section className="flex flex-col gap-4 py-8 md:py-10">
      <h1 className={cn(title(), "!text-2xl")}>All Streams</h1>
      <div className="flex justify-between">
        <Tabs
          aria-label="Options"
          color="primary"
          variant="bordered"
          size="lg"
          onSelectionChange={handleSelectionChange}
        >
          {tabs.map((tab) => (
            <Tab key={tab.value} title={tab.label} />
          ))}
        </Tabs>
        <Button color="primary" size="lg" as={Link} href="/create">
          Create Stream
        </Button>
      </div>
    </section>
  );
}
