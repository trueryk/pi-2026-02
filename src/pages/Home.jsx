import { useState } from "react"
import RollerCard from "../components/RollerCard"

export default function Home() {
    const [search, setSearch] = useState('')
    return (
        <>
            <header className='grid grid-cols-7 h-[6rem] items-center'>
                <div className='col-span-5 text-center grid grid-cols-5 items-center'>
                    <div className='logo col-span-1 justify-center flex'>
                        <img className='w-[2.9rem]' src='/images/Logo.jpg' alt='' />
                    </div>
                    <div className='search relative'>
                        <div className='icon absolute pt-1 ps-2'>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                                <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
                            </svg>
                        </div>
                        <input class='inline-block rounded border-blue-950 border-[.1rem] w-[40rem] h-[2rem] ps-[2.5rem] pe-[1rem]' type='search' name='search-bar' id='search-bar' value={search} onChange={(e) => {
                            setSearch(e.target.value)
                        }} />
                        <input className="absolute" type="reset" value="" />
                    </div>
                </div>
                <div className='col-span-2 text-center'>
                    <a href="/cadastrar">Cadastrar</a>
                    <a href="/entrar" className="ms-10">Entrar</a>
                </div>
            </header>

            <div className='bg-linear-to-b from-[#001f65] to-[#004dff] h-[60vh] justify-end flex'>
                <div className='title text-center flex h-[40vh] items-center'>
                    <h1 className='text-[3.5rem]'>
                        <span className='text-[#0cc0df]'>Conecta</span>
                        <span className='text-white'>Serviços</span>
                        </h1>
                </div>
                <div className='dots-bg w-[30vw] h-[40vh]'></div>
            </div>
            <ul id="scroll-roller1" className='roller flex mt-[-6.7rem] ps-[4rem] overflow-x-scroll pe-[4rem] gap-10'>
                <RollerCard />
                <RollerCard />
                <RollerCard />
                <RollerCard />
                <RollerCard />
            </ul>
        </>
    )
}