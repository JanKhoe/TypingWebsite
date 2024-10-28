interface LetterProps{
  children: React.ReactNode;
  letter: String;
  className: string;
  // next: React.ReactElement;
  // onKeyPress: (event: React.KeyboardEvent<HTMLInputElement>) => void;
}



export default function Letter({children, letter, className}: LetterProps){

  return (<>
            <p className={className}>
              {letter}{children}
            </p>
          </>
          )}