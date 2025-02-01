"use client";

import React, { useRef, useState, ChangeEvent } from "react";
import RedirectDiv from "../components/redirectDiv";
import Option from "../components/option";

export default () => {
  const promptLength = useRef<HTMLInputElement>(null);
  const userInput = useRef<HTMLTextAreaElement>(null);

  // State to store the values of the refs
  const [promptLengthValue, setPromptLengthValue] = useState("");
  const [userInputValue, setUserInputValue] = useState("");
  const [text, setText] = useState<string>('');

  const handleInputFilter = (event: React.FormEvent<HTMLInputElement>) => {
    const target = event.target as HTMLInputElement;
    target.value = target.value.replace(/[^0-9]/g, ""); // Remove non-numeric characters
  };

  const handlePromptLengthFilter = (event: ChangeEvent<HTMLTextAreaElement>) => {
    let target = event.target.value;
    const filteredValue = target.replace(/[^a-zA-Z\s]/g, "");
    const words = filteredValue.split(' ')
    const lastWord = words[words.length - 1];
    var truncatedValue;
    setText(filteredValue)
    if (lastWord.length > 45) {
      // If the last word exceeds 50 characters, truncate it to 50 characters
      words[words.length - 1] = lastWord.slice(0, 45);
      truncatedValue = words.join(' ');
      setText(truncatedValue)
    }
    if (userInput.current) {
      userInput.current.value = event.target.value; // Update ref value
      setUserInputValue(event.target.value); // Update state
    }
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (promptLength.current) {
      promptLength.current.value = event.target.value; // Update ref value
      setPromptLengthValue(event.target.value); // Update state
    }
  };

  return (
    <div className="settings-container">
      <div className="top-section">
        <div className="input-section">
          <textarea
            ref={userInput}
            className="custom-words"
            placeholder="Enter your custom words (Space Separated) here..."
            rows={8}
            value={text}
            onChange={handlePromptLengthFilter}
          ></textarea>
        </div>
        <div className="checkbox-section">
          <div className="checkbox-group">
            <label className="toggle">
              <input type="checkbox" />
              <span className="toggle-slider"></span>
              <span className="toggle-label">Period ( . )</span>
            </label>
            <label className="toggle">
              <input type="checkbox" />
              <span className="toggle-slider"></span>
              <span className="toggle-label">Comma ( , )</span>
            </label>
            <label className="toggle">
              <input type="checkbox" />
              <span className="toggle-slider"></span>
              <span className="toggle-label">Question Mark ( ? )</span>
            </label>
            <label className="toggle">
              <input type="checkbox" />
              <span className="toggle-slider"></span>
              <span className="toggle-label">Exclamation ( ! ) </span>
            </label>
            <label className="toggle">
              <input type="checkbox" />
              <span className="toggle-slider"></span>
              <span className="toggle-label">Semicolon ( ; )</span>
            </label>
            <label className="toggle">
              <input type="checkbox" />
              <span className="toggle-slider"></span>
              <span className="toggle-label">Colon ( : ) </span>
            </label>
            <label className="toggle">
              <input type="checkbox" />
              <span className="toggle-slider"></span>
              <span className="toggle-label">Apostrophe ( ' )</span>
            </label>
            <label className="toggle">
              <input type="checkbox" />
              <span className="toggle-slider"></span>
              <span className="toggle-label">Dash ( - )</span>
            </label>
          </div>
        </div>
      </div>
      <div className="bottom-controls">
        <div className="length-input">
          <input
            type="text"
            onChange={handleInputChange}
            className="length-field"
            ref={promptLength}
            onInput={handleInputFilter}
            placeholder="Enter prompt length"
          />
        </div>
        <RedirectDiv link="/" className="mode-header">
          {/* Pass state values as props */}
          <Option
            Mode={3}
            Params={[promptLengthValue, userInputValue]}
            className={"start-button"}
            innerText={"Start"}
          />
        </RedirectDiv>
      </div>
    </div>
  );
};