"use client";

import { useEffect, useCallback } from "react";
import { title } from "@/components/primitives";
import Image from "next/image";

import {
  useSuiClient,
  useCurrentWallet,
  useSignTransaction,
  useSuiClientQuery,
  useCurrentAccount,
  useSignAndExecuteTransaction,
} from "@mysten/dapp-kit";

import "@mysten/dapp-kit/dist/index.css";
import { Transaction } from "@mysten/sui/transactions";
import { useState } from "react";
import { Button, Chip } from "@nextui-org/react";
import React from "react";
import { MIST_PER_SUI } from "@mysten/sui/utils";
import { cn } from "@/utils";
import { IconBack } from "@/components/icons";

import { FormDataProps } from "./types";
import { CreateForm } from "./form";
import { SummaryPanel } from "./summary-panel";
function QueryObjects() {
  const { data, isPending, error, refetch } = useSuiClientQuery(
    "getOwnedObjects",
    {
      owner:
        "0xc494732d09de23389dbe99cb2f979965940a633cf50d55caa80ed9e4fc4e521e",
    },
  );

  if (isPending) {
    return <div>Loading...</div>;
  }

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
  const input_amount = 100;

  const my_account = useCurrentAccount();
  const { data, isPending, error, refetch } = useSuiClientQuery("getBalance", {
    owner: my_account?.address as string,
  });

  console.log(`balance data:  ${JSON.stringify(data, null, 2)}`);
  const my_balance =
    Number.parseInt(data?.totalBalance ?? "0") / Number(MIST_PER_SUI);

  // todo 判断 amount、balance
  // if (my_balance <= input_amount) {
  //   return <div>余额不足</div>;
  // }

  // 获取 SUI coin 对象
  const mySuiCoins = useSuiClientQuery("getOwnedObjects", {
    owner: my_account?.address as string,
    filter: {
      MatchAll: [
        {
          StructType: "0x2::coin::Coin<0x2::sui::SUI>",
        },
        {
          AddressOwner: my_account?.address as string,
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

  return (
    <div>
      {isPending ? (
        <div>Loading...</div>
      ) : (
        <div>
          Your have {mySuiCoins?.data?.data?.length} transactions
          {/* <pre>{JSON.stringify(mySuiCoins?.data, null, 2)}</pre> */}
        </div>
      )}
    </div>
  );
}
const tokens: { label: string; value: string }[] = [
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

function Warning() {
  const { connectionStatus } = useCurrentWallet();
  const [warningText, setWarningText] = useState("");

  useEffect(() => {
    if (connectionStatus !== "connected") {
      setWarningText("Please connect your wallet to continue");
    }
  }, [connectionStatus]);
  return (
    <div className="flex justify-center items-center">
      <Chip color="warning" size="lg">
        {warningText}
      </Chip>
    </div>
  );
}

export default function CreatePage() {
  const { currentWallet, connectionStatus } = useCurrentWallet();

  const [form, setForm] = useState<FormDataProps>({
    token: tokens[0].value,
    amount: 100,
    cancelable: true,
    recipient: "0x999666",
    duration: 1000,
  });

  const [suiCoins, setSuiCoins] = useState([]);

  const updateSuiCoins = useCallback((coins: any) => {
    setSuiCoins(coins);
  }, []);

  const { mutate: signAndExecuteTransaction } = useSignAndExecuteTransaction();
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
      <WalletBalance updateSuiCoins={updateSuiCoins} />
      <div className="flex items-center pb-8">
        <IconBack
          className="border border-white rounded-full mr-4"
          width={35}
          height={35}
          color="white"
        />
        <h2 className={cn(title(), "!text-3xl")}>Create Stream</h2>
        {/* <QueryObjects /> */}
      </div>
      <div className="panel flex flex-col lg:flex-row gap-8">
        <CreateForm formData={form} updateForm={updateForm} tokens={tokens} />

        <div className="summary basis-[460px] ">
          <SummaryPanel formData={form} />

          {/* <Warning /> */}
          {connectionStatus === "connected" && (
            <Button
              className={cn(
                "w-full mt-4",
                connectionStatus !== "connected"
                  ? "bg-gray-400 !cursor-not-allowed"
                  : "",
              )}
              color="primary"
              size="lg"
              onClick={handleCreate}
              isDisabled={!currentWallet || connectionStatus !== "connected"}
            >
              Create
            </Button>
          )}
        </div>
      </div>
    </section>
  );
}
