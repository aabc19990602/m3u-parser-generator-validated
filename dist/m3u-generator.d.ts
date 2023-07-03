import { M3uPlaylist } from "./m3u-playlist";
/**
 * M3u generator class to generate m3u playlist string from playlist object
 */
export declare class M3uGenerator {
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
    static generate(playlist: M3uPlaylist): string;
    /**
     * Get generated media part string from m3u playlist media object
     * @param media - media object
     * @returns media part string with info, group and location each on separated line
     * @private
     */
    private static getMedia;
    /**
     * Get generated attributes media part string from m3u attributes object
     * @param attributes - attributes object
     * @returns attributes generated string (attributeName="attributeValue" ...)
     * @private
     */
    private static getAttributes;
    /**
     * Method to determine if we need to add info directive or not based on media object and attributes string.
     * At least media duration, media name or some attributes must be present to return true
     * @param media - m3u media object
     * @param attributesString - m3u attributes string
     * @returns boolean if we should add info directive into final media
     * @private
     */
    private static shouldAddInfoDirective;
}
