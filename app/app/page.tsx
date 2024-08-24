"use client";
import { useState } from "react";
import { Tabs, Tab, CircularProgress } from "@nextui-org/react";

import { useRouter } from "next/navigation";
import { Link } from "@nextui-org/react";
import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Button,
} from "@nextui-org/react";
import { Breadcrumbs, BreadcrumbItem } from "@nextui-org/react";
import React from "react";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
} from "@nextui-org/react";

import { cn } from "@/utils";
import { title } from "@/components/primitives";
import { IconMoreVertical } from "@/components/icons";
function BreadcrumbsComponent() {
  return (
    <Breadcrumbs>
      <BreadcrumbItem href="/app">All Streams</BreadcrumbItem>
    </Breadcrumbs>
  );
}

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

const tableColumns = [
  {
    label: "FROM/TO",
    key: "from_to",
  },
  {
    label: "Amount",
    key: "amount",
  },
  {
    label: "Status",
    key: "status",
  },
  {
    label: "Created At",
    key: "created_at",
  },
  // {
  //   label: "Ends At",
  //   key: "ends_at",
  // },
  {
    label: "Progress",
    key: "progress",
  },
  {
    label: "Actions",
    key: "actions",
  },
];

const fakeStreams = [
  {
    id: "1",
    from: "0x123e...789d",
    to: "0x456",
    amount: "100",
    status: "active",
    createdAt: "2024-08-01",
    endsAt: "2024-08-02",
    progress: "3%",
  },
  {
    id: "2",
    from: "0x7dce...186c",
    to: "0x01c2",
    amount: "200",
    status: "active",
    createdAt: "2024-08-16",
    endsAt: "2024-08-02",
    progress: "30%",
  },
  {
    id: "3",
    from: "0x3f5c...186c",
    to: "0x67c8",
    amount: "300",
    status: "active",
    createdAt: "2024-08-20",
    endsAt: "2024-09-20",
    progress: "50%",
  },
  {
    id: "4",
    from: "0xc01cf...234d",
    to: "0x234",
    amount: "400",
    status: "completed",
    createdAt: "2024-08-01",
    endsAt: "2024-08-02",
    progress: "100%",
  },
];

function StreamActions({ stream }: { stream: (typeof fakeStreams)[0] }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Dropdown isOpen={isOpen}>
      <DropdownTrigger>
        <Button
          isIconOnly
          aria-label="More"
          size="sm"
          variant="bordered"
          onMouseEnter={() => setIsOpen(true)}
          onMouseLeave={() => setIsOpen(false)}
        >
          <IconMoreVertical height={18} />
        </Button>
      </DropdownTrigger>
      <DropdownMenu aria-label="Static Actions">
        <DropdownItem key="new">Cancel </DropdownItem>
        <DropdownItem key="copy">Copy Stream</DropdownItem>
      </DropdownMenu>
    </Dropdown>
  );
}

export default function AppPage() {
  const router = useRouter();
  const handleSelectionChange = (key: any) => {
    router.push(`/app?type=${key}`);
  };

  return (
    <section className="flex flex-col gap-4">
      <h1 className={cn(title(), "!text-2xl py-6")}>All Streams</h1>
      <div className="flex justify-between min-w-md overflow-x-auto   flex-col-reverse lg:flex-row">
        <Tabs
          aria-label="Options"
          color="primary"
          size="lg"
          variant="bordered"
          onSelectionChange={handleSelectionChange}
        >
          {tabs.map((tab) => (
            <Tab key={tab.value} title={tab.label} />
          ))}
        </Tabs>
        <Button
          as={Link}
          color="primary"
          href="/create"
          size="lg"
          className="lg:mt-0 mb-4"
        >
          Create Stream
        </Button>
      </div>

      <Table aria-label="Example static collection table min-w-md overflow-x-auto">
        <TableHeader>
          {tableColumns.map((column) => (
            <TableColumn key={column.key}>{column.label}</TableColumn>
          ))}
        </TableHeader>
        <TableBody>
          {fakeStreams
            .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
            .map((stream) => (
              <TableRow
                key={stream.id}
                className="hover:bg-background/50 cursor-pointer"
                onClick={() =>
                  router.push(
                    `/stream/$9DeT6dQNq438uQZbFYGtT93HRzFjK4bWN3WvHX9iVqWM`,
                  )
                }
              >
                <TableCell>{stream.from}</TableCell>
                <TableCell>{stream.amount}</TableCell>
                <TableCell>
                  <span
                    className={cn(
                      "px-2 py-1 rounded-md font-medium text-sm",
                      stream.status === "completed"
                        ? "bg-gray-500 "
                        : "bg-green-500",
                    )}
                  >
                    {stream.status.toUpperCase()}
                  </span>
                </TableCell>
                <TableCell>{stream.createdAt}</TableCell>
                {/* <TableCell>{stream.endsAt}</TableCell> */}
                <TableCell>
                  <CircularProgress
                    value={parseInt(stream.progress)}
                    size="lg"
                    color="primary"
                    aria-label="Loading..."
                    showValueLabel={true}
                  />
                </TableCell>
                <TableCell>
                  <StreamActions stream={stream} />
                </TableCell>
              </TableRow>
            ))}
        </TableBody>
      </Table>
    </section>
  );
}
