import Letter from "./Letter";
import { useCallback } from "react";


interface WordProps {
  children: React.ReactNode;
  text: String
  next: React.ReactElement | null;
}


export default function Word(
  {children, text, next}: WordProps
){

  const changeActiveLetter = useCallback(()=>{
    console.log("keyPress")
  }, [])

  const letters: JSX.Element[] = [];
  for (let i = text.length-1; i >= 0; i--) {
    letters.push(<Letter  letter={text[i]} key={i}>  </Letter>);
  }


  return (
    <>
      {children}
      {letters.reverse()}
    </>
  )
}

