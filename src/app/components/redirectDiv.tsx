"use client";


interface RedirectDivProps{
  link: string
  className?: string
  innerText?: string
  children?: React.ReactNode;
}



export default function RedirectDiv({link, className, innerText, children}: RedirectDivProps){

  const handleClick = () => {
    window.location.href = link;
  };


  return (<>
            <div className={className} onClick={handleClick}>{innerText}

              {children}
            </div>
          </>
          )
}