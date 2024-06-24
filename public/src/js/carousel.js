var carousel = document.getElementById("carousel");
// var itemContainer = carousel.getElementsByClassName('item-container');
var btnNext = document.getElementsByClassName("btn-next")[0];
var btnPrev = document.getElementsByClassName("btn-prev")[0];

function clearCards() {
    while (carousel.hasChildNodes()) {
        carousel.removeChild(carousel.lastChild);
    }
}

function createCard(data) {
    var cardWrapper = document.createElement("div");
    cardWrapper.className = "shared-moment-card mdl-card mdl-shadow--2dp";
    var cardTitle = document.createElement("div");
    cardTitle.className = "mdl-card__title";
    cardTitle.style.background = "url(" + data.image + ") center / cover no-repeat";
    // cardTitle.style.backgroundSize = "cover";
    cardWrapper.appendChild(cardTitle);
    var cardTitleTextElement = document.createElement("h2");
    cardTitleTextElement.style.color = "white";
    cardTitleTextElement.className = "mdl-card__title-text";
    cardTitleTextElement.textContent = data.title;
    cardTitle.appendChild(cardTitleTextElement);
    var cardSupportingText = document.createElement("div");
    cardSupportingText.className = "mdl-card__supporting-text";
    cardSupportingText.textContent = data.location;
    cardSupportingText.style.textAlign = "center";
    // var cardSaveButton = document.createElement('button');
    // cardSaveButton.textContent = 'Save';
    // cardSaveButton.addEventListener('click', onSaveButtonClicked);
    // cardSupportingText.appendChild(cardSaveButton);
    cardWrapper.appendChild(cardSupportingText);
    // var card = document.createElement("div");
    // card.classList.add("item");
    // card.appendChild(cardWrapper);
    cardWrapper.classList.add('item');
    componentHandler.upgradeElement(cardWrapper);
    return cardWrapper;
}

function updateUI(data) {
    clearCards();
    const items = [];
    for (var i = 0; i < data.length; i++) {
        const card = createCard(data[i]);
        items.push(card);
    }
    console.log(items);
    var myCarousel = new Carousel(items);
}

var url =
    "https://id-y-llica-default-rtdb.europe-west1.firebasedatabase.app/posts.json";
var networkDataReceived = false;

fetch(url)
    .then(function (res) {
        return res.json();
    })
    .then(function (data) {
        networkDataReceived = true;
        console.log("From web", data);
        var dataArray = [];
        for (var key in data) {
            dataArray.push(data[key]);
        }
        updateUI(dataArray);
    });

// *********************************************************************************************************************************************
// *********************************************************************************************************************************************

// Логика карусель
function degToRad(input) { return input * (Math.PI / 180); }

function out(arg) { document.getElementById("debug").innerHTML = arg; }

var Carousel = function (items) {             // СБОРКА КОНСТРУКТОРА (items-array of elements)
    //Переманные и установки сферы
    var me = this;

    //Изменяемые переменные 

    var carouselW = 500;
    var carouselH = 300;
    var itemW = 100;
    var itemH = 100;

    var numbers_of_elems = items.length;   // Количество элементов

    var stepItems = [0];
    for (var i = 1; i < numbers_of_elems; i++) {
        var step = 2 * Math.PI / numbers_of_elems;
        var lastStep = 2 * Math.PI - step * (numbers_of_elems - i);
        stepItems.push(lastStep);
    }
    console.log(stepItems);
    //константы
    var carousel = document.getElementById("carousel");
    // var itemContainer = carousel.getElementsByClassName('item-container');
    var btnNext = document.getElementsByClassName("btn-next")[0];
    var btnPrev = document.getElementsByClassName("btn-prev")[0];
    // var bord_value = document.getElementsByClassName("bord-value");
    // var btn_plus = document.getElementsByClassName("btn-carusel plus");
    // var btn_minus = document.getElementsByClassName("btn-carusel minus");

    // переменные панели управления
    var opacity = 0;
    var scale_bord = 1, scaleY = 0.2;
    var rotate = 0;
    var skewX = 20, skewC =-20;
    var rotate = 0, rotate_C = 0;
    // ______________________________

    var items = items;
    var deg = 0;
    var last_deg = 0; // для работы с анимацией без опций
    // var last_deg = 2*Math.PI/numbers_of_elems;
    var L_R;
    var rangeX = carouselW - itemW;
    var rangeY = carouselH - itemH;
    var arr_img = ['Dolphin', 'elephant', 'gorilla', 'Hippopotamus', 'lion', 'Turtle', 'Panda'];

    var options = {
        duration: 500,
        timing: makeEaseOut(linear),
        animate: animate
    }


    build();

    function build() {
        console.log("Carousel.build()");
        // var rangeX = carouselW - itemW;
        // var rangeY = carouselH - itemH;

        for (var i = 0; i < numbers_of_elems; i++) {
            carousel.appendChild(items[i]);

            // ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++ Добавляем номер
            // var numItem = document.createElement("p");
            // console.log(items[i]);
            // items[i].item.style.backgroundImage = "url('views/images/survey/" + arr_img[i] + ".png')"
            // numItem.innerHTML = i + 1;
            // numItem.style.textAlign = "center";
            // items[i].appendChild(numItem);
            // ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

            var degItem = deg + stepItems[i];
            degItem += (Math.PI) / 2;
            var cos = 0.5 + (Math.cos(degItem) * 0.5);
            var sin = 0.5 + (Math.sin(degItem) * 0.5);
            var itemObj = items[i];
            var posX = cos * rangeX;
            var posY = sin * rangeY;
            itemObj.style.left = posX + "px";
            itemObj.style.top = posY + "px";

            var zindex = 1 + Math.round(sin * 100);
            itemObj.style.zIndex = zindex;

            if (i == 0) {
                // bord_value[0].innerHTML = opacity.toFixed(2);
                // bord_value[1].innerHTML = scale_bord.toFixed(2);
                // bord_value[2].innerHTML = scaleY.toFixed(2);
                carousel.style.transform = "skew(" + skewC + "deg) rotate(" + rotate_C + "deg)";
                // bord_value[3].innerHTML = rotate_C.toFixed(2);
                // bord_value[4].innerHTML = skewC.toFixed(2);
                carousel.style.width = carouselW + "px";
                carousel.style.height = carouselH + "px";
                // bord_value[5].innerHTML = carouselW.toFixed();
                // bord_value[6].innerHTML = carouselH.toFixed();
            }
            var scale = (scaleY + sin) * scale_bord;
            // scale -=Math.sin((Math.PI)/0.5);
            // out(scale);
            itemObj.style.transform = "scale(" + scale + ") skew(" + skewX + "deg) rotate(" + rotate + "deg)";
            if (skewX == 5) console.log("Нажал второй раз")
            // var scale =1-cos+sin/2;
            // // scale -=Math.sin((Math.PI)/0.5);
            // // out(scale);
            // itemObj.item.style.transform = "scale(" + scale + ") skew(-35deg, 35deg)";

            var opac = sin + opacity;
            // var opacity = 1-cos+sin/2;
            // // opacity += 1.5*sin;
            itemObj.style.opacity = opac;
        }

        //Обработчики событий
        btnNext.addEventListener('click', handler_mouse_next);
        btnPrev.addEventListener('click', handler_mouse_prev);

        // btn_minus[0].addEventListener('click', down_opas);
        // btn_plus[0].addEventListener('click', up_opas);

        // btn_minus[1].addEventListener('click', down_scale);
        // btn_plus[1].addEventListener('click', up_scale);

        // btn_minus[2].addEventListener('click', down_scaleY);
        // btn_plus[2].addEventListener('click', up_scaleY);

        // btn_minus[3].addEventListener('click', down_rotate);
        // btn_plus[3].addEventListener('click', up_rotate);

        // btn_minus[4].addEventListener('click', down_skewX);
        // btn_plus[4].addEventListener('click', up_skewX);

        // btn_minus[5].addEventListener('click', down_carouselW);
        // btn_plus[5].addEventListener('click', up_carouselW);

        // btn_minus[6].addEventListener('click', down_carouselH);
        // btn_plus[6].addEventListener('click', up_carouselH);
        //Начало анимации
        // animate();
    }

    // function up_opas(e) {
    //     console.log(e.target);
    //     opacity += 0.05;
    //     carousel.innerHTML = '';
    //     items = [];
    //     build();
    // }

    // function down_opas() {
    //     opacity -= 0.05;
    //     carousel.innerHTML = '';
    //     items = [];
    //     build();
    // }

    // function up_scale(e) {
    //     console.log(e.target);
    //     scale_bord += 0.05;
    //     carousel.innerHTML = '';
    //     items = [];
    //     build();
    // }

    // function down_scale() {
    //     scale_bord -= 0.05;
    //     carousel.innerHTML = '';
    //     items = [];
    //     build();
    // }

    // function up_scaleY(e) {
    //     console.log(e.target);
    //     scaleY += 0.1;
    //     carousel.innerHTML = '';
    //     items = [];
    //     build();
    // }

    // function down_scaleY() {
    //     scaleY -= 0.1;
    //     carousel.innerHTML = '';
    //     items = [];
    //     build();
    // }

    // function up_rotate() {
    //     rotate_C += 5;
    //     rotate -= 5;
    //     carousel.innerHTML = '';
    //     items = [];
    //     build();
    // }

    // function down_rotate() {
    //     rotate_C -= 5;
    //     rotate += 5;
    //     carousel.innerHTML = '';
    //     items = [];
    //     build();
    // }

    // function up_skewX() {
    //     console.log("привет");
    //     skewC += 5;
    //     skewX -= 5;
    //     carousel.innerHTML = '';
    //     items = [];
    //     build();
    // }

    // function down_skewX() {
    //     skewC -= 5;
    //     skewX += 5;
    //     carousel.innerHTML = '';
    //     items = [];
    //     build();
    // }

    // function up_carouselW(e) {
    //     carouselW += 20;
    //     rangeX = carouselW - itemW;
    //     carousel.innerHTML = '';
    //     items = [];
    //     build();
    // }

    // function down_carouselW() {
    //     carouselW -= 20;
    //     rangeX = carouselW - itemW;
    //     carousel.innerHTML = '';
    //     items = [];
    //     build();
    // }

    // function up_carouselH(e) {
    //     carouselH += 20;
    //     rangeY = carouselH - itemW;
    //     carousel.innerHTML = '';
    //     items = [];
    //     build();
    // }

    // function down_carouselH() {
    //     carouselH -= 20;
    //     rangeY = carouselH - itemH;
    //     carousel.innerHTML = '';
    //     items = [];
    //     build();
    // }

    //Функции нажатия на кнопки Следующий/предыдущий

    function handler_mouse_next() {
        btnNext.removeEventListener('click', handler_mouse_next);
        btnPrev.removeEventListener('click', handler_mouse_prev);
        console.log("Нажал следующий");
        L_R = 1;
        draw(options);
        // btnNext.addEventListener('click', handler_mouse_next);
        // last_deg += 2*Math.PI/numbers_of_elems;
    }

    function handler_mouse_prev() {
        btnNext.removeEventListener('click', handler_mouse_next);
        btnPrev.removeEventListener('click', handler_mouse_prev);
        console.log("Нажал предыдущий");
        L_R = -1;
        draw(options);
        // last_deg -= 2*Math.PI/numbers_of_elems;
    }


    // Создаем методы конструктора

    function addItem(item) {    // Добавление нового элемента
        // console.log("Carousel.addItem()");

        var item = document.createElement("div");
        item.classList.add("item");
        carousel.appendChild(item);

        var itemObj = {
            item: item
        }

        items.push(itemObj);
    }


    function animate(progress) {       // Анимация движения карусели
        // deg -= L_R*0.02;
        // out (deg);

        // // Базовый случай выхода из рекурсии для работы без объекта option
        // if (L_R == 1) {
        //     if (deg <= -2*Math.PI/numbers_of_elems + last_deg) {
        //         last_deg = deg;
        //         return
        //     }
        // } else if (deg >= 2*Math.PI/numbers_of_elems + last_deg) {
        //     last_deg = deg;
        //     return
        // }
        // last_deg =(2*Math.PI/numbers_of_elems) * progress
        for (var i = 0; i < items.length; i++) {

            // var degItem = deg+stepItems[i];
            var degItem = last_deg + L_R * (2 * Math.PI / numbers_of_elems) * progress + stepItems[i];
            degItem += (Math.PI) / 2;
            var cos = 0.5 + (Math.cos(degItem) * 0.5);
            var sin = 0.5 + (Math.sin(degItem) * 0.5);
            var itemObj = items[i];
            var posX = cos * rangeX;
            var posY = sin * rangeY;
            itemObj.style.left = posX + "px";
            itemObj.style.top = posY + "px";

            var zindex = 1 + Math.round(sin * 100);
            itemObj.style.zIndex = zindex;

            var scale = (scaleY + sin) * scale_bord;
            // scale -=Math.sin((Math.PI)/0.5);
            // out(scale);
            itemObj.style.transform = "scale(" + scale + ") skew(" + skewX + "deg) rotate(" + rotate + "deg)";
            if (skewX == 5) console.log("Нажал второй раз")
            // var scale =1-cos+sin/2;
            // // scale -=Math.sin((Math.PI)/0.5);
            // // out(scale);
            // itemObj.item.style.transform = "scale(" + scale + ") skew(-35deg, 35deg)";

            var opac = sin + opacity;
            // var opacity = 1-cos+sin/2;
            // // opacity += 1.5*sin;
            itemObj.style.opacity = opac;

        }
        if (progress == 1) {
            last_deg += L_R * 2 * Math.PI / numbers_of_elems;
            btnNext.addEventListener('click', handler_mouse_next);
            btnPrev.addEventListener('click', handler_mouse_prev);
            console.log(last_deg);
        }
        // requestAnimationFrame(animate);
    }




    //Дополнительные функции
    function degToRad(input) { return input * (Math.PI / 180); }

    function scale_carusel() {

    }

}




function init() {
    var myCarousel = new Carousel();

    menu();

    fox.speake_start();

    fox.enter_leave_mouse();

    fox.wakeUp_mouse();



    // var timeLoadPage = new Date();

    preloader();
};


/*
Объект options имеет 1 свойство
duration - задержка/длительность анимации;
                и    2 метода
timing(timeFraction) - функция расчета времени;
animate(progress) - функция прорисовки
 
*/

function draw(options) {

    var start = performance.now();

    requestAnimationFrame(function animate(time) {
        // timeFraction от 0 до 1
        var timeFraction = (time - start) / options.duration;
        if (timeFraction > 1) timeFraction = 1;

        // текущее состояние анимации
        var progress = options.timing(timeFraction)

        options.animate(progress);

        if (timeFraction < 1) {
            requestAnimationFrame(animate);
        }

    });
}

function linear(timeFraction) {
    return timeFraction;
}

function bounce(timeFraction) {
    for (let a = 0, b = 1, result; 1; a += b, b /= 2) {
        if (timeFraction >= (7 - 4 * a) / 11) {
            return -Math.pow((11 - 6 * a - 11 * timeFraction) / 4, 2) + Math.pow(b, 2)
        }
    }
}

function makeEaseOut(timing) {
    return function (timeFraction) {
        return 1 - timing(1 - timeFraction);
    }
}











