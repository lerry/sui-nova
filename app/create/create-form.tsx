"use client";

import { useEffect } from "react";

import "@mysten/dapp-kit/dist/index.css";
import { useState } from "react";
import {
  Button,
  Select,
  SelectItem,
  Input,
  Switch,
  useDisclosure,
} from "@nextui-org/react";
import React from "react";

import { FixedDatesPicker } from "./fixed-dates-picker";
import { FormDataProps, TokenProps } from "./types";

import { cn } from "@/utils";

export function CreateForm({
  className,
  tokens,
  updateForm,
  formData,
}: {
  className: string;
  tokens: TokenProps[];
  updateForm: (form: FormDataProps) => void;
  formData: FormDataProps;
}) {
  const [showFixed, setShowFixed] = useState(true);
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [customPeriod, setCustomPeriod] = useState({ years: 0, days: 0 });

  useEffect(() => {
    const seconds =
      customPeriod.years * 365 * 24 * 60 * 60 +
      customPeriod.days * 24 * 60 * 60;

    updateForm({ ...formData, duration: seconds });
  }, [customPeriod]);

  return (
    <div
      className={cn(
        " form border border-gray-200 rounded-lg p-4 md:p-8 grid grid-cols-1 md:grid-cols-2  gap-4 gap-y-8 content-start",
        className,
      )}
    >
      <div className="form-item">
        <Select
          classNames={{
            base: "w-full",
            trigger: "h-12",
          }}
          items={tokens}
          label="Token"
          labelPlacement="outside"
          placeholder="Select a token"
          renderValue={(items) => {
            return items.map((item) => (
              <div key={item.key}>{item.rendered}</div>
            ));
          }}
          selectedKeys={formData.token.symbol ? [formData.token.symbol] : []}
          selectionMode="single"
          size="lg"
          variant="bordered"
          onSelectionChange={(selectedKeys) => {
            if (selectedKeys instanceof Set && selectedKeys.size > 0) {
              const selectedSymbol = Array.from(selectedKeys)[0] as string;
              const token = tokens.find(
                (item) => item.symbol === selectedSymbol,
              );

              if (token) {
                updateForm({ ...formData, token: token });
              }
            }
          }}
        >
          {(token: TokenProps) => (
            <SelectItem key={token.symbol} textValue={token.symbol}>
              <div className="flex gap-2 items-center">
                <img
                  alt={token.symbol}
                  className="h-5 w-auto"
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
          classNames={{
            base: cn(
              "inline-flex flex-row-reverse w-full max-w-sm hover:bg-content2 items-center w-full",
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
          isSelected={formData.cancelable}
          onValueChange={(value: boolean) => {
            updateForm({ ...formData, cancelable: value });
          }}
        >
          <div className="flex flex-col gap-1">
            <p className="text-medium">Cancelability </p>
          </div>
        </Switch>
      </div>
      <div className="form-item">
        <Input
          classNames={{
            base: "w-full",
          }}
          label="Amount"
          labelPlacement="outside"
          placeholder="Fill in the amount"
          size="lg"
          type="number"
          value={formData.amount.toString()}
          variant="bordered"
          onValueChange={(value) => {
            updateForm({ ...formData, amount: Number(value) });
          }}
        />
      </div>
      <div className="form-item">
        <Input
          classNames={{
            base: "w-full",
          }}
          label="Recipient"
          labelPlacement="outside"
          placeholder="Fill in the recipient address"
          size="lg"
          type="text"
          value={formData.recipient}
          variant="bordered"
          onValueChange={(value) => {
            updateForm({ ...formData, recipient: value });
          }}
        />
      </div>
      <div className="form-item col-span-1 md:col-span-2 gap-4 items-center">
        <Button className="w-full" size="lg" onClick={onOpenChange}>
          {customPeriod.years > 0 || customPeriod.days > 0
            ? `Duration: ${customPeriod.years > 0 ? `${customPeriod.years} ${customPeriod.years > 1 ? "years" : "year"}` : ""} ${customPeriod.days > 0 ? `${customPeriod.days} ${customPeriod.days > 1 ? "days" : "day"}` : ""}`
            : "Choose Duration"}
        </Button>
        <FixedDatesPicker
          customPeriod={customPeriod}
          isOpen={isOpen}
          setCustomPeriod={setCustomPeriod}
          onOpenChange={onOpenChange}
        />
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
