"use client";

import { Link } from "@nextui-org/link";
import { Snippet } from "@nextui-org/snippet";
import { Code } from "@nextui-org/code";
import { button as buttonStyles } from "@nextui-org/theme";

import { siteConfig } from "@/config/site";
import { title, subtitle } from "@/components/primitives";
import { GithubIcon } from "@/components/icons";

export default function Home() {
  return (
    <section className="flex flex-col items-center justify-center gap-4 py-8 md:py-10">
      <div className="inline-block max-w-lg text-center justify-center leading-normal">
        <h1 className={title()}>Smart &nbsp;</h1>
        <h1 className={title({ color: "violet" })}>streams &nbsp;</h1>
        <br />
        <h1 className={title()}>for smarter payments.</h1>
        <h2 className={subtitle({ class: "mt-4" })}>
          Efficient, secure, and user-friendly streaming payment.
        </h2>
      </div>

      <div className="flex gap-3 mt-8">
        <Link
          className={buttonStyles({
            color: "primary",
            radius: "full",
            variant: "shadow",
          })}
          href="/app"
        >
          Launch App
        </Link>
        <Link
          isExternal
          className={buttonStyles({ variant: "bordered", radius: "full" })}
          href={siteConfig.links.github}
        >
          <GithubIcon size={20} />
          GitHub
        </Link>
      </div>
    </section>
  );
}
