export const objectKeys = <O extends Object>(obj: O) => Object.keys(obj) as Array<keyof O>;

type EntriesType = [PropertyKey, unknown][] | ReadonlyArray<readonly [PropertyKey, unknown]>;

// Existing Utils
type DeepWritable<OBJ_T> = { -readonly [P in keyof OBJ_T]: DeepWritable<OBJ_T[P]> };
type UnionToIntersection<UNION_T> = // From https://stackoverflow.com/a/50375286
  (UNION_T extends any ? (k: UNION_T) => void : never) extends (k: infer I) => void ? I : never;

// New Utils
type UnionObjectFromArrayOfPairs<ARR_T extends EntriesType> = DeepWritable<ARR_T> extends (infer R)[]
  ? R extends [infer key, infer val]
    ? { [prop in key & PropertyKey]: val }
    : never
  : never;
type MergeIntersectingObjects<ObjT> = { [key in keyof ObjT]: ObjT[key] };
type EntriesToObject<ARR_T extends EntriesType> = MergeIntersectingObjects<UnionToIntersection<UnionObjectFromArrayOfPairs<ARR_T>>>;

export function objectFromEntries<ARR_T extends EntriesType>(arr: ARR_T): EntriesToObject<ARR_T> {
  return Object.fromEntries(arr) as EntriesToObject<ARR_T>;
}
