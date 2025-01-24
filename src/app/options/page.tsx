import React, { useEffect, useMemo, useRef, useState } from "react";


export default () =>{
  return (
    <div className="settings-container">
      {/* Top section for textarea and checkboxes */}
      <div className="top-section">
        {/* Input Area */}
        <div className="input-section">
          <textarea
            className="custom-words"
            placeholder="Enter your custom words (Space Separated) here..."
            rows={8}
          ></textarea>
        </div>

        {/* Checkbox Area */}
        <div className="checkbox-section">
          <div className="checkbox-group">
            <label className="toggle">
              <input type="checkbox" />
              <span className="toggle-slider"></span>
              <span className="toggle-label">Periods ( . )</span>
            </label>
            <label className="toggle">
              <input type="checkbox" />
              <span className="toggle-slider"></span>
              <span className="toggle-label">Commas ( , )</span>
            </label>
            <label className="toggle">
              <input type="checkbox" />
              <span className="toggle-slider"></span>
              <span className="toggle-label">Question Marks ( ? )</span>
            </label>
            <label className="toggle">
              <input type="checkbox" />
              <span className="toggle-slider"></span>
              <span className="toggle-label">Exclamation ( ! ) </span>
            </label>
            <label className="toggle">
              <input type="checkbox" />
              <span className="toggle-slider"></span>
              <span className="toggle-label">Semicolons ( ; )</span>
            </label>
            <label className="toggle">
              <input type="checkbox" />
              <span className="toggle-slider"></span>
              <span className="toggle-label">Colon ( : ) </span>
            </label>
            <label className="toggle">
              <input type="checkbox" />
              <span className="toggle-slider"></span>
              <span className="toggle-label">Apostrophes ( ' )</span>
            </label>
            <label className="toggle">
              <input type="checkbox" />
              <span className="toggle-slider"></span>
              <span className="toggle-label">Dashes ( - )</span>
            </label>
          </div>
        </div>
      </div>

      {/* Bottom Controls */}
      <div className="bottom-controls">
        <div className="length-input">
          <input type="text" placeholder="Enter prompt length..." className="length-field" />
        </div>
        <button className="start-button">Start</button>
      </div>
    </div>
    )
  }
