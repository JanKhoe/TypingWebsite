"use client";

import { HiChevronDown } from "react-icons/hi";
import { FaSync } from "react-icons/fa";
import Letter from './Letter';
import Results from "./Results";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { useLayoutContext } from '../layoutContext';


// const prisma = new PrismaClient();

// async function main(){

// }

// main()
//   .catch(e =>{
//     console.error(e.message)
//   })
//   .finally(async () => {
//     await prisma.$disconnect()
//   })


interface TypingHandlerProps{
  parentfunction: () => void;
  // next: React.ReactElement;
  // onKeyPress: (event: React.KeyboardEvent<HTMLInputElement>) => void;
}

export default ({parentfunction} : TypingHandlerProps) => {


  const { mode, setMode, params, setParams } = useLayoutContext();

  const [TypedLettersCursor, setTypedlettersCursor] = useState(0);
  const [unTypedLetters, setUnTypedLetters] = useState<React.ReactElement[]>([(<React.Fragment key={1}></React.Fragment>)]);
  const [WordContainers, setWordContainers] = useState<React.ReactElement[]>([]);
  const [isDoneTyping, setIsDoneTyping] = useState(false);
  const [randomWords, setRandomWords] = useState<String[]>([]);
  const [phrase, setPhrase] = useState<String>('')
  const [words, setWords] = useState<String[]>([])

  const letters = useRef<String[][]>([] )
  const keyIndex = useRef(0);
  const isFirstRender = useRef(true);
  const isTypingStarted = useRef<boolean>(false);
  const timeStart = useRef<number>(0);
  const timeEnd = useRef<number>(0);
  const tabRef = useRef<HTMLDivElement>(null);

  let result;

  const MAXCHAR = 50


  const fetchData = async () => {
    try {

      console.log(mode)
      if(mode == 1){
        var response = await fetch('https://random-word-api.herokuapp.com/word?number=' + params[0]);
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        result = await response.json();
        setRandomWords(result)
      }
      else if(mode == 2){
        console.log('pulling paragraph')
        var response = await fetch('/api/paragraphs')
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        result = await response.json();
        console.log(result)
        console.log(Math.floor(Math.random() * result.length))
        setRandomWords(result[Math.floor(Math.random() * result.length)].content.split(" "))
      }
    } catch (error) {
      console.error('There was a problem with the fetch operation:', error);
    } finally {
      console.log("request finsihed")  // Stop loading after the request
    }
  };

  useEffect(() => {
    // The API request
    fetchData();

    //handle mode or param switch.
    if (tabRef.current) {
      console.log('focused')
      tabRef.current.focus();
    }
    setIsDoneTyping(false)
    isTypingStarted.current = false
    setTypedlettersCursor(0)
  }, [mode, params]);




  const restartSamePhrase = () => {
    console.log('here')
    setPhrase(phrase + ' ')
    setWords(randomWords)
    setUnTypedLetters([(<React.Fragment key={1}></React.Fragment>)])
    setTypedlettersCursor(0)
    setIsDoneTyping(false)
    isTypingStarted.current = false
    keyIndex.current = 0;
    letters.current = []
    randomWords.forEach((val, index) => {
      const splitWord = val.split('')
      letters.current.push(splitWord);
    });
    if (tabRef.current) {
      console.log('focused')
      tabRef.current.focus();
    }
  }



  useEffect(() => {
    setPhrase(randomWords.join(' '))
    setWords(randomWords)
    letters.current = []
    randomWords.forEach((val, index) => {
      const splitWord = val.split('')
      letters.current.push(splitWord);
    });

  }, [randomWords])


//Calculate JSXLetters and memoize them to reduce load time on longer phrases since itll cache the result
  var JSXLetter: React.ReactElement[] = useMemo(() =>{
    console.log(letters)
    const lettersArray: React.ReactElement[] = [];
    letters.current.forEach((val) => {
      val.forEach((val2) => {
        lettersArray.push(<Letter letter={val2} key={keyIndex.current++} className="untyped text-xl "> </Letter>);
      });
      lettersArray.push(<Letter letter="&nbsp;" key={keyIndex.current++} className="untyped text-xl"> </Letter>);

    });
    lettersArray.pop(); // Remove last space if necessary
    return lettersArray;
  }, [phrase]);

  useEffect(() => {
    console.log('here2')
    setUnTypedLetters(JSXLetter);
    if (tabRef.current) {
      console.log('from here2')
      tabRef.current.focus();
    }
  }, [JSXLetter])


  //Causes the typing area to be refocused
  //Triggers on reference changing. I.E when the tabRef is set to a new ref for switching tabs.
  useEffect(() => {
    console.log('when does this trigger?')
    // Focus the input when the component mounts
    if (tabRef.current) {
      tabRef.current.focus();
    }
      setTimeout(() => {
        const paragraphWrapper = document.querySelector('.ParagraphWrapper') as HTMLDivElement | null;
        if(paragraphWrapper){
          paragraphWrapper.focus();
        }
      }, 1000);
  }, [tabRef.current]);


  useEffect(() => {
    console.log('here3')
    // If unTypedLetters is empty, call the parent function
    if (unTypedLetters.length === TypedLettersCursor && keyIndex.current > 0) {
      console.log('done typing')
      console.log()
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
        var newElement = React.cloneElement(currentElement, {className: "correct text-xl typing-cursor"})
        prevLetters[TypedLettersCursor] = newElement;
        if(TypedLettersCursor > 0){
          currentElement = prevLetters[TypedLettersCursor-1]
          var removedCursorClass = currentElement.props.className.replace('typing-cursor', '')
          newElement = React.cloneElement(currentElement, {className: removedCursorClass})
          prevLetters[TypedLettersCursor-1] = newElement;
        }
        return prevLetters;
      })
      return;
    }
    else{
      setUnTypedLetters((prevLetters) => {
        var currentElement = prevLetters[TypedLettersCursor]
        var newElement = React.cloneElement(currentElement, {className: "incorrect text-xl typing-cursor "})
        prevLetters[TypedLettersCursor] = newElement;
        if(TypedLettersCursor > 0){
          currentElement = prevLetters[TypedLettersCursor-1]
          var removedCursorClass = currentElement.props.className.replace('typing-cursor', '')
          newElement = React.cloneElement(currentElement, {className: removedCursorClass})
          prevLetters[TypedLettersCursor-1] = newElement;
        }
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
      if(TypedLettersCursor-2 > 0){
        currentElement = prevLetters[TypedLettersCursor-2]
        var updatedClass = currentElement.props.className + ' typing-cursor';
        newElement = React.cloneElement(currentElement, {className: updatedClass})
        prevLetters[TypedLettersCursor-2] = newElement;
      }
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
    let WordContainerss:React.ReactElement[] = []

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
          WordContainerss && WordContainerss.length > 1 ? (
            <div className="container">
              <div className="mx-auto w-1/2" >
                <div
                  className={`start-prompt ${
                    isTypingStarted.current  ? "invisible" : ""
                  }`}
                >
                  <p>
                  Type to start!
                  </p>
                  <HiChevronDown className="down-arrow" />
                </div>
              </div>
              <div
                tabIndex={0}
                ref={tabRef}
                className="ParagraphWrapper flex items-start justify-center max-h-96 min-h-72 min-w-[36em] max-w-md overflow-hidden bg-gray-900 p-4 rounded-lg"
                autoFocus={true}
                onKeyDown={handleKeyPresses}
              >
                <div className="flex justify-start flex-wrap">
                  {WordContainerss}
                </div>
              </div>
            </div>
          ) : (
            <div
              tabIndex={0}
              ref={tabRef}
              className="ParagraphWrapper flex items-start justify-center max-h-96 min-h-72 min-w-[36em] max-w-md overflow-hidden bg-gray-900 p-4 rounded-lg"
              autoFocus={true}
              onKeyDown={handleKeyPresses}
            >
              <div className="flex justify-start flex-wrap">
                Loading...
              </div>
            </div>
          )
        ) : (
          <Results
            TypedCharacters={unTypedLetters}
            ElapsedTime={timeEnd.current - timeStart.current}
            RestartFunction={restartSamePhrase}
            NextFunction={parentfunction}
          />
        )
      }
      {!isDoneTyping && (
        <div className="p4 flex items-center justify-center space-x-8">
        <button className="sync-button" onClick={restartSamePhrase}>
          <FaSync className="sync-icon"/>
        </button>
      </div>
      )}
      </div>
    </div>
  )

};