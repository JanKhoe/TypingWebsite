"use client";

import { useEffect, useRef } from "react";
import { FaChevronCircleRight, FaSync } from "react-icons/fa";

interface ResultsProps{
  ElapsedTime: number,
  TypedCharacters: React.ReactElement[],
  parentFunction: () => void;
}

export default function Results({ElapsedTime, TypedCharacters, parentFunction}: ResultsProps){


  const ElapsedTimeinSeconds = ElapsedTime/1_000
  const ElapsedTimeInMinutes = ElapsedTime/60_000
  const GrossWPM = (TypedCharacters.length/5)/ElapsedTimeInMinutes;
  const incorrectLetterCount = TypedCharacters.filter(letter =>
    letter.props.className === 'incorrect'
  ).length;
  const NetWPM = (GrossWPM) - (incorrectLetterCount/ElapsedTimeInMinutes)
  return (
    <div className="p-4">
      <div className="text-center space-y-6">
        <h1 className="text-green-400 text-3xl font-bold">
          <span className="inline" />
          Done Typing
        </h1>
        <div className="space-y-6">
          <div className="bg-gray-900 p-4 rounded-lg">
            <div className="flex justify-between items-center min-w-[12em]">
              <span className="text-gray-400">Net WPM</span>
              <span className="text-green-400 text-2xl font-bold">{NetWPM.toFixed(0)}</span>
            </div>
          </div>
          <div className="bg-gray-900 p-4 rounded-lg">
            <div className="flex justify-between items-center min-w-[12em]">
              <span className="text-gray-400">Gross WPM</span>
              <span className="text-green-400 text-2xl">{GrossWPM.toFixed(0)}</span>
            </div>
          </div>
          <div className="bg-gray-900 p-4 rounded-lg">
            <div className="flex justify-between items-center min-w-[12em]">
              <span className="text-gray-400" style={{ whiteSpace: 'pre-line' }}>{'Elapsed\nTime'}</span>
              <span className="text-green-400 text-2xl">{ElapsedTimeinSeconds.toFixed(2)}s</span>
            </div>
          </div>
          <div className="p4 flex items-center justify-center space-x-8">
            <button className="sync-button" onClick={parentFunction}>
              <FaSync className="sync-icon"/>
            </button>
            <button className="next-button">
              <FaChevronCircleRight className="next-icon"/>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}