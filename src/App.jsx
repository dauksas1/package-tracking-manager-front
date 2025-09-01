import './App.css'
import {Route, Routes} from 'react-router-dom'
import Home from '../src/pages/Home.jsx'
import ParcelDetails from './pages/ParcelDetails';
import { getParcelByIdApi } from './services/api';





function App() {

  return (
    <div>
      
      <main className = "app-container">
        <Routes>
          <Route path = '/' element = {<Home/>}/>
          <Route path="/parcel/:id" element={<ParcelDetails getParcelById={getParcelByIdApi} />} />
        </Routes>
      </main>
    </div>
  )
}

export default App
