"use strict";

const account_1 = {
  AccountHolderName: "Subhash Yogi",
  transections: [
    120000, 670000, -150000, 2400000, -900000, -100000, 7000000, 450000,
  ],
  interestRate: 5.7, //%
  pin: 1717,

  transectionDates: [
    "2019-11-18T21:31:17.178Z",
    "2019-12-23T07:42:02.383Z",
    "2020-01-28T09:15:04.904Z",
    "2020-04-01T10:17:24.185Z",
    "2020-05-08T14:11:59.604Z",
    "2020-07-26T17:01:17.194Z",
    "2020-07-28T23:36:17.929Z",
    "2020-08-01T10:51:36.790Z",
  ],
};

const account_2 = {
  AccountHolderName: "Himanshu Soni",
  transections: [6700000, 3400000, -3200000, 250000, -1290000, 4000000,123569,987654,],
  interestRate: 6.7, //%
  pin: 9999,

  transectionDates: [
    "2019-11-01T13:15:33.035Z",
    "2019-11-30T09:48:16.867Z",
    "2019-12-25T06:04:23.907Z",
    "2020-01-25T14:18:46.235Z",
    "2020-02-05T16:33:06.386Z",
    "2020-04-10T14:43:26.374Z",
    "2020-06-25T18:49:59.371Z",
    "2020-07-26T12:01:20.894Z",
  ],
};

const allAccounts = [account_1, account_2];

const welcomeText = document.querySelector(".welcome");
const loginUser = document.querySelector(".login__input--user");
const loginPin = document.querySelector(".login__input--pin");
const loginBtn = document.querySelector(".login__btn");
const appContainer = document.querySelector(".app");
const currentBalanceDate = document.querySelector(".date");
const currentBalance = document.querySelector(".balance__value");
const movementContainer = document.querySelector(".movements");
const summaryValueIn = document.querySelector(".summary__value--in");
const summaryValueOut = document.querySelector(".summary__value--out");
const summaryValueInterest = document.querySelector(
  ".summary__value--interest"
);
const sortBtn = document.querySelector('.btn--sort');
const transferReciverName = document.querySelector(".form__input--to");
const transferAmount = document.querySelector(".form__input--amount");
const transferBtn = document.querySelector(".form__btn--transfer");
const loanAmount = document.querySelector(".form__input--loan-amount");
const loanBtn = document.querySelector(".form__btn--loan");
const closeUser = document.querySelector(".form__input--user");
const closePin = document.querySelector(".form__input--pin");
const closeBtn = document.querySelector(".form__btn--close");
const logouttimer = document.querySelector("timer");

const formatterTransectionDate = function (date) {
  const calcDayPassed = (tranDate, todayDate) => Math.round(Math.abs(todayDate - tranDate) / (1000 * 60 * 60 * 24));

  const daysPassed = calcDayPassed(new Date(), date)

  if(daysPassed === 0) return 'Today';
  if(daysPassed === 1) return 'Yesterday';
  if(daysPassed <= 7) return `${daysPassed} days ago`;

  const day = `${date.getDate()}`.padStart(2, 0);
  const month = `${date.getMonth() + 1}`.padStart(2, 0);
  const year = date.getFullYear();
  return `${day}/${month}/${year}`
}

const displayMovement = function (transection, sort = false) {
  movementContainer.innerHTML = "";
  const trans = sort ? transection.transections.slice().sort((a, b) => a - b) : transection.transections;
  trans.forEach(function (tran, i) {

    const type = tran > 0 ? "deposit" : "withdrawal";
    const sign = type === "deposit" ? "+" : "";
    const date = new Date(transection.transectionDates[i]);
    
    const dispalyDates = formatterTransectionDate(date);  

    const html = `<div class="movements__row">
                        <div class="movements__type movements__type--${type}">${
      i + 1
    } ${type}</div>
    <div class="movements__date">${dispalyDates}</div>
                        <div class="movements__value">₹ ${sign}${tran.toFixed(
      2
    )}</div>
                    </div>`;

    movementContainer.insertAdjacentHTML("afterbegin", html);
  });
};


const calcCurrentBalance = function (acc) {
  
  acc.balance = acc.transections.reduce((acc, tran) => acc + tran, 0);
  currentBalance.textContent = `₹ ${acc.balance.toFixed(2)}`;
};

const calcCurrentSummary = function (acc) {
  const deposits = acc.transections
    .filter((tran) => tran > 0)
    .reduce((acc, tran) => acc + tran, 0);
  summaryValueIn.textContent = `₹${deposits.toFixed(2)}`;

  const withdrawals = acc.transections
    .filter((tran) => tran < 0)
    .reduce((acc, tran) => acc + tran, 0);
  summaryValueOut.textContent = `₹${Math.abs(withdrawals).toFixed(2)}`;

  const interests = acc.transections
    .filter((tran) => tran > 0)
    .map((depos) => (depos * acc.interestRate) / 100)
    .reduce((acc, inter) => acc + inter, 0);

  summaryValueInterest.textContent = `${interests.toFixed(2)}`;
};

const createUserName = function (accAll) {
  accAll.forEach((acc) => {
    acc.userName = acc.AccountHolderName.toLowerCase()
      .split(" ")
      .map((nam) => nam[0])
      .join("");
  });
};
createUserName(allAccounts);

const updateUI = function (acc) {
  
  //Display transections
  displayMovement(acc);
  //Display Balance
  calcCurrentBalance(acc);
  //Display Summary
  calcCurrentSummary(acc);
};

let currentAccount;
loginBtn.addEventListener("click", (e) => {
  e.preventDefault();

  currentAccount = allAccounts.find(
    (account) => account.userName === loginUser.value
  );
  //console.log(currentAccount);

  if (currentAccount.pin === +(loginPin.value)) {
    //Display Welcome UI
    welcomeText.textContent = `Welcome back, ${
      currentAccount.AccountHolderName.split(" ")[0]
    }`;

    appContainer.style.opacity = 100;
    // Create current date and time 
    const now = new Date();
    const option = {
      year: 'numeric',
      month: 'numeric',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
    }
    const locale = navigator.language;
    currentBalanceDate.textContent = new Intl.DateTimeFormat('en-IN', option).format(now)
      // const day = `${now.getDate()}`.padStart(2, 0);
      // const month = `${now.getMonth() + 1}`.padStart(2, 0);
      // const year = now.getFullYear();
      // const hour = `${now.getHours()}`.padStart(2, 0);
      // const minute = `${now.getMinutes()}`.padStart(2, 0);
      // const date = day + "/" + month + "/" + year;
      // const time = hour + ":" + minute;
      // currentBalanceDate.textContent = ` ${date}, ${time}`;

      updateUI(currentAccount);

    loginUser.value = loginPin.value = "";
    loginPin.blur();

    const lsHistory = localStorage.getItem(currentAccount);
    // if (lsHistory != null) {
    //   setHistory(JSON.parse(lsHistory));
    // }
  } else {
    //For Login wrong password
    console.log("Wrong password");
  }
});

transferBtn.addEventListener("click", (e) => {
  e.preventDefault();

  const reciverName = allAccounts.find(
    (acc) => acc.userName === transferReciverName.value
  );
  const amount = +(transferAmount.value);

  transferReciverName.value = transferAmount.value = '';

  if (amount > 0 && reciverName && currentAccount.balance >= amount && reciverName?.userName !== currentAccount.userName) {
    //Transfer amount
      currentAccount.transections.push(Math.floor(-amount));
      reciverName.transections.push(Math.floor(amount));

      // Transfer date
      currentAccount.transectionDates.push(new Date());
      reciverName.transectionDates.push(new Date()); 

      //update UI
      updateUI(currentAccount)
  }
});

loanBtn.addEventListener('click', (e) => {
  e.preventDefault();

  const amount = +(loanAmount.value);  

  // if (amount > 0 && currentAccount.transections.some(tran => tran >= amount * 0.8)) {
  if (amount >= 1 && currentAccount.balance > amount) {
    //Loan amount
    currentAccount.transections.push(Math.floor(amount));

    //Loan transaction date
    currentAccount.transectionDates.push(new Date());

    updateUI(currentAccount)

  }
  loanAmount.value = '';
})

closeBtn.addEventListener('click', (e) => {
  e.preventDefault();

  if (closeUser.value === currentAccount.userName && +(closePin.value) === currentAccount.pin) {
    
    const index = allAccounts.findIndex(acc => acc.userName === currentAccount.userName)
    //Close account
    allAccounts.splice(index, 1);
    appContainer.style.opacity = 0;
  
  }
  closeUser.value = closePin.value = "";

})

let sorted = false;
sortBtn.addEventListener("click", (e) => {
  e.preventDefault();
  displayMovement(currentAccount.transections, !sorted);
  sorted = !sorted;
}); 