
const updateCart = (event) => {
    const amountDiv = event.target.closest('.amount-div');
    const amountInput = amountDiv.querySelector('.amount-input');
    const productAmount = amountInput.value;
    const productCard = event.target.closest('.product-card');
    const productId = productCard.dataset.id;

    fetch('/updateCart', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({id: productId, amount: productAmount})
    })
    .then(response => response.json())
    .then(data => console.log(data.message));
};

const updateNumberSymbol = () => {
    fetch('/getProductCartAmount')
    .then(response => response.json())
    .then(data => 
        document.getElementById('sumCartProducts').textContent = data.amountProducts);
};

const updateTotalPriceProduct = (event) => {
  
    const amountProducts = parseInt(event.target.value);
    const productCard = event.target.parentElement.parentElement;
    const textPriceProduct = productCard.querySelector('.price-product').textContent;
    const priceProduct = parseFloat(textPriceProduct.replace(/[^0-9]/g, ''));
    const totalPriceProduct = productCard.querySelector('.total-price-product');

    const totalPrice = priceProduct*amountProducts; 
    totalPriceProduct.textContent = `$${totalPrice}`;

}

const updateTotalAllPriceProducts = () => {
    const totalPricesCollection = document.getElementsByClassName('total-price-product'); //return html collection
    
    let sumTotalPrices = 0;
    for(let i=0; i<totalPricesCollection.length; i++){
        let totalPriceProduct = totalPricesCollection[i].textContent.replace(/[^0-9]/g, '');
        totalPriceProduct = parseFloat(totalPriceProduct);
        // if totalPriceProduct contains a non-numeric string, parseFloat will return NaN (Not a Number).
        if (!isNaN(totalPriceProduct)){ 
            sumTotalPrices += totalPriceProduct;
        }
    }

    document.getElementById('sum-total-prices').textContent = `Total: ${sumTotalPrices}$`;
}


//main app
document.addEventListener('DOMContentLoaded', () => {
    const productsList = document.getElementById('cart-products-list');
    updateTotalAllPriceProducts();

    // productsList.addEventListener('click', (event) => {
    //     if(event.target.classList.contains('update-btn')){
    //         updateCart(event);
    //         updateNumberSymbol();
    //     }
    // });

    productsList.addEventListener('change', (event) => {
        if(event.target.classList.contains('amount-input')){
            if(parseInt(event.target.value) < 1 || isNaN(parseInt(event.target.value))){
                event.target.value = 1;
            }
            updateCart(event);
            updateNumberSymbol();
            updateTotalPriceProduct(event);
            updateTotalAllPriceProducts();
        }
    })
});

