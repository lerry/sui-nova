import { FormDataProps } from "./types";
import Image from "next/image";
import dayjs from "dayjs";



export function SummaryPanel({ formData, balance }: { formData: FormDataProps, balance: number }) {
  const tokenItem = (
    <div className="flex items-center gap-1">
      <Image
        src={`/tokens/${formData.token.symbol}.svg`}
        alt="Token"
        width={20}
        height={20}
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
      <div className="border border-gray-200 rounded-lg p-4 md:p-8">
        <h3 className="text-2xl font-bold pt-0 mb-4 ">Summary</h3>
        <div className="items">
          {items.map((item) => (
            <div
              key={item.label}
              className="flex justify-between leading-loose"
            >
              <div className="font-bold">{item.label}</div>
              <div>{item.value}</div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
