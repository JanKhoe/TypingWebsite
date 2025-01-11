"use client";

import { useLayoutContext } from "../layoutContext";


interface OptionProps{
  Mode: number,
  Params: (string | number)[],
  innerText: String
}



export default function Option({Mode, Params, innerText}: OptionProps){

  const { mode, setMode, params, setParams } = useLayoutContext();

  const onModeSelect = (optionMode: number, optionParams: (string | number)[]) => {

    setMode(optionMode);
    setParams(optionParams);

  };

  return (<>
            <div className="mode-option" onClick={() => onModeSelect(Mode, Params)}>{innerText}</div>
          </>
          )}