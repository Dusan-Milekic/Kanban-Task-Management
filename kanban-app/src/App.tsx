
import { useRef } from 'react';
import './App.css'
import Header from './components/Header'
import SideBar from './components/SideBar'
import WorkSpace from './components/WorkSpace'
function App() {

  const sidebar = useRef<HTMLDivElement>(null);
  return (
    <>
      <div className="flex relative">
        <div className="block md:flex-1" ref={sidebar}>
          <SideBar />

        </div>

        <div className="flex-1 md:flex-[100%] ">
          <Header />
          <WorkSpace />
        </div>
      </div>


    </>
  )
}

export default App
