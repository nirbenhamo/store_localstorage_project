// import user class
import user_model from "../../models/user.js";

//import ls functions
import {getDataFromLS,saveDataInLS} from "../../models/localStorage_actions.js";

// elements
const register_form = document.querySelector("#register_form");
const user_name = document.querySelector("#user_name");
const user_name_msg = document.querySelector("#user_name_msg");
const user_mail = document.querySelector("#user_mail");
const user_mail_msg = document.querySelector("#user_mail_msg");
const user_pass = document.querySelector("#user_pass");
const user_pass_msg = document.querySelector("#user_pass_msg");
const user_pass_2 = document.querySelector("#user_pass_2");
const user_pass_2_msg = document.querySelector("#user_pass_2_msg");
const result = document.querySelector("#result");



// regex
const user_name_regex = /^[A-Za-z0-9]{6,15}$/;
const user_mail_regex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
const user_pass_regex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,15}$/;







// init array of users
let users = getDataFromLS('users') ? getDataFromLS('users') : [];

// init user
let user = getDataFromLS("session_login")? getDataFromLS("session_login") : null;

if (user) {
    location.href ="../home/home.html";
}



// array of validations
const validation = [
    {
        name: "user_name_valid",
        valid: false
    },
    {
        name: "user_mail_valid",
        valid: false
    },
    {
        name: "user_pass_valid",
        valid: false
    },
    {
        name: "user_pass2_valid",
        valid: false
    }
]


// user name validation
user_name.addEventListener("input", () => {

    if (user_name_regex.test(user_name.value)) {
        user_name_msg.textContent = "✔";
        user_name_msg.style.color = "green";
        validation[0].valid = true;
    }
    else {
        user_name_msg.textContent = "user name must have a 6-15 charaters and only a-z & A-Z & number !";
        user_name_msg.style.color = "red";
        validation[0].valid = false;
    }

});

// user mail validation
user_mail.addEventListener("input", () => {

    if (user_mail_regex.test(user_mail.value)) {

        if(users.some(user=>user.user_mail == user_mail.value.toLowerCase())){
            user_mail_msg.textContent = "email is already registered";
            user_mail_msg.style.color = "red";
            validation[1].valid = false;
        }

        else {
            user_mail_msg.textContent = "✔";
            user_mail_msg.style.color = "green";
            validation[1].valid = true;
        }
    }
    
    else {
        user_mail_msg.textContent = "please enter regular email";
        user_mail_msg.style.color = "red";
        validation[1].valid = false;
    }

});

// user pass validation
user_pass.addEventListener("input", () => {

    user_pass_2.value = "";
    user_pass_2_msg.innerHTML = "";
    validation[3].valid = false;

    if (user_pass_regex.test(user_pass.value)) {
        user_pass_msg.textContent = "✔";
        user_pass_msg.style.color = "green";
        validation[2].valid = true;
    }
    else {
        user_pass_msg.textContent = "passowrd must to have at least on a-z & A-Z & number and between 6-15 charaters";
        user_pass_msg.style.color = "red";
        validation[2].valid = false;
    }

});

// user pass 2 validation
user_pass_2.addEventListener("input", () => {

    if (user_pass_2.value == user_pass.value) {
        user_pass_2_msg.textContent = "✔";
        user_pass_2_msg.style.color = "green";
        validation[3].valid = true;
    }
    else {
        user_pass_2_msg.textContent = "passwords is not match";
        user_pass_2_msg.style.color = "red";
        validation[3].valid = false;
    }

});


// function that actualy save the user
const addUser= ()=>{
    
    return new Promise((resolve, reject)=>{

        try {
            const new_user = new user_model(user_name.value,user_mail.value.toLowerCase(),user_pass.value);
            users.push(new_user);
    
            saveDataInLS('users',users);
            validation.forEach((element)=>element.valid = false);
    
            resolve(true);
        } catch (error) {
            reject(error)
        }

    })

}

// all form validation
register_form.addEventListener("submit", async(event) => {
    event.preventDefault();

    const form_valid_final = validation.every(input=>input.valid);

    if (form_valid_final) {


        try {
            
            await addUser();


            result.textContent = "user seccessfully added";
            result.style.color = "blue";
            user_name.value = "";
            user_name_msg.textContent = "";
            user_mail.value = "";
            user_mail_msg.textContent = "";
            user_pass.value = "";
            user_pass_msg.textContent = "";
            user_pass_2.value = "";
            user_pass_2_msg.textContent = "";
    
            setTimeout(()=>{
                location.href = '../login/login.html';
            },3000);

        } catch (error) {
            result.innerHTML = "user not added, ERROR : " + error;
        }
    }

    else {
        result.textContent = "form not valid";
        result.style.color = "gray";
    }


})