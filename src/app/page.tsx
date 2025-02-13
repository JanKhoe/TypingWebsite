"use client";
import Image from "next/image";
import TypingHandler from "./components/TypingHandler";
import { useState } from "react";
import React from "react";





export default function Home() {
  const toggleRestartFlag = () => {
    console.log("hello from the parent")
    setRestartFlag(restartFlag+1);
  }
  const [restartFlag, setRestartFlag] = useState(0)
  return (
      <div className="grid grid-rows-[20px_1fr_20px] justify-items-center p-8" key={restartFlag}>
            <TypingHandler parentfunction={toggleRestartFlag}/>
        <footer className="row-start-3 flex gap-6 flex-wrap items-center justify-center">
        </footer>
      </div>
  );
}
