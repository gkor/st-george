// The max and min number of photos a customer can purchase
let TOTAL_PIZZAS = 0;
let MAX_PIZZAS = 3;

let pizzaOneQuantity = document.getElementById('pizza-input-1');
let pizzaTwoQuantity = document.getElementById('pizza-input-2');
let pizzaThreeQuantity = document.getElementById('pizza-input-3');

let addPizzaOneButton = document.getElementById("add-pizza-1");
let addPizzaTwoButton = document.getElementById("add-pizza-2");
let addPizzaThreeButton = document.getElementById("add-pizza-3");

let subPizzaOneButton = document.getElementById("sub-pizza-1");
let subPizzaTwoButton = document.getElementById("sub-pizza-2");
let subPizzaThreeButton = document.getElementById("sub-pizza-3");

let pizzaContainer = document.getElementById("pizzaTimes");

let selectedTime = "";

let pizzaTimes = {
  "4:00": 4,
  "4:30": 4,
  "5:00": 2,
  "5:30": 4,
  "6:00": 4,
  "6:30": 4,
  "7:00": 4,
  "7:30": 4
};

let toggleCheckout = function () {
  if (TOTAL_PIZZAS > 0 && selectedTime !== "") {
    document.getElementById("checkout-warning").style.display = "none";
    document.getElementById("submit").disabled = false;
  } else {
    document.getElementById("checkout-warning").style.display = "block";
    document.getElementById("submit").disabled = true;
  }
}

let selectTime = function (evt) {
  selectedTime = evt.target.innerHTML;
  resetTimeButtons();
  evt.target.classList.add('time-btn-selected');
  toggleCheckout();
};


let assignTimeListeners = function () {
  [...document.getElementsByClassName("time-btn")].forEach(
  (element, index, array) => {
    element.addEventListener('click', selectTime);
  }
);
}

let calculatePizzaSchedule = function () {
    pizzaContainer.innerHTML = '';
    Object.entries(pizzaTimes).forEach(function (time) {
    if(selectedTime === time[0] && time[1] <= TOTAL_PIZZAS) {
      console.log(`Selected Time: ${selectedTime} Time: ${time[0]} Value: ${time[1]} TOTAL_PIZZAS: ${TOTAL_PIZZAS}`);
      selectedTime = "";
      resetTimeButtons();
    }
      
    if(time[1] > TOTAL_PIZZAS) {
      if(selectedTime === time[0]) {
        pizzaContainer.insertAdjacentHTML('beforeend', `<button id="time-${time[0]}" type="button" class="time-btn time-btn-selected">${time[0]}</button>`);
      } else {
        pizzaContainer.insertAdjacentHTML('beforeend', `<button id="time-${time[0]}" type="button" class="time-btn">${time[0]}</button>`);
      }
    } 
  });
  assignTimeListeners();
};

calculatePizzaSchedule();

let resetTimeButtons = function () {
  Array.from(document.getElementsByClassName("time-btn")).forEach(function (button) {
    button.classList.remove('time-btn-selected');
  });
}

let calculateTotalPizzas = function () {
  TOTAL_PIZZAS = parseInt(pizzaOneQuantity.value) + parseInt(pizzaTwoQuantity.value) + parseInt(pizzaThreeQuantity.value);
  toggleCheckout();
  return parseInt(pizzaOneQuantity.value) + parseInt(pizzaTwoQuantity.value) + parseInt(pizzaThreeQuantity.value);
}

let disablePizzaAddButtons = function () {
  addPizzaOneButton.disabled = true;
  addPizzaTwoButton.disabled = true;
  addPizzaThreeButton.disabled = true;
}

let enablePizzaAddButtons = function () {
  addPizzaOneButton.disabled = false;
  addPizzaTwoButton.disabled = false;
  addPizzaThreeButton.disabled = false;
}

let disableAllButtons = function () {
  addPizzaOneButton.disabled = true;
  addPizzaTwoButton.disabled = true;
  addPizzaThreeButton.disabled = true;
  subPizzaOneButton.disabled = true;
  subPizzaTwoButton.disabled = true;
  subPizzaThreeButton.disabled = true;
}

let updateButtonState = function (button) {
  if(calculateTotalPizzas() === MAX_PIZZAS) {
    disablePizzaAddButtons();
  } else {
    enablePizzaAddButtons();
  }
  pizzaOneQuantity.value === 0 ? subPizzaOneButton.disabled = true : subPizzaOneButton.disabled = false;
  pizzaTwoQuantity.value === 0 ? subPizzaTwoButton.disabled = true  : subPizzaTwoButton.disabled = false;
  pizzaThreeQuantity.value === 0 ? subPizzaThreeButton.disabled = true  : subPizzaThreeButton.disabled = false;

  calculatePizzaSchedule();
}

let updatePizzaOneQuantity = function (evt) {
  let amount = evt && evt.target.id === 'add-pizza-1' && 1 || -1; // add or subtract
  disableAllButtons();
  pizzaOneQuantity.value = parseInt(pizzaOneQuantity.value) + amount;
  if (pizzaOneQuantity.value < 0) { pizzaOneQuantity.value = 0; }
  updateButtonState();
  //recalc schedule
};

let updatePizzaTwoQuantity = function (evt) {
  let amount = evt && evt.target.id === 'add-pizza-2' && 1 || -1; // add or subtract
  disableAllButtons();
  pizzaTwoQuantity.value = parseInt(pizzaTwoQuantity.value) + amount;
  if (pizzaTwoQuantity.value < 0) { pizzaTwoQuantity.value = 0; }
  updateButtonState();
};

let updatePizzaThreeQuantity = function (evt) {
  let amount = evt && evt.target.id === 'add-pizza-3' && 1 || -1; // add or subtract
  disableAllButtons();
  pizzaThreeQuantity.value = parseInt(pizzaThreeQuantity.value) + amount;
  if (pizzaThreeQuantity.value < 0) { pizzaThreeQuantity.value = 0; }
  updateButtonState();
};

addPizzaOneButton.addEventListener('click', updatePizzaOneQuantity);
addPizzaTwoButton.addEventListener('click', updatePizzaTwoQuantity);
addPizzaThreeButton.addEventListener('click', updatePizzaThreeQuantity);
subPizzaOneButton.addEventListener('click', updatePizzaOneQuantity);
subPizzaTwoButton.addEventListener('click', updatePizzaTwoQuantity);
subPizzaThreeButton.addEventListener('click', updatePizzaThreeQuantity);