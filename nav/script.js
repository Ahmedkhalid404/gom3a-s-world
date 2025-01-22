const menu = document.querySelector('.menu');
const highlight = document.querySelector('.hover-highlight');
const menuItems = document.querySelectorAll('.menu-item');

const activeItem = document.querySelector('.menu-item.active');
if (activeItem) {
    const activeRect = activeItem.getBoundingClientRect();
    const menuRect = menu.getBoundingClientRect();

    highlight.style.width = `${activeRect.width}px`;
    highlight.style.left = `${activeRect.left - menuRect.left}px`;
}

menuItems.forEach(item => {
    item.addEventListener('mouseenter', () => {
        const itemRect = item.getBoundingClientRect();
        const menuRect = menu.getBoundingClientRect();

        highlight.style.width = `${itemRect.width}px`;
        highlight.style.left = `${itemRect.left - menuRect.left}px`;
    });

    item.addEventListener('click', () => {
        menuItems.forEach(i => i.classList.remove('active'));
        item.classList.add('active');
    });
});

menu.addEventListener('mouseleave', () => {
    const activeItem = document.querySelector('.menu-item.active');
    if (activeItem) {
        const activeRect = activeItem.getBoundingClientRect();
        const menuRect = menu.getBoundingClientRect();

        highlight.style.width = `${activeRect.width}px`;
        highlight.style.left = `${activeRect.left - menuRect.left}px`;
    } else {
        highlight.style.width = '0';
    }
});
