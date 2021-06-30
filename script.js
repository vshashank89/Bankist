'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

/////////////////////////////////////////////////
// Data

// DIFFERENT DATA! Contains movement dates, currency and locale

const account1 = {
  owner: 'Vidapanakal Shashank',
  movements: [200, 455.23, -306.5, 25000, -642.21, -133.9, 79.97, 1300],
  interestRate: 1.2, // %
  pin: 1111,

  movementsDates: [
    '2019-11-18T21:31:17.178Z',
    '2019-12-23T07:42:02.383Z',
    '2020-01-28T09:15:04.904Z',
    '2020-04-01T10:17:24.185Z',
    '2021-06-05T14:11:59.604Z',
    '2021-06-07T17:01:17.194Z',
    '2021-06-10T13:36:17.929Z',
    '2021-06-11T10:51:36.790Z',
  ],
  currency: 'EUR',
  locale: 'pt-PT', // de-DE
};

const account2 = {
  owner: 'Mahesh Babu',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,

  movementsDates: [
    '2019-11-01T13:15:33.035Z',
    '2019-11-30T09:48:16.867Z',
    '2019-12-25T06:04:23.907Z',
    '2020-01-25T14:18:46.235Z',
    '2020-02-05T16:33:06.386Z',
    '2020-04-10T14:43:26.374Z',
    '2020-06-25T18:49:59.371Z',
    '2020-07-26T12:01:20.894Z',
  ],
  currency: 'USD',
  locale: 'en-US',
};

const account3 = {
  owner: 'Arjun Kumar',
  movements: [200, -200, 340, -300, 400, -460, 1000, 2500],
  interestRate: 0.7, // %
  pin: 3333,

  movementsDates: [
    '2019-11-18T21:31:17.178Z',
    '2019-12-23T07:42:02.383Z',
    '2020-01-28T09:15:04.904Z',
    '2020-04-01T10:17:24.185Z',
    '2021-06-05T14:11:59.604Z',
    '2021-06-07T17:01:17.194Z',
    '2021-06-10T13:36:17.929Z',
    '2021-06-11T10:51:36.790Z',
  ],
  currency: 'EUR',
  locale: 'pt-PT',
};

const account4 = {
  owner: 'Radhe Shyam',
  movements: [430, 1000, 700, 50, 90, 5000, 1800, 300],
  interestRate: 1, // %
  pin: 4444,

  movementsDates: [
    '2019-11-18T21:31:17.178Z',
    '2019-12-23T07:42:02.383Z',
    '2020-01-28T09:15:04.904Z',
    '2020-04-01T10:17:24.185Z',
    '2021-06-05T14:11:59.604Z',
    '2021-06-07T17:01:17.194Z',
    '2021-06-10T13:36:17.929Z',
    '2021-06-11T10:51:36.790Z',
  ],
  currency: 'USD',
  locale: 'en-US', // de-DE
};

const accounts = [account1, account2, account3, account4];

/////////////////////////////////////////////////
// Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');

/////////////////////////////////////////////////
// Functions

// 6.Formatting Date Functionality:
// - We exported functionality of formatting date to a new function
// - We want to display recent transactions that happened like Today,Yesterday or 3 days ago , like in real web applications.
const formatMovementDate = function (date, locale) {
  const calcDaysPassed = (date1, date2) =>
    Math.round(Math.abs(date2 - date1) / (1000 * 60 * 60 * 24));

  const daysPassed = calcDaysPassed(new Date(), date);
  //console.log(daysPassed);

  if (daysPassed === 0) return 'Today';
  if (daysPassed === 1) return 'Yesterday';
  if (daysPassed <= 7) return `${daysPassed} days ago`;
  else {
    //const day = `${date.getDate()}`.padStart(2, '0');
    //const mon = `${date.getMonth() + 1}`.padStart(2, '0');
    //const year = date.getFullYear();

    //return `${day}/${mon}/${year}`;

    // Localizing Dates using Intl API in a single line of code instead of above code.
    return new Intl.DateTimeFormat(locale).format(date);
  }
};

// 7. Reusable Function for formatting currency:
// - A more generalized function that can be used anywhere in other apps as well which is less dependent on underlying data:
const formatCurrency = function (value, locale, currency) {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: currency, //we have currency property defined on account object.
  }).format(value);
};

// 1. Display movements in the User Interface.
// - we pass in the current account , because in each movement we need to get access to movementsDates array in the currentaccount object.
const displayMovements = function (acc, sort = false) {
  //First we need To empty the container , we use
  // - innerHTML property gives all the HTML code including tags,classes,text everything.
  // - similar to textContent prop , but it gives only the text.
  containerMovements.innerHTML = '';

  // Here we create movs conditionally based on sort whether true or false.
  // - We cannot sort() the original movements array because it mutates the original array.
  // - So we create a shallow copy using slice() and then sort that array.
  const movs = sort
    ? acc.movements.slice().sort((a, b) => a - b)
    : acc.movements;

  // It is like looping over 2 arrays at the same time
  // - So we are creating a date for each movement from teh movementsDates array with the same index.
  movs.forEach(function (mov, i) {
    const type = mov > 0 ? 'deposit' : 'withdrawal';

    // Create date object from movementsDates array
    const date = new Date(acc.movementsDates[i]); // date is created corresponding to user's Location Time zone.

    const displayDate = formatMovementDate(date, acc.locale);

    // Internationalizing Numbers/Currency:
    // The Number is formatted a/c to the locale,but the currency is displayed based on currency property.
    const formattedMov = formatCurrency(mov, acc.locale, acc.currency);

    // First we need to create a HTML template element.
    // - We can also change the classes of HTML elements in template literal.
    const html = `
      <div class="movements__row">
      <div class="movements__type movements__type--${type}">
      ${i + 1} ${type}
      </div>
        <div class="movements__date">${displayDate}</div>
        <div class="movements__value">${formattedMov}</div>
      </div>
    `;

    // To add html element to the DOM i.e. to insert into HTML : insertAdjacentHTML() method:
    // 1st argument position: 'afterbegin' ,'beforeend' , 'afterend' , 'beforebegin'
    //2nd argument : string to be passed , html element to be inserted in the DOM tree(HTML).
    containerMovements.insertAdjacentHTML('afterbegin', html); //like a stack, last element in the array appears on the top.
  });
};

//console.log(containerMovements.innerHTML);

//3. Calculate and Display Balance of the movements.
const calcDisplayBalance = function (acc) {
  const balance = acc.movements.reduce((acc, curr) => acc + curr, 0);

  acc.balance = balance; // So we are creating a new property on the acc object,but it gets reflected to original object that is passed in ,because acc points to the same object at the same location in the memory heap.

  // Directly formatting currency and displaying to the DOM
  labelBalance.textContent = formatCurrency(
    acc.balance,
    acc.locale,
    acc.currency
  );
};

// 4. Display Summary : We need to pass in the account because of their own and different interestRate properties
const calcDisplaySummary = function (acc) {
  const incomes = acc.movements
    .filter(mov => mov > 0)
    .reduce((acc, mov) => acc + mov, 0);

  labelSumIn.textContent = formatCurrency(incomes, acc.locale, acc.currency);

  const out = acc.movements
    .filter(mov => mov < 0)
    .reduce((acc, mov) => acc + mov, 0);

  labelSumOut.textContent = formatCurrency(
    Math.abs(out),
    acc.locale,
    acc.currency
  ); // This removes the weird long decimal number, that happens becasue of rounding errors in JavaScript.

  const interest = acc.movements
    .filter(mov => mov > 0)
    .map(deposit => (deposit * acc.interestRate) / 100)
    .filter((int, i, arr) => {
      //console.log(arr);
      return int >= 1;
    })
    .reduce((acc, int) => acc + int, 0);
  labelSumInterest.textContent = formatCurrency(
    interest,
    acc.locale,
    acc.currency
  );
};

// 2. User name :
// - We just did some work with the 'accounts' array i.e added new property 'userName'(computed it) to each account object.

const createUserNames = function (accs) {
  accs.forEach(function (acc) {
    acc.userName = acc.owner
      .toLowerCase()
      .split(' ') // since the split method returns an array of names
      .map(name => name[0])
      .join('');
  });
};

createUserNames(accounts);
console.log(accounts);

// 5. Update UI : Refactoring the functionality into its own function so that we can use it anywhere.
const updateUI = function (acc) {
  // Display Movements of the current account.
  displayMovements(acc);

  // Display Balance
  calcDisplayBalance(acc);

  // Display Summary
  calcDisplaySummary(acc);
};

// 8. Countdown Timer Function
// - We can see that the counter doesnot start immediately when we logIn ,It takes some time to actually start the counter, until that it displays the initial value.
// - So we need to take out the callback fn of setInterval and call it first before setInterval() function.
const startLogoutTimer = function () {
  // create a time 5 minutes
  let time = 600;

  // This callback function that we pass to setInterval() is not called immediately, this is first executed only after 1 sec(i.e the time interval of setInterval function.)
  const tick = function () {
    let min = String(Math.trunc(time / 60)).padStart(2, 0);
    let sec = String(time % 60).padStart(2, 0);

    // In Each call display remaining time.
    labelTimer.textContent = `${min}:${sec}`;

    //console.log(time);

    // If we decrease the time before itself, then the applicatins logsOut when the timer is at 01 sec.

    //When remaining time is 0 sec, stop the timer
    if (time === 0) {
      clearInterval(timer); // This stops executing the setInterval() timer.

      // logout the user(i.e Hide UI) and change Welcome msg
      labelWelcome.textContent = 'Log in to get started';
      containerApp.style.opacity = '0';
      containerApp.style.visibility = 'hidden';
    }
    // We need to decrease the time after checking if its zero
    // Decrease 1s of time in every call
    time--;
  };

  //Tick the counter first : Calling this function that displays Timer immediately
  tick();
  // Call the timer every second
  const timer = setInterval(tick, 1000);

  //We want this function to return the timer because it is needed to clear the timer and reset the timer:
  return timer;
};

////////////////////////////////////////////////////////////////////////////////
// Event Listeners:

// 1. Implementing Login :
// - In HTML form , the default behavior when we click the submit button,is the page reloads automatically.
// - To prevent this from happening , e.preventDefault(); property
// - Another Advantage of Html form : When we have one of the fields filled in the form, and when we press 'Enter' that will automatically trigger the 'click' event on the submit button.

let currentAccount;

/* FAKE LOGIN SO THAT ITS ALWAYS LOGGED IN
currentAccount = account1;
updateUI(currentAccount);
containerApp.style.opacity = '1'; // To display the hidden UI
containerApp.style.visibility = 'visible';*/

//We need this 'timer' variable as a global variable because we want the timer to persist b/w different logins and hold the value
// - We also need this to clear the current timer(if exists) and
// To RESET the TIMER :
let timer;

btnLogin.addEventListener('click', function (e) {
  // Prevent submitting form and reloading page.
  e.preventDefault(); // e is the event object,that is passed to the callback function.

  // to find the account that is to be logged in based on userName prop.
  currentAccount = accounts.find(
    acc => acc.userName === inputLoginUsername.value.trim()
  );
  console.log(currentAccount); // 'undefined' if not found

  // To check whether the currentAccount is defined we use optional chaining.
  if (currentAccount?.pin === Number(inputLoginPin.value)) {
    console.log('Logged in');

    // Display UI and message.
    labelWelcome.textContent = `Welcome back, ${
      currentAccount.owner.split(' ')[0]
    }`;
    containerApp.style.opacity = '1';
    containerApp.style.visibility = 'visible';

    // Remove input fields :
    inputLoginUsername.value = inputLoginPin.value = ''; //Assignment operator works from right to left.

    //remove focus on input fields i.e remove cursor : blur() method does it.
    inputLoginUsername.blur();
    inputLoginPin.blur();

    // Creating and Displaying current Date and Time  :
    /*const now = new Date();

    const day = `${now.getDate()}`.padStart(2, '0'); // padStart(desiredLength,string to pad with)
    const mon = `${now.getMonth() + 1}`.padStart(2, '0'); // Since the month component is zero-based
    const year = now.getFullYear();
    const hour = `${now.getHours()}`.padStart(2, '0');
    const min = `${now.getMinutes()}`.padStart(2, '0');

    labelDate.textContent = `${day}/${mon}/${year}, ${hour}:${min}`;*/

    //Internationalizing date and Time:
    const now = new Date();
    const options = {
      hour: 'numeric',
      minute: 'numeric',
      day: 'numeric',
      month: 'numeric', // Other values :'long','numeric','2-digit' , 'short'
      year: 'numeric',
      weekday: 'long', // other values :'short','narrow'
    };

    const locale = currentAccount.locale;
    labelDate.textContent = new Intl.DateTimeFormat('en-US', options).format(
      now
    );

    // Resetting the Timer:
    if (timer) clearInterval(timer);
    timer = startLogoutTimer();

    // Update UI
    updateUI(currentAccount);
  }
});

//2. Implementing Transfer:
btnTransfer.addEventListener('click', function (e) {
  e.preventDefault(); // important in form submit button,to prevent its default behavior of reloading the page.

  const amount = Number(inputTransferAmount.value);
  const receiverAcc = accounts.find(
    acc => acc.userName === inputTransferTo.value
  );
  console.log(amount, receiverAcc);

  // Conditions for the transfer to happen:
  // - Amount should be postive
  // - A valid receiverAcc
  // - enough balance in currentAccount
  // - transfer shouldnot happen to same account.
  if (
    amount > 0 &&
    receiverAcc &&
    currentAccount.balance >= amount &&
    receiverAcc?.userName !== currentAccount.userName
  ) {
    console.log('Transfer valid');

    //Results of Transfer:
    currentAccount.movements.push(-amount); //should be cut from currentAccount.
    receiverAcc.movements.push(amount); //gets added in receiverAcc.

    // Adding date for the transfer to both currentAccount and receiver account:
    currentAccount.movementsDates.push(new Date().toISOString());
    receiverAcc.movementsDates.push(new Date().toISOString());

    // Display UI or Update the User Interface.
    updateUI(currentAccount); // So that the movements,balance and summary immediately are updated.

    // Reset Timer
    clearInterval(timer);
    timer = startLogoutTimer();
  } else {
    console.log('Transfer Invalid - Enter correct Credentials');
  }

  // Clear the input fields:
  inputTransferTo.value = inputTransferAmount.value = '';
});

// 4. Loan feature using some() method:
btnLoan.addEventListener('click', function (e) {
  e.preventDefault();
  //Math.floor() does type corecion and rounds down the value and returns Number.
  const amount = Math.floor(inputLoanAmount.value);

  //Conditions to get a loan : amount>0 and any deposit of atleast 10% of loan amount.
  if (amount > 0 && currentAccount.movements.some(mov => mov >= amount * 0.1)) {
    // Implementing Timer to simulate the loan :
    // - So the loan gets approved after certain time
    setTimeout(function () {
      // Add movement
      currentAccount.movements.push(amount);

      // adding movementDate of the loan
      currentAccount.movementsDates.push(new Date().toISOString());

      // Update UI
      updateUI(currentAccount);

      // Reset Timer
      clearInterval(timer);
      timer = startLogoutTimer();

      //
    }, 2500);
  } else {
    console.log('Loan is not issued due to insufficient transaction amounts.');
  }

  inputLoanAmount.value = '';
});

// 3. Implementing Close account feature using findIndex() method:
btnClose.addEventListener('click', function (e) {
  e.preventDefault(); // to prevent Default behavior.

  // Check credentials:
  // +'23' converts string to Number.
  if (
    currentAccount.userName === inputCloseUsername.value &&
    currentAccount.pin === +inputClosePin.value
  ) {
    // Delete account from accounts array.
    //const index = accounts.indexOf(currentAccount);

    //findIndex() method:
    const index = accounts.findIndex(
      acc => acc.userName === currentAccount.userName
    );

    //console.log(index);

    // splice() method deletes that element from the original array i.e manipulates the original array , so we need not to store this anywhere.
    const [deletedAcc] = accounts.splice(index, 1);

    //Clear the input fields :
    inputCloseUsername.value = inputClosePin.value = '';

    //Hide UI i.e logging out the user
    containerApp.style.opacity = '0';
    containerApp.style.visibility = 'hidden';

    labelWelcome.textContent = 'Log in to get started';
    console.log(`${deletedAcc.owner}'s Account closed`);
  }
});

// 5. Implementing Sort functionaity using sort():
// - We need a state variable to keep the state of sorting.
let sortedState = false;
btnSort.addEventListener('click', function (e) {
  e.preventDefault(); // Always prevent default behavior.
  displayMovements(currentAccount, !sortedState);
  sortedState = !sortedState; // This flipping the state , makes everything work.
});

/////////////////////////////////////////////////
/////////////////////////////////////////////////
