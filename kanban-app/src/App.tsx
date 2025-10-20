
import './App.css'
import Header from './components/Header'
import SideBar from './components/SideBar'
import WorkSpace from './components/WorkSpace'
function App() {


  return (
    <>
      <div className="flex relative">
        <div className="hidden md:block md:flex-1">
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
