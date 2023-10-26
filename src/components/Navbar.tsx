import React from "react";
import MaxWidthWrapper from "./MaxWidthWrapper";
import Link from "next/link";
import { buttonVariants } from "./ui/button";
import {
  LoginLink,
  RegisterLink,
  LogoutLink,
} from "@kinde-oss/kinde-auth-nextjs/server";
import { ArrowRight } from "lucide-react";

import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";

const Navbar = () => {
  const { isAuthenticated } = getKindeServerSession();

  const isSignedIn = isAuthenticated();
  return (
    <nav className="sticky h-14 inset-x-0 top-0 z-30 w-full bg-white/75 border-b border-gray-200 backdrop-blur-lg transition-all">
      <MaxWidthWrapper>
        <div className="flex h-14 items-center justify-between border-b border-zinc-200">
          <Link href={"/"} className="flex z-40 font-semibold">
            <span>quill</span>
          </Link>
          {/* todo: Add mobile navbar */}
          <div className="hidden items-center space-x-4 md:flex">
            <>
              {/* <Link
                href={"/pricing"}
                className={buttonVariants({
                  variant: "ghost",
                  size: "sm",
                })}
              >
                Pricing
              </Link> */}
              {isSignedIn ? (
                <LogoutLink
                  className={buttonVariants({
                    variant: "default",
                    size: "sm",
                  })}
                >
                  Logout
                </LogoutLink>
              ) : (
                <>
                  <LoginLink
                    className={buttonVariants({
                      variant: "ghost",
                      size: "sm",
                    })}
                  >
                    Sign in
                  </LoginLink>
                    <RegisterLink
                    className={buttonVariants({
                      variant: "default",
                      size: "sm",
                    })}
                  >
                    Get started <ArrowRight className="h-5 w-5 ml-1.5" />
                  </RegisterLink>
                </>
              )}
            </>
          </div>
        </div>
      </MaxWidthWrapper>
    </nav>
  );
};

export default Navbar;
