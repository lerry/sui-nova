import { FormDataProps } from "./types";
import Image from "next/image";

function ConnectedSummary({ formData }: { formData: FormDataProps }) {
  const tokenItem = (
    <div className="flex items-center gap-1">
      <Image
        src={`/tokens/${formData.token}.png`}
        alt="Token"
        width={20}
        height={20}
      />
      {formData.token}
    </div>
  );
  const items = [
    {
      label: "Token",
      value: tokenItem,
    },
    {
      label: "Amount",
      value: formData.amount,
    },
    {
      label: "Recipient",
      value: formData.recipient,
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

export function SummaryPanel({ formData }: { formData: any }) {
  return <ConnectedSummary formData={formData} />;
}
