(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.m3uParserGenerator = f()}})(function(){var define,module,exports;return (function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.M3uAttributes = exports.M3uMedia = exports.M3uPlaylist = exports.M3uGenerator = exports.M3uParser = void 0;
var m3u_parser_1 = require("./m3u-parser");
Object.defineProperty(exports, "M3uParser", { enumerable: true, get: function () { return m3u_parser_1.M3uParser; } });
var m3u_generator_1 = require("./m3u-generator");
Object.defineProperty(exports, "M3uGenerator", { enumerable: true, get: function () { return m3u_generator_1.M3uGenerator; } });
var m3u_playlist_1 = require("./m3u-playlist");
Object.defineProperty(exports, "M3uPlaylist", { enumerable: true, get: function () { return m3u_playlist_1.M3uPlaylist; } });
Object.defineProperty(exports, "M3uMedia", { enumerable: true, get: function () { return m3u_playlist_1.M3uMedia; } });
Object.defineProperty(exports, "M3uAttributes", { enumerable: true, get: function () { return m3u_playlist_1.M3uAttributes; } });

},{"./m3u-generator":2,"./m3u-parser":3,"./m3u-playlist":4}],2:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.M3uGenerator = void 0;
const m3u_playlist_1 = require("./m3u-playlist");
/**
 * M3u generator class to generate m3u playlist string from playlist object
 */
class M3uGenerator {
    /**
     * Generate is static method to generate m3u playlist string from playlist object
     * @param playlist - playlist object to generate m3u playlist string
     * @returns final m3u playlist string
     * @example
     * ```ts
     * const playlist = new M3uPlaylist();
     * playlist.title = 'Test playlist';
     * M3uGenerator.generate(playlist);
     * ```
     */
    static generate(playlist) {
        const pls = playlist.title ? `${m3u_playlist_1.M3uDirectives.PLAYLIST}:${playlist.title}` : undefined;
        const medias = playlist.medias.map(item => this.getMedia(item)).join('\n');
        return [m3u_playlist_1.M3uDirectives.EXTM3U, pls, medias].filter(item => item).join('\n');
    }
    /**
     * Get generated media part string from m3u playlist media object
     * @param media - media object
     * @returns media part string with info, group and location each on separated line
     * @private
     */
    static getMedia(media) {
        const attributesString = this.getAttributes(media.attributes);
        const info = this.shouldAddInfoDirective(media, attributesString) ? `${m3u_playlist_1.M3uDirectives.EXTINF}:${media.duration}${attributesString},${media.name}` : null;
        const group = media.group ? `${m3u_playlist_1.M3uDirectives.EXTGRP}:${media.group}` : null;
        return [info, group, media.location].filter(item => item).join('\n');
    }
    /**
     * Get generated attributes media part string from m3u attributes object
     * @param attributes - attributes object
     * @returns attributes generated string (attributeName="attributeValue" ...)
     * @private
     */
    static getAttributes(attributes) {
        const keys = Object.keys(attributes);
        return keys.length ? ' ' + keys.map(key => `${key}="${attributes[key]}"`).join(' ') : '';
    }
    /**
     * Method to determine if we need to add info directive or not based on media object and attributes string.
     * At least media duration, media name or some attributes must be present to return true
     * @param media - m3u media object
     * @param attributesString - m3u attributes string
     * @returns boolean if we should add info directive into final media
     * @private
     */
    static shouldAddInfoDirective(media, attributesString) {
        return media.duration !== m3u_playlist_1.DEFAULT_MEDIA_DURATION || attributesString !== '' || media.name !== undefined;
    }
}
exports.M3uGenerator = M3uGenerator;

},{"./m3u-playlist":4}],3:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.M3uParser = void 0;
const m3u_playlist_1 = require("./m3u-playlist");
/**
 * M3u parser class to parse m3u playlist string to playlist object
 */
class M3uParser {
    /**
     * Get m3u attributes object from attributes string
     * @param attributesString e.g. 'tvg-id="" group-title=""'
     * @returns attributes object e.g. {"tvg-id": "", "group-title": ""}
     * @private
     */
    static getAttributes(attributesString) {
        const attributes = new m3u_playlist_1.M3uAttributes();
        if (!attributesString) {
            return attributes;
        }
        const attributeValuePair = attributesString.split('" ');
        attributeValuePair.forEach((item) => {
            const [key, value] = item.split('="');
            if (value == null) {
                // throw new Error(`Attribute value can't be null!`);
            }
            attributes[key] = value == null ? "" : value.replace('"', '');
        });
        return attributes;
    }
    /**
     * Process media method parse trackInformation and fill media with parsed info
     * @param trackInformation - media substring of m3u string line e.g. '-1 tvg-id="" group-title="",Tv Name'
     * @param media - actual m3u media object
     * @private
     */
    static processMedia(trackInformation, media) {
        const lastCommaIndex = trackInformation.lastIndexOf(',');
        const durationAttributes = trackInformation.substring(0, lastCommaIndex);
        media.name = trackInformation.substring(lastCommaIndex + 1);
        const firstSpaceIndex = durationAttributes.indexOf(' ');
        const durationEndIndex = firstSpaceIndex > 0 ? firstSpaceIndex : durationAttributes.length;
        media.duration = Number(durationAttributes.substring(0, durationEndIndex));
        const attributes = durationAttributes.substring(durationEndIndex + 1);
        media.attributes = this.getAttributes(attributes);
    }
    /**
     * Process directive method detects directive on line and call proper method to another processing
     * @param item - actual line of m3u playlist string e.g. '#EXTINF:-1 tvg-id="" group-title="",Tv Name'
     * @param playlist - m3u playlist object processed until now
     * @param media - actual m3u media object
     * @private
     */
    static processDirective(item, playlist, media) {
        const firstSemicolonIndex = item.indexOf(':');
        const directive = item.substring(0, firstSemicolonIndex);
        const trackInformation = item.substring(firstSemicolonIndex + 1);
        switch (directive) {
            case m3u_playlist_1.M3uDirectives.EXTINF: {
                this.processMedia(trackInformation, media);
                break;
            }
            case m3u_playlist_1.M3uDirectives.EXTGRP: {
                media.group = trackInformation;
                break;
            }
            case m3u_playlist_1.M3uDirectives.PLAYLIST: {
                playlist.title = trackInformation;
                break;
            }
        }
    }
    /**
     * Get playlist returns m3u playlist object parsed from m3u string lines
     * @param lines - m3u string lines
     * @returns parsed m3u playlist object
     * @private
     */
    static getPlaylist(lines) {
        const playlist = new m3u_playlist_1.M3uPlaylist();
        let media = new m3u_playlist_1.M3uMedia('');
        lines.forEach(item => {
            if (this.isDirective(item)) {
                this.processDirective(item, playlist, media);
            }
            else {
                media.location = item;
                playlist.medias.push(media);
                media = new m3u_playlist_1.M3uMedia('');
            }
        });
        return playlist;
    }
    /**
     * Is directive method detect if line contains m3u directive
     * @param item - string line of playlist
     * @returns true if it is line with directive, otherwise false
     * @private
     */
    static isDirective(item) {
        return item[0] === m3u_playlist_1.M3U_COMMENT;
    }
    /**
     * Is valid m3u method detect if first line of playlist contains #EXTM3U directive
     * @param firstLine - first line of m3u playlist string
     * @returns true if line starts with #EXTM3U, false otherwise
     * @private
     */
    static isValidM3u(firstLine) {
        return firstLine[0].startsWith(m3u_playlist_1.M3uDirectives.EXTM3U);
    }
    /**
     * Parse is static method to parse m3u playlist string into m3u playlist object.
     * Playlist need to contain #EXTM3U directive on first line.
     * All lines are trimmed and blank ones are removed.
     * @param m3uString - whole m3u playlist string
     * @returns parsed m3u playlist object
     * @example
     * ```ts
     * const playlist = M3uParser.parse(m3uString);
     * playlist.medias.forEach(media => media.location);
     * ```
     */
    static parse(m3uString) {
        if (!m3uString) {
            throw new Error(`m3uString can't be null!`);
        }
        const lines = m3uString.split('\n').map(item => item.trim()).filter(item => item != '');
        if (!this.isValidM3u(lines)) {
            throw new Error(`Missing ${m3u_playlist_1.M3uDirectives.EXTM3U} directive!`);
        }
        return this.getPlaylist(lines);
    }
}
exports.M3uParser = M3uParser;

},{"./m3u-playlist":4}],4:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.M3uAttributes = exports.M3uMedia = exports.M3uPlaylist = exports.M3uDirectives = exports.DEFAULT_MEDIA_DURATION = exports.M3U_COMMENT = void 0;
const m3u_generator_1 = require("./m3u-generator");
exports.M3U_COMMENT = '#';
exports.DEFAULT_MEDIA_DURATION = -1;
var M3uDirectives;
(function (M3uDirectives) {
    M3uDirectives["EXTM3U"] = "#EXTM3U";
    M3uDirectives["EXTINF"] = "#EXTINF";
    M3uDirectives["PLAYLIST"] = "#PLAYLIST";
    M3uDirectives["EXTGRP"] = "#EXTGRP";
})(M3uDirectives = exports.M3uDirectives || (exports.M3uDirectives = {}));
/**
 * M3u playlist object
 */
class M3uPlaylist {
    constructor() {
        /**
         * Title of playlist
         * @example code
         * ```ts
         * const playlist = new M3uPlaylist();
         * playlist.title = 'Test playlist';
         * ```
         * @example example output in final m3u string
         * ```
         * #PLAYLIST:Test TV
         * ```
         */
        this.title = '';
        /**
         * M3u media objects
         * @example
         * ```ts
         * const playlist = new M3uPlaylist();
         * const media1 = new M3uMedia('http://my-stream-ulr.com/playlist.m3u8');
         * playlist.medias.push(media1);
         * ```
         */
        this.medias = [];
    }
    /**
     * Get m3u string method to get m3u playlist string of current playlist object
     * @returns m3u playlist string
     */
    getM3uString() {
        return m3u_generator_1.M3uGenerator.generate(this);
    }
}
exports.M3uPlaylist = M3uPlaylist;
/**
 * M3u media object
 * @example code example
 * ```ts
 * const media1 = new M3uMedia('http://my-stream-ulr.com/playlist.m3u8');
 * ```
 * @example example output in final m3u string
 * ```
 * #EXTINF:-1 tvg-id="Test tv 1" tvg-country="CZ" tvg-language="CS" tvg-logo="logo1.png" group-title="Test1" unknown="0",Test tv 1 [CZ]
 * #EXTGRP:Test TV group 1
 * http://iptv.test1.com/playlist.m3u8
 * ```
 */
class M3uMedia {
    /**
     * Constructor
     * @param location - location of stream
     */
    constructor(location) {
        this.location = location;
        /**
         * Duration of media. Default value is -1 (infinity).
         */
        this.duration = exports.DEFAULT_MEDIA_DURATION;
        /**
         * Attributes of media. Default value is empty attributes object.
         */
        this.attributes = new M3uAttributes();
    }
}
exports.M3uMedia = M3uMedia;
/**
 * M3u media attributes. Can contains know attributes, or unknown custom user defined.
 * @example
 * ```ts
 * const media1 = new M3uMedia('http://my-stream-ulr.com/playlist.m3u8');
 * media1.attributes = {'tvg-id': '5', 'tvg-language': 'EN', 'unknown': 'my custom attribute'};
 * ```
 */
class M3uAttributes {
}
exports.M3uAttributes = M3uAttributes;

},{"./m3u-generator":2}]},{},[1])(1)
});
