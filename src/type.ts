import { type TypeTransfroMap } from './table'

export type TrimLeft<Str extends string> = Str extends ` ${infer Rest}`
  ? TrimLeft<Rest>
  : Str
export type TrimRight<Str extends string> = Str extends `${infer Rest} `
  ? TrimRight<Rest>
  : Str
export type Trim<Str extends string> = TrimLeft<TrimRight<Str>>

export type GetType<
  Str extends string,
  Includes extends Object = {},
> = Str extends `${infer Type}[]`
  ? Array<GetType<Type, Includes>>
  : Str extends keyof TypeTransfroMap
    ? TypeTransfroMap[Str]
    : Str extends `*${infer IncloudName}`
      ? IncloudName extends keyof Includes
        ? Includes[IncloudName]
        : never
      : never
