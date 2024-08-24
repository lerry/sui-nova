import { useState, useEffect } from "react";
import { useCurrentWallet } from "@mysten/dapp-kit";

import { FormDataProps } from "./types";
import { checkSuiAddress } from "@/utils";
export function Warning({
  balance,
  form,
}: {
  balance: number;
  form: FormDataProps;
}) {
  const { isConnected } = useCurrentWallet();
  const [warningText, setWarningText] = useState("");

  useEffect(() => {
    if (!isConnected) {
      setWarningText("Please connect your wallet to continue");
    } else if (!form.amount) {
      setWarningText("Please input the amount");
    } else if (balance < form.amount) {
      setWarningText("Insufficient balance");
    } else if (!checkSuiAddress(form.recipient)) {
      setWarningText("Please input a valid recipient address");
    } else if (!form.duration) {
      setWarningText("Please select a duration");
    } else {
      setWarningText("");
    }
  }, [isConnected, balance, form]);

  return (
    (warningText && (
      <div className="w-full mt-4 ">
        <div className="mt-4 bg-yellow-600 text-white p-3 rounded-lg flex items-center">
          <svg className="w-6 h-6 mr-2" fill="currentColor" viewBox="0 0 20 20">
            <path
              clipRule="evenodd"
              d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
              fillRule="evenodd"
            />
          </svg>
          {warningText}
        </div>
      </div>
    )) ||
    null
  );
}
