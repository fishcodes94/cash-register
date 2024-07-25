let price = 3.26;

// Cash in drawer represented as an array of currency units and their amounts
let cid = [
  ["PENNY", 1.01],
  ["NICKEL", 2.05],
  ["DIME", 3.1],
  ["QUARTER", 4.25],
  ["ONE", 90],
  ["FIVE", 55],
  ["TEN", 20],
  ["TWENTY", 60],
  ["ONE HUNDRED", 100],
];

// Select the input element where the user will input the cash amount
const cash = document.querySelector("input");
// Select the element where the change due will be displayed
const change = document.getElementById("change-due");
// Select the purchase button
const purchaseBtn = document.querySelector("button");

// Array representing the value of each currency unit
let currencyUnits = [
  ["PENNY", 0.01],
  ["NICKEL", 0.05],
  ["DIME", 0.1],
  ["QUARTER", 0.25],
  ["ONE", 1],
  ["FIVE", 5],
  ["TEN", 10],
  ["TWENTY", 20],
  ["ONE HUNDRED", 100],
];

// Event listener for the purchase button click event
purchaseBtn.addEventListener("click", () => {
  // Parse the cash value input by the user
  const cashValue = parseFloat(cash.value);
  // Calculate the change due
  const changeDue = cashValue - price;

  // If the user does not have enough money
  if (cashValue < price) {
    alert("Customer does not have enough money to purchase the item");
    return;
  }

  // If the user paid the exact amount
  if (cashValue === price) {
    change.innerText = "No change due- customer paid with exact cash";
    return;
  }

  // Get the change breakdown
  const changeResult = getChange(changeDue, cid);

  // Display the status and the change due
  if (
    changeResult.status === "INSUFFICIENT_FUNDS" ||
    changeResult.status === "CLOSED"
  ) {
    change.innerText = `Status:${changeResult.status}  ${formatChange(
      changeResult.change
    )}`;
  } else {
    let changeText = `Status: OPEN ${formatChange(changeResult.change)}`;
    change.innerText = changeText;
  }
});

// Function to calculate the change
const getChange = (changeDue, cid) => {
  // Calculate the total amount of cash in drawer
  let totalCid = parseFloat(
    cid.reduce((sum, [_, amount]) => sum + amount, 0).toFixed(2)
  );

  // If there is not enough money in the drawer
  if (totalCid < changeDue) {
    return { status: "INSUFFICIENT_FUNDS", change: [] };
  }

  let changeArray = [];
  let remainingChange = changeDue;

  // Iterate over the currency units from largest to smallest
  for (let i = currencyUnits.length - 1; i >= 0; i--) {
    let unit = currencyUnits[i][0];
    let unitValue = currencyUnits[i][1];
    let unitInDrawer = cid[i][1];

    // If the currency unit can be used to give change
    if (unitValue <= remainingChange && unitInDrawer > 0) {
      let amountFromUnit = 0;

      // Continue to use the currency unit until the remaining change is less than the unit value or the unit in drawer is empty
      while (remainingChange >= unitValue && unitInDrawer > 0) {
        remainingChange = (remainingChange - unitValue).toFixed(2);
        unitInDrawer -= unitValue;
        amountFromUnit += unitValue;
      }

      // If any amount was used from the currency unit, add it to the change array
      if (amountFromUnit > 0) {
        changeArray.push([unit, amountFromUnit]);
      }
    }
  }

  // If there is still remaining change that cannot be given
  if (remainingChange > 0) {
    return { status: "INSUFFICIENT_FUNDS", change: [] };
  }

  // If the change due is exactly equal to the total cash in drawer
  if (changeDue === totalCid) {
    return { status: "CLOSED", change: cid };
  }

  // Return the change array and status as OPEN
  return { status: "OPEN", change: changeArray };
};

// Function to format the change array into a string
const formatChange = (changeArray) =>
  changeArray
    .map(([unit, amount]) => `${unit}: ${amount.toFixed(2)}`)
    .join(" ");
