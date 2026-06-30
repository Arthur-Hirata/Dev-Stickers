const inputEmail = document.getElementById("email")
const inputSenha = document.getElementById("senha")
const checkBox = document.getElementById("checkbox-lembrar")

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
        fetch("http://127.0.0.1:5000/")
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