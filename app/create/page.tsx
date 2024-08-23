"use client";

import { useCallback } from "react";
import { title } from "@/components/primitives";
import Image from "next/image";
import {
  useSuiClientQuery,
  useCurrentAccount,
  useSignAndExecuteTransaction,
} from "@mysten/dapp-kit";

// Remove this line
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
  MenuItem,
} from "@nextui-org/react";
import React from "react";
import { MIST_PER_SUI } from "@mysten/sui/utils";
import { cn } from "@/utils";
import { now, getLocalTimeZone } from "@internationalized/date";
import { FixedDatesPicker } from "./fixed-dates-picker";
import { IconBack } from "@/components/icons";


function QueryWalletBalance() {
  const my_account = useCurrentAccount();
  const { data, isPending, error, refetch } = useSuiClientQuery('getBalance', {
    owner: my_account?.address as string,
  });

  console.log(`balance data:  ${JSON.stringify(data, null, 2)}`);
  const my_balance = Number.parseInt(data?.totalBalance ?? '0') / Number(MIST_PER_SUI);

  return (
      <div>My wallet balance is : {my_balance} SUI.</div>
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


  async function CreatePoolAndPayStream() {

    const { mutate: signAndExecute } =useSignAndExecuteTransaction();

    const depositAmount = 2;
    const recipient = "0x123";
    const amountPerSec = 1;

    const tx = new Transaction();

    // 1.split coins
    const [depositCoin] = tx.splitCoins(tx.gas, [MIST_PER_SUI * BigInt(depositAmount)]);

    // 2.Calling smart contract function to create payer pool
    const [payerPoolAddr] = tx.moveCall({
      target: `0x29379cc662cd00266b9bb87db9cadfdafd1bd5215bc4b3dc9779653a66e01a0e::liner_pay::createAndDeposit`,
      arguments: [
        depositCoin
      ],
    });

    // 3.Calling smart contract function to create stream
    const [recivierCardId] = tx.moveCall({
      target: `0x29379cc662cd00266b9bb87db9cadfdafd1bd5215bc4b3dc9779653a66e01a0e::liner_pay::createStream`,
      arguments: [
        tx.object(payerPoolAddr),
        tx.object(recipient),
        tx.pure.option('u8', amountPerSec),
      ],
    });

    signAndExecute(
      {
        transaction: tx,
        // options: {
        //   showObjectChanges: true,
        // },
      },
      {
        onError: (err: Error) => {
          console.error(err.message);
        },
        onSuccess: (result) => {
          console.log("executed create pool and stream transaction", result);
        },
      },
    );
  }

  return (
    <section className="flex flex-col  gap-4 py-8 md:py-10">
      <div className="flex items-center pb-8">
        <IconBack
          className="border border-white rounded-full mr-4"
          width={35}
          height={35}
          color="white"
        />
        <h2 className={cn(title(), "!text-3xl")}>Create Stream</h2>
      </div>
      <div>
        <h3><QueryWalletBalance /></h3>
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
                  <div key={item.key}>
                    {item.rendered}
                  </div>
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
          <Button className="w-full mt-4" color="primary" size="lg" onClick={CreatePoolAndPayStream}>
            Create
          </Button>
        </div>
      </div>
    </section>
  );
}