"use client";


interface RedirectDivProps{
  link: string
  className: string
  innerText: string
}



export default function RedirectDiv({link, className, innerText}: RedirectDivProps){

  const handleClick = () => {
    window.location.href = link;
  };


  return (<>
            <div className={className} onClick={handleClick}>{innerText}</div>
          </>
          )
}