type Dictionary<T> = { [id: string]: T };
type UnionDictionary<K extends string, V> = { [k in K]: V }; // union string literal type as key
type AsInterface<T> = { [K in keyof T]: T[K] };

type Opaque<K, T> = T & { __TYPE__: K };

type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends Array<infer U>
    ? Array<DeepPartial<U>>
    : T[P] extends ReadonlyArray<infer U> ? ReadonlyArray<DeepPartial<U>> : DeepPartial<T[P]>
};

export type TDictionaryValues<T> = T extends Dictionary<infer U> ? U : never;

export type TPrimitive = string | number | boolean | undefined | null;
export type DeepReadonly<T> = T extends TPrimitive
  ? T
  : T extends Array<infer U> ? ReadonlyArray<U> : T extends Function ? T : DeepReadonlyObject<T>;

export type DeepReadonlyObject<T> = { readonly [P in keyof T]: DeepReadonly<T[P]> };
