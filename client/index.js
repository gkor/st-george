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

let pizzaTimes = window.SERVER_DATA.availability;

let toggleCheckout = function () {
  if (TOTAL_PIZZAS > 0 && selectedTime !== "") {
    document.getElementById("submit").disabled = false;
  } else {
    document.getElementById("submit").disabled = true;
  }
}

let selectTime = function (evt) {
  selectedTime = evt.target.innerHTML.replace(':','');;
  resetTimeButtons();

  evt.target.parentElement.getElementsByTagName('input')[0].checked = true;
  toggleCheckout();
};


let assignTimeListeners = function () {
  [...document.getElementsByClassName("input-radio")].forEach(
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
    
    if(time[1] >= TOTAL_PIZZAS && time[1] > 0) {
      if(selectedTime === time[0]) {
        pizzaContainer.insertAdjacentHTML('beforeend', `<div class="input-radio"><input class="pizza-radio" type="radio" id="time" name="time" value="${time[0]}" checked> <label id="${time[0]}-label" class="pizza-label" for="${time[0]}">${time[0].charAt(0)}:${time[0].substring(1, 3)}</label></div>`);
      } else {
        pizzaContainer.insertAdjacentHTML('beforeend', `<div class="input-radio"><input class="pizza-radio" type="radio" id="time" name="time" value="${time[0]}"> <label id="${time[0]}-label" class="pizza-label" for="${time[0]}">${time[0].charAt(0)}:${time[0].substring(1, 3)}</label></div>`);
      }
    } 
  });
  assignTimeListeners();
};

calculatePizzaSchedule();

let resetTimeButtons = function () {
  Array.from(document.getElementsByClassName("pizza-radio")).forEach(function (button) {
    button.checked = false;
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