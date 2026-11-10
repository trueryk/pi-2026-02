import { useState } from "react"

export default function Home() {
    const [search, setSearch] = useState('')
    return (
        <>
            <header className='grid grid-cols-7 h-[6rem] items-center'>
                <div className='col-span-5 text-center grid grid-cols-5 items-center'>
                    <div className='logo col-span-1 justify-center flex'>
                        <img className='w-[2.9rem]' src='/images/Logo.jpg' alt='' />
                    </div>
                    <div className='search'>
                        <input class='rounded border-blue-950 border-[.1rem]' type='text' name='search-bar' id='search-bar' value={search} onChange={(e) => {
                            setSearch(e.target.value)
                        }} />
                    </div>
                </div>
                <div className='col-span-2 text-center'>B</div>
            </header>
            
            <div className='bg-linear-to-b from-[#001f65] to-[#004dff] h-[60vh] justify-end flex'>
                <div className='dots-bg w-[30vw] h-[40vh]'></div>
            </div>
            <div className='roller flex mt-[-6.7rem] ps-[4rem] overflow-x-scroll pe-[4rem]'>
                <div className="h-[12rem] w-[12rem] bg-red-100 rounded-[1rem]"></div>
                <div className="h-[12rem] w-[12rem] bg-red-100 rounded-[1rem]"></div>
                <div className="h-[12rem] w-[12rem] bg-red-100 rounded-[1rem]"></div>
                <div className="h-[12rem] w-[12rem] bg-red-100 rounded-[1rem]"></div>
            </div>
        </>
    )
}