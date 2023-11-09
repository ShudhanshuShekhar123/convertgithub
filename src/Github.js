import React, { useState } from 'react';
import { Link } from "react-router-dom";



const Github = () => {

  const [loading, setloading] = useState(false)

  const handleclick = () => {
    setloading(true)
    window.location.href = ("https://code-converter-github-integration.onrender.com/auth")
    // window.location.href = ("  http://localhost:8000/auth")
  }



  return (
    <div>
      <div style={{ marginTop: "10%", marginBottom: "60px" }}>
        <h1 style={{ color: "white", marginBottom: "30px", wordSpacing: "20px", fontSize: "70px" }}>CODE CONVERTER</h1>
        <h1 style={{ color: "white", textAlign: "center" }}>Convert, Debug and Elevate Your Code!</h1>
      </div>
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", marginBottom: "60px" }}>
        {
          loading ?
            <div>
              <img style={{ mixBlendMode: "difference", zIndex: "1" }} height="500px" src=" https://i.pinimg.com/originals/39/3b/cd/393bcdb21e28679f89d9fd9cfaecdced.gif" about='lt ="' />
            </div>
            :
            <div>
              <button style={{ padding: "10px 45px", fontSize: "22px", fontWeight: "600", borderRadius: "10px", cursor: "pointer" }} onClick={handleclick}>Sign In to Github</button>
              <Link to="/app">
                <button style={{ padding: "10px 45px", fontSize: "22px", fontWeight: "600", borderRadius: "10px", cursor: "pointer", marginLeft: "20px" }} > Enter as Guest Mode</button>
              </Link>
            </div>

        }

      </div>
    </div>

  )
}

export default Github