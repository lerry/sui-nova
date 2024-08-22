"use client";

import { useEffect } from "react";
import Image from "next/image";

import "@mysten/dapp-kit/dist/index.css";
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
import { cn } from "@/utils";
import { FixedDatesPicker } from "./fixed-dates-picker";
import { FormDataProps, TokenProps } from "./types";

export function CreateForm({
  tokens,
  updateForm,
  formData,
}: {
  tokens: TokenProps[];
  updateForm: (form: FormDataProps) => void;
  formData: FormDataProps;
}) {
  const [showFixed, setShowFixed] = useState(true);
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [customPeriod, setCustomPeriod] = useState({ years: 0, days: 0 });

  useEffect(() => {
    const seconds = customPeriod.years * 365 * 24 * 60 * 60 + customPeriod.days * 24 * 60 * 60;
    updateForm({ ...formData, duration: seconds });
  }, [customPeriod]);

  return (
    <div className="form flex-1 border border-gray-200 rounded-lg p-4 md:p-8 sm:grid sm:grid-cols-2 gap-4">
      <div className="form-item">
        <Select
          variant="bordered"
          items={tokens}
          selectionMode="single"
          label="Token"
          size="lg"
          placeholder="Select a token"
          labelPlacement="outside"
          selectedKeys={formData.token.symbol ? [formData.token.symbol] : []}
          onSelectionChange={(selectedKeys) => {
            if (selectedKeys instanceof Set && selectedKeys.size > 0) {
              const selectedSymbol = Array.from(selectedKeys)[0] as string;
              const token = tokens.find((item) => item.symbol === selectedSymbol);
              if (token) {
                updateForm({ ...formData, token: token });
              }
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
          {(token: TokenProps) => (
            <SelectItem key={token.symbol} textValue={token.symbol}>
              <div className="flex gap-2 items-center">
                <Image
                  width={24}
                  height={24}
                  alt={token.symbol}
                  className="flex-shrink-0"
                  src={`/tokens/${token.symbol}.svg`}
                />
                <div className="flex flex-col">
                  <span className="text-small">{token.symbol}</span>
                </div>
              </div>
            </SelectItem>
          )}
        </Select>
      </div>
      <div className="form-item">
        <div className="show-label mb-1">
          <p className="text-medium text-foreground">Cancelable</p>
        </div>
        <Switch
          isSelected={formData.cancelable}
          onValueChange={(value: boolean) => {
            updateForm({ ...formData, cancelable: value });
          }}
          classNames={{
            base: cn(
              "inline-flex flex-row-reverse w-full max-w-sm hover:bg-content2 items-center",
              "justify-between cursor-pointer rounded-lg gap-2 p-4 border-2",
              "data-[selected=true]:border-primary border-default-200 h-12 rounded-large",
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
          variant="bordered"
          size="lg"
          labelPlacement="outside"
          value={formData.amount.toString()}
          onValueChange={(value) => {
            updateForm({ ...formData, amount: Number(value) });
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
          variant="bordered"
          value={formData.recipient}
          onValueChange={(value) => {
            updateForm({ ...formData, recipient: value });
          }}
          classNames={{
            base: "max-w-xs",
          }}
        />
      </div>
      <div className="form-item col-span-2 grid grid-cols-5 gap-4 items-center">
        {showFixed && (
          <>
            <div className="col-span-5">
              <Button className="w-full" size="lg" onClick={onOpenChange}>
                {customPeriod.years > 0 || customPeriod.days > 0
                  ? `Duration: ${customPeriod.years > 0 ? `${customPeriod.years} ${customPeriod.years > 1 ? "years" : "year"}` : ""} ${customPeriod.days > 0 ? `${customPeriod.days} ${customPeriod.days > 1 ? "days" : "day"}` : ""}`
                  : "Choose Duration"}
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
        {/* {!showFixed && (
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
        )} */}
        {/* <div className="col-span-2 pr-4">
          <Button
            size="lg"
            className="w-full"
            onClick={() => {
              setShowFixed(!showFixed);
            }}
          >
            {showFixed ? "Duration" : "Fixed dates"}
          </Button>
        </div> */}
      </div>
    </div>
  );
}