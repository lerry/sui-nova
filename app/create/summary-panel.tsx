import Image from "next/image";
import dayjs from "dayjs";

import { FormDataProps } from "./types";

export function SummaryPanel({
  formData,
  balance,
}: {
  formData: FormDataProps;
  balance: number;
}) {
  const tokenItem = (
    <div className="flex items-center gap-1">
      <Image
        alt="Token"
        height={20}
        src={`/tokens/${formData.token.symbol}.svg`}
        width={20}
      />
      {formData.token.symbol}
    </div>
  );

  const items = [
    {
      label: "Token",
      value: tokenItem,
    },
    {
      label: "Wallet Balance",
      value: balance,
    },
    {
      label: "Amount",
      value: formData.amount,
    },
    {
      label: "Recipient",
      value: formData.recipient,
    },
    {
      label: "End Date",
      value: formData.duration
        ? dayjs().add(formData.duration, "seconds").format("DD/MM/YYYY HH:mm")
        : "N/A",
    },
  ];

  return (
    <>
      <div className=" border border-border/80 text-white rounded-lg p-6 md:p-10 max-w-md mx-auto">
        <h3 className="text-3xl font-bold mb-6">Summary</h3>
        <div className="space-y-4">
          {items.map((item) => (
            <div key={item.label} className="flex justify-between items-center">
              <div className="text-gray-400">{item.label}</div>
              <div className="font-semibold text-lg">{item.value}</div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
