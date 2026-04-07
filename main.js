const next_arrow = document.querySelector(".next-page span:not(:first-Child)");
const prev_arrow = document.querySelector(".next-page span:first-Child");
const add_address = document.querySelector(".add-address");
const go_back = document.querySelector(".address-page button");
const portion_element = document.querySelector(".portions .container input").addEventListener('keydown',(e)=>{
    //check for neg || fract
    if(e.key === "." || e.key === "-" || !/[1-9]/.test(e.key) && !(['Backspace', 'Delete', 'ArrowLeft', 'ArrowRight', 'Tab'].includes(e.key)))
        e.preventDefault();
});



let map= L.map('map').setView([51.505, -0.09], 13);
L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map);


next_arrow.addEventListener("click" ,()=>{
    document.querySelector(".main.active").classList.remove("active");
    document.querySelector(".page-two").classList.add("active");
    next_arrow.style.pointerEvents ='none';
    prev_arrow.style.pointerEvents = 'auto';
});

prev_arrow.addEventListener("click" ,()=>{
    document.querySelector(".page-two.active").classList.remove("active");
    document.querySelector(".main").classList.add("active");
    prev_arrow.style.pointerEvents = 'none';
    next_arrow.style.pointerEvents = 'auto';
});

add_address.addEventListener('click',()=>{
    document.querySelector(".page-two.active").classList.remove("active");
    document.querySelector(".next-page.active").classList.remove("active");
    document.querySelector(".address-page").classList.add("active");
});

go_back.addEventListener('click',()=>{
    document.querySelector(".page-two").classList.add("active");
    document.querySelector(".next-page").classList.add("active");
    document.querySelector(".address-page.active").classList.remove("active");
});
