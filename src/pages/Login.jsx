import { useState } from "react"

export default function Login (){
    
    const [email, setEmail] = useState('')
    const [senha, setSenha] = useState('')
    const [ocultar, setOcultar] = useState(true)
    const [resposta, setResposta] = useState([])



    function enviarLogin(){

        fetch(`http://localhost:8080/api/auth/login`,{

            method: "POST",
            body: JSON.stringify({

            "email": email,
            "password": senha

        }),
        headers: {
        "Content-type": "application/json; charset=UTF-8"

        }})
    .then((response) => response.json())
    //.then((json) => setResposta(json))
    //
    // ACHAR UMA FORMA SEGURA DE ARMAZENAR O TOKEN E O BEARER
    //
    // CHEQUE O CONSOLE PARA ENTENDER O QUE É O   TOKEN  <-------(TUDO NA VIDA ME LEMBRA DISSO SOCORRO)
    //
    .then((json)=> console.log(json))

    }
    

    return(
        <>
        <form>

        <input required type="text" name="email" placeholder="Digite seu email" id="email" value={email} onChange={(e)=>{setEmail(e.target.value)}}></input>
        <input required type={`${ocultar? "password" : "text"}`} name="senha" placeholder="Digite sua senha" id="senha" value={senha} onChange={(e)=>{setSenha(e.target.value)}}></input>
        <button type="button" onClick={()=>{setOcultar(!ocultar)}}>{`${ocultar? "Mostrar senha": "Ocultar senha"}`}</button>

        <button type="button" onClick={()=>{enviarLogin()}}>Enviar</button>

        </form>
        </>
    )
}