
import './App.css'
import {Route, Routes} from 'react-router-dom'
import Home from '../src/pages/Home.jsx'


function App() {

  return (
    <div>
      
      <main className = "app-container">
        <Routes>
          <Route path = '/' element = {<Home/>}/>
        </Routes>
      </main>
    </div>
  )
}

export default App
