/**
 * Util class for persisting/retrieving the last loaded locale id from a cookie
 */
Ext.define('nineam.localization.util.Persistence', {
    singleton: true,

    /**
     * Name to use for persisting locale id to cookie
     *
     * @private
     */
    LOCALE_COOKIE_ID: 'nineam.localization.util.Persistence-ExtJS.LOCALE_COOKIE_ID_2',

    /**
     * Retrieve locale Id from cookie
     *
     * @return {String} - The persisted locale Id
     */
    getLocale: function() {
        var regex = new RegExp('(?:^|;)\\s?' + this.LOCALE_COOKIE_ID + '=(.*?)(?:;|$)','i');
        var match = document.cookie.match(regex);
        var value = match ? unescape(match[1]) : null;

        Ext.log({level: 'log'}, 'DEBUG: LocaleManager - Getting persisted locale id: ' + value);

        return value;
    },

    /**
     * Persist locale Id to cookie
     *
     * @param {String} value - the id of the locale to persist
     */
    setLocale: function(value) {
        Ext.log({level: 'log'}, 'DEBUG: LocaleManager - Persisting locale id: ' + value);

        document.cookie = this.LOCALE_COOKIE_ID + "=" + escape(value) + "; expires="+new Date(new Date().getTime()+(1000*60*60*24*365)).toUTCString();
    }
});
