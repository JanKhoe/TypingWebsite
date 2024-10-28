import Word from "./Word";
import React from "react";

interface ParagraphProps{
  children: React.ReactNode;
  phrase: String;
}


export default function Paragraph({children, phrase}: ParagraphProps){

  var words = phrase.split(' ').reverse();
  //var words = [ 'Jansen', '-', 'know', "don't", 'I', 'Something', 'Something' ]
  let JSXWords: React.ReactElement[] = [];
  // JSXWords.push(<Word text = {words[0]} next = {null} key={0}> </Word>)

  words.map((val, index) => {
    JSXWords.push(<Word text = {val} next ={JSXWords[index -1] || null} key={index}> </Word>);
    return(true)
  })




  return(
    <div className="flex justify-start">
      {JSXWords.reverse().map((val, index) => {
        return (
          <React.Fragment key={index}>
            {val}
            <React.Fragment> &nbsp; </React.Fragment>
          </React.Fragment>
        )
      })}
    </div>
  )
}