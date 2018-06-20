window.addEventListener('DOMContentLoaded', function () {

  let tab = document.getElementsByClassName('info-header-tab'),
    tabContent = document.getElementsByClassName('info-tabcontent'),
    info = document.getElementsByClassName('info-header')[0];

  function hideTabContent(a) {
    for (let i = a; i < tab.length; i++) {
      tabContent[i].classList.remove('show');
      tabContent[i].classList.add('hide');
    }
  }

  hideTabContent(1);

  function showTabContent(b) {
    if (tabContent[b].classList.contains('hide')) {
      hideTabContent(0);
      tabContent[b].classList.remove('hide');
      tabContent[b].classList.add('show');
    }
  }

  info.addEventListener('click', function (event) {
    let target = event.target;
    if (target.className == 'info-header-tab') {
      for (let i = 0; i < tab.length; i++) {
        if (target == tab[i]) {
          showTabContent(i);
          break;
        }
      }
    };

  });

  //таймер
  let deadLine = '2019-03-20';

  /*parse - возвращает целое число, представляющее собой количество миллисекунд, истекших с полуночи 1 января 1970 года GMT+0 до даты, указанной в параметре dateVal*/
  function getTimeRemaining(endtime) {

    let t = Date.parse(endtime) - Date.parse(new Date()),
      seconds = Math.floor((t / 1000) % 60), //округляем, берем милисекунды и переводим в секунды - получаем остаток от деления
      minutes = Math.floor((t / 1000 / 60) % 60),
      /*        hours = Math.floor( (t / (1000 * 60 * 60)) );// - тут не верно*/
      hours = Math.floor((t) % (24 * 60 * 60 * 1000) / (60 * 60 * 1000));


    return {
      total: t,
      hours: hours,
      minutes: minutes,
      seconds: seconds
    };
  };

  function setClock(id, endtime) {

    let timer = document.getElementById(id),
      hours = timer.querySelector('.hours'),
      minutes = timer.querySelector('.minutes'),
      seconds = timer.querySelector('.seconds');

    let timeInterval = setInterval(updateClock, 1000);

    //обновляем часы
    function updateClock() {

      let t = getTimeRemaining(endtime);
      hours.innerHTML = addZero(t.hours);
      minutes.innerHTML = addZero(t.minutes);
      seconds.innerHTML = addZero(t.seconds);
      if (t.total < 0) { //если мень дедлайна - то выводим нули
        hours.innerHTML = '00';
        minutes.innerHTML = '00';
        seconds.innerHTML = '00';
      } else {
        hours.innerHTML = addZero(t.hours);
        minutes.innerHTML = addZero(t.minutes);
        seconds.innerHTML = addZero(t.seconds);
      }
      if (t.total <= 0) {
        clearInterval(timeInterval);
      }
    };

    function addZero(num) {
      return ('0' + num).slice(-2); // обрезает 2 ненужных символа
    }

    updateClock();

  };

  setClock('timer', deadLine);


  //модальное окно
  let more = document.querySelector('.more'),
    overlay = document.querySelector('.overlay'),
    close = document.querySelector('.popup-close');

  //функция открытия модальнго окна
  function showPopup() {
    this.classList.add('more-splash');
    overlay.style.display = 'block';
    document.body.style.overflow = 'hidden';
  };

  //функция закрытия модального окна
  function closePopup() {
    overlay.style.display = 'none';
    more.classList.remove('more-splash');
    document.body.style.overflow = '';
  }

  more.addEventListener('click', function () {
    showPopup.call(more);
  });

  close.addEventListener('click', function () {
    closePopup.call(close);
  });

  //Перебрал все кнопки циклом и при нажании на любую выходит попап
  let descriptionBtn = document.querySelectorAll('.description-btn');
  for (let i = 0; i < descriptionBtn.length; i++) {
    descriptionBtn[i].addEventListener('click', function () {
      showPopup.call(descriptionBtn[i]);
    });
  };

  //Можно ли тут сделать с помощью делегирования событий?

  //модальное окно Об успешной отправке сообщения

  let overlaySend = document.querySelector('.overlaySend'),
    okClose = document.querySelector('.ok');

  function overlaySendShow() {
    overlaySend.style.display = 'block';
    document.body.style.overflow = 'hidden';
  };

  function closePopupOk() {
    overlaySend.style.display = 'none';
    document.body.style.overflow = '';
  };



  //Форма
  let message = new Object();
  message.loading = 'Загрузка...';
  message.success = 'Спасибо! Мы свяжемся с вами в самое ближайшее время';
  message.failure = 'Ошибка на сервере';

  let form = document.getElementsByClassName('main-form')[0],
    formContact = document.getElementById('form'),
    input = document.getElementsByTagName('input'), //все инпуты беру для очитки так как 2 формы
    statusMessage = document.createElement('div');

  statusMessage.classList.add('status');

  // функция отправляет 2 формы с помощью this - после успешной отправки - появляется сообщение для отправки - мне как раз для лендинга нужно было, ни как не мог сделать - тут уже готове решение и более менее понятно почему так происходит
  function sendMessage() {
    this.addEventListener('submit', function (event) {
      event.preventDefault();
      this.appendChild(statusMessage);

      //AJAX
      let request = new XMLHttpRequest();
      request.open('POST', 'server.php');
      request.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');

      let formData = new FormData(form);

      request.send(formData);

      request.onreadystatechange = function () {
        if (request.readyState < 4) {
          statusMessage.innerHTML = message.loading;
        } else if (request.readyState == 4) {
          if (request.status == 200 && request.status < 300) {
            statusMessage.innerHTML = message.success;
            //Добавление контента на страницу
            closePopup(); //закрываем первый попап
            overlaySendShow(); // показываем что все ок в Новом попап

            //это закрыть новый попап  
            okClose.addEventListener('click', function () {
              closePopupOk();
            });
            //очистить сообщение
            statusMessage.innerHTML = '';
          } else {
            statusMessage.innerHTML = message.failure;
          }

        }
      }
      //Очистка формы
      for (let i = 0; i < input.length; i++) {
        input[i].value = '';
      }

    });
  };

  sendMessage.call(form);
  sendMessage.call(formContact);


  /*слайдер */
  let slideIndex = 1,
    slides = document.getElementsByClassName('slider-item'),
    prev = document.querySelector('.prev'),
    next = document.querySelector('.next'),
    dotsWrap = document.querySelector('.slider-dots'),
    dot = document.getElementsByClassName('dot');

  showSlides(slideIndex);

  function showSlides(n) {
    if (n > slides.length) {
      slideIndex = 1;
    }
    if (n < 1) {
      slideIndex = slides.length;
    }

    for (let i = 0; i < slides.length; i++) {
      slides[i].style.display = 'none';
    }

    for (let i = 0; i < dot.length; i++) {
      dot[i].classList.remove('dot-active');
    }

    slides[slideIndex - 1].style.display = 'block';
    dot[slideIndex - 1].classList.add('dot-active');

  };

  function plusSlides(n) {
    showSlides(slideIndex += n);
  };

  prev.addEventListener('click', function () {
    plusSlides(-1);
  });

  next.addEventListener('click', function () {
    plusSlides(1);
  });

  function currentSlide(n) {
    showSlides(slideIndex = n);
  };

  dotsWrap.addEventListener('click', function (event) {
    for (let i = 0; i < dot.length + 1; i++) {
      if (event.target.classList.contains('dot') && event.target == dot[i - 1]) {
        currentSlide(i);
      }
    };
  });


  //Калькулятор - делал сам - не хватило времени допилиить смысл понятен как делать
  /*  let countPeople = document.querySelectorAll('.counter-block-input')[0],
        countDays = document.querySelectorAll('.counter-block-input')[1],
        selectPlace = document.getElementById('select'),
        option = document.getElementsByTagName('option'),
        totalPrice = document.getElementById('total');
    
    const mumbai = 5000,
          kerala = 6000,
          varanasi = 7000;
    
    selectPlace.addEventListener('click', function(event){
      if ( (event.target == option[0]) && (countPeople.value != 0) && (countDays.value != 0) ) {
        totalPrice.textContent = countPeople.value * mumbai *  countDays.value;
      };
      
      if ( (event.target == option[1]) && (countPeople.value != 0) && (countDays.value != 0) ) {
        totalPrice.textContent = countPeople.value * kerala *  countDays.value;
      };  
      
      if ( (event.target == option[2]) && (countPeople.value != 0) && (countDays.value != 0) ) {
        totalPrice.textContent = countPeople.value * varanasi *  countDays.value;
      };      
      
    });*/


  let persons = document.getElementsByClassName('counter-block-input')[0],
      restDays = document.getElementsByClassName('counter-block-input')[1],
      place = document.getElementById('select'),
      totalPrice = document.getElementById('total'),
      personsSum = 0,
      daySum = 0,
      total = 0;

  totalPrice.innerHTML = 0;

  persons.addEventListener('change', function () {
    personsSum = +this.value;
    total = (daySum + personsSum) * 4000;
    if (persons.value == '' || restDays.value == '' || persons.value <= 0 || restDays.value <= 0 ) {
      totalPrice.innerHTML = 0;
    } else {
      totalPrice.innerHTML = total;
    };
  });

  restDays.addEventListener('change', function () {
    daySum = +this.value;
    total = (daySum + personsSum) * 4000;
    if (persons.value == '' || restDays.value == '' || persons.value <= 0 || restDays.value <= 0 ) {
      totalPrice.innerHTML = 0;
    } else {
      totalPrice.innerHTML = total;
    };
  });

  place.addEventListener('change', function () {

    if (persons.value == '' || restDays.value == '' || persons.value <= 0 || restDays.value <= 0 ) {
      totalPrice.innerHTML = 0;
    } else {
      let a = total;
      totalPrice.innerHTML = a * this.options[this.selectedIndex].value;;
    };
  });


});
