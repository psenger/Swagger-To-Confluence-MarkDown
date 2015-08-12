/**
 * Created by Philip A Senger on 10/08/15.
 */
var _ = require('lodash');

module.exports = {
    'toUpperCase': function(value) {
        return value ? value.toUpperCase() : '';
    },
    "ifcontains": function (array, object, options) {
        if (array && array.indexOf(object) >= 0) {
            return options.fn(this);
        }
        return options.inverse(this);
    },
    "titleBGColor" : function titleBGColor( value ){
        switch (value.toUpperCase()) {
            case 'DELETE':
                return '#EED4D4';
            case 'GET':
                return '#E7F0F7';
            case 'POST':
                return '#E7F6EC';
            case 'PUT':
                return '#F9F2E9';
            case 'PATCH':
                return '#E4DFEC';
            default:
                return "gray";
        }
    },
    "refLink" : function refLink ( value ) {
        // "#/definitions/Recipes"
        return "[" + value.split("/")[2] + "|" + value + "]"
    },
    "borderColor" : function borderColor( value ){
        switch (value.toUpperCase()) {
            case 'DELETE':
                return '#DCA7A7';
            case 'GET':
                return '#76A9CF';
            case 'POST':
                return '#78CC94';
            case 'PUT':
                return '#D7AA75';
            case 'PATCH':
                return '#CCC1D9';
            default:
                return "gray";
        }
    },
    "anchor": function anchor( object ) {
        return "{anchor:/definitions/" + object + "}"
    },
    "schema" : function schema (  object ) {
        if ( _.includes( ['integer', 'long', 'float', 'double', 'string', 'byte', 'binary', 'boolean', 'date', 'dateTime', 'password'], object.type ) ) {
            if ( object.enum ) {
                var vals;
                var isUnQuoted = _.includes( ['integer', 'long', 'float', 'double', 'byte', 'binary', 'boolean', 'dateTime' ], object.type);
                if ( isUnQuoted ) {
                    vals = object.enum.join(",");
                } else {
                    vals = "'" + object.enum.join("','") + "'";
                }
                var def = "";
                if ( object.default !== undefined ) {
                    def = " default is " + ( ( isUnQuoted ) ? "" : "'" ) + object.default + ( ( isUnQuoted ) ? "" : "'" ) + " ";
                }
                return "*" + object.type + "* &isin; &#91;" + vals + "&#93;" + def;
            } else {
                var fmt = (object.format) ? "( _" + object.format + "_ )" : "";
                return "*" + object.type + "* " + fmt;
            }
        } else if ( 'array' === object.type  ){
            if ( object.$ref || (object.items && object.items.$ref) )  {
                var ref = object.$ref ||  object.items.$ref;
                return "*array* of " + "[" + ref.split("/")[2] + "|" + ref + "]";
            } else if ( object.items && _.includes( ['integer', 'long', 'float', 'double', 'string', 'byte', 'binary', 'boolean', 'date', 'dateTime', 'password'], object.items.type ) ){
                var fmt = (object.items.format) ? "( _" + object.items.format + "_ )" : "";
                return "*array* of " + object.items.type + fmt;
            }
        } else if ( 'object' === object.type  ){
            if ( object.$ref ) {
                return "[" + object.$ref.split("/")[2] + "|" + object.$ref + "]";
                // return "[Object Reference]({{" + object.$ref + "}})";
            } else if ( object.properties ) {
                return "**This object can not be displayed in Confluence until it is made normalized, Please Make a reference**";
            }
        } else if ( object.$ref ) {
            return "[" + object.$ref.split("/")[2] + "|" + object.$ref + "]";
            // return "[Object Reference]({{" + object.$ref + "}})";
        }

        return '';
    }
};
