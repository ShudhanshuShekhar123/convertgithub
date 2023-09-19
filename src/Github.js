import React from 'react';



const Github = () => {
   
    const handleclick =()=>{
        window.location.href= ("https://code-converter-github-integration.onrender.com/auth")
    }


  return (
   <button onClick={handleclick}>Sign IN to Github</button>
  )
}

export default Github