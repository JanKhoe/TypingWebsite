



interface WordProps{
  children: React.ReactNode;
  letterCount: number
  // next: React.ReactElement;
  // onKeyPress: (event: React.KeyboardEvent<HTMLInputElement>) => void;
}



export default function Word({children, letterCount}: WordProps){

  return (<>
            <div className="flex" data-letter-count={letterCount} >{children}</div>
          </>
          )}