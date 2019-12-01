import { Value, ValueOrReference, TraversalNode, TraversalState } from "./api";
import { has_items, is_object } from "@def.codes/helpers";

export const is_value = (vr: ValueOrReference): vr is Value =>
  vr !== null && typeof vr === "object" && "value" in vr;

function* enumerate_members<T>(
  sequence: Iterable<T>
): IterableIterator<[number, T]> {
  let i = 0;
  for (const value of sequence) yield [i++, value];
}

export function members_of(o: object): Iterable<[any, any]> {
  if (o instanceof Map) return o.entries();
  // @ts-ignore: Guard doesn't convince TS it's an Iterable.
  if (Symbol.iterator in o) return enumerate_members(o);
  if (typeof o === "object") return Object.entries(o);
  console.warn("members_of: unsupported type", typeof o, o);
  return [];
}

export const is_reference_type = (value: any) =>
  value !== null && (typeof value === "object" || typeof value === "function");

export const empty_traversal_state = (): TraversalState => ({
  indices: new Map<object, number>(),
  traversed: new Set(),
});

export function* depth_first_walk(
  roots: readonly object[],
  { indices, traversed } = empty_traversal_state()
): IterableIterator<TraversalNode> {
  const queue: TraversalNode[] = [];
  const index_of = (o: object) =>
    indices.get(o) ?? indices.set(o, indices.size).size - 1;
  for (const value of roots) queue.push({ value, index: index_of(value) });

  while (has_items(queue)) {
    const node = queue.pop();
    yield node;
    if (is_object(node.value) && !traversed.has(node.value))
      for (const [key, value] of members_of(node.value)) {
        const is_reference_key = is_reference_type(key);
        if (is_reference_key) queue.push({ value: key, index: index_of(key) });
        queue.push({
          value,
          index: index_of(value),
          key: is_reference_key ? { reference: index_of(key) } : { value: key },
          container: node.index,
        });
      }
    traversed.add(node.value);
  }
}

export const walk_object_graph = (roots: readonly object[]) =>
  Array.from(depth_first_walk(roots));
