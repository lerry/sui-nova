"use client";
import {
  Button,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  Input,
} from "@nextui-org/react";
import { useState } from "react";
const preDefinedDates = [
  {
    years: 3,
    days: 0,
  },
  {
    years: 2,
    days: 0,
  },
  {
    years: 0,
    days: 180,
  },
  {
    years: 0,
    days: 30,
  },
  {
    years: 0,
    days: 7,
  },
  {
    years: 0,
    days: 1,
  },
];

export function FixedDatesPicker({
  isOpen,
  onOpenChange,
  customPeriod,
  setCustomPeriod,
}: {
  isOpen: boolean;
  onOpenChange: () => void;
  customPeriod: { years: number; days: number };
  setCustomPeriod: (period: { years: number; days: number }) => void;
}) {
  const [_peroid, setPeriod] = useState(customPeriod);

  function handleChoosePeriod(period: { years: number; days: number }) {
    setPeriod(period);
  }
  function handleSetPeriod() {
    setCustomPeriod(_peroid);
    onOpenChange();
  }

  return (
    <Modal isOpen={isOpen} size="2xl" onOpenChange={onOpenChange}>
      {" "}
      <ModalContent>
        <ModalHeader>Fixed dates</ModalHeader>
        <ModalBody>
          <>
            <h2 className="">Suggested periods</h2>
            <div className="flex gap-2">
              {preDefinedDates.map((date, index) => (
                <Button
                  key={index}
                  color={
                    _peroid.years === date.years && _peroid.days === date.days
                      ? "primary"
                      : "default"
                  }
                  onClick={() => handleChoosePeriod(date)}
                >
                  {date.years > 0
                    ? `${date.years} ${date.years > 1 ? "years" : "year"}`
                    : ""}{" "}
                  {date.days > 0
                    ? `${date.days} ${date.days > 1 ? "days" : "day"}`
                    : ""}
                </Button>
              ))}
            </div>
            <h2 className="">Custom period</h2>
            <div className="flex gap-2">
              <Input
                label="Years"
                placeholder="Years"
                type="number"
                value={_peroid.years.toString()}
                onValueChange={(value) =>
                  setPeriod({
                    ...customPeriod,
                    years: parseInt(value),
                  })
                }
              />
              <Input
                label="Days"
                placeholder="Days"
                type="number"
                value={_peroid.days.toString()}
                onValueChange={(value) =>
                  setPeriod({
                    ...customPeriod,
                    days: parseInt(value),
                  })
                }
              />
            </div>
            <Button
              className="text-medium"
              color="primary"
              onClick={() => handleSetPeriod()}
            >
              Set
            </Button>
          </>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}
