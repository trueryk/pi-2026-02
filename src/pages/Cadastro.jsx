import { useMask } from "@react-input/mask"
import { useState } from "react"

export default function Cadastro() {
    const cpfRef = useMask({
        mask: '___.___.___-__',
        replacement: { _: /\d/ }
    })

    const [cpf, setCpf] = useState('')
    const [nome, setNome] = useState('')
    const [email, setEmail] = useState('')
   

    return (
        <>
            <div className='container w-full h-[100vh] flex items-center justify-center'>
                <section className='login-card h-[80vh] w-[60vw] shadow-[0_0_20px_rgba(0,0,0,0.25)] rounded'>
                    <h1 className='text-center pt-5 text-[1.5rem]'>Cadastrar</h1>
                    <form className='' validate>
                        <div className='grid grid-cols-2 py-2'>
                            <div className='flex flex-col gap-5 px-5'>
                                {/* CPF */}
                                <div className='input-container flex flex-col'>
                                    <label htmlFor='cpf'>CPF</label>
                                    <input className='ring-1 rounded'
                                        type='text'
                                        name='cpf'
                                        id='cpf'
                                        ref={cpfRef}
                                        required
                                        value={cpf}
                                        onChange={(e) => {setCpf(e.target.value)}}
                                         />
                                </div>
                                {/* Nome */}
                                <div className='input-container flex flex-col'>
                                    <label htmlFor='nome'>Nome</label>
                                    <input className='ring-1 rounded'
                                        type='text'
                                        name='nome'
                                        id='nome'
                                        required
                                        value={nome}
                                        onChange={(e) => {setNome(e.target.value)}} />
                                </div>
                                {/* Email */}
                                <div className='input-container flex flex-col'>
                                    <label htmlFor='email'>E-mail</label>
                                    <input className='ring-1 rounded'
                                        type='email'
                                        name='email'
                                        id='email'
                                        value={email}
                                        onChange={(e) => {setEmail(e.target.value)}} />
                                </div>
                                <input type="submit" value="Submit" />
                            </div>
                        </div>
                    </form>
                </section>
            </div>
        </>
    )
}