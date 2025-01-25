"use client";

import { useEffect } from "react";
import { useLayoutContext } from "../layoutContext";


interface OptionProps{
  Mode: number,
  Params: (string | number)[],
  innerText: String
}



export default function Option({Mode, Params, innerText}: OptionProps){

  const { mode, setMode, params, setParams, refreshflag, setFlag } = useLayoutContext();
  const onModeSelect = (optionMode: number, optionParams: (string | number)[]) => {

    setMode(optionMode);
    setParams(optionParams);
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
            <div className="mode-option" onClick={() => onModeSelect(Mode, Params)}>{innerText}</div>
          </>
          )}