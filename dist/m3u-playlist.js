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
