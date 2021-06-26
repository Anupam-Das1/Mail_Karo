import React,{useEffect,createContext,useReducer,useContext} from 'react'
import {BrowserRouter,Route,Switch,useHistory} from'react-router-dom'
import NavBar from './component/Navbar'
import "./App.css"
import Home from './component/screen/Home'
import Signin from './component/screen/Signin'
import Signup from './component/screen/Signup'
import Create from './component/screen/Create'
import History from './component/screen/History'
import {reducer,initialState} from './reducers/userReducer'
export const userContext=createContext()

const Routing=()=>{
  const history=useHistory()
  const {state,dispatch}=useContext(userContext)
  useEffect(()=>{
    const user=JSON.parse(localStorage.getItem("user"))
      if(user){
         dispatch({type:"USER",payload:user})
         //history.push('/')
      }
      else{
        history.push('/signin')
      }
  },[])
  return(
    <Switch>
         <Route exact path="/">
           <Home />
         </Route>
         <Route path="/signin">
           <Signin />
         </Route>
         <Route path='/signup'>
           <Signup />
         </Route>
         <Route path='/create'>
           <Create />
         </Route>
         <Route path='/history'>
           <History />
         </Route>
    </Switch>
  )
}
function App() {
  const [state,dispatch] =useReducer(reducer,initialState)
  return (
      <userContext.Provider value={{state,dispatch}}> 
      <BrowserRouter>
        <NavBar />
        <Routing />
      </BrowserRouter>
      </userContext.Provider>
      // <div>
      //   <NavBar />
      // </div>
  );
}


export default App;
