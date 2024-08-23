"use client";

import { useEffect, useCallback } from "react";
import {
  useCurrentWallet,
  useSuiClientQuery,
  useCurrentAccount,
  useSignAndExecuteTransaction,
} from "@mysten/dapp-kit";

import "@mysten/dapp-kit/dist/index.css";
import { Transaction } from "@mysten/sui/transactions";
import { useState } from "react";
import { Button } from "@nextui-org/react";
import React from "react";
import { MIST_PER_SUI } from "@mysten/sui/utils";

import { FormDataProps, TokenProps } from "./types";
import { CreateForm } from "./create-form";
import { SummaryPanel } from "./summary-panel";

import { IconBack } from "@/components/icons";
import { cn } from "@/utils";
import { title } from "@/components/primitives";

const MIST_PER_USDC = 1000000;
// 0x2::coin::Coin<0x2::sui::SUI>
const tokens: TokenProps[] = [
  {
    symbol: "SUI",
    coinType: "0x2::sui::SUI",
    perValue: Number(MIST_PER_SUI),
  },
  // {
  //   symbol: "DAI",
  //   coinType: "0x2::coin::Coin<0x2::sui::SUI>",
  // },
  {
    symbol: "USDC",
    coinType:
      "0x5d4b302506645c37ff133b98c4b50a5ae14841659738d6d733d59d0d217a93bf::coin::COIN",
    perValue: Number(MIST_PER_USDC),
  },
  // {
  //   label: "USDT",
  //   value: "USDT",
  //   coinType: "0x2::coin::Coin<0x2::sui::SUI>",
  // },

  // {
  //   label: "ETH",
  //   value: "ETH",
  //   coinType: "0x2::coin::Coin<0x2::sui::SUI>",
  // },
];

function QueryObjects() {
  const currentAccount = useCurrentAccount();

  const { data, isPending, error, refetch } = useSuiClientQuery(
    "getAllBalances",
    {
      owner: currentAccount?.address as string,
    },
  );

  if (isPending) {
    return <div>Loading...</div>;
  }
  console.log("obj", data);

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

function WalletBalance({
  updateSuiCoins,
}: {
  updateSuiCoins: (coins: any) => void;
}) {
  // 来自于用户的输入框

  const currentAccount = useCurrentAccount();

  // 获取 SUI coin 对象
  const mySuiCoins = useSuiClientQuery("getOwnedObjects", {
    owner: currentAccount?.address as string,
    filter: {
      MatchAll: [
        {
          StructType: "0x2::coin::Coin<0x2::sui::SUI>",
        },
        {
          AddressOwner: currentAccount?.address as string,
        },
      ],
    },
    options: {
      showOwner: true,
      showType: true,
    },
  });

  // 使用 useEffect 来更新 SUI coins 和打印日志
  useEffect(() => {
    if (mySuiCoins.data) {
      updateSuiCoins(mySuiCoins.data.data);
      console.log(`mySuiCoins: ${JSON.stringify(mySuiCoins.data, null, 2)}`);
    }
  }, [mySuiCoins.data, updateSuiCoins]);
}

function Warning({ balance, form }: { balance: number; form: FormDataProps }) {
  const { isConnected } = useCurrentWallet();
  const [warningText, setWarningText] = useState("");

  useEffect(() => {
    if (!isConnected) {
      setWarningText("Please connect your wallet to continue");
    } else if (balance < form.amount) {
      setWarningText("Insufficient balance");
    } else if (!form.duration) {
      setWarningText("Please select a duration");
    } else {
      setWarningText("");
    }
  }, [isConnected, balance, form.amount, form.duration]);

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

export default function CreatePage() {
  const { currentWallet, connectionStatus } = useCurrentWallet();
  const [balance, setBalance] = useState(0);
  const currentAccount = useCurrentAccount();
  const { data: balanceData } = useSuiClientQuery("getAllBalances", {
    owner: currentAccount?.address as string,
  });

  const [form, setForm] = useState<FormDataProps>({
    token: tokens[0],
    amount: 100,
    cancelable: false,
    recipient: "0x999666",
    duration: 1000,
  });

  const [suiCoins, setSuiCoins] = useState([]);
  const { mutate: signAndExecuteTransaction } = useSignAndExecuteTransaction();

  const updateSuiCoins = useCallback((coins: any) => {
    setSuiCoins(coins);
  }, []);

  // 将 useSuiClientQuery 移到这里
  // const { data: balanceData, isPending, error, refetch } = useSuiClientQuery(
  //   "getBalance",
  //   {
  //     owner: currentAccount?.address as string,
  //   },
  //   {
  //     enabled: connectionStatus === "connected" && !!currentAccount?.address,
  //   }
  // );

  useEffect(() => {
    if (balanceData) {
      const tokenBalance = balanceData.find(
        (item: any) => item.coinType === form.token.coinType,
      );

      if (tokenBalance) {
        const balance =
          Number.parseInt(tokenBalance.totalBalance ?? "0") /
          Number(form.token.perValue);

        setBalance(balance);
      } else {
        setBalance(0);
      }
    }
  }, [balanceData, form.token]);

  async function handleCreate() {
    const mySuiCoinIds =
      suiCoins?.map((item: any) => item?.data?.objectId).filter(Boolean) ?? [];

    if (mySuiCoinIds.length === 0) {
      console.error("没有可用的 SUI 币");

      return;
    }

    const tx = new Transaction();

    tx.mergeCoins(mySuiCoinIds[0], mySuiCoinIds.slice(1));
    // console.log(`tx: ${JSON.stringify(tx, null, 2)}`);
    signAndExecuteTransaction(
      {
        transaction: tx,
      },
      {
        onSuccess: (result) => {
          console.log("executed create pool transaction", result);
        },
      },
    );

    console.log(`交易: ${JSON.stringify(tx, null, 2)}`);
  }

  function updateForm(form: any) {
    setForm(form);
  }

  return (
    <section className="flex flex-col  gap-4 py-8 md:py-10">
      {/* <CreatePool /> */}
      <QueryObjects />
      <div className="flex items-center pb-8">
        <IconBack
          className="border border-white rounded-full mr-4"
          color="white"
          height={35}
          width={35}
        />
        <h2 className={cn(title(), "!text-3xl")}>Create Stream</h2>
        {/* <QueryObjects /> */}
      </div>
      <div className="panel flex flex-col lg:flex-row gap-8">
        <CreateForm formData={form} tokens={tokens} updateForm={updateForm} />

        <div className="summary basis-[460px]">
          <SummaryPanel balance={balance} formData={form} />

          <Warning balance={balance} form={form} />
          <Button
            className="w-full mt-4"
            color="primary"
            isDisabled={
              !currentWallet ||
              connectionStatus !== "connected" ||
              balance < form.amount ||
              !form.duration
            }
            size="lg"
            onClick={handleCreate}
          >
            Create
          </Button>
        </div>
      </div>
    </section>
  );
}
