//  fake-localstorage.js
//  jamesanthony
;(function(global) {
  var cookie = function() {
    function setCookie(name, value, days) {
      days = days || 365
      var expires
      if (days) {
        var date = new Date
        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000))
        expires = '; expires=' + date.toGMTString()
      }
      else expires = ''
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
      get: getCookie,
      set: setCookie,
      remove: removeCookie
    }
  }()
  if (!String.prototype.trim) {
    var rtrim = /^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g
    String.prototype.trim = function() {
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
  Storage.$ = window.$ || window.jQuery
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
      var len = 0
      if (typeof Storage.cookie.set === 'function') {
        Storage.cookie.set(name, value, options)
      }
      else if (typeof Storage.cookie === 'function') {
        Storage.cookie(name, value, options)
      }
      this.key()
      for (name in this) {
        if (this.hasOwnProperty(name) && name !== 'length') {
          len += 1
        }
      }
      this.length = len
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
      var first = split[0]
      var result = null
      var pair
      var count = 0
      for (var i = 0, len = split.length; i < len; i++) {
        pair = split[i].split('=')
        if (pair[0].trim()) {
          this[pair[0].trim()] = pair[1]
          count += 1
        }
      }
      if (name !== undefined) {
        result = first.split('=')[0].trim()
      }
      this.length = count
      return result
    },
    clear: function() {
      var split = unescape(document.cookie).split(';')
      for (var i = 0, len = split.length; i < len; i++) {
        var pair = split[i].split('=')
        this.removeItem(pair[0].trim())
      }
      return
    }
  }
  if (typeof global.localStorage === 'undefined') {
    global.localStorage = Storage()
  }
})(window)
