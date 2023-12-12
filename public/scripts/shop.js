
  const changeProductNumber = () => {
    const productNumber = document.getElementById('sumCartProducts');
    productNumber.textContent = `${productNumber.textContent*1 + 1}`;
  };
  
  document.addEventListener('DOMContentLoaded', ()=>{
    console.log('DOMContentLoaded');
    const productsList = document.getElementById('productsList-div');
    productsList.addEventListener('click', (event) => {
        if (event.target.classList.contains('addProduct-btn')){
            const productDiv = event.target.closest('.product-div');
            const productId = productDiv.dataset.productId;
            fetch('/addProductToCart', {
                method:'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({productId: productId})
            })
            .then(response => response.json())
            .then(data => alert(data.message))
            .then(data => changeProductNumber());
        };
    });
  });
