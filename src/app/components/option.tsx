"use client";

import { useEffect } from "react";
import { useLayoutContext } from "../layoutContext";


interface OptionProps{
  Mode: number,
  Params: (string | number)[],
  innerText: String
  className: string
}

export default function Option({Mode, Params, innerText, className}: OptionProps){

  function setCookie(name:String, value:String, days:number) {
    if (typeof window === 'undefined') return; // Skip on server
    const date = new Date();
    date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
    const expires = `expires=${date.toUTCString()}`;
    document.cookie = `${name}=${value}; ${expires}; path=/`;
  }

  const { mode, setMode, params, setParams, refreshflag, setFlag } = useLayoutContext();
  const onModeSelect = (optionMode: number, optionParams: (string | number)[]) => {

    setMode(optionMode);
    setCookie("mode", optionMode.toString(), 7)
    setParams(optionParams);
    setCookie("params", optionParams.toString(), 7)
    if(refreshflag > 1){
      setFlag(1);
    }
    else{
      setFlag(2);
    }
  };

  useEffect(() => {
    if(refreshflag != 0){
      if(window.location.pathname !== "/"){
        window.location.href = "/"
      }
    }
  }, [mode])

  return (<>
            <div className={className} onClick={() => onModeSelect(Mode, Params)}>{innerText}</div>
          </>
          )}