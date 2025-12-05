import { SignedOut, SignInButton, SignedIn, UserButton } from "@clerk/nextjs";
import Link from "next/link";
import React from "react";
import { Button } from "@/components/ui/button";
import { CartButton } from "@/components/cart-button";
import { ThemeToggle } from "@/components/theme-toggle";
import { Package } from "lucide-react";

const Navbar = () => {
  return (
    <header className="flex justify-between items-center p-4 gap-4 h-16 max-w-7xl mx-auto" role="banner">
      <Link href="/" className="text-2xl font-bold" aria-label="홈으로 이동">
        SaaS Template
      </Link>
      <div className="flex gap-4 items-center">
        <ThemeToggle />
        <SignedOut>
          <SignInButton mode="modal">
            <Button>로그인</Button>
          </SignInButton>
        </SignedOut>
        <SignedIn>
          <CartButton />
          <Link href="/orders" aria-label="주문 내역">
            <Button variant="ghost" size="icon" aria-label="주문 내역 보기">
              <Package className="w-5 h-5" aria-hidden="true" />
            </Button>
          </Link>
          <UserButton />
        </SignedIn>
      </div>
    </header>
  );
};

export default Navbar;
