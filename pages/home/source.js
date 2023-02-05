// import ls and ss functions
import Cart from '../../models/cart.js';
import { getDataFromLS, saveDataInLS } from '../../models/localStorage_actions.js'


//elements
const dashboard = document.querySelector("#dashboard");
const logout_btn = document.querySelector("#logout_btn");
const container = document.querySelector(".products_container");
const form_select = document.querySelector(".form-select");
const search_form = document.querySelector("#search_form");
const search_input = document.querySelector("#search_input");




// init user
let user = getDataFromLS("session_login") ? getDataFromLS("session_login") : null;

// init cart
let cart = getDataFromLS("user_cart") ? getDataFromLS("user_cart") : null;

if (user) {

    const builder = (product) => {

        const card = document.createElement("div");
        card.setAttribute("class", "card d-inline-block");
        card.style = "width: 18rem; margin: 10px;";

        const img = document.createElement("img");
        img.src = product.product_img;
        img.setAttribute("class", "card-img-top");
        img.style = "height: 200px; object-fit:contain"

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


        const plus_btn = document.createElement("a");
        plus_btn.href = "#";
        plus_btn.setAttribute("class", "btn btn-warning");
        plus_btn.textContent = "➕";

        // 
        plus_btn.addEventListener("click", () => {

            if (cart) {

                let temp_product = cart.products.find(eivar => eivar.product_id == product.product_id);
                if (temp_product) {
                    temp_product.quantity++;
                }

                else {
                    cart.products.push({
                        product_id: product.product_id,
                        quantity: 1
                    })
                }
            }

            else {


                cart = new Cart(user.user_mail, [
                    {
                        product_id: product.product_id,
                        quantity: 1
                    }
                ]);


            }


            saveDataInLS('user_cart', cart);
        });


        const minus_btn = document.createElement("a");
        minus_btn.href = "#";
        minus_btn.setAttribute("class", "btn btn-warning m-3");
        minus_btn.textContent = "➖";

        minus_btn.addEventListener("click", () => {

            if (cart) {

                
                let temp_product = cart.products.find(eivar => eivar.product_id == product.product_id);

                if (temp_product) {

                    if (temp_product.quantity > 1) {

                        temp_product.quantity--
                        
                    }

                    else {
                        cart.products.filter(eivar => eivar.product_id !== product.product_id);
                    }
                }

                saveDataInLS('user_cart', cart);
            }
        });

        body.append(title, description, price, plus_btn, minus_btn);
        card.append(img, body);
        container.append(card);
    }

    dashboard.textContent = `welcome ${user.user_name}`;


    let products = getDataFromLS("products") ? getDataFromLS("products") : [];


    if (products.length < 1) {
        container.innerHTML = "no products"
    }

    else {

        products.map(product => {
            builder(product)
        })
    }


    search_form.addEventListener("submit",(event)=>{
        event.preventDefault();
    
        let value = search_input.value;
        
        let filtered = products.filter(eivar => eivar.product_name.includes(value));


        if (filtered.length < 1) {
            container.innerHTML = "no products"
        }
    
        else {

            container.innerHTML = "";
    
            filtered.map(product => {
                builder(product)
            })
        }
        
    });


    search_input.addEventListener('input',()=>{

        if(search_input.value.length == 0) {

            container.innerHTML = "";

            products.map(product => {
                builder(product)
            })
        }
    })



    logout_btn.addEventListener("click", (event) => {
        event.preventDefault();
        localStorage.removeItem("session_login");
        setTimeout(() => {
            location.reload();
        }, 1000)
    })


    form_select.addEventListener("change", () => {

        let sorted_products = [...products];

        container.innerHTML = "";

        container.innerHTML = `
        <div class="loader">
            <div class="circle"></div>
            <div class="circle"></div>
            <div class="circle"></div>
            <div class="circle"></div>
        </div>
        `

        switch (form_select.value) {
            case "Name": {
                sorted_products.sort((a, b) => a.product_name.localeCompare(b.product_name));
                break;
            }
            case "Price": {
                sorted_products.sort((a, b) => a.product_price - b.product_price);
                break;
            }
            default: {
                sorted_products = products;
            }
        }

        setTimeout(() => {
            container.innerHTML = "";
            sorted_products.map(product => {
                builder(product)
            });
        }, 3000)
    })
}
else {
    location.href = "../login/login.html";
}




