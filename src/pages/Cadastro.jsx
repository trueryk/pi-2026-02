import { useMask } from "@react-input/mask"
import { useState, useEffect } from "react"
import { replace, useNavigate } from "react-router-dom";
import { cpfValidator } from 'cpf-cnpj-validator'

export default function Cadastro() {
    const cpfRef = useMask({
        mask: '___.___.___-__',
        replacement: { _: /\d/ }
    })

    const cepRef = useMask({
        mask: '__.___-___',
        replacement: { _: /\d/ }
    })

    const navegar = useNavigate()
    const [cpf, setCpf] = useState('')
    const [nome, setNome] = useState('')
    const [email, setEmail] = useState('')
    const [nasc, setNasc] = useState('')
    const [bday, setBday] = useState('')
    const [senha, setSenha] = useState('')
    // Endereço com API dos correios
    const [cep, setCep] = useState('')
    const [bairro, setBairro] = useState('')
    const [cidade, setCidade] = useState('')
    const [estado, setEstado] = useState('')
    const [erro, setErro] = useState(false)
    const [rua, setRua] = useState('')
    const [numero, setNumero] = useState('')
    const [complemento, setComplemento] = useState('')
    const [resposta, setResposta] = useState([])

    useEffect(() => {
        if (cep.length === 10) {
            fetch(`https://viacep.com.br/ws/${cep.replace(/[.,/#!$%^&*;:{}=\-_`~()?"'']/g, "")}/json/`)
                .then(response => response.json())
                .then(data => {
                    setBairro(data.bairro);
                    setCidade(data.localidade);
                    setEstado(data.uf);
                    setRua(data.logradouro);
                    setErro(data.erro);
                });
        } else {
            setBairro('');
            setCidade('');
            setEstado('');
            setRua('');
        }
    }, [cep]);

    useEffect(()=>{

        setBday(nasc.slice(0,4) + "-" + nasc.slice(5,7) + "-" + nasc.slice(8,10))

    },[nasc])

    function enviarCadastro(){

        fetch(`http://localhost:8080/api/auth/register`,{

            method: "POST",
            body: JSON.stringify({
                "cpf": cpf,
                "name": nome,
                "email": email,
                "password": senha,
                "birthday": bday,
                "address": {
                    "cep": cep.replace(/[.,/#!$%^&*;:{}=\_`~()?"'']/g, ""),
                    "uf": estado,
                    "municipio": cidade,
                    "bairro": bairro,
                    "logradouro": rua,
                    "numero": numero,
                    "complemento": complemento
                }
            }),
    headers: {
    "Content-type": "application/json; charset=UTF-8"
  }

    })
    .then((response) => response.json())
    .then((json) => setResposta(json))
    }

    useEffect(()=>{

        if(resposta.id != null){

            window.alert("Cadastro realizado com sucesso, prossiga com o login para continuar!")

            navegar("/entrar", {replace: true, relative: "path"})

        }

    },[resposta])

    return (
        <>
            <div className='container w-full h-[100vh] flex items-center justify-center bg-[#144975] h-[60vh]'>
                <section className='login-card h-[85vh] w-[60vw] shadow-[0_0_20px_rgba(0,0,0,0.25)] rounded bg-white'>
                    <h1 className='text-center py-3 text-[1.5rem] text-black'>CADASTRO</h1>
                    <form className=''>
                        <div className='grid grid-cols-2 py-2'>
                            <div className='flex flex-col px-5'>
                                {/* CPF */}
                                <div className='input-container flex flex-col text-black'>
                                    <label htmlFor='cpf'>CPF</label>
                                    <input className='ring-1 rounded ps-2 py-1'
                                        type='text'
                                        name='cpf'
                                        id='cpf'
                                        ref={cpfRef}
                                        required
                                        value={cpf}
                                        placeholder='Digite seu CPF (000.000.000-00)'
                                        onChange={(e) => { setCpf(e.target.value) }}
                                    />
                                </div>
                                <div className="h-4">
                                    {cpfValidator.isValid(cpf) ?
                                        <></> :
                                        cpf.length == 14 ?
                                            <span className='text-red-500 flex flex-row items-center'>
                                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-4 me-1">
                                                    <path stroke-linecap="round" stroke-linejoin="round" d="m11.25 11.25.041-.02a.75.75 0 0 1 1.063.852l-.708 2.836a.75.75 0 0 0 1.063.853l.041-.021M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9-3.75h.008v.008H12V8.25Z" />
                                                </svg> CPF inválido</span> :
                                            <></>
                                    }
                                </div>
                                {/* Nome */}
                                <div className='input-container flex flex-col mb-4 text-black'>
                                    <label htmlFor='nome'>Nome</label>
                                    <input className='ring-1 rounded ps-2 py-1'
                                        type='text'
                                        name='nome'
                                        id='nome'
                                        required
                                        value={nome}
                                        placeholder='Digite seu nome'
                                        onChange={(e) => { setNome(e.target.value) }} />
                                </div>
                                {/* Email */}
                                <div className='input-container flex flex-col mb-4 text-black'>
                                    <label htmlFor='email'>E-mail</label>
                                    <input className='ring-1 rounded ps-2 py-1'
                                        type='email'
                                        name='email'
                                        id='email'
                                        required
                                        value={email}
                                        placeholder='Digite seu email (email@email.com)'
                                        onChange={(e) => { setEmail(e.target.value) }} />
                                </div>
                                {/* Senha */}
                                <div className='input-container flex flex-col mb-4 text-black'>
                                    <label htmlFor='password'>Senha</label>
                                    <input className='ring-1 rounded ps-2 py-1'
                                        type='password'
                                        name='password'
                                        id='password'
                                        required
                                        value={senha}
                                        placeholder='Digite sua senha'
                                        onChange={(e) => { setSenha(e.target.value) }} />
                                </div>
                                {/* Aniversário */}
                                <div className='input-container flex flex-col text-black'>
                                    <label htmlFor='nasc'>Data de Nascimento</label>
                                    <input className='ring-1 rounded ps-2 py-1'
                                        type='date'
                                        name='nasc'
                                        id='nasc'
                                        required
                                        value={nasc}
                                        onChange={(e) => { setNasc(e.target.value) }} />
                                </div>
                            </div>
                            <div className='flex flex-col px-5 text-black'>
                                {/* CEP */}
                                <div className='input-container flex flex-col'>
                                    <label htmlFor='cep'>CEP</label>
                                    <input className='ring-1 rounded ps-2 py-1 '
                                        type='text'
                                        name='cep'
                                        id='cep'
                                        ref={cepRef}
                                        value={cep}
                                        placeholder='Digite seu CEP (00.000-00)'
                                        onChange={(e) => { setCep(e.target.value) }} />
                                </div>
                                <div className="h-4">
                                    {cep == 10 ?
                                        <></> :
                                        erro ?
                                            <span className='text-red-500 flex flex-row items-center'>
                                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-4 me-1">
                                                    <path stroke-linecap="round" stroke-linejoin="round" d="m11.25 11.25.041-.02a.75.75 0 0 1 1.063.852l-.708 2.836a.75.75 0 0 0 1.063.853l.041-.021M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9-3.75h.008v.008H12V8.25Z" />
                                                </svg> CEP inválido </span> :
                                            <></>
                                    }
                                </div>
                                {/* Bairro */}
                                <div className='input-container flex flex-col mb-4'>
                                    <label htmlFor='bairro'>Bairro</label>
                                    <input className='ring-1 rounded ps-2 py-1 bg-[#efefef] text-[#545454] border-[#767676]'
                                        type='text'
                                        name='bairro'
                                        id='bairro'
                                        disabled
                                        value={bairro}
                                    />
                                </div>
                                <div className='input-container flex flex-col mb-4'>
                                    <div className="grid grid-cols-5 gap-5">
                                        {/* Cidade */}
                                        <div className="col-span-4 input-container flex flex-col">
                                            <label htmlFor='cidade'>Cidade</label>
                                            <input className='ring-1 rounded ps-2 py-1 bg-[#efefef] text-[#545454] border-[#767676]'
                                                type='text'
                                                name='cidade'
                                                id='cidade'
                                                disabled
                                                value={cidade}
                                            />
                                        </div>
                                        {/* Estado */}
                                        <div className='col-span-1 input-container flex flex-col mb-4'>
                                            <label htmlFor='uf'>Estado</label>
                                            <input className='ring-1 rounded ps-2 py-1 bg-[#efefef] text-[#545454] border-[#767676]'
                                                type='text'
                                                name='uf'
                                                id='uf'
                                                disabled
                                                value={estado}
                                            />
                                        </div>
                                    </div>
                                    {/* Rua */}
                                    <div className="grid grid-cols-5 gap-5">
                                        <div className='col-span-4 input-container flex flex-col mb-4'>
                                            <label htmlFor='rua'>Rua</label>
                                            <input className='ring-1 rounded ps-2 py-1 bg-[#efefef] text-[#545454] border-[#767676]'
                                                type='text'
                                                name='rua'
                                                id='rua'
                                                disabled
                                                value={rua}
                                            />
                                        </div>
                                        {/* Número */}
                                        <div className='col-span-1 input-container flex flex-col mb-4'>
                                            <label htmlFor='numero'>Número</label>
                                            <input className='ring-1 rounded ps-2 py-1'
                                                type='number'
                                                name='numero'
                                                id='numero'
                                                value={numero}
                                                onChange={(e) => { setNumero(e.target.value) }}
                                            />
                                        </div>
                                    </div>
                                    {/* Complemento */}
                                    <div className='input-container flex flex-col'>
                                        <label htmlFor='complemento'>Complemento</label>
                                        <input className='ring-1 rounded ps-2 py-1'
                                            type='text'
                                            name='complemento'
                                            id='complemento'
                                            value={complemento}
                                            placeholder='Ex: apt 1'
                                            onChange={(e) => { setComplemento(e.target.value) }}
                                        />
                                    </div>
                                </div>
                                {/* {cpf.replace(/[.,/#!$%^&*;:{}=\-_`~()?"'']/g, "")} */}
                            </div>
                        </div>
                        <div className="flex justify-center mt-2">
                            <button type="button" disabled={erro} className={`disabled:bg-black hover:ring-1 hover:ring-[#144975] text-white bg-[#144975] hover:bg-white hover:text-[#144975] px-3 py-2 rounded text-[1rem] hover:shadow-[0_0_5px_#144975] duration-200`} onClick={()=>{enviarCadastro()}}>
                                Cadastrar
                            </button>
                        </div>
                    </form>
                    
                </section>
            </div>
        </>
    )
}