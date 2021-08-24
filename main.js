// const
const sliderContainer = document.querySelector('.slider-container');
const slideLeft = document.querySelector('.left-slider');
const slideRight = document.querySelector('.right-slider');
const upButton = document.querySelector('.up-button');
const downButton = document.querySelector('.down-button');

const slidesLength = slideRight.querySelectorAll('div').length; //колличество слайдов
let activeSlideIndex = 0; // индекс активного слайда

slideLeft.style.top = `-${(slidesLength - 1)*100}vh`;

//Add EventLinerter to Buttons
upButton.addEventListener('click', ()=>{
    changeSlide('up')});
downButton.addEventListener('click', ()=>{
    changeSlide('down')});

function infiniteSlider(slide1, slide2, direction) {
    slide1.append(slide1.firstElementChild);
    slide2.prepend(slide2.lastElementChild);
    slideLeft.style.transition = "none";
    slideRight.style.transition = "none";
    if (direction === "up") {
        activeSlideIndex = slidesLength - 2;
    } else if (direction === "down") {
        activeSlideIndex = 1;
    }
    setTimeout(function () {
        slideLeft.style.transition = "0.5s ease-out";
        slideRight.style.transition = "0.5s ease-out";
    });
    setTimeout(function () {
        changeSlide(direction);
    });
}
      

// function changes slides
const changeSlide = (direction)=>{
    const sliderHeight = sliderContainer.clientHeight;
    if(direction ==='up'){
        activeSlideIndex++;
        if(activeSlideIndex === slidesLength){
            infiniteSlider(slideRight, slideLeft, direction)
        }
    } else if(direction ==='down'){
        activeSlideIndex--;
        if(activeSlideIndex < 0){
            infiniteSlider(slideLeft, slideRight, direction)
        }
    }
    slideRight.style.transform = `translateY(-${activeSlideIndex * sliderHeight}px)`;
    slideLeft.style.transform = `translateY(${activeSlideIndex * sliderHeight}px)`;
};

//swiper
const swipedetect = (el)=>{

    let surface = el; // элемент по которому идет свайп 
    let startX = 0; //стартовая позиция по Х курсора
    let startY = 0; //стартовая позиция по Y курсора 
    let distX = 0; // дистанция по X 
    let distY = 0; //дистанция по Y 
    
    let startTime = 0; // начало движение ''mousedown'
    let elapsedTime = 0; // время вычисленное от начала  до конца савйпа 

    let threshold = 50; //  расстояние которое определяет происхождение савйпа (то от какой высоты свайп - это свайп) 
    let resttraint = 400; // угол свайпа от горизонта
    let allowedTime = 300; // время, которое должен длится свайп (не обычный клик или иное событие)

    surface.addEventListener('mousedown', function(e){
        // console.log('mousedown'+ ' '+ e)
        // console.log('e.pageX' + ' ' + e.pageX)
        // console.log('e.offsetX'+ ' '+ e.offsetX)
        startX = e.pageX; //старт 
        startY = e.pageY;
        startTime = new Date().getTime(); 
        e.preventDefault(); //останавливаем все другие взаимодействия
    });

    surface.addEventListener('mouseup', function(e){
        // console.log('mouseup'+ ' ' + e) 
        // console.log(e.pageX)
        distX = e.pageX - startX; // текущее положение минус старт (расстояние пройденное)
        distY = e.pageY - startY;
        elapsedTime = new Date().getTime() - startTime;
        // console.log('startTime:'+ ' ' + startTime)
        // console.log('elapsedTime:'+ ' ' + elapsedTime)
        // console.log('allowedTime:' + ' ' + allowedTime)
        // console.log('distX:' + ' ' + distX)
        // console.log('distY:' + ' ' + distY)
        if(elapsedTime <= allowedTime){
            if(Math.abs(distY) >= threshold && Math.abs(distX) <= resttraint){
                if(distY > 0){
                    changeSlide('up')
                }else {
                    changeSlide('down')
                }
            }
        }
        e.preventDefault();
    }); 

    surface.addEventListener('touchstart', function(e){
        if(e.target.classList.contains('up-button') || e.target.classList.contains('fas')){
            changeSlide('up')
        } else if(e.target.classList.contains('down-button') || e.target.classList.contains('fas')){
            changeSlide('down')
        }
        let touchObj = e.changedTouches[0];
        startX = touchObj.pageX; //старт 
        startY = touchObj.pageY;
        startTime = new Date().getTime();
        e.preventDefault(); //останавливаем все другие взаимодействия
    });

    surface.addEventListener('touchmove', function(e){
        e.preventDefault(); // чтобы страница не сползала
    });

    surface.addEventListener('touchend', function(e){
        let touchObj = e.changedTouches[0];
        distX = touchObj.pageX - startX; // текущее положение минус старт (расстояние пройденное)
        distY = touchObj.pageY - startY;
        elapsedTime = new Date().getTime() - startTime;
        if(elapsedTime <= allowedTime){
            if(Math.abs(distY) >= threshold && Math.abs(distX) <= resttraint){
                if(distY > 0){
                    changeSlide('up')
                }else {
                    changeSlide('down')
                }
            }
        }
        e.preventDefault();
    }); 

}

swipedetect(document.querySelector('.swiper'));

function addHandler(object, event, handler) {
    if (object.addEventListener) {
      object.addEventListener(event, handler, false);
    }
    else if (object.attachEvent) {
      object.attachEvent('on' + event, handler);
    }
    else alert("Обработчик не поддерживается");
}

  // Добавляем обработчики для разных браузеров
  addHandler(sliderContainer, 'DOMMouseScroll', wheel);
  addHandler(sliderContainer, 'mousewheel', wheel);

// Функция, обрабатывающая событие
function wheel(event) {
    let delta; // Направление колёсика мыши
    event = event || window.event;
    // Opera и IE работают со свойством wheelDelta
    if (event.wheelDelta) { 
      delta = event.wheelDelta / 120;
      // В Опере значение wheelDelta такое же, но с противоположным знаком
      if (window.opera) delta = -delta; // Дополнительно для Opera
    };
    
    // Запрещаем обработку события браузером по умолчанию
    if (event.preventDefault) event.preventDefault();
        event.returnValue = false;

    if(delta === 1){
        changeSlide('up')
    } else if (delta === -1) {
        changeSlide('down')
    }
    //console.log(delta); // Выводим направление колёсика мыши
}
