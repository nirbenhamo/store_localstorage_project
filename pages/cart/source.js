import { getDataFromLS, saveDataInLS } from '../../models/localStorage_actions.js'


//elements
const logout_btn = document.querySelector("#logout_btn");
const container = document.querySelector(".container");


// init user
let user = getDataFromLS("session_login") ? getDataFromLS("session_login") : null;

// init cart
let cart = getDataFromLS("user_cart") ? getDataFromLS("user_cart") : null;

if (user) {


    let products = getDataFromLS("products") ? getDataFromLS("products") : [];


    if (cart) {

        let total = 0;

        cart.products.forEach((cart_product, index) => {

            let product_data = products.find(prd => prd.product_id == cart_product.product_id);
            /*                       <tr>
                        <th scope="row">1</th>
                        <td><img style="width: 10%;" src="https://cdn.shopify.com/s/files/1/0526/8075/3332/products/31vdoe4YWhL_540x.jpg"></td>
                        <td>Bannana</td>
                        <td>10</td>
                        <td>3.5</td>
                        <td>
                          <button class="btn btn-warning">➕</button>
                          <button class="btn btn-warning">➖</button>
                        </td>
                      </tr>  */
            const tr = document.createElement("tr");
            const th = document.createElement("th");
            th.setAttribute("scope", "row");
            th.append(index + 1)
            const td_1 = document.createElement("td");
            const img = document.createElement("img");
            img.style = "width: 10%;";
            img.src = product_data.product_img;
            td_1.append(img)
            const td_2 = document.createElement("td");
            td_2.textContent = product_data.product_name;
            const td_3 = document.createElement("td");
            td_3.textContent = cart_product.quantity;
            const td_4 = document.createElement("td");
            td_4.textContent = product_data.product_price;
            const td_5 = document.createElement("td");
            const plus_button = document.createElement("button");
            plus_button.setAttribute('class', "btn btn-warning");
            plus_button.textContent = "➕";


            // event liesintner for plus button

            plus_button.addEventListener("click", () => {

                cart_product.quantity++;

                td_3.textContent = cart_product.quantity;


                total += product_data.product_price;

                document.querySelector('#result').textContent = `Total : ${total}`
                saveDataInLS('user_cart', cart);
            });
            const minus_button = document.createElement("button");
            minus_button.setAttribute('class', "btn btn-warning");
            minus_button.textContent = "➖";


            // event liesintner for minus button
            minus_button.addEventListener("click", () => {




                if (cart_product.quantity > 1) {
                    cart_product.quantity--;

                    td_3.textContent = cart_product.quantity;


                    total -= product_data.product_price;

                    document.querySelector('#result').textContent = `Total : ${total}`
                    saveDataInLS('user_cart', cart);
                }

                else {

                    cart.products.splice(index, 1)

                    total -= product_data.product_price;

                    document.querySelector('#result').textContent = `Total : ${total}`
                    saveDataInLS('user_cart', cart);
                    tr.remove();

                }



            });

            td_5.append(plus_button, minus_button)

            total += product_data.product_price * cart_product.quantity;

            tr.append(th, td_1, td_2, td_3, td_4, td_5);
            document.querySelector('table').append(tr)


        });

        document.querySelector('#result').textContent = `Total : ${total}`;


        document.querySelector('#delete_cart_btn').addEventListener('click',()=>{
            document.querySelector('table').remove();
            document.querySelector('#delete_cart_btn').remove();
            document.querySelector('#result').innerHTML = "Cart is empty";
            localStorage.removeItem('user_cart')
        })



    }
    else {
        document.querySelector('table').remove();
        document.querySelector('#delete_cart_btn').remove();
        document.querySelector('#result').innerHTML = "Cart is empty";
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


