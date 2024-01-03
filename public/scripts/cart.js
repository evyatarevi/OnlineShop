const updateCart = (event) => {
  const amountDiv = event.target.closest(".amount-div");
  const amountInput = amountDiv.querySelector(".amount-input");
  const productAmount = amountInput.value;
  const productCard = event.target.closest(".product-card");
  const productId = productCard.dataset.id;

  fetch("/updateCart", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ id: productId, amount: productAmount }),
  })
    .then((response) => response.json())
    .then((data) => console.log(data.message));
};

const updateNumberSymbol = () => {
  fetch("/getProductCartAmount")
    .then((response) => response.json())
    .then(
      (data) =>
        (document.getElementById("sumCartProducts").textContent =
          data.amountProducts)
    );
};

const updateTotalPriceProduct = (event) => {
  const amountProducts = parseInt(event.target.value);
  const productCard = event.target.parentElement.parentElement;
  const textPriceProduct =
    productCard.querySelector(".price-product").textContent;
  const priceProduct = parseFloat(textPriceProduct.replace(/[^\d.]/g, ""));  //replace(/[^\d.]/g, "") - retain the decimal point in the resulting number
  const totalPriceProduct = productCard.querySelector(".total-price-product");
  
  const totalPrice = priceProduct * amountProducts;
  totalPriceProduct.textContent = `$${totalPrice}`;
};

const updateTotalAllPriceProducts = () => {
  const totalPricesCollection = document.getElementsByClassName(
    "total-price-product"
  ); //return html collection

  let sumTotalPrices = 0;
  for (let i = 0; i < totalPricesCollection.length; i++) {
    let totalPriceProduct = totalPricesCollection[i].textContent.replace(
      /[^\d.]/g,"");
    totalPriceProduct = parseFloat(totalPriceProduct);
    // if totalPriceProduct contains a non-numeric string, parseFloat will return NaN (Not a Number).
    if (!isNaN(totalPriceProduct)) {
      sumTotalPrices += totalPriceProduct;
    }
  }
  sumTotalPrices = sumTotalPrices.toFixed(2);  //The toFixed method returns a string representing a number in fixed-point notation, with a specified number of digits after the decimal point.
  
  //remove zero numbers after the dot:
  if(sumTotalPrices[sumTotalPrices.length-1] == 0){
      sumTotalPrices = sumTotalPrices.slice(0,-1);
      if(sumTotalPrices[sumTotalPrices.length-1] == 0){
        sumTotalPrices = sumTotalPrices.slice(0,-2); //with -2 I slice the end number and the dot.
      }
    }

  document.getElementById(
    "sum-total-prices"
  ).textContent = `Total: ${sumTotalPrices}$`;
};

const deleteProduct = async (event) => {
    const product = event.target.closest(".product-card");
    const productId = product.dataset.id;
    const response = await fetch("/delete-product", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ id: productId}),
    });
    const data = await response.json();
    if(data.message === 'Deleted successfully'){
        product.remove();
        console.log(`product ${productId} ${data.message}`);
        updateNumberSymbol();
        updateTotalAllPriceProducts();
    }
};

//main app
document.addEventListener("DOMContentLoaded", () => {
  const productsList = document.getElementById("cart-products-list");
  updateTotalAllPriceProducts();

  productsList.addEventListener("click", (event) => {
    if (event.target.classList.contains("delete-btn")) {
      deleteProduct(event);
    }
  });

  productsList.addEventListener("change", (event) => {
    if (event.target.classList.contains("amount-input")) {
      if (
        parseInt(event.target.value) < 1 ||
        isNaN(parseInt(event.target.value))
      ) {
        event.target.value = 1;
      }
      updateCart(event);
      updateNumberSymbol();
      updateTotalPriceProduct(event);
      updateTotalAllPriceProducts();
    }
  });
});
