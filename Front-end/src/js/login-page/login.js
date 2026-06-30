



const inputEmail = document.getElementById("email")
const inputSenha = document.getElementById("senha")
const checkBox = document.getElementById("checkbox-lembrar")
const eye= document.getElementById("eye1")
eye.addEventListener("click", function(){
    if (inputSenha.type === "password"){
        inputSenha.type = "text"
        eye.className = "fas fa-eye-slash"
    } else{
        inputSenha.type = "password"
        eye.className = "fas fa-eye"
    }
})

function estiloBaseInput(...inputs){
    inputs.forEach(input =>{
        input.style.border = ""
    })
}
function estiloErroInput(input){
    if (input) input.style.border = "1px solid #EF4444"
}
function estilioBaseSpan(...spans){
    spans.forEach(span =>{
        span.style.display = "none"
    })
}
function eslitoErroSpan(span){
    span.style.display = "flex"
}







function logar(){
    const userEmail = inputEmail.value.trim()
    const userPassword = inputSenha.value.trim()
    let remeber = false

    if (checkBox.checked){
        remeber = true
    } else {
        remeber = false
    }
    const emailError = document.getElementById('email-error')
    const passwordError = document.getElementById("password-error")
    estiloBaseInput(inputEmail, inputSenha)
    estilioBaseSpan(emailError, passwordError )

    if (userEmail !== "" && userPassword !== ""){
        fetch("http://127.0.0.1:5000/loginUser", {
            method : 'POST', 
            headers : { 'Content-Type': 'application/json' },
            body : JSON.stringify({
                email: userEmail,
                senha : userPassword,
                remeber: remeber
            })
        })
        .then(respone => respone.json())
        .then(data=>{
            const modalOverlay = document.querySelector(".modal-overlay")
            const modalTittle = document.querySelector(".modal-tittle")
            const modalText = document.querySelector(".modal-text")
            let modalBtn = document.querySelector(".modal-btn")




            if (data.mensagem === "Usuário não encontrado"){
                estiloErroInput(inputEmail)
                emailError.textContent= "Usuário não encontrado!"
                eslitoErroSpan(emailError)
            }
            if (data.mensagem === "Senha incorreta"){
                estiloErroInput(inputSenha)
                passwordError.textContent = "Senha incorreta!"
                eslitoErroSpan(passwordError)
            }
            if (data.mensagem === "Erro no banco de dados"){
                modalOverlay.style.display = "flex"
                modalTittle.textContent= "Erro!"
                modalTittle.style.color = "#EF4444"
                modalText.textContent = "Ocorreu um erro em nosso banco de dados, tente novamente mais tarde!"
                modalBtn.style.width = "200px"
                modalBtn.textContent = "Voltar"
                modalBtn.style.backgroundColor = "#EF4444"
                modalBtn.addEventListener("click", function(){
                    modalOverlay.style.display="none"
                })
            }
            if (data.mensagem === "Login bem-sucedido"){
                localStorage.setItem("JWT_token", data.JWT_token)
                modalOverlay.style.display = "flex"
                modalTittle.textContent = "Login Efetuado com sucesso"
                modalTittle.style.color = "#22C55E"
                modalText.textContent="Agora você pode acessar sua conta."
                modalBtn.style.width = "200px"
                modalBtn.textContent = "Ir para a página principal"
                modalBtn.style.backgroundColor = "#22C55E"
                modalBtn.addEventListener("click", function(){
                    window.location.href = "Dev-Stickers.html"
                })
            }
        })
    } else{
        if (userEmail === ""){
            estiloErroInput(inputEmail)
            eslitoErroSpan(emailError)
        }
        if (userPassword === ""){
            estiloErroInput(inputSenha)
            passwordError.textContent = "Esse cammpo é obrigatório"
            eslitoErroSpan(passwordError)

        }

    }




}