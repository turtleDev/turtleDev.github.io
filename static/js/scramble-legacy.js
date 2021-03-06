/**
 *
 * The MIT License
 *
 * Copyright (c) 2016 Saravjeet 'Aman' Singh
 * <saravjeetamansingh@gmail.com>
 *
 * Permission is hereby granted, free of charge, to any person obtaining a
 * copy of this software and associated documentation files (the "Software"),
 * to deal in the Software without restriction, including without limitation
 * the rights to use, copy, modify, merge, publish, distribute, sublicense,
 * and/or sell copies of the Software, and to permit persons to whom the
 * Software is furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL
 * THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
 * FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER
 * DEALINGS IN THE SOFTWARE.
 *
 */

/**
 * XXX: This is an old, unmainted version of scramble. please use the update version at
 * http://github.com/turtledev/scramblejs
 */

'use strict';

(function(module) {
    var exports = Object.create(null);

    var MIN_FLIP = 1;
    var MAX_FLIP = 7;

    var MIN_INTERVAL = 70;
    var MAX_INTERVAL = 140;

    var MIN_DELAY = 10;
    var MAX_DELAY = 50;

    var chars = [ "a",  "b",  "c",  "d",  "e",  "f",  "g",  "h",  "i",  "j",  "k",  "l",  "m",  "n",  "o",  "p",  "q",  "r",  "s",  "t",  "u",  "v",  "w",  "x",  "y",  "z",  "0",  "1",  "2",  "3",  "4",  "5",  "6",  "7",  "8",  "9",  "0",  "&excl;",  "&quest;",  "&midast;",  "&lpar;",  "&rpar;",  "&commat;",  "&pound",  "&dollar;",  "&percnt;",  "&Hat;",  "&amp;",  "&UnderBar;",  "-",  "&plus;",  "&equals;",  "&lsqb;",  "&rbrack;",  "&lcub;",  "&rcub;",  "&colon;",  "&semi;",  "&bsol;",  "&apos;",  "&QUOT;",  "&VerticalLine;",  "&LT",  "&GT",  "&comma;",  "&period;",  "&sol;",  "~",  "&DiacriticalGrave;",  "&NewLine;", ];

    function newPlaceholder(ch) {
        return "<span data-ch='" + ch + "'>" + ch + "</span>";
    }

    function scaffold(el) {

        if (el.children.length !== 0) {
            return;
        }

        var baseString = el.innerHTML.split('');
        var replacement = "";
        baseString.forEach(function(c) {
            replacement += newPlaceholder(c);
        });

        el.innerHTML = replacement;
        el.className += " js-scramble";
    }

    function _getRandomChar() {
        var index = Math.floor(Math.random() * chars.length);
        return chars[index];
    }

    function getRandomChars(n) {
        /* get a list of n random chars */
        var list = [];
        for ( var i = 0; i < n; ++i ) {
            list.push(_getRandomChar());
        }
        return list;
    }

    function getRandomValue(min, max) {
        /* get a list of random values between min and max */
        return min + Math.floor(Math.random() * (max - min));
    }

    function hasClass(el, cls) {
        return el.className.indexOf(cls) != -1;
    }

    function domListToArray(dl) {
        /* convert DOM list to an Array. Doesn't work for for IE8 or less */
        return [].slice.call(dl, 0);
    }

    function queueAnimation(el, cb) {
        /* cb takes the arguments (el, chars, id) */

        if ( !hasClass(el, "js-scramble") ) {
            scaffold(el);
        }

        var actors = domListToArray(el.children);
        actors.forEach(function(actor) {
            var delay = getRandomValue(MIN_DELAY, MAX_DELAY);
            setTimeout(function() {
                var n = getRandomValue(MIN_FLIP, MAX_FLIP);
                var ch = getRandomChars(n);
                var interval = getRandomValue(MIN_INTERVAL, MAX_INTERVAL);
                setTimeout(function() {
                    cb(actor, ch, interval);
                }, interval);
            }, delay);
        });
    }

    exports.enscramble = function(el) {
        function _enscramble(actor, chars, interval) {
            if ( chars.length == 0 ) return
            actor.innerHTML = chars.pop();
            setTimeout(function() {
                _enscramble(actor, chars, interval);
            }, interval);
        }
        queueAnimation(el, _enscramble);
    }

    exports.descramble = function(el) {
        function _descramble(actor, chars, interval) {
            if ( chars.length == 0 ) {
                actor.innerHTML = actor.dataset.ch;
                return;
            }
            actor.innerHTML = chars.pop();
            setTimeout(function() {
                _descramble(actor, chars, interval);
            }, interval);
        }
        queueAnimation(el, _descramble);
    }

    exports.setText = function(el, text) {

        if ( typeof text != "string" ) {
            console.error("scramble.setText: text must be a string, got: " + typeof text);
            return;
        }

        if ( !hasClass(el, "js-scramble") ) {
            scaffold(el);
        }

        var actors = el.children;
        for ( var i = 0; i < actors.length; ++i ) {
            actors[i].dataset.ch = text[i] || "&nbsp;";
        }
    }

    exports.createEmpty = function(el, length) {

        if ( typeof length != "number" ) {
            console.error("scramble.createEmpty: length must be a number, got: " + typeof length);
            return;
        }

        var components = "";
        for ( var i = 0; i < length; ++ i ) {
            components += newPlaceholder("&nbsp;");
        }

        el.innerHTML = components;

        if ( !hasClass(el, "js-scramble") ) {
            el.className += " js-scramble";
        }
    }

    if ( module.jQuery ) {
        module.jQuery.fn.scramble = function(action, arg) {

            /* get list of selected DOM elements */
            var els = this.get();

            var action = action || "enscramble";
            if ( exports[action] ) {
                els.forEach(function(el) {
                    exports[action](el, arg);
                });
            } else if ( action == "export" ) {
                return exports;
            } else {
                console.error("scramble: unrecognized operation: " + action);
            }

            return this;
        }
    } else {
        module.scramble = exports
    }
})(this)
