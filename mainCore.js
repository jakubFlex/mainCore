/**
 *  @namespace mainCore 
 */

var mainCore = (function mainCore() {

  /**
   * Returns the flag. 
   * True - run function.
   * 
   * Don't call this function!
   * This function works like a callback.
   * @function OnOffFunc
   *
   * @param {array} whichPage - The array of selectors that they specify where function should be run. 
   * 
   * @returns {boolean}
   */
  var OnOffFunc = function (whichPage) {

    var whichPage = whichPage || ['all'];

    if (Array.isArray(whichPage)) {

      var isTrue = false;

      for (var i = 0, len = whichPage.length; i < len; i++) {
        if (whichPage[i] === 'all') {
          isTrue = true;
          continue;
        }

        if ($(whichPage[i]).length) {
          isTrue = true;
        }
      }
    }

    if (!isTrue) {
      return null;
    } else {
      return true;
    }
  };

  /**
   * Adds style and move box on the top. 
   * @function infoBar
   * 
   * @param {string} id - Box selector. ( Set default ).
   * @param {array} whichPage - The array of selectors that they specify where function should be run. 
   * @param {string} color - Text color. 
   * @param {string} bg - Background color.
   * 
   * @default id - 'fx-welcome'
   */
  var infoBar = function (id, whichPage, color, bg) {

    var OnOff = OnOffFunc(whichPage);

    if (!OnOff) {
      return null;
    }

    var id = id || 'fx-welcome';

    var mainElem = document.getElementById(id);

    if (!mainElem) {
      console.error('Element not found');
      return null;
    }

    var closeSign = document.createElement('span');

    $(closeSign).html('<i class="fa fa-times"></i>');
    $(closeSign).addClass(id + '-x');

    $(`
        <style>
          #${id}{
            box-sizing: border-box;
            text-align: center;
            margin: 0;
            background: ${bg};
            width: 100%;
            padding: 10px 20px;
            overflow: hidden;
          }

          #${id} > p, #${id} a{
            color: ${color};
            font-size: 13px;
            font-weight: 300;
            text-transform: uppercase;
            margin: 0;
          }

          #${id} a{
            text-decoration: underline;
          }

          .${id}-x{
            position: absolute;
            top: 50%;
            right: 2%;
            transform: translateY(-50%);
            color: ${color};

            cursor: pointer;
            font-size: 16px;
          }
        </style>
        `).appendTo('head');

    closeSign.addEventListener('click', function () {

      $.when($(mainElem).fadeOut()).then(function () {
        $(mainElem).remove();
      });
    }, false);

    $(mainElem).append(closeSign);

    moveElement(mainElem, '.wrap > header.row', 'prepend', undefined, whichPage);
  };

  /**
   * Moves the element to the selected location.
   * @function moveElement
   * 
   * @param {string} el - The selector of the element to be moved.
   * @param {string} where - The selector of the element to which the previous element is to be moved.
   * @param {string} fnType - The name of the function that describes how to insert content.
   * @param {string} fnHow - The name of the function describing the way of moving content.
   * @param {array} whichPage - The array of selectors that they specify where function should be run.
   * 
   * @default fnHow - 'detach'  
   */
  var moveElement = function (el, where, fnType, fnHow, whichPage) {
    var fnHow = fnHow || undefined,
      fnType = fnType || undefined,
      whichPage = whichPage || ['all'];

    var OnOff = OnOffFunc(whichPage);

    if (!OnOff) {
      return null;
    }

    if (!$(el).length) {
      console.error('Element not found.');
      return null;
    }

    if (!$(where).length) {
      console.error('Content not found.');
      return null;
    }

    if (fnType === undefined) {
      console.error('The type is not specified.');
      return null;
    }

    var possibleHow = ['clone', 'detach'],
      possibleType = ['after', 'append', 'before', 'prepend'];

      var isGood = 0;

    for (var i in possibleType) {
      if (fnType === possibleType[i]) {
        isGood++;
      }
    }

    if (!isGood && fnType !== undefined) {
      console.error('Wrong fnType');
      return false;
    }

    isGood = 0;
    for (var i in possibleHow) {
      if (fnHow === possibleHow[i]) {
        isGood++;
      }
    }
    if (!isGood && fnHow !== undefined) {
      console.error('Wrong fnHow');
      return false;
    }

    var execFunc = new Function('el', 'where', 'fnType', 'fnHow', `
          var el = $(el), where = $(where), fnType = fnType, fnHow = fnHow;
  
          if(fnHow){
            (fnType === 'before' || fnType === 'after') ? $(el).${fnHow}().insert${fnType.charAt(0).toUpperCase()}${fnType.slice(1)}(where) : $(el).${fnHow}().${fnType}To(where);
          } else{
            $(where).${fnType}(el);
          }
        `);

    execFunc(el, where, fnType, fnHow);
  };

  /**
   * Adds more/less button in a curtain menu.
   * @function curtainSubmenu
   * @param {number} lvl - Menu level.
   * @param {number} whichPosition - From which position to start covering.
   */
  var curtainSubmenu = function (lvl, whichPosition) {

    var listLvl = $('.submenu.level' + lvl + ' .level' + lvl),
      htmlLang = $('html').attr('lang'),
      moreText = {
        'pl': 'więcej',
        'en': 'more',
        'de': 'mehr'
      },
      lessText = {
        'pl': 'mniej',
        'en': 'less',
        'de': 'wenig'
      }

    if (listLvl.length === 0) {
      console.error('Not found this submenu level.');
      return null;
    }

    listLvl.each(function (index, ul) {
      var listEl = $(ul).children("li");
      listEl.each(function (howMany, li) {
        if (howMany > whichPosition - 1) {
          $(li).addClass("hideMenuPosition");
          if (0 == $(ul).find("li.showMoreElements").length) {
            var moreBtn = $(`<li class='showMoreElements'><h3><a><span>${lessText[htmlLang]}</span></a></h3></li>`);
            $(ul).append(moreBtn);
          }
        }
      });
    });

    $('li.showMoreElements h3 a span').css({
      'cursor': 'pointer',
    });


    $(".showMoreElements").click(function () {
      $(this).siblings('.hideMenuPosition').toggle(500);
      var $inText = $(this).find('span')[0].innerText.toUpperCase();
      if ($inText == lessText[htmlLang].toUpperCase()) {
        $(this).find('span')[0].innerText = moreText[htmlLang];
      } else if ($inText === moreText[htmlLang].toUpperCase()) {
        $(this).find('span')[0].innerText = lessText[htmlLang];
      }
    });
  };

  /**
   * Sets sticky menu.
   * 
   * @param {boolean} copyLogo - The flag specifying whether to move the logo.
   * 
   * @default copyLogo - false
   */
  var stickyMenu = function(copyLogo) {
    var mainWrap = document.querySelector('.wrap'),
          mainMenu = document.querySelector('.menu.row'),
          menuFromTop = $(mainMenu).offset().top;

        if (copyLogo) {
          moveElement('.link-logo', '.menu .innermenu .home-link-menu-li', 'prepend', 'clone');
          $('.home-link-menu-li').addClass('stickyMenucopyLogo');
        }

        moveElement('header .logo-bar .basket', '.menu .innermenu .menu-list', 'append', 'clone');
        $('.menu .innermenu .basket').addClass('stickyMenucopyBasket').css('display', 'none');

        document.addEventListener('DOMContentLoaded', isSticky);

        document.addEventListener('scroll', isSticky.bind(this, mainWrap, mainMenu, menuFromTop));

        function isSticky(mainWrap, mainMenu, y) {
          if (mainWrap.getBoundingClientRect().top * (-1) > y) {

            mainWrap.style.paddingTop = mainMenu.clientHeight + "px";

            $(mainMenu).find('.innermenu .menu-list').css({
              'position': 'relative',
            });

            $(mainMenu).css({
              'position': 'fixed',
              'top': '0',

              'width': '100%',
              'background': '#fff',
              'box-shadow': '0px 1px 2px 0px rgba(50,50,50,0.3)',
              'transition': 'top ease-in-out .3s',
              'z-index': '100'
            });

            $('.stickyMenucopyLogo').css({
              'display': 'block'
            });

            $('.stickyMenucopyBasket').css({
              'display': 'flex',
              'align-items': 'center',
              'height': '100%',
              'position': 'absolute',
              'right': '10px'
            });

            $('.stickyMenucopyBasket img').css({
              'background': 'url(/skins/user/rwd_shoper_21/images/user/basket1.png) 0 0 no-repeat',
              'width': '15px',
              'height': '22px',
              'display': 'inline-block',
              'margin': '0 5px'
            });

            $('.stickyMenucopyBasket a').css({
              'font-size': '0'
            });

            $('.stickyMenucopyBasket b.count').css({
              'position': 'relative'
            });

            $('.stickyMenucopyBasket b.count span').css({
              'font-size': '12px',
              'position': 'absolute',
              'left': '-10px',
              'top': '-20px',
              'display': 'block',
              'width': '20px',
              'height': '20px',
              'line-height': '20px',
              'text-align': 'center',
              'background': '#fa6060',
              '-webkit-border-radius': '50%',
              '-moz-border-radius': '50%',
              'border-radius': '50%',
              'color': '#fff'
            });

          } else {
            //Not sticky
            mainWrap.style.paddingTop = 0;

            $(mainMenu).css({
              'position': 'relative',
              'box-shadow': 'none',
              'transition': 'none'
            });

            $('.stickyMenucopyLogo').css({
              'display': 'none'
            });

            $('.stickyMenucopyBasket').css({
              'display': 'none'
            });
          }

        }
  };

  /**
   * Runs other type of menu.
   * @function hamburgerMenu
   * 
   * @param {number} type - Type of menu. ( 1. Fullpage , 2. Leftsliding ) 
   * @param {string} where - The selector of the element to which the previous element is to be moved.
   * @param {string} fnType - The name of the function that describes how to insert content.
   */
  var hamburgerMenu = function(type, where, fnType) {
    var $mainMenu = $('div.menu'),
          hamburgerMenu = document.createElement('div');

        $(hamburgerMenu).addClass('burgerMenu');

        $(hamburgerMenu).html('<div class="hamburgerBar"></div><div class="hamburgerBar"></div><div class="hamburgerBar"></div>')

        $(`
        <style>
            @media (min-width: 768px){
              
                .burgerMenu{
                  position: fixed;
                  z-index: 1000;
                  cursor: pointer;
                  user-select: none;
                  transform: rotateY(0);
                  transition: all 0.4s cubic-bezier(0.23, 1, 0.32, 1);
                }

                .burgerMenu.changeMe{
                  transform: rotate(180deg);
                }

                .burgerMenu > div.hamburgerBar{
                  width: 28px;
                  height: 2px;
                  margin: 0 0 4px 0;
                  background: black;
                  transition: all 0.4s cubic-bezier(0.23, 1, 0.32, 1);
                }

                .burgerMenu.changeMe > div.hamburgerBar{
                  background: white;
                }

                .burgerMenu.changeMe > div.hamburgerBar:nth-child(1){
                  transform: rotate(45deg) translate(4px, 4px);
                }

                .burgerMenu.changeMe > div.hamburgerBar:nth-child(2){
                  opacity: 0
                }

                .burgerMenu.changeMe > div.hamburgerBar:nth-child(3){
                  transform: rotate(-45deg) translate(5px, -4px);
                }

                //Fullpage

                div.menu, div.menu .innermenu{
                    position: fixed;
                    top: 0;
                  
                    height: 0;
                    padding: 0;
                }

                div.menu.fullpage.showMe, div.menu.leftSide.showMe{
                    display: block;
                }

                div.menu.fullpage .menu-list{
                  display: flex;
                  flex-direction: column;
                  align-items: center;
                  justify-content: flex-start;
                  
                  position: fixed;
                  top: 0;
                  left: 0;


                  height: 0;
                  width: 100%;
                  background-color: #fb5642;
                  padding-top: 0;
                  margin-top: 0;
                  border: none;

                  opacity: 0;
                  visibility: hidden;
                  transition: opacity .35s, height .35s;
                  overflow: hidden;

                }

                div.menu.fullpage.showMe .menu-list{
                    height: 100vh;
                    opacity: .9;
                    visibility: visible;
                    padding-top: 5%;
                }

                div.menu.fullpage.showMe .menu-list li h3{
                  font-size: 1.8em;
                }

                div.menu.fullpage.showMe .menu-list li h3 a,
                div.menu.leftSide.showMe .menu-list li h3 a{
                    color: white;
                    padding: .3em .5em;
                }

                div.menu.fullpage.showMe .menu-list li h3 a:after,
                div.menu.leftSide.showMe .menu-list li h3 a:after{
                    content: '';
                    position: absolute;
                    bottom: 0;
                    left: 50%;
                    width: 0%;
                    transform: translateX(-50%);
                    height: 3px;
                    background: white;
                    transition : .35s;
                }  

                div.menu.fullpage.showMe .menu-list li h3 a:hover,
                div.menu.leftSide.showMe .menu-list li h3 a:hover{
                    text-decoration: none;
                } 

                div.menu.fullpage.showMe .menu-list li h3 a:hover:after,
                div.menu.leftSide.showMe .menu-list li h3 a:hover:after{
                    width: 100%;
                } 

                div.menu.fullpage.showMe .menu-list .submenu, div.menu.leftSide.showMe .menu-list .submenu{
                    display: none;
                }

                //Leftslide

                div.menu.leftSide .menu-list{
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: flex-start;
                  
                    position: fixed;
                    top: 0;
                    left: -300px;


                    padding-top: 5%;
                    height: 100vh;
                    width: 300px;
                    background-color: #fb5642;
                    border: none;

                    transition: left .35s;
                    overflow: hidden;
                }

                div.menu.leftSide.showMe .menu-list{
                    left: 0;
                    z-index: 999999;
                }

            }
        </style>
        `).appendTo('head');

        hamburgerMenu.addEventListener('click', function () {
          $($mainMenu).toggleClass('showMe');
          $(this).toggleClass('changeMe');
        });

        if (type === 1) { //FullPage
          moveElement(hamburgerMenu, where, fnType);

          $($mainMenu).addClass('fullpage');
        }
        if (type === 2) { //Leftside sliding
          moveElement(hamburgerMenu, where, fnType);

          $('.menu').addClass('leftSide');
        }

  };
  
  /**
   * Connects boxes in one module and displaying they like a tabs.
   * @function turnTabs
   * 
   * @param {string} whereAppend - The selector of the element to which the previous element is to be moved.
   * @param {string} fnType - The name of the function that describes how to insert content.
   * @param {array} whichPage - The array of selectors that they specify where function should be run. 
   * 
   * You must add externel JS code from Shoper!
   */
  var turnTabs = function (whereAppend, fnType, whichPage){
  
        var OnOff = OnOffFunc(whichPage);

        if (!OnOff) {
          return null;
        }

        var selectorsAvailable = {
          lastAdd: '#box_lastadded',
          promotion: '#box_specialoffer',
          bestsellers: '#box_bestsellers'
        };

        var selectors = {

        };

        var tabsHead = document.createElement('div'),
          allContent = document.createElement('div');

          var flagNotFound = false,
          allTabs = {},
          allHeader = [];

        for (var t = 0; t < Object.keys(selectorsAvailable).length; t++) {
          ($('' + Object.values(selectorsAvailable)[t]).length !== 0) ? selectors[Object.keys(selectorsAvailable)[t]] = Object.values(selectorsAvailable)[t]: null;
        }

        for (var i in selectors) {
          if ($(selectors[i]).length === 0) {
            console.log('Not found ' + selectors[i] + ' elements.');
            flagNotFound = true;
          } else {

            allHeader.push($('' + selectors[i] + ' .boxhead'));
            allTabs[selectors[i]] = $(selectors[i]);
          }
        }

        if (flagNotFound) {
          return false;
        }

        //Do tabs
        tabsHead.classList = 'tabsHead box resetcss box_custom';

        var childrenTabsHead = $(tabsHead)[0].children;

        for (var i in allHeader) {
          var tabsHeadPosition = document.createElement('div');

          tabsHeadPosition.setAttribute('class', Object.keys(selectors)[i]);
          tabsHeadPosition.setAttribute('data-id', Object.values(selectors)[i]);

          var activeBox = $(tabsHeadPosition).attr('data-id');

          if (i == 0) {
            tabsHeadPosition.classList.add('active');
          } else {
            $('' + Object.values(selectors)[i]).css({
              'display': 'none'
            });
          }

          tabsHeadPosition.innerHTML = '<span>' + allHeader[i][0].innerText + '</span>';
          tabsHead.appendChild(tabsHeadPosition);

          tabsHeadPosition.addEventListener('click', function () {
            $(childrenTabsHead).each(function () {
              if ($(this).hasClass('active')) {
                this.classList.remove('active');
                $($(this).attr('data-id')).css('display', 'none');
              }
            });
            this.classList.add('active');
            $($(this).attr('data-id')).css({
              'display': 'block'
            });
          });

          $('div' + activeBox).find('.boxhead').detach();
        }

        for (var i in selectors) {
          $(allContent).append($('' + selectors[i]));
        }

        $(`
      <style>
        .tabsHead{
          text-align: center;
          border-bottom: 1px solid #c2c2c2;
        }

        .tabsHead > div{
          display: inline-block;
          cursor: pointer;
          padding: 12px 20px;
          margin: 0;
          box-sizing: border-box;
          position: relative;
        }

        .tabsHead > div > span{
          line-height: 20px;
          margin: 0;
          font-size: 18px;
          font-weight: 600;
          text-transform: uppercase;
          color: #282828;
          padding: 0;
        }

        .tabsHead > div.active{
          border: 1px solid #c2c2c2;
          border-bottom: 0;
        }

        .tabsHead > div.active:after{
          content: '';
          position: absolute;
          bottom: -1px;
          left: 0;
          border-bottom: 1px solid #fff;
          width: 100%;
        }

        .tabsHead > div.active > span{
          color: #fa6060;
        }

        @media (max-width: 766px){
          .tabsHead > div{
            display: block;
          }

          .tabsHead > div.active{
            border: none;
          }
        }
      </style>
      `).appendTo('head');

        $(allContent).prepend(tabsHead);

        moveElement(allContent, whereAppend, fnType);
  };

  /**
   * Display specific element when other element is visible.
   * @function slidingBox
   * 
   * @param {string} el - The element that will be shown. ( You must set style this element in external CSS !)
   * @param {string} whenEl - The element that must be in viewport.
   * @param {array} whichPage - The array of selectors that they specify where function should be run. 
   * 
   * External CSS ! 
   * IN PROGRESS - isElementinViewport 
   */
  var slidingBox = function(el, whenEl, whichPage) {

        var OnOff = OnOffFunc(whichPage);

        if (!OnOff) {
          return null;
        }

        if (!$(el).length) {
          console.error('Element not found.');
          return null;
        }

        if (!$(whenEl).length) {
          console.error('Content not found.');
          return null;
        }

        var slidingEl = document.querySelector(el),
          whenSliding = document.querySelector(whenEl);

        function isElementInViewport(el) {
          var rect = el.getBoundingClientRect();
          return (
            rect.top >= 0 &&
            rect.bottom <= (window.innerHeight || document.documentElement.clientHeight)
          );
        }

        $(`
      <style>
        ${el}{
          background: #f4f4f4;
          position: fixed;
          z-index: 1000;
          padding: 20px;
          width: 100%;
          max-width: 300px;
          box-shadow: 0px 4px 12px 0px rgba(50,50,50,0.5);
          left: -300px;
          transition: all ease-in-out .5s;
          box-sizing: border-box;
          overflow: hidden;
          opacity: 0;
          transition : opacity .35s left .35s;
        }

        ${el}.showSliding{
          left: 0;
          opacity: 1;
        }
      </style>
      `).appendTo('head');

        document.addEventListener('scroll', function () {
          if (isElementInViewport(whenSliding)) {
            $(slidingEl).addClass('showSliding');
          } else {
            $(slidingEl).removeClass('showSliding');
          }
        }, false);

  };

  /**
   * Turn off specific element on the specific product page.
   * @function turnOnOffForSpecialCategory
   * 
   * @param {array} whereHideArray - Name of category.
   * @param {string} whatHideSelector - Selector to hide.
   */
  var turnOnOffForSpecialCategory = function(whereHideArray, whatHideSelector) {

    var currentProduct = document.querySelector('#box_productfull');

        if (currentProduct) {
          var currentCategory;
          currentCategory = whereHideArray.filter(function (value) {
            return value === currentProduct.getAttribute('data-category');
          });
        }

        if (currentProduct && currentProduct.getAttribute('data-category') === currentCategory[0]) {
          var allCategoryApi = frontAPI.getCategories({});

          var allCategory = [];

          for (var i in allCategoryApi) {
            if (allCategoryApi[i].children.length > 0) {
              var childLength = allCategoryApi[i].children.length,
                j = 0;

              for (j; j < childLength; j++) {
                allCategory.push(allCategoryApi[i].children[j].name);
              }
            }

            allCategory.push(allCategoryApi[i].name);
          }
          $(whatHideSelector).css('display', 'none');
        }
  };

  /**
   * Load scripts and next run the function.
   * @function loadScript
   * 
   * @param {array} arr - Array with links to scripts.
   * @param {function} fn - Callback.
   */
  var loadScript = function (arr, fn) {
    var importerScript = {
      url: (url) => {
        return new Promise((resolve, reject) => {
          var script = document.createElement('script');
          script.type = 'text/javascript';
          script.src = url;
          script.addEventListener('load', () => resolve(script), false);
          script.addEventListener('error', () => reject(script), false);
          document.body.appendChild(script);
        });
      },
      urls: (urls) => {
        return Promise.all(urls.map(importerScript.url));
      }
    };

    importerScript.urls(arr).then(() => {
      fn();
    }).catch((e) => {
      console.error('Failed loading scripts.');
    });
  };

  /**
   * Set and display counter.
   * @function counter
   * 
   * @param {string} setId - The box with requirement values.
   * @param {string} mainId - The box with main text.
   * @param {array} whichPage - The array of selectors that they specify where function should be run.
   * 
   * @default setId 'fx-setCounter'
   * @default mainId 'fx-mainCounter'
   * 
   * @example
   * // Values of setId and mainId are default.
   * // counter will be run only on main page.
   * mainCore.counter('','',['.shop_index']);
   */
  var counter = function(setId, mainId, whichPage) {

        var OnOff = OnOffFunc(whichPage);

        if (!OnOff) {
          return null;
        }

        var setId = setId || 'fx-setCounter',
          mainId = mainId || 'fx-mainCounter';

          var setElem = document.getElementById(setId),
          mainElem = document.getElementById(mainId);

        if (!setElem) {
          console.error('Element not found');
          return null;
        }

        var queryBox = document.querySelector(`#${setId} > p:first-child`),
          setTime = queryBox.innerText,
          whenOff = document.querySelector(`#${setId} > p:nth-child(2)`),
          optionalText = document.querySelector(`#${setId} > p:nth-child(3)`),
          counterBox = document.createElement('div');

        $(`#${mainId}`).append(counterBox);

        counterBox.classList = 'counterBox';
        counterBox.innerHTML = `<span id="fx-hours" class="timeBox"></span><span id="fx-minutes" class="timeBox"></span><span id="fx-seconds" class="timeBox"></span>`;

        if(whenOff){
          var setDate = whenOff.innerText.slice(1, -1).split(',');
        } else{
          var setDate = [];
        }

        if (optionalText) {
          $(counterBox).after(optionalText);
        }

        var counterDiv = $(counterBox).find('.counterDiv'),
          counterDivHours = $('#fx-hours')[0],
          counterDivMinutes = $('#fx-minutes')[0],
          counterDivSeconds = $('#fx-seconds')[0];

        $(`
      <style>
        #${setId}{
          display: none;
        }

        #${mainId}{
          box-sizing: border-box;
          display: inline-block;

          width: 300px;
          padding: 10px 20px;
          margin: 5px 0;

          border-radius: 5px;
          background: #595959;
          color: white;

          text-align: center;
        }

        #${mainId} p{
          margin: 0;
          padding: 5px 0;
        }

        .counterBox span.timeBox{
          box-sizing: border-box;
          display: inline-block;
          
          width: 50px;
          height: 50px;
          line-height: 50px;
          background: white;
          color: black;
          
          font-size: 1.6em;
        }

        .counterBox span.timeBox:nth-child(2){
          margin: 0 10px;
        }
      </style>
      `).appendTo('head');

        var countDownDate = new Date(),
          currMonth = countDownDate.getMonth() + 1,
          currDay = countDownDate.getDate(),
          turnTimer = true;

        for (var i = 0, length = setDate.length; i < length; i++) {
          if (currDay == setDate[i].slice(0, 2) && currMonth == setDate[i].slice(3, 5)) {
            turnTimer = false;
          }
        }

        if (countDownDate.getDay() === 6 || countDownDate.getDay() === 7 || !turnTimer) {
          counterBox.innerText = `Dzisiaj nie wysyłamy!`;
        } else {

          countDownDate.setHours(setTime);
          countDownDate.setMinutes(0);
          countDownDate.setSeconds(0);

          (function displayTime() {

            var nowDate = new Date().getTime();

            var diff = countDownDate - nowDate;

            var hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            var minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
            var seconds = Math.floor((diff % (1000 * 60)) / 1000);

            counterDivHours.innerText = hours;
            counterDivMinutes.innerText = minutes;
            counterDivSeconds.innerText = seconds;

            if (diff < 0) {
              counterBox.innerText = `Koniec promocji na dzisiaj`;
              cancelAnimationFrame(displayTime);
              return;
            }

            requestAnimationFrame(displayTime);
          })();

        }

        if ($(mainElem).parents('div.top').length) {
          $('header .logo-bar').append(mainElem);
        }

  };

  /**
   * TEST TEST TEST
   * @function loadAndDisplay
   * @param {*} wait 
   * @param {*} elementToLoad 
   * @param {*} where 
   * @param {*} fnType 
   * @param {*} fnHow 
   * @param {*} whichPage 
   * 
   * IN PROGRESS
   */
  var loadAndDisplay = function (wait, elementToLoad, where, fnType, fnHow, whichPage) {

    var counter = 0;

    var timer = setInterval(function () {

      console.log($(wait));

      if ($(wait).length !== 0) {

        if (typeof elementToLoad === 'function') {
          console.log('tu?');
          elementToLoad();
        } else if (typeof elementToLoad === 'string') {
          moveElement(elementToLoad, where, fnType, fnHow);
        }
        clearInterval(timer);
      }

      console.log(counter);

      counter++;
    }, 100);
  };

  /**
   * Adds a special tag to products with a specific category.
   * @function addSpecialTag
   * 
   * @param {*} name - Text inside tag.
   * @param {*} type - Type of tag. ( text - Include name property, promo - Show percent )
   * @param {*} where - Box selector.
   * @param {*} color - Text color.
   * @param {*} bg - Background color.
   */
  var addSpecialTag = function(name, type, where, color, bg) {

        var p = $(where).find('.product');

        if ($(p).length == 0) {
          return null;
        }

        //Default settings
        $(`
      <style>
        .fx-${name}{
          color: ${color};
          background: ${bg};
        }
      </style>
      `).appendTo('head');

        $(p).each(function (index, element) {
          if (type === 'text' && $(element).find('ul.tags').length === 0) {
            var inside = `
            <ul class="tags">
              <li class="fx-${name}">
                <span>${name}</span>
              </li>
            </ul>
          `;
          } else {
            var inside = `
          <li class="fx-${name}">
                <span>${name}</span>
              </li>
          `;

            $(element).find('ul.tags').append(inside);
          }

          if (type === 'promo') {

            var price = parseFloat($(element).find('.price em')[0].innerText),
              del = parseFloat($(element).find('.price del')[0].innerText);

            console.log(element);

            var valPercent = parseInt((price * 100) / del);
            valPercent = 100 - valPercent;

            if ($(element).find('ul.tags').length === 0) {
              var inside = `
            <ul class="tags">
              <li class="fx-${name}">
                <span>${valPercent}%</span>
              </li>
            </ul>
          `;

              $(element).append(inside);

            } else {
              var inside = `
              <li class="fx-${name}">
                <span>${valPercent}%</span>
              </li>
            `;

              $(element).find('ul.tags').append(inside);
            }
          }
        });
  };

  /**
   * Connects baner and products box.
   * @function joinBanerAndDayProduct
   * 
   * @param {*} id 
   * @param {*} banerID 
   * @param {*} where 
   * @param {*} fnType 
   * @param {*} fnHow 
   * @param {*} whichPage 
   * 
   * IN PROGRESS
   */
  var joinBanerAndDayProduct = function(id, banerID, where, fnType, fnHow, whichPage) {

        var OnOff = OnOffFunc(whichPage);

        if (!OnOff) {
          return null;
        }

        id = id || 'fx-special-banner';

        var productDay = document.querySelector('#box_productoftheday'),
          mainBaner = document.querySelector('#' + banerID),
          mainContainer = document.createElement('div');

        mainContainer.classList = 'box resetcss box_custom';
        mainContainer.setAttribute('id', id);

        if (1) {

          var mainBox = document.createElement('div');
          $(mainBox).attr('id', id + '-wrap');
          $(mainBox).append(mainBaner).append(productDay);

          $(`
        <style>
          #${banerID}{
            grid-area: Baner;
          }
          #box_productoftheday{
            grid-area: Product;
          }
          #${id}-wrap{
            display: grid;
            grid-template-areas: "Baner Baner Product";
          }
        </style>
        `).appendTo('head');

          $(mainContainer).append(mainBox);

          moveElement(mainContainer, where, fnType, fnHow);

          return true;
        } else {
          console.error('Not found elements.');
          return null;
        }

  };

  /**
   * @function collapseMenu
   * 
   * Adds "More" button at the end of the menu.
   * 
   * IN PROGRESS - Wrong behaviour.
   */
  var collapseMenu = function (){
    var $mainMenu = $('.menu-list'),
          htmlLang = $('html').attr('lang'),
          $mainMenuLength = $($mainMenu)[0].clientWidth,
          $mainMenuElements = $('.menu-list > li:not(".home-link-menu-li")'),
          moreText = {
            'pl': 'więcej',
            'en': 'more',
            'de': 'mehr'
          };

        var $mainMenuElementsLength = 0;

        if ($(document).innerWidth() > 699) {
          var temp = 0;
        } else {
          var temp = -1;
        }

        var $collapsePosition = new Array();

        for (var i = 0; i < $mainMenuElements.length; i++) {
          $mainMenuElementsLength += $mainMenuElements[i].clientWidth;

          console.log(`Szerokość menu przy pozycji nr ${i} = ${$mainMenuElementsLength}`);

          if ($mainMenuElementsLength > $mainMenuLength) {
            $collapsePosition.push($mainMenuElements[i]);
          }

          //   if ($mainMenuElementsLength > $mainMenuLength || $mainMenuElements[i].clientWidth > $mainMenuLength - $mainMenuElementsLength){
          //     $collapsePosition.push($mainMenuElements[i]);

          //     if (temp === 0) {
          //       $collapsePosition.push($mainMenuElements[i - 1]);

          //       temp++;
          //     }
          //   }
        }

        if ($collapsePosition.length) {

          $('.menu-list').addClass('isCollapse');

          //   for (var j = 0; j < $collapsePosition.length; j++) {
          //     $('.menu-list > li:last-child').remove();
          //   }

          $('.menu-list').prepend(`<li class="parent moreCollapseMenu"><h3><a href="#" title="collapseMenu" class="spanhover mainlevel"><span class="moreText">${moreText[htmlLang]}</span></a></h3><div class="submenu level1"><ul class="level1" style="right: 0;"></ul></div></li>`);
          $('.moreCollapseMenu').css('float', 'right');
          for (var t = 0; t < $collapsePosition.length; t++) {
            $('.moreCollapseMenu > div > ul').append($collapsePosition[t]);
          }

        }

  };

  /**
   * Show specific module on the left or right side.
   * @param {string} id - Selector of the element.
   * @param {array} whichPage - The array of selectors that they specify where function should be run.
   * 
   * @default id - 'fx-fixedBox'
   */
  var fixedBox = function(id, whichPage) {

        var OnOff = OnOffFunc(whichPage);

        if (!OnOff) {
          return null;
        }

        var id = id || 'fx-fixedBox',
          mainEl = document.getElementById(id);

        if (!mainEl) {
          console.error('Element not found.');
          return null;
        }

        var content = $(mainEl).find('div:first-child');

        if (content.length === 0) {
          console.error('Content must be put in div element.');
          return null;
        }

        content.css('display', 'inline-block');

        var valMargin = ($('body').innerWidth() - $('div.main .container').innerWidth()) / 2,
          mainElWidth = $(content).innerWidth();


        if (mainElWidth > valMargin) {
          $(mainEl).css('display', 'none');
          return null;
        }

        $(`
      <style>
        #${id}{
          display: block;
          visibility: visible;
        }
        #${id} > div{
          position: fixed;
          right: 0;
          top: 50%;
          transform: translateY(-50%);
        }
      </style>
      `).appendTo('head');

  };

  return {
    infoBar,
    moveElement,
    curtainSubmenu,
    stickyMenu,
    collapseMenu,
    hamburgerMenu,
    turnTabs,
    slidingBox,
    turnOnOffForSpecialCategory,
    loadScript,
    counter,
    loadAndDisplay,
    addSpecialTag,
    joinBanerAndDayProduct,
    fixedBox
  };

})();

$(document).ready(function(){
  console.log('Work');

  mainCore.fixedBox();
  mainCore.infoBar('fx-welcome-new','','red','blue');
});