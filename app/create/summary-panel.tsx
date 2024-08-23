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

  const shorttenAddress =
    formData.recipient.slice(0, 6) + "..." + formData.recipient.slice(-6);

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
      value: shorttenAddress,
      caption: formData.recipient,
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
      <div className="border border-border/80 text-white rounded-lg p-6 md:p-10 mx-auto">
        <h3 className="text-3xl font-bold mb-6">Summary</h3>
        <div className="space-y-4">
          {items.map((item) => (
            <div
              key={item.label}
              className="flex justify-between items-center text-foreground/80"
            >
              <div className="">{item.label}</div>
              <div
                className="font-semibold text-lg overflow-hidden text-ellipsis"
                title={item.caption}
              >
                {item.value}
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
