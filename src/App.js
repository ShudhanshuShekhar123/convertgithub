import React, { useEffect, useState } from 'react';
import './styles.css'; // Assuming the CSS code is in a file named "styles.css"


import axios from 'axios';
import { useSearchParams } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  const [code, setCode] = useState('');
  const [convertedCode, setConvertedCode] = useState('');
  const [language, setLanguage] = useState("")
  const [searchparams] = useSearchParams()
  const [loading, setloading] = useState(false)
  const [profile, setprofile] = useState("")
  const [content, setcontent] = useState(null)
  const [filepath, setfilepath] = useState("")
  const [filepathsha, setfilepathsha] = useState("")
  // const[storebranch, setstorebranch] = useState("")

  const [username, setusername] = useState("")
  const [toggle, settoggle] = useState(false)
  const [repo, setrepo] = useState([])
  const [selectedrepo, setselectedrepo] = useState("")
  const [branch, setbranch] = useState("")
  const [particularbranch, setparticularbranch] = useState("")
  const [header, setheader] = useState("")
  const [path, setpath] = useState("")
  const [codecontent, setcodecontent] = useState("")
  const [commitsha, setcommitsha] = useState("")
  const [tokenauth, settokenauth] = useState("")
  const [commitmessage, setcommitmessage] = useState("")
  // const[ image, setimage] = useState("")
  // const navigate = useNavigate()
  const notify = () => toast.warn("Select the language to Convert!!", {
    position: "top-center",
    autoClose: 2000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    theme: "dark",
  });

  console.log(searchparams.get("code"), "oparams here")







  useEffect(() => {

    async function gettoken() {

      let url = `https://code-converter-github-integration.onrender.com/gettoken?code=${searchparams.get("code")}`;
      // console.log(url, "heer")

      let response = await axios.get(url)
      //  nextfunction()
      // .then((response) =>{
      //   // Handle success
      //   console.log(response,"accesstoken")


      // })
      // .catch(function (error) {
      //   // Handle error
      //   console.log(error);
      // });
      console.log(response.data.accesstoken, "accesstoken")
      settokenauth(response.data.accesstoken)

      if (response.data.accesstoken == null) {
        alert(" Code Expired!!, You need to Login again to Coonect to Github")
      }

      getprofile(response.data.accesstoken)


    }

    gettoken()


  }, [])


  // useEffect(()=>{

  //   let cookieurl =`http://localhost:8000/setcookie`;

  //   axios.get(cookieurl)
  //  .then((data)=>{
  //   console.log(data, "in cookie frontend")

  //  })

  // },[])





  //   function nextfunction(){


  //   let cookieurl =`http://localhost:8000/setcookie`;

  //     axios.get(cookieurl)
  //    .then((data)=>{
  //     console.log(data, "in cookie frontend")
  //     // getprofile()
  //    })

  // }






  function getprofile(token) {


    let profileurl = `https://code-converter-github-integration.onrender.com/profile?token=${token}`;

    axios.get(profileurl)
      .then(function (response) {
        // Handle success
        console.log(response, "profile")
        setprofile(response.data.login)
        setusername(response.data.name)
        console.log(response.data.login)

      })
      .catch(function (error) {
        // Handle error
        console.log(error);
      });


  }



  const getrepos = () => {
    if (profile.length === 0) {
      alert(" Code Expired!!, You need to Login again to Coonect to Github")
    } else {


      axios.get(`https://api.github.com/users/${profile}/repos`)
        .then((data) => {
          console.log(data.data)
          setrepo(data.data)
          setcontent("repos")
          setheader("Select the Repository")
          settoggle(true)
        })

    }


  }


  async function fetchRepositoryDetails(repoName) {
    // console.log(repoName,"reponame")
    // https://api.github.com/repos/{owner}/{repo}/branches
    setselectedrepo(repoName)

    try {
      const response = await axios.get(`https://api.github.com/repos/${profile}/${repoName}/branches`);
      console.log(response.data, "details of repo") // This contains the details of the repository


      setbranch(response.data)
      setcontent("branch")
      setheader("Select the Branch")



    } catch (error) {
      console.error('Error fetching repository details:', error);
      throw error;
    }
  }


  async function getRepositoryFile(branch1) {
    console.log(profile, repo, branch)
    setparticularbranch(branch1)
    try {
      const response = await axios.get(`https://api.github.com/repos/${profile}/${selectedrepo}/git/trees/${branch1}?recursive=1`);



      const selectedBranch = branch.find(branch => branch.name === branch1);

      if (selectedBranch) {
        const commitSHA = selectedBranch.commit.sha;
        setcommitsha(commitSHA)
        console.log('Commit SHA:', commitSHA);
      } else {
        console.error('Branch not found.');
      }

      console.log(branch, "brancbh")
      setpath(response.data.tree)
      console.log(response.data.tree, "path set")
      setcontent("path")
      setheader("Select the Path for change/edit the code")
    } catch (error) {
      console.error('Error fetching repository file:', error);
      throw error;
    }
  }




  async function getfilecontent(path1) {
    console.log(particularbranch, "partivlar branch")
    console.log(path, "path")

    try {
      const response = await axios.get(`https://api.github.com/repos/${profile}/${selectedrepo}/contents/${path1}`);

      console.log(response, "filepath")
      setfilepath(response.data.path)
      setfilepathsha(response.data.sha)



      const base64Content = response.data.content
      const decodedContent = atob(base64Content)

      console.log('Decoded Content:', decodedContent);
      setheader("Edit Your Code")
      setcontent("content")
      setcodecontent(decodedContent)



    } catch (error) {
      console.error('Error fetching repository file:', error);
      throw error;
    }
  }




  const handleCommit = async () => {
    const notify3 = () => toast.success("Code PUshed Successfully", {
      position: "top-center",
      autoClose: 2000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "dark",
    });

    fetch(`https://api.github.com/repos/${profile}/${selectedrepo}/contents/${filepath}`, {
      method: 'PUT',
      headers: {
        Authorization: `token ${tokenauth}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message: commitmessage,
        content: btoa(codecontent), // Convert content to Base64
        branch: particularbranch,
        sha: filepathsha // Specify the SHA hash of the existing file
      }),
    })
      .then(response => response.json())
      .then(data => {
        console.log('File updated:', data);
        settoggle(false)
        notify3()

      })
      .catch(error => {
        console.error('Error updating file:', error);
      });


  };


  const finalpage = () => {
    setheader("Adding changes to Github")
    setcontent("push")


  }

  const closediv = () => {
    settoggle(false)
  }






  // console.log(profile, "here")






  // if (searchparams.get("code") == null) {
  //   return <Navigate to="/github"></Navigate>
  // }







  const handleConvert = async () => {

    if (language.length === 0) {
      // alert("Select the language to Convert")
      notify()

    } else {

      setloading(true)
      try {
        const response = await fetch('https://code-converter-openai-c71m.onrender.com/convert', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ code, prompt: language }),
        });

        const data = await response.json();
        console.log(data.convertedcode)
        setloading(false)
        setConvertedCode(data.convertedcode);
      } catch (error) {
        console.error('Error converting code:', error);
      }

    }

  };

  const handledebug = async () => {
    console.log("hello")
    const notify1 = () => toast.info(" Please, Write some  Code first", {
      position: "top-center",
      autoClose: 2000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "dark",
    });


    if (code.length == 0) {
      // alert("Write some  Code first")
      notify1()
    } else {

      setloading(true)

      try {
        const response = await fetch('https://code-converter-openai-c71m.onrender.com/choice', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ code, prompt: "debug" }),
        });

        const data = await response.json();
        console.log(data.codequality)
        setloading(false)
        setConvertedCode(data.codequality);
      } catch (error) {
        console.error('Error converting code:', error);
      }

    }


  }

  const handlequality = async () => {
    console.log("hello")
    const notify2 = () => toast.info(" Please, Write some  Code first", {
      position: "top-center",
      autoClose: 2000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "dark",
    });


    if (code.length == 0) {
      // alert("Write some  Code first")
      notify2()
    } else {

      setloading(true)

      try {
        const response = await fetch('https://code-converter-openai-c71m.onrender.com/choice', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ code, prompt: "check quality" }),
        });

        const data = await response.json();
        console.log(data.codequality)
        setloading(false)
        setConvertedCode(data.codequality);
      } catch (error) {
        console.error('Error converting code:', error);
      }

    }



  }

  const handleclear = () => {

    setCode("")
    setConvertedCode("")
    setLanguage("")
  }

  const handlechangelanguage = (e) => {

    setLanguage(e.target.value)
  }





  return (

    <div className="container">


      <div className={toggle ? "a" : "b"} style={{ position: "relative", backgroundColor: "white", position: "absolute", top: "230px", zIndex: "200", left: "25%" }}>
        <span onClick={closediv} style={{ display: "flex", justifyContent: "center", alignItems: "center", position: "absolute", to: "50px", right: "40px", fontSize: "38px", backgroundColor: "black", color: "white", fontweight: '600', padding: "4px 9px", borderRadius: "6px" }}>&times;</span>

        <div>
          {
            content == "content" ? <div style={{ display: "flex", justifyContent: "center",gap:"80px", alignItems: "center" }}>
              <h2 style={{ textAlign: "center", color: "black", }}>{header}</h2>
              <button onClick={finalpage} style={{ fontSize: "18px", fontWeight: "600", padding: "5px 10px", borderRadius: "8px", cursor: "pointer", backgroundColor: "teal", color: "white" }}>Click to Proceed</button>
            </div>
              :
              <h2 style={{ textAlign: "center", color: "black" }}>{header}</h2>
          }


          <div style={{ height: "50vh", width: "50vw", overflowY: "scroll", backgroundColor: "white", padding: "20px", marginTop: "30px", paddingTop: "20px" }}>

            {
              content == "repos" ?
                repo?.map((item) => {
                  return <div onClick={() => fetchRepositoryDetails(item.name)} style={{ cursor: "pointer", paddingLeft: "18px", fontSize: "18px", fontWeight: "600", border: "2px solid black", marginBottom: "6px", marginRight: "10px", padding: "5px 9px", borderRadius: "8px" }}>{item.name}</div>
                })
                :
                content == "branch" ?

                  branch?.map((item) => {

                    return <div onClick={() => getRepositoryFile(item.name)} style={{ cursor: "pointer", paddingLeft: "18px", fontSize: "18px", fontWeight: "600", border: "2px solid black", marginBottom: "6px", marginRight: "10px", padding: "5px 9px", borderRadius: "8px" }}>{item.name}</div>
                  })
                  :

                  content == "path" ?

                    path?.map((item) => {
                      return <div onClick={() => getfilecontent(item.path)} style={{ cursor: "pointer", paddingLeft: "18px", fontSize: "18px", fontWeight: "600", border: "2px solid black", marginBottom: "6px", marginRight: "10px", padding: "5px 9px", borderRadius: "8px" }}>{item.path}</div>
                    })
                    :
                    content == "content" ?

                      <textarea className='first'
                        style={{ width: "50vw", height: "78vh", resize: "none" }}
                        value={codecontent}
                        onChange={(e) => setcodecontent(e.target.value)}
                        placeholder="Enter code..."
                      />


                      :
                      content == "push" ?
                        <div style={{ display: "flex", flexDirection: "column" }}>
                          <input onChange={(e) => setcommitmessage(e.target.value)} style={{ padding: "10px 6px", fontSize: "16px", fontWeight: "600", marginBottom: "10px" }} placeholder='Enter commit message' />
                          <button onClick={handleCommit} style={{ width: "200px", margin: "auto", padding: "9px 10px", fontSize: "17px", fontWeight: "600" , borderRadius:"6px", cursor:"pointer"}}>PUSH TO GITHUB</button>

                        </div>

                        :
                        null
            }

          </div>
        </div>
      </div>
      <h1>Code-Xpert </h1>
      <div>
        {/* <img width="100px" src={image} /> */}
        <h3 style={{ color: "white", textAlign: "center" }}> GithHub Profile ID :  <span style={{ color: "red" }}>{profile}</span></h3>


      </div>


      <div className='buttonsname'>
        <button onClick={getrepos}>SHOW ALL REPOS</button>
        <select hidden={toggle ? true : false} value={language} onChange={handlechangelanguage}>
          <option value="">Select Category</option>
          <option value="javascript">JAVASCRIPT</option>
          <option value="python">PYTHON </option>
          <option value="c++">C++ </option>
          <option value="java">JAVA</option>
          <option value="php">PHP</option>
        </select>
        {!toggle && (
          <>
            <button onClick={handleConvert}>CONVERT</button>
            <button onClick={handledebug}>DEBUG</button>
            <button onClick={handlequality}>QUALITY CHECK</button>
            <button className='clear' onClick={handleclear}>CLEAR</button>
          </>
        )}

      </div>
      <div className='text'>
        <textarea className='first'
          style={{ width: "50%", height: "72vh", marginTop: "20px", resize: "none", }}
          value={code}
          onChange={(e) => setCode(e.target.value)}
          placeholder="Enter code..."
        />

        {

          loading ? <div className='second' style={{ display: "flex", justifyContent: "center", alignItems: "center", width: "50%", height: "74vh", marginTop: "20px", resize: "none", overflowY: "scroll" }}>
            <img width={"160px"} src="https://downgraf.com/wp-content/uploads/2014/09/01-progress.gif" />
          </div>
            :

            <div className='second'
              style={{ width: "50%", height: "74vh", marginTop: "20px", resize: "none", overflowY: "scroll" }}>
              {convertedCode.split('\n').map((line, index) => (
                <div key={index}>{line}</div>
              ))}

            </div>

        }


        <ToastContainer
          position="top-center"
          autoClose={1000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="dark"
        />
      </div>

      {/* <div className="left-section">
        <textarea
          value={code}
          onChange={(e) => setCode(e.target.value)}
          placeholder="Enter code..."
        />
        <select
          value={language}
          onChange={(e) => setLanguage(e.target.value)}
        >
          <option value="">Select Language</option>
          <option value="javascript">JavaScript</option>
          <option value="python">Python</option>
          {/* Add more options for different languages */}
      {/* </select>
        <button onClick={handleConvert}>Convert</button>
      </div>
      <div className="right-section">
        <pre>{convertedCode}</pre>
      </div> */}
    </div>
  )
}

export default App;
