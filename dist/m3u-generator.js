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
