const boutonStart = document.querySelector('.start');
const restaurantsDiv = document.querySelector('.restaurants');
const platsDiv = document.querySelector('.plats');
const formDiv = document.querySelector('.form');

afficheRestaurants();
boutonStart.addEventListener('click', () => {
    afficheRestaurants();

})


/**
 * request a resto 
 * @param none
 */
function afficheRestaurants() {
    let maRequete = new XMLHttpRequest();

    maRequete.open('GET', `http://localhost:8888/frameworkPooRest-pm/index.php?controller=restaurant&task=indexApi`)

    maRequete.onload = () => {
        let data = JSON.parse(maRequete.response)

        let restaurants = data //objet
        restoCards(restaurants);

    }
    maRequete.send();
    restaurantsDiv.innerHTML = "";
    platsDiv.innerHTML = "";
    formDiv.innerHTML = ""

}


/**
 * gets a resto by its id along with all its associated plates
 * @param {*} id 
 */
function afficheUneRestaurant(id) {
    let maRequete = new XMLHttpRequest();

    maRequete.open('GET', `http://localhost:8888/frameworkPooRest-pm/index.php?controller=restaurant&task=showApi&id=${id}`)

    maRequete.onload = () => {
        let data = JSON.parse(maRequete.response)

        let restaurant = data.restaurant //objet
        let plats = data.plats //objet
        createRestoEtPlats(restaurant, plats);

    }
    maRequete.send();
}


function restoCards(tbl) {
    let cards = "";
    tbl.forEach(el => {
        let card =
            `
            <div class="card justify-content-center me-2" style="width: 18rem;">
                <div class="card-body">
                    <h5 class="card-title">${el.name}</h5>
                    <p class="card-text">${el.address}</p>
                    <button id="${el.id}" class="btn btn-primary viewresto"> Voir la carte </button>
                </div>
            </div>
        `;
        cards += card
    });
    restaurantsDiv.innerHTML = cards;

    const viewRestoBtns = document.querySelectorAll('.viewresto');
    viewRestoBtns.forEach(button => {
        button.addEventListener('click', event => {
            afficheUneRestaurant(button.id)
        })

    });

}

function createRestoEtPlats(resto, plats) {
    cardResto = `        
        <div class="col-6 d-flex border border-3 border-dark p-3 me-3 mb-5">
            <div class="card" style="width: 18rem;">
                <div class="card-body">
                <h5 class="card-title">${resto.name}</h5>
                <p class="card-text">${resto.address}</p>
                </div>
            </div> 
        </div>
        <hr>
        <button class="btn btn-dark addPlat" >Add Plat</button>
        `;

    restaurantsDiv.innerHTML = cardResto;


    let addBtn = document.querySelector('.addPlat');
    addBtn.addEventListener('click', () => {
        restaurantsDiv.innerHTML = "";
        platsDiv.innerHTML = "";
        addPlatForm(resto.id)
    });
    // ADD PLAT LOGIC WITH QSL event listener HERE CALL 
    // addPlat(name, description, price, restaurant_id)



    cardsPlats = ""

    plats.forEach(plat => {
        // recipe Template
        cardPlat = `     
        <div id="${plat.id}" class="col-6 d-flex border border-2 border-success flex-column align-items-center plat mb-2 p-3">
            <hr>
            <h4><strong>${plat.name}</strong></h4>
            <h5><strong>$ ${plat.price}</strong></h5>
            <p>${plat.description}</p>
            <hr>
            <button class="btn btn-danger" id="${plat.id}">Delete Plat</button>
        </div>`;
        cardsPlats += cardPlat
    })
    platsDiv.innerHTML = cardsPlats

    // Delete plat Button
    document.querySelectorAll('.plat').forEach(button => {
        button.addEventListener('click', event => {
            event.preventDefault();
            if (event.target.innerHTML == "Delete Plat") {
                deletePlat(button.id);
                button.remove();
            }
        })
    })
}

/**
 * deletes recipe by object idpassed through post
 * @param id
 * 
 */
function deletePlat(id) {

    let maRequete = new XMLHttpRequest();

    maRequete.open('POST', 'http://localhost:8888/frameworkPooRest-pm/index.php?controller=plat&task=supprApi')

    maRequete.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");

    maRequete.send(`id=${id}`);

}

/**
 * adds a plat by params pass through post
 * @param name
 * @param description
 * @param price
 * @param restaurant_id
 * 
 */
function addPlat(name, description, price, restaurant_id) {

    params = `name=${name}&description=${description}&price=${price}&restaurant_id=${restaurant_id}`;

    let maRequete = new XMLHttpRequest();

    maRequete.open('POST', 'http://localhost:8888/frameworkPooRest-pm/index.php?controller=plat&task=createApi')
    maRequete.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            afficheUneRestaurant(restaurant_id);
        }
    };

    // maRequete.onload = afficheUneRestaurant(restaurant_id);

    maRequete.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");

    maRequete.send(params);
}


function addPlatForm(restaurant_id) {
    let form = `
     <div class="col-6">
            <h4>Add Plate</h4>
            <form >
                <input type="hidden" name="restaurant_id" value="${restaurant_id}">
                <div class="mb-3">
                    <label for="name" class="form-label"> Name</label>
                    <input name="name" type="text" class="form-control" id="name">
                </div>
                <div class="mb-3">
                    <label for="price" class="form-label"> price</label>
                    <input name="price" type="number" class="form-control" id="price">
                </div>
                
                <div class="mb-3">
                    <label for="description" class="form-label">description</label>
                    <br>
                    <textarea name="description" id="description" cols="40" rows="5"></textarea>
                </div>

                <button id="addPlatSbmt" class="btn btn-primary addPlatSbmt">Submit</button>
            </form>
        </div>
    `;
    formDiv.innerHTML = form;
    let addPlatSbmt = document.querySelector(".addPlatSbmt")


    addPlatSbmt.addEventListener('click', event => {
        event.preventDefault();
        let name = document.querySelector('input[name="name"]');
        let description = document.querySelector('textarea[name="description"]');
        let price = document.querySelector('input[name="price"]');
        let restaurant_id = document.querySelector('input[name="restaurant_id"]');
        addPlat(name.value, description.value, price.value, restaurant_id.value);
        formDiv.innerHTML = "";
    })
}