// fake-localstorage.js
;(function(global, $) {
  
  var cookie = function() {
    function setCookie(name, value, days) {
      days = days || 365
      var expires = ''
      if (days) {
        var date = new Date
        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000))
        expires = '; expires=' + date.toGMTString()
      }
      document.cookie = name + '=' + value + expires + '; path=/'
    }

    function getCookie(name) {
      var nameEQ = name + '='
      var ca = document.cookie.split(';')
      for (var i = 0; i < ca.length; i++) {
        var c = ca[i]
        while (c.charAt(0) == ' ') c = c.substring(1, c.length)
        if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length, c.length)
      }
      return null
    }

    function removeCookie(name) {
      setCookie(name, '', -1);
    }
    return {
      getCookie,
      setCookie,
      removeCookie
    }
  }()
  
  // String.prototype.trim polyfill
  if (!String.prototype.trim) {
    String.prototype.trim = function() {
      var rtrim = /^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g
      return this.replace(rtrim, '')
    }
  }

  function Storage() {
    if (!(this instanceof Storage)) {
      return new Storage
    }
    this.length = 0
    this.key(':)')
  }
  
  Storage.$ = global.$
  Storage.cookie = (Storage.$ && Storage.$.cookie) ? Storage.$.cookie : cookie
  
  Storage.prototype = {
    constructor: Storage,
    getItem: function(name) {
      if (Storage.cookie.get) {
        return Storage.cookie.get(name)
      }
      return Storage.cookie(name)
    },
    setItem: function(name, value, options) {
      var count = 0
      if (typeof Storage.cookie.set === 'function') {
        Storage.cookie.set(name, value, options)
      }
      else if (typeof Storage.cookie === 'function') {
        Storage.cookie(name, value, options)
      }
      this.key()
      for (name in this) {
        if (this.hasOwnProperty(name) && name !== 'length') {
          count += 1
        }
      }
      this.length = count
    },
    removeItem: function(name, options) {
      if (this[name] !== undefined && this.hasOwnProperty(name)) {
        delete this[name]
        this.length -= 1
      }
      if (Storage.cookie.remove) {
        return Storage.cookie.remove(name)
      }
      return Storage.$.removeCookie(name, options)
    },
    key: function() {
      var split = unescape(document.cookie).split(';')
      ,first = split[0]
      ,result = null
      ,count = 0, pair
      for (var i = 0, len = split.length; i < len; i++) {
        pair = split[i].split('=')
        if (pair[0].trim()) {
          this[pair[0].trim()] = pair[1]
          count += 1
        }
      }
      if (name !== undefined && first) {
        result = first.split('=')[0].trim()
      }
      this.length = count
      return result
    },
    clear: function() {
      for (var name in this) {
        if (this.hasOwnProperty(name) && name !== 'length') {
          this.removeItem(name)
        }
      }
    }
  }
  if (typeof global.localStorage === 'undefined') {
    global.localStorage = Storage()
  }
})(window, window.jQuery)
