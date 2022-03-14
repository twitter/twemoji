declare interface TwemojiOptions {
  /**
   * Default: MaxCDN
   */
  base?: string;
  /**
   * Default: .png
   */
  ext?: string;
  /**
   * Default: emoji
   */
  className?: string;
  /**
   * Default: 72x72
   */
  size?: string | number;
  /**
   * To render with SVG use `folder: svg, ext: .svg`
   */
  folder?: string;
  /**
   * The function to invoke in order to generate image src(s).
   */
  callback?(icon: string, options: TwemojiOptions): void;
  /**
   * Default () => ({})
   */
  attributes?(): void;
}

declare type Twemoji = {
  convert: {
    fromCodePoint(hexCodePoint: string): string;
    toCodePoint(utf16surrogatePairs: string): string;
  };
  parse(node: HTMLElement | string, options?: TwemojiOptions): void;
};

declare module 'twemoji' {
  const twemoji: Twemoji;
  export default twemoji;
}
