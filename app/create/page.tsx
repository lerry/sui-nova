"use client";

import { title } from "@/components/primitives";
import Image from "next/image";
import {
  useSuiClientQuery,
  useCurrentAccount,
  useSignAndExecuteTransaction,
} from "@mysten/dapp-kit";
import "@mysten/dapp-kit/dist/index.css";
import { Transaction } from "@mysten/sui/transactions";
import { useState } from "react";
import {
  Button,
  Select,
  SelectItem,
  Input,
  Switch,
  DatePicker,
  useDisclosure,
} from "@nextui-org/react";
import React from "react";
import { MIST_PER_SUI } from "@mysten/sui/utils";
import { cn } from "@/utils";
import { now, getLocalTimeZone } from "@internationalized/date";
import { FixedDatesPicker } from "./fixed-dates-picker";

function QueryObjects() {
  const { data, isPending, error, refetch } = useSuiClientQuery(
    "getOwnedObjects",
    {
      owner:
        "0xc494732d09de23389dbe99cb2f979965940a633cf50d55caa80ed9e4fc4e521e",
    },
  );

  if (isPending) {
    return <div>Loading...</div>;
  }

  return <pre>{JSON.stringify(data, null, 2)}</pre>;
}

function CreatePool() {
  const { mutate: signAndExecuteTransaction } = useSignAndExecuteTransaction();
  const [digest, setDigest] = useState("");
  const currentAccount = useCurrentAccount();

  const tx = new Transaction();
  tx.moveCall({
    target:
      "0x8096b927f041dbcb156aa0dfa8e6804fe8c9383d9ed15dee5fae5c2d70cd7dd7::liner_pay::createAndDeposit",
    arguments: [
      tx.object(
        "0x373569027e0fdd0203b22d061307336c3fa7f9b7b0b82225144bbc436c6fa20a",
      ),
    ],
  });

  return (
    <div style={{ padding: 20 }}>
      {currentAccount && (
        <>
          <div>
            <Button
              color="primary"
              onClick={() => {
                signAndExecuteTransaction(
                  {
                    transaction: tx,
                  },
                  {
                    onSuccess: (result) => {
                      console.log("executed create pool transaction", result);
                      setDigest(result.digest);
                    },
                  },
                );
              }}
            >
              Create Pool
            </Button>
          </div>
          <div>Digest: {digest}</div>
        </>
      )}
    </div>
  );
}

function WalletBalance() {
  const my_account = useCurrentAccount();
  const balance = (balance: Record<string, any>) => {
    return Number.parseInt(balance.totalBalance) / Number(MIST_PER_SUI);
  };

  const { data, isPending, error, refetch } = useSuiClientQuery("getBalance", {
    owner: my_account?.address as string,
  });
  console.log(`balance data:  ${data && balance(data)} SUI`);

  // todo 判断 amount、balance

  // todo merge coins

  // create pool

  return (
    <div>
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </div>
  );
}

const coins: { label: string; value: string }[] = [
  {
    label: "DAI",
    value: "DAI",
  },
  {
    label: "USDC",
    value: "USDC",
  },
  {
    label: "USDT",
    value: "USDT",
  },
];

export default function CreatePage() {
  const [form, setForm] = useState({
    token: coins[0].value,
    amount: 100,
    recipient: "0x999666",
    duration: 1000,
    cancelable: true,
  });
  const [showFixed, setShowFixed] = useState(true);
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [customPeriod, setCustomPeriod] = useState({ years: 0, days: 0 });

  return (
    <section className="flex flex-col  gap-4 py-8 md:py-10">
      <div className="inline-block max-w-lg ">
        <h1 className={title()}>Create Stream</h1>
        {/* <QueryObjects /> */}
        <CreatePool />
        <WalletBalance />
      </div>
      <div className="panel flex flex-col lg:flex-row gap-8">
        <div className="form flex-1 border border-gray-200 rounded-lg p-4 md:p-8 sm:grid sm:grid-cols-2 gap-4">
          <div className="form-item">
            <Select
              items={coins}
              selectionMode="single"
              label="Token"
              placeholder="Select a token"
              labelPlacement="outside"
              selectedKeys={[form.token]}
              onSelectionChange={(selectedKeys) => {
                if (selectedKeys.currentKey) {
                  setForm({ ...form, token: selectedKeys.currentKey });
                }
              }}
              classNames={{
                base: "max-w-xs",
                trigger: "h-12",
              }}
              renderValue={(items) => {
                return items.map((item) => (
                  <div key={item.key}>{item.rendered}</div>
                ));
              }}
            >
              {(item) => (
                <SelectItem key={item.value} textValue={item.label}>
                  <div className="flex gap-2 items-center">
                    <Image
                      width={24}
                      height={24}
                      alt={item.label}
                      className="flex-shrink-0"
                      src={`/coins/${item.label}.png`}
                    />
                    <div className="flex flex-col">
                      <span className="text-small">{item.label}</span>
                    </div>
                  </div>
                </SelectItem>
              )}
            </Select>
          </div>
          <div className="form-item">
            <div className="show-label">
              <p className="text-sm">Cancelable</p>
            </div>
            <Switch
              isSelected={form.cancelable}
              onValueChange={(value: boolean) => {
                setForm({ ...form, cancelable: value });
              }}
              classNames={{
                base: cn(
                  "inline-flex flex-row-reverse w-full max-w-sm bg-content1 hover:bg-content2 items-center",
                  "justify-between cursor-pointer rounded-lg gap-2 p-4 border-2 border-transparent",
                  "data-[selected=true]:border-primary",
                ),
                wrapper: "p-0 h-4 overflow-visible",
                thumb: cn(
                  "w-6 h-6 border-2 shadow-lg",
                  "group-data-[hover=true]:border-primary",
                  //selected
                  "group-data-[selected=true]:ml-6",
                  // pressed
                  "group-data-[pressed=true]:w-7",
                  "group-data-[selected]:group-data-[pressed]:ml-4",
                ),
              }}
            >
              <div className="flex flex-col gap-1">
                <p className="text-medium">Cancelability </p>
              </div>
            </Switch>
          </div>
          <div className="form-item">
            <Input
              label="Amount"
              placeholder="Fill in the amount"
              type="number"
              size="lg"
              labelPlacement="outside"
              value={form.amount.toString()}
              onValueChange={(value) => {
                setForm({ ...form, amount: Number(value) });
              }}
              classNames={{
                base: "max-w-xs",
              }}
            />
          </div>
          <div className="form-item">
            <Input
              label="Recipient"
              placeholder="Fill in the recipient address"
              type="text"
              size="lg"
              labelPlacement="outside"
              value={form.recipient}
              onValueChange={(value) => {
                setForm({ ...form, recipient: value });
              }}
              classNames={{
                base: "max-w-xs",
              }}
            />
          </div>
          <div className="form-item col-span-2 grid grid-cols-5 gap-4 items-center">
            {showFixed && (
              <>
                <div className="col-span-3">
                  <Button className="w-full" size="lg" onClick={onOpenChange}>
                    {customPeriod.years > 0 || customPeriod.days > 0
                      ? `${customPeriod.years > 0 ? `${customPeriod.years} ${customPeriod.years > 1 ? "years" : "year"}` : ""} ${customPeriod.days > 0 ? `${customPeriod.days} ${customPeriod.days > 1 ? "days" : "day"}` : ""}`
                      : "Choose Date"}
                  </Button>
                  <FixedDatesPicker
                    isOpen={isOpen}
                    onOpenChange={onOpenChange}
                    customPeriod={customPeriod}
                    setCustomPeriod={setCustomPeriod}
                  />
                </div>
              </>
            )}
            {!showFixed && (
              <>
                <DatePicker
                  className="col-span-2"
                  label="Event Date"
                  variant="bordered"
                  hideTimeZone
                  showMonthAndYearPickers
                  defaultValue={now(getLocalTimeZone())}
                />
                <DatePicker
                  className="col-span-2"
                  label="Event Date"
                  variant="bordered"
                  hideTimeZone
                  showMonthAndYearPickers
                  defaultValue={now(getLocalTimeZone())}
                />
              </>
            )}
            <div className="col-span-2 pr-4">
              <Button
                size="lg"
                className="w-full"
                onClick={() => {
                  setShowFixed(!showFixed);
                }}
              >
                {showFixed ? "Duration" : "Fixed dates"}
              </Button>
            </div>
          </div>
        </div>
        <div className="summary basis-[460px] ">
          <div className="show-summary border border-gray-200 rounded-lg p-4 md:p-8">
            <div className="flex flex-col gap-4"></div>
          </div>
          <Button className="w-full mt-4" color="primary" size="lg">
            Create
          </Button>
        </div>
      </div>
    </section>
  );
}
