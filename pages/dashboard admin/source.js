// import ls and ss functions
import { getDataFromLS, saveDataInLS } from '../../models/localStorage_actions.js';



// regex

const product_name_regex = /^[a-zA-Z_ ]{15,30}$/;

//elements
const dashboard = document.querySelector("#dashboard");
const logout_btn = document.querySelector("#logout_btn");
const container = document.querySelector(".container");
const products_div = document.querySelector(".products_div");
const date_data = document.querySelector('#date_data');
const time_data = document.querySelector('#time_data');
const address = document.querySelector('#address');


// init user
let user = getDataFromLS("session_login") ? getDataFromLS("session_login") : null;

if (user) {


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
        }
    ];


    let products = getDataFromLS("products") ? getDataFromLS("products") : [];

    const builder = (product) =>{
        const card = document.createElement("div");
        card.setAttribute("class", "card d-inline-block");
        card.style = "width: 18rem; margin: 10px;";

        const img = document.createElement("img");
        img.src = product.product_img;
        img.setAttribute("class", "card-img-top");
        img.style = "height: 200px; object-fit:cover"


        const body = document.createElement("div");
        body.setAttribute("class", "card-body");

        const title = document.createElement("h5");
        title.setAttribute("class", "card-title");
        title.textContent = product.product_name;

        const description = document.createElement("p");
        description.setAttribute("class", "card-text");
        description.textContent = product.product_desc;

        const price = document.createElement("p");
        price.setAttribute("class", "card-text");
        price.textContent = product.product_price;


        const remove_btn = document.createElement("a");
        remove_btn.href = "#";
        remove_btn.setAttribute("class", "btn btn-success");
        remove_btn.textContent = "remove";


        const edit_btn = document.createElement("button");
        edit_btn.setAttribute("class", "btn btn-warning");
        edit_btn.style = "margin-left:130px";

        const icon = document.createElement("i");
        icon.setAttribute('class', "bi bi-pencil-square");

        edit_btn.append(icon);


        edit_btn.addEventListener('click', ()=>{

            const product_name_update_input = document.createElement("input");
            product_name_update_input.setAttribute("type","text");
            product_name_update_input.value = product.product_name;
            body.replaceChild(product_name_update_input, title);


            
            const product_description_update_input = document.createElement("input");
            product_description_update_input.setAttribute("type","text");
            product_description_update_input.value = product.product_desc;
            product_description_update_input.style = "margin-top:5px"
            body.replaceChild(product_description_update_input, description);

            const product_price_update_input = document.createElement("input");
            product_price_update_input.setAttribute("type","number");
            product_price_update_input.value = product.product_price;
            product_price_update_input.style = "margin-block:5px;"
            body.replaceChild(product_price_update_input, price);


            const update_btn = document.createElement("a");
            update_btn.href = "#";
            update_btn.setAttribute("class", "btn btn-danger");
            update_btn.textContent = "update";

            body.replaceChild(update_btn, remove_btn);



            update_btn.addEventListener('click',()=>{

                if(product_name_regex.test(product_name_update_input.value)) {

                    product_name_update_input.style= "background-color:lightgreen";
                    validations[0].valid = true;
                }
                else {
                    product_name_update_input.style= "background-color:tomato"
                    validations[0].valid = false;
                }
                
                if(product_description_update_input.value.length <= 250) {
                    product_description_update_input.style= "background-color:lightgreen"
                    validations[1].valid = true;
                }
                else {
                    product_description_update_input.style= "background-color:tomato"
                    validations[1].valid = false;
                }
                
                if (parseInt(product_price_update_input.value) > 0) {
                    product_price_update_input.style = "background-color: lightgreen",
                    validations[2].valid = true;
                }
                else {
                    product_price_update_input.style = "background-color: tomato",
                    validations[2].valid = false;
                }

                if (validations.every(input => input.valid)) {
                    products.find(prd => prd.product_id == product.product_id).product_name = product_name_update_input.value;
                    products.find(prd => prd.product_id == product.product_id).product_desc = product_description_update_input.value;
                    products.find(prd => prd.product_id == product.product_id).product_price = parseInt(product_price_update_input.value);
    
                    saveDataInLS("products", products);
    
                    alert('update success');
                    location.reload();
                }
                
                else {
                    alert("please input correct all the fields")
                }

            })



        })

        remove_btn.addEventListener("click", (e) => {
            e.preventDefault();

            const filtered_arr = products.filter(prd => prd.product_id != product.product_id);

            saveDataInLS("products", filtered_arr);
            location.reload();
        })


        body.append(title, description, price, remove_btn, edit_btn);
        card.append(img, body);
        products_div.append(card);
    }

    if (products.length < 1) {
        container.innerHTML = "no products"
    }

    else {

        products.map(product => {

            builder(product);

        });
    }


    logout_btn.addEventListener("click", (event) => {
        event.preventDefault();
        localStorage.removeItem("session_login");
        setTimeout(() => {
            location.reload();
        }, 1000)
    })

}
else {
    location.href = "../login/login.html";
}



setInterval(() => {
    const current_day = new Date();

    const current_date = current_day.toLocaleDateString();
    const current_time = current_day.toLocaleTimeString();

    date_data.innerHTML = current_date;
    time_data.innerHTML = current_time;
}, 1000);

const successCallback = async (obj) => {

    const { longitude, latitude } = obj.coords;

    try {

        const url = `https://api.opencagedata.com/geocode/v1/json?q=${latitude}+${longitude}&key=8b8e2b3b17c2487980f16568681d848c`
        const response = await fetch(url);
        const data = await response.json();
        address.innerHTML = data.results[0].formatted;

    } catch (error) {
        console.log(error);
    }
}

const failCalback = (err) => {
    console.log(err);
}


navigator.geolocation.getCurrentPosition(successCallback, failCalback, {
    enableHighAccuracy: true
});