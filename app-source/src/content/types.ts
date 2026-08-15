import type tr from "./tr.json";

type DeepWiden<T> = T extends string
  ? string
  : T extends number
    ? number
    : T extends boolean
      ? boolean
      : T extends readonly (infer Item)[]
        ? DeepWiden<Item>[]
        : T extends object
          ? { [Key in keyof T]: DeepWiden<T[Key]> }
          : T;

export type Dictionary = DeepWiden<typeof tr>;
export type Locale = "tr" | "en" | "de";
export type PageKey = "home" | "technology" | "principles" | "trust" | "about";
