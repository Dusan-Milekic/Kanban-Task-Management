export default function WorkSpace() {
    return (
        <div className="h-[80vh] bg-light-grey  dark:bg-very-dark-grey flex flex-col items-center justify-center gap-[25px] ">
            <p className="text-center font-bold text-lg text-medium-grey ">The board is empty. Create a new  <br />column to get started</p>
            <button className="w-[174px] h-[48px] bg-main-purple text-white rounded-3xl cursor-pointer">+ Add New Column</button>
        </div>
    )

}