/**
 * Created by Ivan Oliveira
 */
"use strict";

var IvanShoppingCart = (function () {

    var items = [];

    var cartItems = [];

    var numberOfItemsInCart = 0;

    var total = 0.00;


    //Public methods
    var getTotal = function() {

        return parseFloat(total).toFixed(2);

    }


    var LoadJson = function () {

        $.ajax({

            url: "js/data.json",

            dataType: "text",

            success: function(data) {

                items = $.parseJSON(data);

                items = items['products'];

                $.each(items, function(i){

                    _appendToHTML(i);

                });

                _registerClicks();

            }

        });

    };



    //Private methods
    var _appendToHTML = function(i) {

        var elem =  '<div class="item">' +
                    '    <div class="image">' +
                    '        <img src="' + items[i].image_url + '" alt="' + items[i].title + ' cover" />' +
                    '    </div>' +
                    '    <div class="title-and-price">' +
                    '        <span class="title">' + items[i].title + '</span>' +
                    '        <span class="price">&pound;' + items[i].price + '</span>' +
                    '    </div>' +
                    '    <div class="description-and-add">' +
                    '        <span class="description">' + items[i].description + '</span>' +
                    '        <span class="add"><a href="' + i + '" class="button additem">Add to cart</a></span>' +
                    '    </div>' +
                    '</div>';

        $('#items').append(elem);

    };


    var _registerClicks = function() {

        $('.add a').bind("click", function(e){

            e.preventDefault();

            _addItemToCart(parseInt($(this).attr('href')));

        });

        $('a[name=view-cart]').click(function(e) {

            e.preventDefault();

            if(cartItems.length > 0) {

                _showItemsInCart();

                var id = $(this).attr('href');

                var H = $(window).height();
                var W = $(window).width();

                $(id).css('top',  H/2-$(id).height()/2);
                $(id).css('left', W/2-$(id).width()/2);

                $('#mask').css({ 'display' : 'block', opacity : 0});
                $('#mask').fadeTo(500, 0.5);
                $(id).fadeIn(500);
            }

        });

        $('.close').click(function (e) {

            e.preventDefault();

            $('.cart-window').fadeOut(500);
            $('#mask').fadeOut(500);

        });

    }


    var _addItemToCart = function(id) {

        var index = -1;

        $.each(cartItems, function(i){

            if(cartItems[i]['id'] == id){

                index = i;

            }

        });

        if(index >= 0){

            cartItems[index]['amount'] += 1;

        } else {

            cartItems.push({id: id, amount: 1, price: items[id]['price']});

            index = cartItems.length - 1;

        }

        _updateTotal(cartItems[index]['price']);

    }


    var _showItemsInCart = function() {

        var _items = '';

        $.each(cartItems, function(i){
            _items += '<div class="item cf">' +
                      '    <div class="image">' +
                      '        <img src="' + items[cartItems[i]['id']]['image_url'] + '" />' +
                      '    </div>' +
                      '    <div class="title-and-quantity">' +
                      '        <div class="title">' + items[cartItems[i]['id']]['title'] + '</div>' +
                      '        <div class="quantity">Quantity: ' + cartItems[i]['amount'] + '</div>' +
                      '    </div>' +
                      '    <div class="subtotal">&pound;' + (parseFloat(cartItems[i]['price']) * parseInt(cartItems[i]['amount'])).toFixed(2) + '</div>' +
                      '</div>';
        })

        _items += '<div id="total-price">' +
                  '    <span class="label">Total</span>' +
                  '    <span class="value"></span>' +
                  '</div>';

        $("#cart-statement").html(_items);

        $("#total-price .value").html('&pound' + getTotal());

    }


    //Helpers
    var _updateTotal = function(value) {

        total += parseFloat(value);

        numberOfItemsInCart += 1;

        if(numberOfItemsInCart == 0 || numberOfItemsInCart > 1) {

            $("#number-of-items").html(numberOfItemsInCart + ' items');

        } else {

            $("#number-of-items").html(numberOfItemsInCart + ' item');

        }

        $('#cart-items #total').html('&pound;' + getTotal());

    }



    return {
        LoadJson:       LoadJson,
        getTotal:       getTotal()
    }
})();


$(document).ready(function() {

    IvanShoppingCart.LoadJson();

});