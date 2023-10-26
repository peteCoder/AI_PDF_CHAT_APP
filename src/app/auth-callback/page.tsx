"use client";

import { redirect, useRouter, useSearchParams } from "next/navigation";
import { trpc } from "../_trpc/client";
import { Loader2 } from "lucide-react";

const CallbackAuthPage = () => {
  const router = useRouter();

  const searchParams = useSearchParams();
  const origin = searchParams.get("origin");

  const { error, isSuccess } = trpc.authCallback.useQuery(undefined, {});

  if (isSuccess) {
    router.push(origin ? `/${origin}` : "/dashboard");
  }

  if (error?.data?.code === "UNAUTHORIZED") {
    console.log("it is ", error);
    redirect(
      "/"
    );
  }

  return (
    <div className="w-full mt-24 flex justify-center">
      <div className="flex flex-col items-center gap-2">
        <Loader2 className="h-8 w-8 animate-spin text-zinc-800" />
        <h3 className="font-semibold text-xl">Setting up your account...</h3>
        <p>You will be redirected automatically.</p>
      </div>
    </div>
  );
};

export default CallbackAuthPage;
