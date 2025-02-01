"use client";

import { HiChevronDown } from "react-icons/hi";
import { FaSync } from "react-icons/fa";
import {FaChevronCircleRight} from "react-icons/fa"
import Letter from './Letter';
import WordTest from './Word';
import Results from "./Results";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { useLayoutContext } from '../layoutContext';
import { cookies } from "next/headers";


interface TypingHandlerProps{
  parentfunction: () => void;
  // next: React.ReactElement;
  // onKeyPress: (event: React.KeyboardEvent<HTMLInputElement>) => void;
}

export default ({parentfunction} : TypingHandlerProps) => {


  const { mode, setMode, params, setParams, refreshflag, setFlag } = useLayoutContext();

  const [TypedLettersCursor, setTypedlettersCursor] = useState(0);
  const [unTypedLetters, setUnTypedLetters] = useState<React.ReactElement[]>([(<React.Fragment key={1}></React.Fragment>)]);
  const [WordContainers, setWordContainers] = useState<React.ReactElement[]>([]);
  const [isDoneTyping, setIsDoneTyping] = useState(false);
  const [randomWords, setRandomWords] = useState<String[]>([]);
  const [phrase, setPhrase] = useState<String>('')
  const [words, setWords] = useState<String[]>([])
  const [cookiesLoaded, setCookiesLoaded] = useState(false);

  const letters = useRef<String[][]>([] )
  const CharsPerLine = useRef<number[]>([])
  const pastRecentRandomChars = useRef<number[]>([])
  const keyIndex = useRef(0);
  const charOnCurLine = useRef(0);
  const WordContainerssCursor = useRef(0);
  const UserCurWord = useRef(0);
  let triggerNewLine = useRef(false)
  const TriggerPrevLine = useRef(false)
  const isTypingStarted = useRef<boolean>(false);
  const timeStart = useRef<number>(0);
  const timeEnd = useRef<number>(0);
  const tabRef = useRef<HTMLDivElement>(null);


  let result;
  const MAXCHAR = 52

  function getCookie(name: String) {
    const cookies = document.cookie.split(';');
    for (let cookie of cookies) {
      cookie = cookie.trim(); // Remove whitespace
      if (cookie.startsWith(name + '=')) {
        return decodeURIComponent(cookie.substring(name.length + 1));
      }
    }
    return null; // Cookie not found
  }

  const abortControllers: AbortController[] = [];

  const controller = new AbortController();
  abortControllers.push(controller);

  function cancelAllRequests() {
    abortControllers.forEach((controller) => controller.abort());
    abortControllers.length = 0; // Clear the array
  }


  const fetchData = async () => {
    try {
      console.log(mode)
      if(mode == 1){
        var response = await fetch('https://random-word-api.herokuapp.com/word?number=' + params[0], { signal:controller.signal  } );
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        result = await response.json();
        if(mode==1){
          setRandomWords(result)
        }

      }
      else if(mode == 2){
        console.log('pulling paragraph')
        var response = await fetch('/api/paragraphs')
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        result = await response.json();
        console.log(result)
        var randomNum;
        do{
          console.log('is this even repeating? this should btw')
          randomNum = Math.floor(Math.random() * result.length);
          console.log(randomNum);
          console.log(randomNum in pastRecentRandomChars.current)
          console.log(pastRecentRandomChars.current)
        }while(pastRecentRandomChars.current.includes(randomNum))
        if(pastRecentRandomChars.current.length >= 3){
          pastRecentRandomChars.current.shift()
          pastRecentRandomChars.current.push(randomNum)
        }
        else{
          pastRecentRandomChars.current.push(randomNum)
        }
        setRandomWords(result[randomNum].content.split(" "))
      }

    if(mode == 3){
      console.log(params[1])
      var customPhrase: String[] = []
      var randomWords: String[] = [];

      if(typeof(params[1]) == 'string'){
        randomWords = params[1].replace(/  +/g, ' ').trim().split(' ')
      }
      console.log(randomWords)
      for(let i = 0; i < Number(params[0]); i++){
        randomNum = Math.floor(Math.random() * randomWords.length);
        console.log(randomNum)
        customPhrase.push(randomWords[randomNum])
      }
      setRandomWords(customPhrase)
    }
    } catch (error) {
      console.log('There was a problem with the fetch operation:', error);
    } finally {
      console.log("request finsihed")  // Stop loading after the request
    }
  };

  useEffect(() => {
    console.log('cookies loaded')
    const cookiesStoredMode = getCookie("mode")
    const cookiesStoredParams = getCookie("params")
    if(cookiesStoredMode != null && cookiesStoredParams != null){
      const newParams = cookiesStoredParams.split(",");
      console.log(cookiesStoredMode, cookiesStoredParams, "cokoies")
      setMode(parseInt(cookiesStoredMode))
      if (JSON.stringify(newParams) !== JSON.stringify(params)) {
        setParams(newParams);
      }
    }
    setCookiesLoaded(true);
  }, [])



  useEffect(() => {
    console.log('attepmt to check cookies')
    if (!cookiesLoaded) return;
    fetchData();

    //handle mode or param switch.
    if (tabRef.current) {
      console.log('focused')
      tabRef.current.focus();
    }
    setIsDoneTyping(false)
    isTypingStarted.current = false
    setTypedlettersCursor(0)
    UserCurWord.current = 0;
    triggerNewLine.current = false
    TriggerPrevLine.current = false
    WordContainerssCursor.current = 0
    charOnCurLine.current = 0;
    CharsPerLine.current = []
    setPhrase('')
  }, [refreshflag, mode, cookiesLoaded]);




  const restartSamePhrase = () => {
    console.log('here')
    setPhrase(phrase + ' ')
    setWords(randomWords)
    setUnTypedLetters([(<React.Fragment key={1}></React.Fragment>)])
    CharsPerLine.current = []
    setTypedlettersCursor(0)
    triggerNewLine.current = false
    TriggerPrevLine.current = false
    WordContainerssCursor.current = 0
    charOnCurLine.current = 0;
    UserCurWord.current = 0;
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
        lettersArray.push(<Letter letter={val2} key={keyIndex.current++} className="untyped text-2xl "> </Letter>);
      });
      lettersArray.push(<Letter letter="&nbsp;" key={keyIndex.current++} className="untyped text-2xl"> </Letter>);

    });
    lettersArray.pop(); // Remove last space if necessary
    console.log(lettersArray)
    if(lettersArray.length > 0){
      var currentElement = lettersArray[0]
      var newElement = React.cloneElement(currentElement, {className: `untyped newline-cursor text-2xl`})
      lettersArray[0] = newElement;
    }
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
    // If unTypedLetters is empty, call the parent function
    if (unTypedLetters.length === TypedLettersCursor && keyIndex.current > 0) {
      console.log('done typing')
      console.log()
      setIsDoneTyping(true);
      timeEnd.current = performance.now()
    }
  }, [TypedLettersCursor]);

  const AddLetter = (isCorrect: boolean, isSpace: boolean) => {


    if(TypedLettersCursor == 1 && !isTypingStarted.current){
      timeStart.current = performance.now()
      isTypingStarted.current = true;
    }

    //Check if the next char starts on the next line
    if(unTypedLetters[TypedLettersCursor]?.props.letter.replace(/\u00A0/g, ' ') == ' '){
      console.log('space char was filled')
      WordContainerssCursor.current += 2;
      charOnCurLine.current += WordContainerss[WordContainerssCursor.current].props.letterCount
      UserCurWord.current += 1;
      if(charOnCurLine.current > MAXCHAR){
        console.log('newline imminent')
        CharsPerLine.current.push(charOnCurLine.current -= WordContainerss[WordContainerssCursor.current].props.letterCount)
        charOnCurLine.current = WordContainerss[WordContainerssCursor.current].props.letterCount
        triggerNewLine.current = true
      }
    }

      setUnTypedLetters((prevLetters) => {
        var currentElement = prevLetters[TypedLettersCursor]
        var newElement = React.cloneElement(currentElement, {className: `${isCorrect? "correct" : "incorrect"} text-2xl ${!triggerNewLine.current ? "typing-cursor" : ""}`})
        if(triggerNewLine.current){
          currentElement = prevLetters[TypedLettersCursor+1]
          var MoveCursorToNewLine = React.cloneElement(currentElement, {className: `untyped text-2xl newline-cursor`})
          prevLetters[TypedLettersCursor+1] = MoveCursorToNewLine;
        }
        prevLetters[TypedLettersCursor] = newElement;
        if(TypedLettersCursor > 0){
          currentElement = prevLetters[TypedLettersCursor-1]
          var removedCursorClass = currentElement.props.className.replace('typing-cursor', '')
          newElement = React.cloneElement(currentElement, {className: removedCursorClass})
          prevLetters[TypedLettersCursor-1] = newElement;
        }
        const newLetters = [...prevLetters];
        return newLetters;
      })
  }



  const HandleBackSpace = () => {

    if(unTypedLetters[TypedLettersCursor-1]?.props.letter.replace(/\u00A0/g, ' ') == ' '){
      console.log('space char was deleted')
      charOnCurLine.current -= WordContainerss[WordContainerssCursor.current].props.letterCount
      WordContainerssCursor.current -= 2;
      UserCurWord.current -= 1;
      if(charOnCurLine.current <= 0){
        console.log('wentback one line')
        charOnCurLine.current = CharsPerLine.current.pop() ?? 0;
        TriggerPrevLine.current = true
      }
    }

    setUnTypedLetters((prevLetters) => {
      var currentElement = prevLetters[TypedLettersCursor-1]
      var newElement = React.cloneElement(currentElement, {className: "untyped text-2xl"})
      prevLetters[TypedLettersCursor-1] = newElement;

      if(TriggerPrevLine.current){
        currentElement = prevLetters[TypedLettersCursor]
        var newElement = React.cloneElement(currentElement, {className: "untyped text-2xl"})
        prevLetters[TypedLettersCursor] = newElement;
      }

      if(TypedLettersCursor-2 > 0){
        currentElement = prevLetters[TypedLettersCursor-2]
        var updatedClass = currentElement.props.className + ' typing-cursor';
        newElement = React.cloneElement(currentElement, {className: updatedClass})
        prevLetters[TypedLettersCursor-2] = newElement;
      }
      const newLetters = [...prevLetters];
      return newLetters;
    })
  }

  //Used to revert triggers back to false AFTER unTypedLetters have been properly set.
  useEffect(() => {
    if(triggerNewLine.current){
      const all_words =  document.getElementById('all-words')
      if(all_words && CharsPerLine.current.length > 1 ){
        var currentBottom = all_words.style.bottom || '0em';
        let bottomValue = parseFloat(currentBottom);
        bottomValue += 2
        all_words.style.bottom = `${bottomValue}em`
      }
      triggerNewLine.current = false
    }

    if(TriggerPrevLine.current){

      const all_words =  document.getElementById('all-words')
      if(all_words){
        var currentBottom = all_words.style.bottom || '2em';
        let bottomValue = parseFloat(currentBottom);
        bottomValue -= 2
        all_words.style.bottom = `${bottomValue}em`
      }
      TriggerPrevLine.current = false
    }
  }, [unTypedLetters])

  const handleKeyPresses = (Event: React.KeyboardEvent) => {

    if(charOnCurLine.current == 0){
      charOnCurLine.current = WordContainerss[0].props.letterCount
    }

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
        AddLetter(true, keyPressed == ' ');
        //setUnTypedLetters(unTypedLetters.slice(1));
        setTypedlettersCursor(TypedLettersCursor+1);
      }
      else if(keyPressed.match(/^[\S\s]{1}$/) && TypedLettersCursor < unTypedLetters.length){
        AddLetter(false, keyPressed == ' ')
        setTypedlettersCursor(TypedLettersCursor+1);
        //setUnTypedLetters(unTypedLetters.slice(1));
      }
    }
    else{
      if(Event.key == unTypedLetters[TypedLettersCursor]?.props.letter.replace(/\u00A0/g, ' ')){
        AddLetter(true, Event.key == ' ');
        setTypedlettersCursor(TypedLettersCursor+1);
        //setUnTypedLetters(unTypedLetters.slice(1));
      }
      else if(Event.key.match(/^[\S\s]{1}$/) && TypedLettersCursor < unTypedLetters.length){
        AddLetter(false, Event.key == ' ');
        setTypedlettersCursor(TypedLettersCursor+1);
        //setUnTypedLetters(unTypedLetters.slice(1));
      }
    }
  }
    let WordContainerss:React.ReactElement[] = []
    let lettersCounter = 0;
    var Word: React.ReactElement[] = [];
    for(var i =0; i<unTypedLetters.length; i++ ){
      if(unTypedLetters[i].props.letter != '\u00A0'){
        Word.push(unTypedLetters[i])
      }
      else{
        WordContainerss.push((<WordTest letterCount={i - lettersCounter}> {Word} </WordTest>))
        lettersCounter = i
        WordContainerss.push(unTypedLetters[i]);
        Word = []
      }
    }
    WordContainerss.push((<WordTest letterCount={i - lettersCounter}> {Word} </WordTest>))

    let charRenderCursor = 0;


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
                className="ParagraphWrapper flex items-start justify-center max-h-[13em]  min-h-[13em]  min-w-[42em] max-w-md bg-gray-900 p-4 rounded-lg"
                autoFocus={true}
                onKeyDown={handleKeyPresses}
              >

                <div id="progress-wrapper" className="relative">
                <div className="progress-tracker">
                    {UserCurWord.current}/{WordContainerss.length/2 + 0.5}
                  </div>
                  <div id="clip-container" className="w-full max-h-[11em] overflow-hidden">
                    <div id="all-words" className="flex justify-start flex-wrap relative box-content max-h-full overflow-hidden">
                      {WordContainerss.map((elem: React.ReactElement) =>(
                        <React.Fragment key={keyIndex.current++}>
                          {/* {charRenderCursor}
                          {!isNaN(parseInt(elem.props.letterCount, 10)) ? parseInt(elem.props.letterCount, 10) : 0} */}
                          {(charRenderCursor += !isNaN(parseInt(elem.props.letterCount, 10)) ? parseInt(elem.props.letterCount, 10) : 0) > MAXCHAR && <div style={{ flexBasis: '100%', height: '0' }} data-ignore={charRenderCursor -= (charRenderCursor - parseInt(elem.props.letterCount, 10)) } > </div>}
                          {elem}
                        </React.Fragment>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div
              tabIndex={0}
              ref={tabRef}
              className="ParagraphWrapper flex items-start justify-center max-h-[30em] min-h-[30em] min-w-[42em] max-w-md overflow-hidden bg-gray-900 p-4 rounded-lg"
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
          <button className="next-button" onClick={parentfunction}>
            <FaChevronCircleRight className="next-icon"/>
          </button>
        </div>
      )}
      </div>
    </div>
  )
};


