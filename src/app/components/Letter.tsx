interface LetterProps{
  children: React.ReactNode;
  letter: String;
  // next: React.ReactElement;
  // onKeyPress: (event: React.KeyboardEvent<HTMLInputElement>) => void;
}



export default function Letter({children, letter}: LetterProps){

  return (<>
            <p>
              {letter}{children}
            </p>
          </>
          )}