// import ls and ss functions
import {getDataFromLS,saveDataInLS} from '../../models/localStorage_actions.js'

// elements
const login_form = document.querySelector("#login_form");
const user_mail = document.querySelector("#user_mail");
const user_pass = document.querySelector("#user_pass");
const result = document.querySelector("#result");


// init array of users
let users = getDataFromLS('users') ? getDataFromLS('users') : [];


// init user
let user = getDataFromLS("session_login")? getDataFromLS("session_login") : null;

if(user) {

    if (user.role == 1) {
        location.href ="../home/home.html";
    }
    
    else if (user.role == 2) {
        location.href = "../dashboard admin/dash.html";
    }
}


login_form.addEventListener("submit",(event)=>{
    event.preventDefault();
    const user_exist = users.find(user=>user.user_mail == user_mail.value.toLowerCase());
    let user_name;
    if (user_exist && user_pass.value == user_exist.user_pass){


        user_name = user_exist.user_name;
        result.textContent = "successfully login..";
        saveDataInLS("session_login",{...user_exist});
        debugger


        if (user_exist.role == 2) {
            setTimeout(()=>{
                location.href = "../dashboard admin/dash.html"
            },3000)
        }

        else {

            setTimeout(()=>{
                location.href = "../home/home.html"
            },3000)
        }
    } 
    else {
        result.textContent = "mail or password are wrong";
    }
})