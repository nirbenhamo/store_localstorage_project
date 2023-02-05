import { getDataFromLS, saveDataInLS } from '../../models/localStorage_actions.js';
import Product from '../../models/product.js';



// regex

const product_name_regex = /^[a-zA-Z_ ]{15,30}$/;

// init product id counter
let id_counter = getDataFromLS("id_counter") ? parseInt(getDataFromLS("id_counter")) : 0;


// init products
let products = getDataFromLS("products") ? getDataFromLS("products") : [];


// init user
let user = getDataFromLS("session_login") ? getDataFromLS("session_login") : null;


// elements
const logout_btn = document.querySelector("#logout_btn");
const add_product_form = document.querySelector("#add_product_form");
const product_name = document.querySelector("#product_name");
const product_name_msg = document.querySelector("#product_name_msg");
const product_description = document.querySelector("#product_description");
const product_description_msg = document.querySelector("#product_description_msg");
const product_price = document.querySelector("#product_price");
const product_price_msg = document.querySelector("#product_price_msg");
const product_img = document.querySelector("#product_img");
const product_img_msg = document.querySelector("#product_img_msg");
const result = document.querySelector("#result");
const add_btn = document.querySelector("#add_btn");



let validations = [
    {
        name: "name validation",
        valid: false
    },
    {
        name: "description validation",
        valid: false
    },
    {
        name: "price validation",
        valid: false
    },
    {
        name: "img validation",
        valid: false
    }
];


if (user) {
    product_name.addEventListener("input", () => {

        if (product_name_regex.test(product_name.value)) {

            product_name_msg.textContent = "✔";
            product_name_msg.style.color = "green";
            validations[0].valid = true;
        }

        else {

            product_name_msg.textContent = "please enter valid product name";
            product_name_msg.style.color = "red";
            validations[0].valid = false;
        }
    })


    product_description.addEventListener("input", () => {

        if (product_description.value.length <= 250) {
            product_description_msg.textContent = "✔";
            product_description_msg.style.color = "green";
            validations[1].valid = true;
        }

        else {
            product_description_msg.textContent = "please enter till 250 charaters";
            product_description_msg.style.color = "red";
            validations[1].valid = false;
        }
    });


    product_price.addEventListener("input", () => {

        if (parseInt(product_price.value) > 0) {
            product_price_msg.textContent = "✔";
            product_price_msg.style.color = "green";
            validations[2].valid = true;
        }
        else {
            product_price_msg.textContent = "please enter a positive value";
            product_price_msg.style.color = "red";
            validations[2].valid = false;
        }
    });


    product_img.addEventListener("input", () => {

        if (product_img.value.toLowerCase().endsWith(".jpg") || product_img.value.toLowerCase().endsWith(".png")) {
            product_img_msg.textContent = "✔";
            product_img_msg.style.color = "green";
            validations[3].valid = true;
        }

        else {
            product_img_msg.textContent = "please enter jpg or png only";
            product_img_msg.style.color = "red";
            validations[3].valid = false;
        }
    });


    // function that actualy add the product
    const addProduct = ()=>{
        return new Promise((resolve, reject)=>{

            try {
                id_counter++
    
                const new_product = new Product(
                    id_counter,
                    product_name.value,
                    product_description.value,
                    parseInt(product_price.value),
                    product_img.value
                );
    
                products.push(new_product);
    
                saveDataInLS("id_counter", id_counter);
                saveDataInLS("products", products);
    
                resolve(true)
            } catch (error) {
                reject(error)
            }
        })
    }


    add_product_form.addEventListener("submit", async(e) => {

        e.preventDefault();

        const form_valid_final = validations.every(input => input.valid);

        if (form_valid_final) {

            try {

                await addProduct();

                result.textContent = "great ! successfully added";
                add_btn.remove();
    
                setTimeout(() => {
                    location.href = "./dash.html"
                }, 2000)

            } catch(error) {
                result.innerHTML = `failed to add product : error : ${error}`;
            }


        }
        else {
            result.textContent = "please add all correct inputs"
        }
    })



    logout_btn.addEventListener("click", (event) => {
        event.preventDefault();
        localStorage.removeItem("session_login");
        setTimeout(() => {
            location.reload();
        }, 1000)
    })
}

else {
    location.href = "../login/login.html"
}





setInterval(() => {
    const current_day = new Date();

    const current_date = current_day.toLocaleDateString();
    const current_time = current_day.toLocaleTimeString();

    date_data.innerHTML = current_date;
    time_data.innerHTML = current_time;
}, 1000);

const successCallback = async(obj)=>{
    
    const {longitude, latitude} = obj.coords;

    try {

        const url = `https://api.opencagedata.com/geocode/v1/json?q=${latitude}+${longitude}&key=8b8e2b3b17c2487980f16568681d848c`
        const response = await fetch(url);
        const data = await response.json();
        address.innerHTML = data.results[0].formatted;
        
    } catch (error) {
        console.log(error);
    }
}

const failCalback = (err)=>{
    console.log(err);
}


navigator.geolocation.getCurrentPosition(successCallback, failCalback,{
    enableHighAccuracy:true
});