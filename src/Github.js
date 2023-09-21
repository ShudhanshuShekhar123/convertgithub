import React from 'react';



const Github = () => {

  const handleclick = () => {
    window.location.href = ("https://code-converter-github-integration.onrender.com/auth")
    // window.location.href = ("  http://localhost:8000/auth")
  }



  return (
    <div>
      <div style={{marginTop:"10%",marginBottom:"60px"}}>
      <h1 style={{color:"white", marginBottom:"30px",wordSpacing:"20px", fontSize:"70px"}}>CODE CONVERTER</h1>
      <h1  style={{color:"white", textAlign:"center"}}>Convert, Debug and Elevate Your Code!</h1>
      </div>
      <div style={{display:"flex", justifyContent:"center", alignItems:"center", marginBottom:"60px"}}>
      <button style={{padding:"10px 45px", fontSize:"22px", fontWeight:"600", borderRadius:"10px", cursor:"pointer"}} onClick={handleclick}>Sign In to Github</button>
      </div>
    </div>

  )
}

export default Github