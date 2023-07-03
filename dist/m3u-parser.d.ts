import { M3uPlaylist } from "./m3u-playlist";
/**
 * M3u parser class to parse m3u playlist string to playlist object
 */
export declare class M3uParser {
    /**
     * Get m3u attributes object from attributes string
     * @param attributesString e.g. 'tvg-id="" group-title=""'
     * @returns attributes object e.g. {"tvg-id": "", "group-title": ""}
     * @private
     */
    private static getAttributes;
    /**
     * Process media method parse trackInformation and fill media with parsed info
     * @param trackInformation - media substring of m3u string line e.g. '-1 tvg-id="" group-title="",Tv Name'
     * @param media - actual m3u media object
     * @private
     */
    private static processMedia;
    /**
     * Process directive method detects directive on line and call proper method to another processing
     * @param item - actual line of m3u playlist string e.g. '#EXTINF:-1 tvg-id="" group-title="",Tv Name'
     * @param playlist - m3u playlist object processed until now
     * @param media - actual m3u media object
     * @private
     */
    private static processDirective;
    /**
     * Get playlist returns m3u playlist object parsed from m3u string lines
     * @param lines - m3u string lines
     * @returns parsed m3u playlist object
     * @private
     */
    private static getPlaylist;
    /**
     * Is directive method detect if line contains m3u directive
     * @param item - string line of playlist
     * @returns true if it is line with directive, otherwise false
     * @private
     */
    private static isDirective;
    /**
     * Is valid m3u method detect if first line of playlist contains #EXTM3U directive
     * @param firstLine - first line of m3u playlist string
     * @returns true if line starts with #EXTM3U, false otherwise
     * @private
     */
    private static isValidM3u;
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
    static parse(m3uString: string): M3uPlaylist;
}
