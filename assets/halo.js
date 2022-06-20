(function ($) {
    var body = $('body'),
        doc = $(document),
        html = $('html'),
        win = $(window),
        wrapperOverlaySlt = '.wrapper-overlay',
        iconNav,
        dropdownCart,
        miniProductList;

    doc.ready(function () {
        iconNav = $('[data-menu-mb-toogle]'),
        dropdownCart = $('#dropdown-cart'),
        miniProductList = dropdownCart.find('.mini-products-list');

        doc.ajaxStart(function () {
            soun.isAjaxLoading = true;
        });

        doc.ajaxStop(function () {
            soun.isAjaxLoading = false;
        });

        soun.init(); 
    });

    var winWidth = win.innerWidth();

    win.off('resize.initMenuMobile').on('resize.initMenuMobile', function() {
        var resizeTimerId;

        clearTimeout(resizeTimerId);

        resizeTimerId = setTimeout(function() {
            var curWinWidth = win.innerWidth();

            if ((curWinWidth < 1200 && winWidth >= 1200) || (curWinWidth >= 1200 && winWidth < 1200)) {
                soun.initToggleMuiltiLangCurrency();
                soun.addTextMuiltiOptionActive($('#lang-switcher'), $('#lang-switcher [data-value].active'), $('[data-language-label]'));
                soun.addTextMuiltiOptionActive($('#currencies'), $('#currencies [data-currency].active'), $('[data-currency-label]'));
                soun.dropdownCart();
                soun.dropdownCustomer();

                soun.stickyFixedTopMenu();
            };
            winWidth = curWinWidth;
        }, 0);
    });

    win.on('resize', function () {
        soun.setActiveViewModeMediaQuery();
    });

    var soun = {
        sounTimeout: null,
        isSidebarAjaxClick: false,
        isAjaxLoading: false,
        init: function () {
            this.closeHeaderTop();
            this.closeAllOnMobile();
            this.initToggleMuiltiLangCurrency();
            this.addTextMuiltiOptionActive($('#lang-switcher'), $('#lang-switcher [data-value].active'), $('[data-language-label]'));
            this.addTextMuiltiOptionActive($('#currencies'), $('#currencies [data-currency].active'), $('[data-currency-label]'));
            this.initScrollTop();
            this.dropdownCart();
            this.dropdownCustomer();
            this.addEventShowOptions();
            this.changeQuantityAddToCart();
            this.initAddToCart();
//           -----
            this.smoothScrolling();
            this.videoProductPopup();
            this.header_mobile();
            this.openSubmenuMobile();

            if(body.hasClass('template-index')) {
                this.handleScrollDown();
            }
            this.initProductMoreview($('[data-more-view-product] .product-img-box'));
            
            this.initCustomerViewProductShop();
            this.initChangeQuantityButtonEvent();
            this.initQuantityInputChangeEvent();
            this.removeCartItem();
            this.initZoom();

            this.stickyFixedTopMenu();

            if(body.hasClass('template-product') ) {
                this.initSoldOutProductShop();
//                 this.productPageInitProductTabs();
                this.changeSwatch('#add-to-cart-form .swatch :radio');
//                 this.initStickyAddToCart();
                this.wrapTable();
            }
            
        },

        closeHeaderTop: function () {
            var headerTopEml = $('.header-top'),
                closeHeaderTopElm = headerTopEml.find('[data-close-header-top]');

            if (closeHeaderTopElm.length && closeHeaderTopElm.is(':visible')) {
                if ($.cookie('headerTop') == 'closed') {
                    headerTopEml.remove();
                };

                closeHeaderTopElm.off('click.closeHeaderTop').on('click.closeHeaderTop', function (e) {
                    e.preventDefault();
                    e.stopPropagation();

                    headerTopEml.remove();
                    $.cookie('headerTop', 'closed', {
                        expires: 1,
                        path: '/'
                    });
                });
            };
        },

        closeAllOnMobile: function () {
            body.off('click.close', wrapperOverlaySlt).on('click.close', wrapperOverlaySlt, function (e) {
                e.preventDefault();
                e.stopPropagation();

                html.removeClass('translate-overlay cart-show customer-show sidebar-open options-show');
                $('.close-menu-mb').removeClass('menu-open');

                $('.main-menu.jas-mb-style').css({
                    "overflow": ""
                });
                $('.site-nav').find('[data-toggle-menu-mb]').parent().next('.sub-menu-mobile').removeClass('sub-menu-open');
            });
        },

        initToggleMuiltiLangCurrency: function () {
            var langCurrencyGroups = $('.lang-currency-groups'),
                dropdownGroup = langCurrencyGroups.find('.btn-group'),
                dropdownLabel = dropdownGroup.find('.dropdown-label');

            if (dropdownLabel.length && dropdownLabel.is(':visible')) {
                dropdownLabel.off('click.toggleMuiltiOption').on('click.toggleMuiltiOption', function (e) {
                    e.preventDefault();
                    e.stopPropagation();

                    var selfNextDropdown = $(this).next();

                    if (!selfNextDropdown.is(':visible')) {
                        dropdownLabel.next('.dropdown-menu').hide();
                        selfNextDropdown.slideDown(300);
                    } else {
                        selfNextDropdown.slideUp(300);
                    }
                });

                soun.hideMuiltiLangCurrency();
            } else {
                dropdownLabel.next('.dropdown-menu').css({
                    'display': ''
                });
            };
        },

        hideMuiltiLangCurrency: function () {
            doc.off('click.hideMuiltiLangCurrency').on('click.hideMuiltiLangCurrency', function (e) {
                var muiltiDropdown = $('.lang-currency-groups .dropdown-menu');

                if (!muiltiDropdown.is(e.target) && !muiltiDropdown.has(e.target).length) {
                    muiltiDropdown.slideUp(300);
                }
            });
        },

        addTextMuiltiOptionActive: function (SltId, dataSlt, label) {
            if (label.length && label.is(':visible')) {
                var item = dataSlt.html();

                SltId.prev(label).html(item);
            };
        },

        initScrollTop: function () {
            var backToTop = $('#back-top');

            win.scroll(function () {
                if ($(this).scrollTop() > 220) {
                    backToTop.fadeIn(1200);
                } else {
                    backToTop.fadeOut(1200);
                };
            });

            backToTop.off('click.scrollTop').on('click.scrollTop', function (e) {
                e.preventDefault();
                e.stopPropagation();

                $('html, body').animate({
                    scrollTop: 0
                }, 1200);
                return false;
            });
        },

        dropdownCustomer: function () {
            this.initDropdownCustomerTranslate($('[data-user-mobile-toggle]'), 'customer-show');

            if (window.innerWidth >= 1200) {
                this.initDropdownCustomerTranslate($('[data-user-pc-translate]'), 'customer-show');
            };

            this.closeDropdownCustomerTranslate();
            this.initDropdownCustomer();
        },

        initDropdownCustomerTranslate: function (iconUser, sltShowUser) {
            if (iconUser.length && iconUser.is(':visible')) {
                iconUser.off('click.dropdownCustomerMobile').on('click.dropdownCustomerMobile', function (e) {
                    e.preventDefault();
                    e.stopPropagation();

                    html.addClass(sltShowUser);
                });
            };
        },

        closeTranslate: function (closeElm, classRemove) {
            if ($(closeElm).length) {
                body.off('click.closeCustomer', closeElm).on('click.closeCustomer', closeElm, function (e) {
                    e.preventDefault();
                    e.stopPropagation();

                    html.removeClass(classRemove);
                });
            };
        },

        closeDropdownCustomerTranslate: function () {
            soun.closeTranslate('#dropdown-customer .close-customer', 'customer-show');
        },

        appendCustomerForPCHeaderDefault: function () {
            var customerLink = $('.header-default .header-panel-bt .customer-links'),
                dropdowCustomer = $('#dropdown-customer');

            if (window.innerWidth >= 1200) {
                dropdowCustomer.appendTo(customerLink);
            } else {
                dropdowCustomer.appendTo(body);
            }
        },

        doDropdownCustomerPCHeaderDefault: function () {
            var customerLoginLink = $('[data-dropdown-user]');

            if(window.innerWidth >= 1200) {
                customerLoginLink.off('click.toogleCustomer').on('click.toogleCustomer', function (e) {
                    e.preventDefault();
                    e.stopPropagation();

                    $(this).siblings('#dropdown-customer').slideToggle();
                });

            }
        },

        initDropdownCustomer: function () {
            var siteHeader = $('.site-header');

            if (siteHeader.hasClass('header-default')) {
                this.appendCustomerForPCHeaderDefault();
                this.doDropdownCustomerPCHeaderDefault();
            }
        },

        dropdownCart: function () {
            this.closeDropdownCartTranslate();
            this.initDropdownCartMobile();
            this.initDropdownCartDesktop();
            this.checkItemsInDropdownCart();
            this.removeItemDropdownCart();
        },

        appendDropdownCartForMobile: function () {
            var wrapperTopCart = $('.wrapper-top-cart');

            if (window.innerWidth < 1200) {
                dropdownCart.appendTo(body);
            } else {
                dropdownCart.appendTo(wrapperTopCart);
            }
        },

        closeDropdownCartTranslate: function () {
            soun.closeTranslate('#dropdown-cart .close-cart', 'cart-show');
        },

        initDropdownCartMobile: function () {
            var headerMb = $('.header-mb, [data-cart-header-parallax], [data-cart-header-02], [data-cart-header-04], [data-cart-header-supermarket]'),
                cartIcon = headerMb.find('[data-cart-toggle]');

            cartIcon.off('click.initDropdownCartMobile').on('click.initDropdownCartMobile', function (e) {
                e.preventDefault();
                e.stopPropagation();

                html.toggleClass('cart-show');
            });
        },

        initDropdownCartDesktop: function () {
            var siteHeader = $('.site-header');

            if (siteHeader.hasClass('header-default')) {
                soun.appendDropdownCartForMobile();
                soun.initDropdownCartForHeaderDefault();
            }
        },

        addEventShowOptions: function() {
            var optionsIconSlt = '[data-show-options]';

            doc.off('click.showOptions', optionsIconSlt).on('click.showOptions', optionsIconSlt, function(e) {
                e.preventDefault();
                e.stopPropagation();

                html.toggleClass('options-show');
            });

            soun.closeTranslate('.lang-currency-groups .close-option', 'options-show');
        },

        initDropdownCartForHeaderDefault: function () {
            var wrapperTopCart = $('.wrapper-top-cart'),
                cartIcon = wrapperTopCart.find('[data-cart-toggle]');

            if (cartIcon.length && cartIcon.is(':visible')) {
                if (window.dropdowncart_type == 'click') {
                    cartIcon.off('click.toogleDropdownCart').on('click.toogleDropdownCart', function (e) {
                        e.preventDefault();
                        e.stopPropagation();

                        wrapperTopCart.toggleClass('is-open');
                        dropdownCart.slideToggle();
                    });
                } else {
                    cartIcon.hover(function () {
                        var customer = $('#dropdown-customer');

                        if (customer.is(':visible')) {
                            customer.hide();
                        };

                        if (!wrapperTopCart.hasClass('is-open')) {
                            wrapperTopCart.addClass('is-open');
                            dropdownCart.slideDown();
                        }
                    });

                    wrapperTopCart.mouseleave(function () {
                        if (wrapperTopCart.hasClass('is-open')) {
                            wrapperTopCart.removeClass('is-open');
                            dropdownCart.slideUp();
                        };
                    });
                }
            } else {
                dropdownCart.css("display", "");
            }
        },

        checkItemsInDropdownCart: function () {
            var cartNoItems = dropdownCart.find('.no-items'),
                cartHasItems = dropdownCart.find('.has-items');

            if (miniProductList.children().length) {
                cartHasItems.show();
                cartNoItems.hide();
            } else {
                cartHasItems.hide();
                cartNoItems.show();
            };
        },

        removeItemDropdownCart: function (cart) {
            var btnRemove = dropdownCart.find('.btn-remove');

            btnRemove.off('click.removeCartItem').on('click.removeCartItem', function (e) {
                e.preventDefault();
                e.stopPropagation();

                var productId = $(this).parents('.item').attr('id');
                productId = productId.match(/\d+/g);

                Shopify.removeItem(productId, function (cart) {
                    soun.doUpdateDropdownCart(cart);
                });
            });
        },

        updateDropdownCart: function () {
            Shopify.getCart(function (cart) {
                soun.doUpdateDropdownCart(cart);
            });
        },

        doUpdateDropdownCart: function (cart) {
            var template = '<li class="item" id="cart-item-{ID}"><a href="{URL}" title="{TITLE}" class="product-image"><img src="{IMAGE}" alt="{TITLE}"></a><div class="product-details"><a href="javascript:void(0)" title="Remove This Item" class="btn-remove"><svg aria-hidden="true" data-prefix="fal" data-icon="times" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512" class="svg-inline--fa fa-times fa-w-10 fa-2x"><path fill="currentColor" d="M193.94 256L296.5 153.44l21.15-21.15c3.12-3.12 3.12-8.19 0-11.31l-22.63-22.63c-3.12-3.12-8.19-3.12-11.31 0L160 222.06 36.29 98.34c-3.12-3.12-8.19-3.12-11.31 0L2.34 120.97c-3.12 3.12-3.12 8.19 0 11.31L126.06 256 2.34 379.71c-3.12 3.12-3.12 8.19 0 11.31l22.63 22.63c3.12 3.12 8.19 3.12 11.31 0L160 289.94 262.56 392.5l21.15 21.15c3.12 3.12 8.19 3.12 11.31 0l22.63-22.63c3.12-3.12 3.12-8.19 0-11.31L193.94 256z" class=""></path></svg></a><a class="product-name" href="{URL}">{TITLE}</a><div class="option"><small>{VARIANT}</small></div><div class="cart-collateral"><span class="qtt">{QUANTITY} X </span><span class="price">{PRICE}</span></div></div></li>';

            $('[data-cart-count]').text(cart.item_count);

            dropdownCart.find('.summary .price').html(Shopify.formatMoney(cart.total_price, window.money_format));

            miniProductList.html('');

            if (cart.item_count > 0) {
                for (var i = 0; i < cart.items.length; i++) {
                    var item = template;

                    item = item.replace(/\{ID\}/g, cart.items[i].id);
                    item = item.replace(/\{URL\}/g, cart.items[i].url);
                    item = item.replace(/\{TITLE\}/g, soun.translateText(cart.items[i].product_title));
                    item = item.replace(/\{VARIANT\}/g, cart.items[i].variant_title || '');
                    item = item.replace(/\{QUANTITY\}/g, cart.items[i].quantity);
                    item = item.replace(/\{IMAGE\}/g, Shopify.resizeImage(cart.items[i].image, '160x'));
                    item = item.replace(/\{PRICE\}/g, Shopify.formatMoney(cart.items[i].price, window.money_format));

                    miniProductList.append(item);
                }

                soun.removeItemDropdownCart(cart);

                if (soun.checkNeedToConvertCurrency()) {
                    Currency.convertAll(window.shop_currency, $('#currencies .active').attr('data-currency'), '#dropdown-cart span.money', 'money_format');
                }
            }

            soun.checkItemsInDropdownCart();
        },

        translateText: function (str) {
            if (!window.multi_lang || str.indexOf("|") < 0)
                return str;

            if (window.multi_lang) {
                var textArr = str.split("|");

                if (translator.isLang2())
                    return textArr[1];
                return textArr[0];
            };
        },

        checkNeedToConvertCurrency: function () {
            return window.show_multiple_currencies && Currency.currentCurrency != shopCurrency;
        },

        showLoading: function () {
            $('.loading-modal').show();
        },

        hideLoading: function () {
            $('.loading-modal').hide();
        },

        showModal: function (selector) {
            $(selector).fadeIn(500);

            soun.sounTimeout = setTimeout(function () {
                $(selector).fadeOut(500);
            }, 5000);
        },

        translateBlock: function (blockSelector) {
            if (window.multi_lang && translator.isLang2()) {
                translator.doTranslate(blockSelector);
            }
        },

        closeLookbookModal: function () {
            $('.ajax-lookbook-modal').fadeOut(500);
        },

        doAjaxAddLookbookModal: function (handle, position) {
            var offSet = $(position).offset(),
                top = offSet.top,
                left = offSet.left,
                iconWidth = position.innerWidth(),
                innerLookbookModal = $('.ajax-lookbook-modal').innerWidth(),
                str3 = iconWidth + "px",
                str4 = innerLookbookModal + "px",
                newtop,
                newleft;

            if (window.innerWidth > 767) {
                if (left > (innerLookbookModal + 31)) {
                    newleft = "calc(" + left + "px" + " - " + str4 + " + " + "2px" + ")";
                } else {
                    newleft = "calc(" + left + "px" + " + " + str3 + " - " + "2px" + ")";
                }

                newtop = top - (innerLookbookModal / 2) + "px";
            } else {
                newleft = 0;
                newtop = top - 30 + "px";
            };

            if (soun.isAjaxLoading) return;

            $.ajax({
                type: "get",
                url: '/products/' + handle + '?view=json',

                success: function (data) {
                    $('.ajax-lookbook-modal').css({
                        'left': newleft,
                        'top': newtop
                    });

                    $('.ajax-lookbook-modal .lookbook-content').html(data);

                    soun.translateBlock('.lookbook-content');
                    $('.ajax-lookbook-modal').fadeIn(500);
                },

                error: function (xhr, text) {
                    $('.ajax-error-message').text($.parseJSON(xhr.responseText).description);

                    soun.showModal('.ajax-error-modal');
                }
            });
        },

        doAjaxProductTabs: function (handle, loadingElm, curTabContent) {
            // if (ella.isAjaxLoading) return;

            $.ajax({
                type: "get",
                url: handle,

                beforeSend: function () {
                    loadingElm.text('Loading ... please wait ...');
                },

                success: function (data) {
                    loadingElm.hide();

                    if (handle == '/collections/?view=json') {
                        loadingElm.text('Please link to collections').show();
                    } else {
                        curTabContent.html($(data).find('.grid-items').html());

                        if (!curTabContent.hasClass('slick-initialized')) {
                            soun.initProductTabsSlider(curTabContent.parent());
                        };

                        if (soun.checkNeedToConvertCurrency()) {
                            Currency.convertAll(window.shop_currency, $('#currencies .active').attr('data-currency'), 'span.money', 'money_format');
                        };

                        soun.translateBlock('[data-home-product-tabs]');

                        soun.sounTimeout = setTimeout(function () {
                            if ($('.shopify-product-reviews-badge').length && $('.spr-badge').length) {
                                return window.SPR.registerCallbacks(), window.SPR.initRatingHandler(), window.SPR.initDomEls(), window.SPR.loadProducts(), window.SPR.loadBadges();
                            };
                        }, 1000);
                    };
                },

                error: function (xhr, text) {
                    loadingElm.text('Sorry, there are no products in this collection').show();
                }
            });
        },

        initProductTabsSlider: function (slt) {
            slt.each(function () {
                var self = $(this),
                    productGrid = self.find('.products-grid'),
                    gridItemWidth = productGrid.data('row');

                if (productGrid.not('.slick-initialized') && productGrid.find('.grid-item').length) {
                    productGrid.slick({
                        slidesToShow: productGrid.data('row'),
                        slidesToScroll: productGrid.data('row'),
                        dots: false,
                        infinite: false,
                        speed: 1000,
                        nextArrow: '<button type="button" class="slick-next"><i class="fa fa-angle-right"></i></button>',
                        prevArrow: '<button type="button" class="slick-prev"><i class="fa fa-angle-left"></i></button>',
                        responsive: [
                            {
                                breakpoint: 1200,
                                settings: {
                                    dots: true,
                                    arrows: false,
                                    get slidesToShow() {
                                        if(self.hasClass('sections-has-banner')) {
                                            return this.slidesToShow = 2;
                                        }else {
                                            if(gridItemWidth >= 4) {
                                                return this.slidesToShow = 4;
                                            }else if(gridItemWidth = 3) {
                                                return this.slidesToShow = 3
                                            }else {
                                                return this.slidesToShow = 2
                                            }
                                        }
                                    },
                                    get slidesToScroll() {
                                        if (self.hasClass('sections-has-banner')) {
                                            return this.slidesToScroll = 2;
                                        }else {
                                            if(gridItemWidth >= 4) {
                                                return this.slidesToScroll = 4;
                                            }else if(gridItemWidth = 3) {
                                                return this.slidesToScroll = 3
                                            }else {
                                                return this.slidesToScroll = 2
                                            }
                                        };
                                    }
                                }
                            },
                            {
                                breakpoint: 992,
                                settings: {
                                    dots: true,
                                    arrows: false,
                                    get slidesToShow() {
                                        if(self.hasClass('sections-has-banner')) {
                                            return this.slidesToShow = 2;
                                        }else {
                                            if (gridItemWidth >= 3) {
                                                return this.slidesToShow = 3;
                                            } else {
                                                this.slidesToShow = 2
                                            }
                                        }
                                    },
                                    get slidesToScroll() {
                                        if (self.hasClass('sections-has-banner')) {
                                            return this.slidesToScroll = 2;
                                        }else {
                                            if(gridItemWidth >= 3) {
                                                return this.slidesToScroll = 3;
                                            }else {
                                                return this.slidesToScroll = 2
                                            }
                                        };
                                    }
                                }
                            },
                            {
                                breakpoint: 768,
                                settings: {
                                    slidesToShow: 2,
                                    slidesToScroll: 2,
                                    arrows: false,
                                    dots: true
                                }
                            }
                        ]
                    });
                }
            });
        },

        openEmailModalWindow: function (newsletterWrapper) {
            newsletterWrapper.fadeIn(1000);
        },

        closeEmailModalWindow: function (newsletterWrapper) {
            newsletterWrapper.fadeOut(1000);

            var inputChecked = newsletterWrapper.find('input[name="dismiss"]').prop('checked');

            if (inputChecked || !newsletterWrapper.find('input[name="dismiss"]').length)
                $.cookie('emailSubcribeModal', 'closed', {
                    expires: 1,
                    path: '/'
                });
        },
      

        queryParams: function () {
            Shopify.queryParams = {};

            if (location.search.length) {
                for (var aKeyValue, i = 0, aCouples = location.search.substr(1).split('&'); i < aCouples.length; i++) {
                    aKeyValue = aCouples[i].split('=');

                    if (aKeyValue.length > 1) {
                        Shopify.queryParams[decodeURIComponent(aKeyValue[0])] = decodeURIComponent(aKeyValue[1]);
                    }
                }
            };
        },

        filterAjaxClick: function (baseLink) {
            delete Shopify.queryParams.page;

            var newurl = soun.ajaxCreateUrl(baseLink);

            soun.isSidebarAjaxClick = true;

            History.pushState({
                param: Shopify.queryParams
            }, newurl, newurl);
        },

        ajaxCreateUrl: function (baseLink) {
            var newQuery = $.param(Shopify.queryParams).replace(/%2B/g, '+');

            if (baseLink) {
                if (newQuery != "")
                    return baseLink + "?" + newQuery;
                else
                    return baseLink;
            }
            return location.pathname + "?" + newQuery;
        },
        doAjaxLimitGetContent: function (value) {
            if (soun.isAjaxLoading) return;

            $.ajax({
                type: "Post",
                url: '/cart.js',
                data: {
                    "attributes[pagination]": value
                },

                success: function (data) {
                    window.location.reload();
                },

                error: function (xhr, text) {
                    $('.ajax-error-message').text($.parseJSON(xhr.responseText).description);
                    soun.showModal('.ajax-error-modal');
                },
                dataType: 'json'
            });
        },

        doAjaxToolbarGetContent: function (newurl) {
            if (soun.isAjaxLoading) return;

            $.ajax({
                type: "get",
                url: newurl,

                beforeSend: function () {
                    soun.showLoading();
                },

                success: function (data) {
                    soun.ajaxMapData(data);
                },

                error: function (xhr, text) {
                    $('.ajax-error-message').text($.parseJSON(xhr.responseText).description);
                    soun.showModal('.ajax-error-modal');
                },

                complete: function () {
                    soun.hideLoading();
                }
            });
        },

        doAjaxSidebarGetContent: function (newurl) {
            if (soun.isAjaxLoading) return;

            $.ajax({
                type: "get",
                url: newurl,

                beforeSend: function () {
                    soun.showLoading();
                },

                success: function (data) {
                    soun.ajaxMapData(data);
                },

                error: function (xhr, text) {
                    $('.ajax-error-message').text($.parseJSON(xhr.responseText).description);
                    soun.showModal('.ajax-error-modal');
                },

                complete: function () {
                    soun.hideLoading();
                }
            });
        },

        ajaxMapData: function (data) {
            var curCollTemplate = $('.collection-template'),
                curBreadcrumb = curCollTemplate.find('.breadcrumb'),
                curSidebar = curCollTemplate.find('.sidebar'),
                curCollHeader = curCollTemplate.find('.collection-header'),
                curProColl = curCollTemplate.find('.product-collection'),
                curPadding = curCollTemplate.find('.padding'),

                newCollTemplate = $(data).find('.collection-template'),
                newBreadcrumb = newCollTemplate.find('.breadcrumb'),
                newSidebar = newCollTemplate.find('.sidebar'),
                newCollHeader = newCollTemplate.find('.collection-header'),
                newProColl = newCollTemplate.find('.product-collection'),
                newPadding = newCollTemplate.find('.padding');

            curBreadcrumb.replaceWith(newBreadcrumb);
            curSidebar.replaceWith(newSidebar);
            curCollHeader.replaceWith(newCollHeader);
            curProColl.replaceWith(newProColl);

            if (curPadding.length > 0) {
                curPadding.replaceWith(newPadding);
            } else {
                if(curCollTemplate.find('.col-main').length) {
                    curCollTemplate.find('.col-main').append(newPadding);
                } else {
                    curCollTemplate.find('.col-no-sidebar').append(newPadding);
                }

            };

            soun.translateBlock('.collection-template');

            if ($('[data-view-as]').length) {
                soun.viewModeLayout();
            };

            if (soun.checkNeedToConvertCurrency()) {
                Currency.convertAll(window.shop_currency, $('#currencies .active').attr('data-currency'), 'span.money', 'money_format');
            };

            if ($('.shopify-product-reviews-badge').length && $('.spr-badge').length) {
                return window.SPR.registerCallbacks(), window.SPR.initRatingHandler(), window.SPR.initDomEls(), window.SPR.loadProducts(), window.SPR.loadBadges();
            };
        },


        doAjaxInfiniteScrollingGetContent: function (url) {
            if (soun.isAjaxLoading) return;

            $.ajax({
                type: "get",
                url: url,

                beforeSend: function () {
                    soun.showLoading();
                },

                success: function (data) {
                    soun.ajaxInfiniteScrollingMapData(data);
                    if ($('[data-view-as]').length) {
                        soun.viewModeLayout();
                    };
                },

                error: function (xhr, text) {
                    $('.ajax-error-message').text($.parseJSON(xhr.responseText).description);
                    soun.showModal('.ajax-error-modal');
                },

                complete: function () {
                    soun.hideLoading();
                }
            });
        },

        ajaxInfiniteScrollingMapData: function (data) {
            var collectionTemplate = $('.collection-template'),
                currentProductColl = collectionTemplate.find('.product-collection'),
                newCollectionTemplate = $(data).find('.collection-template'),
                newProductColl = newCollectionTemplate.find('.product-collection'),
                newProductItem = newProductColl.children('.grid-item').not('.banner-img');

            showMoreButton = $('.infinite-scrolling a');

            if (newProductColl.length) {
                currentProductColl.append(newProductItem);

                if ($('.collection-template .product-collection[data-layout]').length) {
                    soun.sounTimeout = setTimeout(function () {
                        currentProductColl.isotope('appended', newProductItem).isotope('layout');
                    }, 700);
                }

                soun.translateBlock('.product-collection');

                if ($(data).find('.infinite-scrolling').length > 0) {
                    showMoreButton.attr('href', newCollectionTemplate.find('.infinite-scrolling a').attr('href'));
                } else {
                    //no more products
                    var noMoreText = window.inventory_text.no_more_product;

                    if (window.multi_lang && translator.isLang2())
                        noMoreText = window.lang2.collections.general.no_more_product;

                    showMoreButton.html(noMoreText).addClass('disabled');
                };

                if (soun.checkNeedToConvertCurrency()) {
                    Currency.convertAll(window.shop_currency, $('#currencies .active').attr('data-currency'), 'span.money', 'money_format');
                };

                if ($('.shopify-product-reviews-badge').length && $('.spr-badge').length) {
                    return window.SPR.registerCallbacks(), window.SPR.initRatingHandler(), window.SPR.initDomEls(), window.SPR.loadProducts(), window.SPR.loadBadges();
                };
            };
        },


        viewModeLayout: function () {
            var viewMode = $('[data-view-as]'),
                viewModeActive = viewMode.find('.icon-mode.active'),
                col = viewModeActive.data('col'),
                products = $('.collection-template .product-collection'),
                gridItem = products.find('.grid-item'),
                strClass = 'col-12 col-6 col-md-4 col-lg-3 col5',
                gridClass = 'grid-2 grid-3 grid-4 grid-5 products-grid products-list';

            switch (col) {
                case 1:
                    if(gridItem.hasClass('grid-item-mansory')) {
                        products.removeClass(gridClass).addClass('products-list');
                    } else {
                        products.removeClass('products-grid').addClass('products-list');
                    }

                    gridItem.removeClass(strClass).addClass('col-12');
                    break;

                default:
                    switch (col) {
                        case 2:
                            if(gridItem.hasClass('grid-item-mansory')) {
                                products.removeClass(gridClass).addClass('products-grid grid-2');
                            } else {
                                products.removeClass('products-list').addClass('products-grid');
                            }
                            gridItem.removeClass(strClass).addClass('col-6');
                            break;

                        case 3:
                            if(gridItem.hasClass('grid-item-mansory')) {
                                products.removeClass(gridClass).addClass('products-grid grid-3');
                            } else {
                                products.removeClass('products-list').addClass('products-grid');
                            }
                            gridItem.removeClass(strClass).addClass('col-6 col-md-4');
                            break;

                        case 4:
                            if(gridItem.hasClass('grid-item-mansory')) {
                                products.removeClass(gridClass).addClass('products-grid grid-4');
                            } else {
                                products.removeClass('products-list').addClass('products-grid');
                            }
                            gridItem.removeClass(strClass).addClass('col-6 col-md-4 col-lg-3');
                            break;

                        case 5:
                            if(gridItem.hasClass('grid-item-mansory')) {
                                products.removeClass(gridClass).addClass('products-grid grid-5');
                            } else {
                                products.removeClass('products-list').addClass('products-grid');
                            }
                            gridItem.removeClass(strClass).addClass('col-6 col-md-4 col-lg-3 col5');
                            break;
                    }
            };
        },

        setActiveViewModeMediaQuery: function () {
            var viewMode = $('[data-view-as]'),
                viewModeActive = viewMode.find('.icon-mode.active'),
                col = viewModeActive.data('col'),
                windowWidth = window.innerWidth;

            if (windowWidth < 768) {
                if (col === 3 || col == 4 || col == 5) {
                    viewModeActive.removeClass('active');
                    $('[data-col="2"]').addClass('active');
                }
            } else if (windowWidth < 992 && windowWidth >= 768) {
                if (col == 4 || col == 5) {
                    viewModeActive.removeClass('active');
                    $('[data-col="3"]').addClass('active');
                }
            } else if (windowWidth < 1200 && windowWidth >= 992) {
                if (col == 5) {
                    viewModeActive.removeClass('active');
                    $('[data-col="4"]').addClass('active');
                }
            }

            if (viewMode.length) {
                soun.viewModeLayout();
            }
        },

        changeQuantityAddToCart: function () {
            var buttonSlt = '[data-minus-quantity], [data-plus-quantity]',
                buttonElm = $(buttonSlt);

            doc.on('click', buttonSlt, function (e) {
                e.preventDefault();
                e.stopPropagation();

                var self = $(this),
                    input = self.siblings('input[name="quantity"]').length > 0 ? self.siblings('input[name="quantity"]') : self.siblings('input[name="group_quantity"]');



                if (input.length < 1) {
                    input = self.siblings('input[name="updates[]"]');
                }

                var val = parseInt(input.val());

                switch (true) {
                    case (self.hasClass('plus')):
                        {
                            val +=1;
                            break;
                        }
                    case (self.hasClass('minus') && val > 0):
                        {
                            val -=1;
                            break;
                        }
                }

                input.val(val);
            });
        },

        expressAjaxAddToCart: function(variant_id, quantity, cartBtn, form) {
            $.ajax({
                type: "post",
                url: "/cart/add.js",
                data: 'quantity=' + quantity + '&id=' + variant_id,
                dataType: 'json',

                beforeSend: function() {
                    window.setTimeout(function() {
                        cartBtn.text(window.inventory_text.adding +"...");
                    }, 100);
                },

                success: function(msg) {
                    window.setTimeout(function() {
                        cartBtn.text(window.inventory_text.thank_you);
                    }, 600);
                    window.setTimeout(function() {
                        cartBtn.text(window.inventory_text.add_more + "...");
                    }, 1000);

                    soun.updateDropdownCart();

                    cartBtn.addClass('add_more');
                    form.next('.feedback-text').text(window.inventory_text.cart_feedback);
                },

                error: function(xhr, text) {
                    $('.ajax-error-message').text($.parseJSON(xhr.responseText).description);
                    soun.showModal('.ajax-error-modal');
                    window.setTimeout(function() {
                        cartBtn.text(window.inventory_text.add_to_cart);
                    }, 400);
                }
            });
        },

        initAddToCart: function () {
            var btnAddToCartSlt = '[data-btn-addToCart]';

            doc.off('click.addToCart', btnAddToCartSlt).on('click.addToCart', btnAddToCartSlt, function (e) {
                e.preventDefault();
                e.stopPropagation();
                var self = $(this);
                var thisForm = $(self.data('form-id'));
                
                var data = thisForm.serialize();

                if (self.attr('disabled') !== "disabled") {
                    var productItem = self.closest('.product-item');

                    if (productItem.length < 1) {
                        var sectionsProduct = self.closest('[data-section-type="product"]');

                        if (!sectionsProduct.length) {
                            sectionsProduct = self.closest('.quickview-tpl');
                        }

                        productItem = sectionsProduct.find('.product-shop');
                    };

                    var form = productItem.find('form'),
                        handle = productItem.find('.product-grid-image').data('collections-related') || sectionsProduct.data('collections-related');

                    // var variant_id = form.find('select[name=id]').val();
                    // if (!variant_id) {
                    //     variant_id = form.find('input[name=id]').val();
                    // };

                    // var quantity = form.find('input[name=quantity]').val();
                    // if (!quantity) {
                    //     quantity = 1;
                    // };

                    switch (window.ajax_cart) {
                        case "none":
                            form.submit();
                            break;

                        case "normal":
                            var title = productItem.find('.product-title').html();
                            var image = productItem.find('.product-grid-image img').attr('src');

                            if(!image) {
                                image = productItem.siblings('.product-photos').find('.slick-current img[id|="product-featured-image"]').attr('src') || productItem.siblings('.product-photos').find('.slick-current img[id|="qv-product-featured-image"]').attr('src');
                            }

                            soun.doAjaxAddToCartNormal(data, title, image);
                            break;

                        
                    };

                }
                return false;
            });

            soun.closeSuccessModal();
        },
      

        changeVariantSelectOption: function() {
            var selectSlt = '[data-select-change-variant]';

            doc.on('change', selectSlt, function() {
                var value = $(this).val(),
                    dataImg = $(this).find('option:selected').data('img'),
                    dataPrice = $(this).find('option:selected').data('price'),
                    parent = $(this).closest('.grouped-product');

                parent.find('input[type=hidden]').val(value);
                parent.find('.product-img img').attr({ src: dataImg });
                parent.find('[data-price-change]').html(Shopify.formatMoney(dataPrice, window.money_format));

                if (soun.checkNeedToConvertCurrency()) {
                    Currency.convertAll(window.shop_currency, $('#currencies .active').attr('data-currency'), '[data-select-change-variant] span.money', 'money_format');
                }
            });
        },

        closeSuccessModal: function () {
            var ajaxCartModal = $('[data-ajax-cart-success], [data-quickview-modal]'),
                closeWindow = ajaxCartModal.find('.close-modal, .continue-shopping'),
                modalContent = ajaxCartModal.find('.halo-modal-content');

            closeWindow.click(function (e) {
                e.preventDefault();

                ajaxCartModal.fadeOut(500, function () {
                    html.removeClass('halo-modal-open');
                    html.css({
                        "overflow": ""
                    });

                    if (body.hasClass('template-cart')) {
                        window.location.reload();
                    }
                });
            });

            ajaxCartModal.on('click', function (e) {
                if (!modalContent.is(e.target) && !modalContent.has(e.target).length) {
                    ajaxCartModal.fadeOut(500, function () {
                        html.removeClass('halo-modal-open');
                        html.css({
                            "overflow": ""
                        });

                        if (body.hasClass('template-cart')) {
                            window.location.reload();
                        }
                    });
                };
            });
        },

        doAjaxAddToCartNormal: function(data, title, image) {
            $.ajax({
                type: "POST",
                url: "/cart/add.js",
                data: data,
                dataType: "json",

                beforeSend: function () {
                    soun.showLoading();
                },

                success: function () {
                    var ajaxCartModal = $('[data-ajax-cart-success]'),
                        modalContent = ajaxCartModal.find('.cart-modal-content');

                    modalContent.find('.ajax-product-title').html(soun.translateText(title));
                    modalContent.find('.ajax-product-image').attr('src', image);
                    modalContent.find('.message-added-cart').show();

                    ajaxCartModal.fadeIn(600, function () {
                        // html.addClass('halo-modal-open'); 

                        if ($('[data-quickview-modal]').is(':visible')) {
                            $('[data-quickview-modal]').hide();
                        }

                        soun.closeLookbookModal();
                    });
                    soun.updateDropdownCart();
                },

                error: function (xhr) {
                    $('.ajax-error-message').text($.parseJSON(xhr.responseText).description);
                    soun.showModal('.ajax-error-modal');
                },

                complete: function () {
                    soun.hideLoading();
                }
            });
        },

        getPopupShoppingCart: function (shouldShowModel, handle) {
            var ajaxCartModal = $('[data-ajax-cart-success]'),
                modalContent = ajaxCartModal.find('.cart-popup-content'),
                collUpsell = ajaxCartModal.find('.cart-popup-coll-related');

            $.get("/cart?view=json", function (data) {
                modalContent.html(data);

                if (shouldShowModel) {
                    if (handle != '/collections/?view=related') {
                        collUpsell.load('' + handle + '');
                    } else {
                        collUpsell.load('/collections/all?view=related');
                    };
                }
            }).always(function () {
                soun.updateDropdownCart();

                soun.sounTimeout = setTimeout(function () {
                    soun.translateBlock('[data-ajax-cart-success]');

                    if ($('.shopify-product-reviews-badge').length && $('.spr-badge').length) {
                        return window.SPR.registerCallbacks(), window.SPR.initRatingHandler(), window.SPR.initDomEls(), window.SPR.loadProducts(), window.SPR.loadBadges();
                    };
                }, 1000);

                if (soun.checkNeedToConvertCurrency()) {
                    Currency.convertAll(window.shop_currency, $('#currencies .active').attr('data-currency'), '[data-ajax-cart-success] span.money', 'money_format');
                }

                if (shouldShowModel) {
                    ajaxCartModal.fadeIn(600, function () {
                        // html.addClass('halo-modal-open');

                        if ($('[data-quickview-modal]').is(':visible')) {
                            $('[data-quickview-modal]').hide();
                        }

                        soun.closeLookbookModal();
                    });
                }
            });
        },

        doAjaxUpdatePopupCart: function (quantity, id) {
            $.ajax({
                type: 'POST',
                url: '/cart/change.js',
                data: {
                    id: id,
                    quantity: quantity
                },
                dataType: 'json',

                beforeSend: function () {
                    soun.showLoading();
                },

                success: function (result) {
                    soun.getPopupShoppingCart(false);
                },

                error: function (xhr) {
                    $('.ajax-error-message').text($.parseJSON(xhr.responseText).description);
                    soun.showModal('.ajax-error-modal');
                },

                complete: function () {
                    soun.hideLoading();
                }
            });
        },

        initChangeQuantityButtonEvent: function () {
            var buttonSlt = '[data-minus-quantity-cart], [data-plus-quantity-cart]',
                buttonElm = $(buttonSlt);

            doc.off('click.updateCart').on('click.updateCart', buttonSlt, function (e) {
                e.preventDefault();
                e.stopPropagation();

                var btn = $(this);
                var id = btn.closest("[data-product-id]").data("product-id");
                var quantity = parseInt(btn.siblings('input[name="quantity"]').val());

                if (btn.hasClass('plus')) {
                    quantity += 1;
                } else {
                    quantity -= 1;
                };

                soun.doAjaxUpdatePopupCart(quantity, id);

            });
        },

        initQuantityInputChangeEvent: function () {
            var quantityIptSlt = '[data-quantity-input]';

            doc.on('change', quantityIptSlt, function () {
                var id = $(this).closest("[data-product-id]").data("product-id"),
                    quantity = parseInt($(this).val());

                soun.doAjaxUpdatePopupCart(quantity, id);
            });
        },

        removeCartItem: function () {
            var removeSlt = '.cart-remove';

            doc.on('click', removeSlt, function (e) {
                e.preventDefault();
                e.stopPropagation();

                var id = $(this).closest("[data-product-id]").data("product-id");

                soun.doAjaxUpdatePopupCart(0, id);
            });
        },

        initSoldOutProductShop: function () {
            var soldProduct = $('.product-shop [data-soldOut-product]');

            if (soldProduct.length) {
                soldProduct.each(function () {
                    var self = $(this);

                    var items = self.data('items').toString().split(","),
                        hours = self.data('hours').toString().split(","),
                        i = Math.floor(Math.random() * items.length),
                        j = Math.floor(Math.random() * hours.length);

                    self.find('.items-count').text(items[i]);
                    self.find('.hours-num').text(hours[j]);
                });
            }
        },

        initCustomerViewProductShop: function () {
            var customerView = $('.product-shop [data-customer-view]');

            if (customerView.length) {
                customerView.each(function () {
                    var self = $(this);

                    setInterval(function () {
                        var views = self.data('customer-view').split(","),
                            i = Math.floor(Math.random() * views.length);

                        self.find('label').text(views[i]);
                    }, 5000);
                });
            }
        },

        initProductMoreview: function (productMoreview) {
            var sliderFor = productMoreview.find('.slider-for'),
                sliderNav = productMoreview.find('.slider-nav'),
                vertical = sliderNav.data('vertical');

            if (!sliderFor.hasClass('slick-initialized') && !sliderNav.hasClass('slick-initialized')) {
                sliderFor.slick({
                    slidesToShow: 1,
                    slidesToScroll: 1,
                    arrows: false,
                    fade: true,
                    asNavFor: sliderNav,
                    adaptiveHeight:true
                });

                sliderNav.slick({
                    infinite: true,
                    slidesToShow: sliderNav.data('rows'),
                    vertical: vertical,
                    slidesToScroll: 1,
                    asNavFor: sliderFor,
                    focusOnSelect: true,
                    nextArrow: '<button type="button" class="slick-next"><svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" id="Layer_1" x="0px" y="0px" viewBox="0 0 17 33" xml:space="preserve"><g id="e4eb89a6-f885-43b8-9259-0d6b1516fab0"><g id="_x38_e584754-6657-46f1-a9d8-2cfd6623b552"><g><polygon points="14.9,14.5 0,0 0,3.7 11.1,14.5 13.2,16.5 11.1,18.5 0,29.3 0,33 14.9,18.5 17,16.5 "/></g></g></g></svg></button>',
                    prevArrow: '<button type="button" class="slick-prev"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 17 33"><g id="7f9a1925-e8c7-4614-8787-3c6095a9f6e1" data-name="Layer 2"><g id="c9b7920a-81fa-4bfe-ad13-4da717c6854b" data-name="Layer 1"><g id="c2d982ff-0cf6-4220-b365-47f30d708fea" data-name="e4eb89a6-f885-43b8-9259-0d6b1516fab0"><g id="f51d455e-6b9c-4c4e-96db-a5004582beda" data-name="8e584754-6657-46f1-a9d8-2cfd6623b552"><polygon points="0 16.5 2.1 18.5 17 33 17 29.3 5.9 18.5 3.8 16.5 5.9 14.5 17 3.7 17 0 2.1 14.5 0 16.5"/></g></g></g></g></svg></button>',
                    responsive: [{
                            breakpoint: 1200,
                            settings: {
                                get dots() {
                                    if (vertical == true) {
                                        return dots = false;
                                    }
                                },
                            }
                        },
                        {
                            breakpoint: 992,
                            settings: {
                                slidesToShow: 4,
                                slidesToScroll: 1,
                                get dots() {
                                    if (vertical == true) {
                                        return dots = false;
                                    }
                                },
                            }
                        },
                        {
                            breakpoint: 768,
                            settings: {
                                slidesToShow: 4,
                                slidesToScroll: 1,
                                get dots() {
                                    if (vertical == true) {
                                        return dots = false;
                                    }
                                },
                            }
                        },
                        {
                            breakpoint: 360,
                            settings: {
                                slidesToShow: 3,
                                slidesToScroll: 1,
                                get dots() {
                                    if (vertical == true) {
                                        return dots = false;
                                    }
                                },
                            }
                        }
                    ]
                });
            };

            if(window.color_swatch_style === "variant_grouped" && window.use_color_swatch) {
                var swatch = productMoreview.closest('[data-more-view-product]').siblings('.product-shop').find('.swatch'),
                    swatchColor = swatch.find('.swatch-element.color'),
                    inputChecked = swatchColor.find(':radio:checked');

                if(inputChecked.length) {
                    var className = inputChecked.data('filter');

                    if(className !== undefined) {
                        sliderNav.slick('slickUnfilter');
                        sliderFor.slick('slickUnfilter');

                        if(sliderNav.find(className).length && sliderFor.find(className).length) {
                            sliderNav.slick('slickFilter', className).slick('refresh');
                            sliderFor.slick('slickFilter', className).slick('refresh');
                        }
                    };
                };
            }
        },

        changeSwatch: function (swatchSlt) {
            doc.on('change', swatchSlt, function () {
                var className = $(this).data('filter');
                var optionIndex = $(this).closest('.swatch').attr('data-option-index');
                var optionValue = $(this).val();

                $(this)
                    .closest('form')
                    .find('.single-option-selector')
                    .eq(optionIndex)
                    .val(optionValue)
                    .trigger('change');

                if(window.color_swatch_style === "variant_grouped" && window.use_color_swatch && className !== undefined) {
                    var productShop = $(swatchSlt).closest('.product-shop');

                    if(productShop.closest('.product-slider').length) {
                        var productImgs = productShop.closest('.product-slider').find('[data-moreview-product-slider]'),
                            sliderFor = productImgs.find('.slider-for');

                        sliderFor.slick('slickUnfilter');

                        if(sliderFor.find(className).length) {
                            sliderFor.slick('slickFilter', className).slick('refresh');
                        }
                    }else {
                        var productImgs = productShop.prev('[data-more-view-product]');

                        if(productImgs.length) {
                            var sliderNav = productImgs.find('.slider-nav'),
                                sliderFor = productImgs.find('.slider-for');

                            sliderNav.slick('slickUnfilter');
                            sliderFor.slick('slickUnfilter');

                            if(sliderNav.find(className).length && sliderFor.find(className).length) {
                                sliderNav.slick('slickFilter', className).slick('refresh');
                                sliderFor.slick('slickFilter', className).slick('refresh');
                            }
                        }
                    }

                }
            });
        },

        productPageInitProductTabs: function () {
            var listTabs = $('.tabs__product-page'),
                tabLink = listTabs.find('[data-tapTop]'),
                tabContent = listTabs.find('[data-TabContent]');

            tabLink.off('click').on('click', function (e) {
                e.preventDefault();
                e.stopPropagation();

                var curTab = $(this),
                    curTabContent = $(curTab.data('target')),
                    ulElm = curTab.closest('.list-tabs');

                if (ulElm.length) {
                    if (!$(this).hasClass('active')) {
                        tabLink.removeClass('active');
                        tabContent.removeClass('active');

                        curTab.addClass('active');
                        ulElm.next().find(curTab.data('target')).addClass('active');
                    }
                } else {
                    if($('.product-template-full-width').length) {
                        if (!$(this).hasClass('active')) {
                            curTab.addClass('active');

                            curTabContent.show(0, function() {
                                $(document.body).trigger("sticky_kit:recalc");
                            });
                        } else {
                            curTab.removeClass('active');

                            curTabContent.hide(0, function() {
                                $(document.body).trigger("sticky_kit:recalc");
                            });
                        };
                    } else if($('.has-sticky-product-img').length) {
                        if (!$(this).hasClass('active')) {
                            curTab.addClass('active');
                            curTabContent.show();
                        } else {
                            curTab.removeClass('active');
                            curTabContent.hide();
                        };
                    } else {
                        if (!$(this).hasClass('active')) {
                            curTab.addClass('active');
                            curTabContent.slideDown();
                        } else {
                            curTab.removeClass('active');
                            curTabContent.slideUp();
                        };
                    }

                };
            });

            var sprBadge = '.product-shop .spr-badge',
                btnReviewSlt = '.product-template-full-width .spr-summary-actions-newreview';

            doc.on('click.triggerTabsReviews', sprBadge, function () {
                if (listTabs.length) {
                    $('html,body').animate({
                        scrollTop: listTabs.offset().top
                    }, 400);

                    var activeTab = listTabs.find('[data-target="#collapse-tab2"]');

                    if (!activeTab.hasClass('active')) {
                        activeTab.trigger('click');
                    }
                };
            });

            if($('.product-template-full-width').length) {
                doc.on('click', btnReviewSlt, function() {
                    $(document.body).trigger("sticky_kit:recalc");
                });
            };
        },

        doAjaxShowQuickView: function (href) {
            if (soun.isAjaxLoading) return;

            $.ajax({
                type: "get",
                url: '/products/' + href + '?view=quickview',

                beforeSend: function () {
                    soun.showLoading();

                    html.css({
                        "overflow": "hidden"
                    });
                },

                success: function (data) {
                    var quickviewModal = $('[data-quickview-modal]'),
                        modalContent = quickviewModal.find('.halo-modal-body');

                    modalContent.html(data);

                    setTimeout(function () {
                        soun.translateBlock('[data-quickview-modal]');
                        soun.initProductMoreview($('[data-more-view-product-qv] .product-img-box'));
                        soun.initSoldOutProductShop();
                        soun.initCustomerViewProductShop();
                        soun.changeSwatch('.quickview-tpl .swatch :radio');
                        soun.initZoom();

                        $.getScript("https://s7.addthis.com/js/300/addthis_widget.js#pubid=ra-595b0ea2fb9c5869")
                            .done(function() {
                                if(typeof addthis !== 'undefined') {
                                    addthis.init();
                                    addthis.layers.refresh();
                                }
                            })

                        if ($('.shopify-product-reviews-badge').length && $('.spr-badge').length) {
                            return window.SPR.registerCallbacks(), window.SPR.initRatingHandler(), window.SPR.initDomEls(), window.SPR.loadProducts(), window.SPR.loadBadges();
                        };
                    }, 500);

                    soun.hideLoading();

                    quickviewModal.fadeIn(600, function () {
                        // html.addClass('halo-modal-open');

                        if ($('[data-ajax-cart-success]').is(':visible')) {
                            $('[data-ajax-cart-success]').hide();
                        }
                    });
                },

                error: function (xhr, text) {
                    $('.ajax-error-message').text($.parseJSON(xhr.responseText).description);
                    soun.hideLoading();
                    soun.showModal('.ajax-error-modal');
                }
            });
        },

        initZoom: function () {
            var zoomElm = $('.product-img-box [data-zoom]');

            if (win.width() >= 1200) {
                zoomElm.zoom();
            } else {
                zoomElm.trigger('zoom.destroy');
            };
        },

        stickyFixedTopMenu: function() {
            if(window.fixtop_menu) {
                if(window.innerWidth >= 1200) {
                    $('[data-sticky-mb]').unstick();

                    setTimeout(
                        function() {
                            $('.site-header').css('height', '');
                            $('[data-sticky-pc]').sticky({
                                zIndex: 3
                            });

                            $('[data-sticky-pc]').on('sticky-start', function() {
                                body.addClass('has_sticky');
                            });

                            $('[data-sticky-pc]').on('sticky-end', function() {
                                body.removeClass('has_sticky');
                            });
                        }, 100
                    );
                } else {
                    $('[data-sticky-pc]').unstick();

                    setTimeout(
                        function() {
                            $('.site-header').css('height', '');
                            $('[data-sticky-mb]').sticky({
                                zIndex: 3
                            });
                        }, 100
                    );
                };
            };
        },

        handleScrollDown: function() {
            var iconSrollDownSlt = '[data-scroll-down]',
                iconSrollDown = $(iconSrollDownSlt);

            iconSrollDown.each(function() {
                var self = $(this);
                var target = self.closest('.shopify-section').next('.shopify-section').attr('id');

                self.attr('href', '#'+ target +'');

                doc.off('click.handleScrollDown', iconSrollDownSlt).on('click.handleScrollDown', iconSrollDownSlt, function(e) {
                    e.preventDefault();

                    var scroll = $(this.getAttribute('href'));

                    if( scroll.length ) {
                        $('html, body').stop().animate({
                            scrollTop: scroll.offset().top
                        }, 500);
                    };
                });
            });
        },

        initStickyAddToCart: function() {
            var blockSticky = $('[data-sticky-add-to-cart]'),
                sltVariantActive = blockSticky.find('.pr-active'),
                variantElm = blockSticky.find('.pr-swatch');

            if(blockSticky.length) {
                var showHideVariantsOptions = function() {
                    sltVariantActive.off('click.showListVariant').on('click.showListVariant', function(e) {
                        e.preventDefault();

                        blockSticky.toggleClass('open-sticky');
                    });

                    doc.off('click.hideVariantsOption').on('click.hideVariantsOption', function(e) {
                        if (!sltVariantActive.is(e.target) && sltVariantActive.has(e.target).length === 0){
                            blockSticky.removeClass('open-sticky');
                        };
                    })
                };

                var handleActiveVariant = function() {
                    variantElm.off('click.activeVar').on('click.activeVar', function(e) {
                        var self = $(this),
                            text = self.text(),
                            value = self.data('value'),
                            newImage = self.data('img');

                        variantElm.removeClass('active');
                        self.addClass('active');
                        blockSticky.toggleClass('open-sticky');

                        blockSticky.find('.action input[type=hidden]').val(value);
                        sltVariantActive.attr('data-value', value).text(text);

                        var swatchNameValue = $('#add-to-cart-form [data-value-sticky="'+value+'"]');

                        swatchNameValue.each(function() {
                            var slt = $(this).data('value');

                            $('[data-value="'+slt+'"]').closest('.swatch').find('#'+slt+'').click();
                        });

                        if(self.hasClass('sold-out')) {
                            blockSticky.find('.sticky-add-to-cart').val(window.inventory_text.sold_out).addClass('disabled').attr('disabled', 'disabled');
                        }else {
                            blockSticky.find('.sticky-add-to-cart').removeClass('disabled').removeAttr('disabled').val(window.inventory_text.add_to_cart);
                        };

                        $('.pr-img img').attr({ src: newImage });

                        return false;
                    });
                };

                var stickyAddToCart = function() {
                    doc.on('click', '[data-sticky-btn-addToCart]', function(e) {
                        e.preventDefault();

                        if($('#add-to-cart-form [data-btn-addToCart]').length) {
                            $('#add-to-cart-form [data-btn-addToCart]').click();
                        } else if($('#add-to-cart-form [data-grouped-addToCart]').length) {
                            $('#add-to-cart-form [data-grouped-addToCart]').click();
                        };

                        return false;
                    });
                };

                var activeVariantSelected = function() {
                    var optionSelected = $('#product-selectors option:selected'),
                        value = optionSelected.val(),
                        stickyActive = blockSticky.find('.pr-swatch[data-value="'+value+'"]'),
                        stickyText = stickyActive.text();

                    sltVariantActive.text(stickyText);
                    stickyActive.addClass('active');

                    var str = stickyActive.data('img');

                    $('.pr-img img').attr({ src: str });

                    $(".swatch .swatch-element").each(function(e) {
                        var idVariant = $(this).find('input:radio').attr('id');

                        $('.swatch input.text[data-value="'+idVariant+'"]').appendTo($(this));
                    });

                    $('.selector-wrapper').change(function() {
                        var n = $("#product-selectors").val();

                        $('.sticky_form .pr-selectors li').each(function(e) {
                            var t = $(this).find('a').data('value');

                            if(t == n){
                                $(this).find('a').addClass('active')
                            } else{
                                $(this).find('a').removeClass('active')
                            }
                        });

                        $("#product-selectors").change(function() {
                            var str = "";

                            $("#product-selectors option:selected").each(function() {
                                str += $(this).data('imge');
                            });

                            $('.pr-img img').attr({ src: str });
                        }).trigger("change");

                        if(variantElm.hasClass('active')) {
                            var h = $('.sticky_form .pr-swatch.active').text();

                            $('.sticky_form .action input[type=hidden]').val(n);
                            sltVariantActive.text(h);
                            sltVariantActive.attr('data-value', n);
                        };
                    });
                };

                var offSetTop = $('#add-to-cart-form .groups-btn').offset().top;

                $(window).scroll(function () {
                    var scrollTop = $(this).scrollTop();

                    if (scrollTop > offSetTop) {
                        body.addClass('show_sticky');
                    }
                    else {
                        body.removeClass('show_sticky');
                    }
                });

                showHideVariantsOptions();
                handleActiveVariant();
                stickyAddToCart();
                activeVariantSelected();
            };
        },


        wrapTable: function(){
            var table = $('.tab-content').find('table');
            if(table.length){
                table.each(function(){
                    $(this).wrap('<div class="table-wrapper"></div>')
                })
            }
        },
        apply_discount: function( discount_code ){
            if(window.bundleMatch){
                $.ajax({
                    url: "/discount/" + discount_code,
                    success: function(response){
                        console.log('Discount code added');
                    }
                });
            }

        },
//       ----------------popup video-----------
      videoProductPopup: function(){
        $( ".video-mp" ).click(function() {
         $(this).parent().find(".modal_cms").addClass("show-modal");
        });

        $( ".modal_cms .header .close-button" ).click(function() {
          $(".modal_cms").removeClass("show-modal");
        });

        $(".modal-cms-overlay").click(function() {
          $(".modal_cms").removeClass("show-modal");
        });
      },
//       -----------scroll link----------
        smoothScrolling: function () {
          $(".header-bottom .site-nav li a, .header-mb nav li a, .custom-block-feature .features-botton a, .banner-parallax .banner-content .banner_left a, .template-product .product-shop .group_item a").off('click.scrollTop').on('click', function(event) {
            if (this.hash !== "") {
              	event.preventDefault();
              var hash = this.hash;
              $('html, body').animate({
                scrollTop: $(hash).offset().top
              }, 1200, function(){
                window.location.hash = hash;
              });
            } // End if
          });
        },
//       ---------------header mobile--------------
      header_mobile:function(){
        $('.header-mb .mn_mobile nav ul').html($('.site-nav').html());

        $('.header-mb .mn_mobile .icon-nav').click(function() {
          //         debugger;
          if($('body').hasClass('open-mn')){
            $('body').removeClass('open-mn');
          }
          else{
            $('body').addClass('open-mn');
          }
        });

        $('.overlay-mn, .close-mm').click(function(){
          $('body').removeClass('open-mn');
        });  
        var w = window.innerWidth;
        if (w <= 1024) {
          $('.top-right .lang-currency-groups').appendTo('.header-mb .language-mobile ');
        }

        $('.header-mb .nav-bar>li  a').click(function(e){
          $('body').removeClass('open-mn');
        });
      },
      openSubmenuMobile:function(){
        $(".header-mb .nav-bar li.dropdown .icon-dropdown").click(function(e){
          $(this).next(".sub-menu-open").removeClass("sub-menu-open");
          $(this).next().addClass("sub-menu-open");
        });
        $(".header-mb .nav-bar li.dropdown .icon-dropdown.back-submenu").click(function(e){
          $(this).parent().parent(".sub-menu-open").removeClass("sub-menu-open");
        });
      }
 };



})(jQuery);
