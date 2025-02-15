document.addEventListener('DOMContentLoaded', () => {
    const sortSelect = document.getElementById('sort');
    const grid = document.querySelector('.product-grid');

    if (sortSelect && grid) {
        sortSelect.addEventListener('change', function () {
            const sortOrder = this.value;
            const productCards = Array.from(document.querySelectorAll('.product-card'));

            if (sortOrder === 'desc') {
                // Sort descending by price
                productCards.sort((a, b) => {
                    let priceA = parseFloat(a.querySelector('.price').textContent.replace('₹', '').trim());
                    let priceB = parseFloat(b.querySelector('.price').textContent.replace('₹', '').trim());
                    return (priceB - priceA);
                });
            } else if (sortOrder === 'aesc') {
                // Sort ascending by price
                productCards.sort((a, b) => {
                    let priceA = parseFloat(a.querySelector('.price').textContent.replace('₹', '').trim());
                    let priceB = parseFloat(b.querySelector('.price').textContent.replace('₹', '').trim());
                    return priceA -priceB;
                });
            }

            // Clear the product grid and append the sorted product cards
            grid.innerHTML = '';
            productCards.forEach(card => grid.appendChild(card));
        });
    }
});