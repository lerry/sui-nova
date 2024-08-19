"use client";
import { title } from "@/components/primitives";
import { WalletStatus } from "@/components/WalletStatus";

export default function AppPage() {
  return (
    <section className="flex flex-col items-center justify-center gap-4 py-8 md:py-10">
      <div className="inline-block max-w-lg text-center justify-center">
        <div>
          <h1 className={title()}>Blog</h1>
          <WalletStatus />
        </div>
      </div>
    </section>
  );
}
