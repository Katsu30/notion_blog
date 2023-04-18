import React, { ReactNode } from "react";
import Navbar from "@/components/Navbar/Navbar";

interface Props {
  children: ReactNode;
}

export function DefaultLayout({ children }: Props) {
  return (
    <>
      <Navbar/>
      <div>{ children }</div>
    </>
  );
}
