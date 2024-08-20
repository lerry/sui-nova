"use client";
import { useState } from "react";
import { title } from "@/components/primitives";
import { cn } from "@/utils";
import { Tabs, Tab } from "@nextui-org/react";
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
  {
    label: "Ends At",
    key: "ends_at",
  },
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
    from: "0x123",
    to: "0x456",
    amount: "100",
    status: "active",
    createdAt: "2021-01-01",
    endsAt: "2021-01-02",
    progress: "0%",
  },
  {
    id: "2",
    from: "0x789",
    to: "0x012",
    amount: "200",
    status: "active",
    createdAt: "2021-01-01",
    endsAt: "2021-01-02",
    progress: "0%",
  },
  {
    id: "3",
    from: "0x345",
    to: "0x678",
    amount: "300",
    status: "active",
    createdAt: "2021-01-01",
    endsAt: "2021-01-02",
    progress: "0%",
  },
  {
    id: "4",
    from: "0x901",
    to: "0x234",
    amount: "400",
    status: "active",
    createdAt: "2021-01-01",
    endsAt: "2021-01-02",
    progress: "0%",
  },
];

function StreamActions({ stream }: { stream: (typeof fakeStreams)[0] }) {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <Dropdown isOpen={isOpen}>
      <DropdownTrigger>
        <Button
          isIconOnly
          size="sm"
          variant="bordered"
          aria-label="More"
          onMouseEnter={() => setIsOpen(true)}
          onMouseLeave={() => setIsOpen(false)}
        >
          <IconMoreVertical />
        </Button>
      </DropdownTrigger>
      <DropdownMenu aria-label="Static Actions">
        <DropdownItem key="new">New file</DropdownItem>
        <DropdownItem key="copy">Copy link</DropdownItem>
        <DropdownItem key="edit">Edit file</DropdownItem>
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
      {/* <BreadcrumbsComponent /> */}
      <h1 className={cn(title(), "!text-2xl py-6")}>All Streams</h1>
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

      <Table aria-label="Example static collection table">
        <TableHeader>
          {tableColumns.map((column) => (
            <TableColumn key={column.key}>{column.label}</TableColumn>
          ))}
        </TableHeader>
        <TableBody>
          {fakeStreams.map((stream) => (
            <TableRow key={stream.id}>
              <TableCell>{stream.from}</TableCell>
              <TableCell>{stream.amount}</TableCell>
              <TableCell>{stream.status}</TableCell>
              <TableCell>{stream.createdAt}</TableCell>
              <TableCell>{stream.endsAt}</TableCell>
              <TableCell>{stream.progress}</TableCell>
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
