declare namespace __AdaptedExports {
  /** Exported memory */
  export const memory: WebAssembly.Memory;
  /**
   * src/engine/engine/init
   * @param sr `f32`
   */
  export function init(sr: number): void;
  /**
   * src/engine/engine/render
   * @param frames `i32`
   */
  export function render(frames: number): void;
}
/** Instantiates the compiled WebAssembly module with the given imports. */
export declare function instantiate(module: WebAssembly.Module, imports: {
}): Promise<typeof __AdaptedExports>;
