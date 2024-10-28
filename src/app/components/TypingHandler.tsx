"use client";

import Letter from './Letter';
import Results from "./Results";
import React, { useEffect, useMemo, useRef, useState } from "react";

interface TypingHandlerProps  {
  parentFunction: () => void;
}


export default ({parentFunction} : TypingHandlerProps) => {
  const [TypedLettersCursor, setTypedlettersCursor] = useState(0);
  const [unTypedLetters, setUnTypedLetters] = useState<React.ReactElement[]>([(<React.Fragment key={1}></React.Fragment>)]);
  const [WordContainers, setWordContainers] = useState<React.ReactElement[]>([]);
  const [isDoneTyping, setIsDoneTyping] = useState(false);

  const keyIndex = useRef(0);
  const isFirstRender = useRef(true);
  const isTypingStarted = useRef<boolean>(false);
  const timeStart = useRef<number>(0);
  const timeEnd = useRef<number>(0);
  const tabRef = useRef<HTMLDivElement>(null);

  const phrase = "According to all known laws of aviation, there is no way a bee should be able to fly. Its wings are too small to get its fat little body off the ground. The bee, of course, flies anyway because bees don't care what humans think is impossible."
  const words = phrase.trim().split(" ")
  const letters:String[][] = []



  words.forEach((val, index) => {
    const splitWord = val.split('')
    letters.push(splitWord);
  });

  const activeWord = words[0]


//Calculate JSXLetters and memoize them to reduce load time on longer phrases since itll cache the result
  var JSXLetter: React.ReactElement[] = useMemo(() =>{
    const lettersArray: React.ReactElement[] = [];
    letters.forEach((val) => {
      val.forEach((val2) => {
        lettersArray.push(<Letter letter={val2} key={keyIndex.current++} className="untyped text-xl"> </Letter>);
      });
      lettersArray.push(<Letter letter="&nbsp;" key={keyIndex.current++} className="untyped text-xl"> </Letter>);

    });
    lettersArray.pop(); // Remove last space if necessary
    return lettersArray;
  }, []);

  useEffect(() => {
    setUnTypedLetters(JSXLetter);

  }, [])

  useEffect(() => {
    // Focus the input when the component mounts
    if (tabRef.current) {
      tabRef.current.focus();
    }
  }, []);


  useEffect(() => {
    // If unTypedLetters is empty, call the parent function
    if (unTypedLetters.length === TypedLettersCursor && keyIndex.current > 0) {
      setIsDoneTyping(true);
      timeEnd.current = performance.now()
    }
  }, [TypedLettersCursor]);

  const AddLetter = (isCorrect: boolean) => {
    if(TypedLettersCursor == 1 && !isTypingStarted.current){
      timeStart.current = performance.now()
      isTypingStarted.current = true;
    }
    if(isCorrect){
      setUnTypedLetters((prevLetters) => {
        var currentElement = prevLetters[TypedLettersCursor]
        var newElement = React.cloneElement(currentElement, {className: "correct text-xl"})
        prevLetters[TypedLettersCursor] = newElement;
        return prevLetters;
      })
      return;
    }
    else{
      setUnTypedLetters((prevLetters) => {
        var currentElement = prevLetters[TypedLettersCursor]
        var newElement = React.cloneElement(currentElement, {className: "incorrect text-xl"})
        prevLetters[TypedLettersCursor] = newElement;
        return prevLetters;
      })

      return;
    }
  }

  const HandleBackSpace = () => {
    setUnTypedLetters((prevLetters) => {
      var currentElement = prevLetters[TypedLettersCursor-1]
      var newElement = React.cloneElement(currentElement, {className: "untyped text-xl"})
      prevLetters[TypedLettersCursor-1] = newElement;
      return prevLetters;
    })
  }

  const handleKeyPresses = (Event: React.KeyboardEvent) => {
    const isShiftKey = Event.shiftKey && Event.key.length === 1 && Event.key.match(/[a-z]/i);
    if(Event.key === 'Backspace'){
      if(TypedLettersCursor > 0){
        HandleBackSpace();
        setTypedlettersCursor(TypedLettersCursor-1);
        return;
      }

    }
    else if(isShiftKey){
      const keyPressed = Event.key === Event.key.toUpperCase() ? Event.key.toUpperCase(): Event.key.toLowerCase()
      if(keyPressed == unTypedLetters[TypedLettersCursor]?.props.letter.replace(/\u00A0/g, ' ')){
        AddLetter(true);
        //setUnTypedLetters(unTypedLetters.slice(1));
        setTypedlettersCursor(TypedLettersCursor+1);
      }
      else if(keyPressed.match(/^[\S\s]{1}$/) && TypedLettersCursor < unTypedLetters.length){
        AddLetter(false)
        setTypedlettersCursor(TypedLettersCursor+1);
        //setUnTypedLetters(unTypedLetters.slice(1));
      }
    }
    else{
      console.log(Event.key == ' ')
      if(Event.key == unTypedLetters[TypedLettersCursor]?.props.letter.replace(/\u00A0/g, ' ')){
        AddLetter(true);
        setTypedlettersCursor(TypedLettersCursor+1);
        //setUnTypedLetters(unTypedLetters.slice(1));
      }
      else if(Event.key.match(/^[\S\s]{1}$/) && TypedLettersCursor < unTypedLetters.length){
        AddLetter(false);
        setTypedlettersCursor(TypedLettersCursor+1);
        //setUnTypedLetters(unTypedLetters.slice(1));
      }
    }
  }
    const WordContainerss:React.ReactElement[] = []

    var Word: React.ReactElement[] = [];
    for(var i =0; i<unTypedLetters.length; i++ ){
      if(unTypedLetters[i].props.letter != '\u00A0'){
        Word.push(unTypedLetters[i])
      }
      else{
        WordContainerss.push((<div className="flex" key={keyIndex.current++}>{Word}</div>))
        WordContainerss.push(unTypedLetters[i]);
        Word = []
      }
    }
    WordContainerss.push((<div className="flex"  key={keyIndex.current++}>{Word}</div>))

  return(
    <div className="p-8">
      <div className="text-center space-y-6">
          {
          !isDoneTyping ? (
            <div tabIndex={0} ref={tabRef} className="ParagraphWrapper flex items-start justify-center max-h-96 min-h-72 min-w-[36em] max-w-md overflow-hidden bg-gray-900 p-4 rounded-lg" autoFocus={true} onKeyDown={handleKeyPresses}>
              <div className="flex justify-start flex-wrap">
                {WordContainerss}
              </div>
            </div>
          ) : (
            <Results TypedCharacters={unTypedLetters} ElapsedTime={timeEnd.current-timeStart.current} parentFunction={parentFunction}/>
          )
        }
      </div>
    </div>
  )

};