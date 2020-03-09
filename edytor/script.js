let suffix;
const inputs = document.querySelectorAll('.sliders input');
let canvas = document.getElementById('myCanvas'),
    context = canvas.getContext('2d');

make_base();

function make_base() {
    base_image = new Image();
    base_image.src = 'image.jpg';
    base_image.onload = function() {
        context.drawImage(base_image, 0, 0);
    }
}

inputs.forEach(input => input.addEventListener('click', handleUpdate));
inputs.forEach(input => input.addEventListener('mousemove', handleUpdate));

function handleUpdate() {
    suffix = this.dataset.sizing || "";
    document.documentElement.style.setProperty(`--${this.name}`, this.value + suffix);
    this.nextElementSibling.innerHTML = this.value + suffix;
    if (this.nextElementSibling.classList == "noSuffix") {
        this.nextElementSibling.innerHTML = "";
    };
}