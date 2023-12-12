
document.addEventListener('DOMContentLoaded', () => {

    const addProductsNumber = async () => {
        const response = await fetch('/getProductCartAmount');
        const data = await response.json();
        const amountProducts = data.amountProducts;
            
        document.getElementById('sumCartProducts').textContent = `${amountProducts}`;
    };
    addProductsNumber();
});

