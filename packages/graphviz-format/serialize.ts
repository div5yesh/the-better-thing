import * as Dot from "./api";
import { assert_unreachable } from "@def.codes/helpers";

const is_subgraph = (o: any): o is Dot.Subgraph => o && o.type === "subgraph";

const escape_string = (s: string) => s.toString().replace(/"/g, `\\"`);

type AttributeContext = "node" | "edge" | "graph" | "subgraph";

const BRACES = /[<>{}| ]/g;

// > Braces, vertical bars and angle brackets must be escaped with a backslash
// > character if you wish them to appear as a literal character. Spaces are
// > interpreted as separators between tokens, so they must be escaped if you
// > want spaces in the text.
//
// “Braces” evidently includes angle brackets.
const escape_field = (s: string | number) =>
  s
    .toString()
    .substring(0, 15)
    .replace(BRACES, "\\$&");

const keyed_record_field = (field: Dot.KeyedRecordField) =>
  `<${field.key}> ${escape_field(field.value)}`;

/** For labels that are inside of another label, i.e. not the topmost. */
const record_field = (field: Dot.RecordLabel) =>
  Array.isArray(field)
    ? `{ ${record_fields(field)} }`
    : typeof field === "object"
    ? keyed_record_field(field)
    : escape_field(field);

const record_fields = (fields: Dot.RecordFields): string =>
  fields.map(record_field).join(" | ");

// https://www.graphviz.org/doc/info/shapes.html#record
const record_label = (value: Dot.RecordLabel) =>
  // The outermost array is not wrapped in braces.
  Array.isArray(value) ? record_fields(value) : record_field(value);

const serialize_attribute = (
  key: string,
  value: any,
  _context?: AttributeContext
) => {
  let item = value;
  // Should include `context === "node" &&` But context is only for the group,
  // so currently you don't know what item is being processed.
  if (key === "label") item = record_label(value);
  return `${key}="${escape_string(item)}"`;
};

function* serialize_attributes(
  attributes: object | undefined,
  target?: AttributeContext
) {
  if (attributes)
    // Ignore null or undefined because it's convenient for conditional expressions
    for (let [key, value] of Object.entries(attributes))
      if (value != null) yield serialize_attribute(key, value, target) + "\n";
}

function* serialize_attribute_block(
  attributes: object | undefined,
  target?: AttributeContext
) {
  if (attributes) {
    yield (target || "") + " [";
    yield* serialize_attributes(attributes);
    yield "]";
  }
}

const serialize_node_id = (id: Dot.NodeId) =>
  typeof id === "string"
    ? `"${escape_string(id)}"`
    : `"${escape_string(id.id)}":"${escape_string(id.port)}"${
        id.compass ? ":" + id.compass : ""
      }`;

function* serialize_node(node: Dot.Node) {
  yield serialize_node_id(node.id);
  yield* serialize_attribute_block(node.attributes);
}

function* serialize_subgraph(
  subgraph: Dot.Subgraph,
  options?: Dot.SerializeOptions
): IterableIterator<string> {
  yield "subgraph " + (subgraph.id ? '"' + subgraph.id + '" ' : "") + "{\n";
  yield* serialize_attributes(subgraph.attributes);
  yield* serialize_statements(subgraph.statements, options);
  yield "}";
}

function* serialize_edge_ref(
  ref: Dot.NodeId | Dot.Subgraph,
  options?: Dot.SerializeOptions
) {
  if (is_subgraph(ref)) yield* serialize_subgraph(ref, options);
  else yield serialize_node_id(ref);
}

function* serialize_edge(edge: Dot.Edge, options?: Dot.SerializeOptions) {
  yield* serialize_edge_ref(edge.from, options);
  yield options && options.directed ? " -> " : " -- ";
  yield* serialize_edge_ref(edge.to, options);
  yield* serialize_attribute_block(edge.attributes);
}

function* serialize_statement(
  statement: Dot.Statement,
  options?: Dot.SerializeOptions
) {
  switch (statement.type) {
    case "node":
      yield* serialize_node(statement);
      yield "\n";
      return;
    case "edge":
      yield* serialize_edge(statement, options);
      yield "\n";
      return;
    case "subgraph":
      yield* serialize_subgraph(statement, options);
      yield "\n";
      return;
  }

  assert_unreachable(statement, "dot statement");
}

function* serialize_statements(
  statements: Dot.StatementList | undefined,
  options?: Dot.SerializeOptions
) {
  if (statements)
    for (const statement of statements)
      yield* serialize_statement(statement, options);
}

function* serialize_lines(graph: Dot.Graph, options?: Dot.SerializeOptions) {
  yield (graph.strict ? "strict " : "") +
    (graph.directed ? "digraph " : "graph ") +
    (graph.id ? graph.id + " " : "") +
    "{\n";

  yield* serialize_attributes(graph.attributes, "graph");

  yield* serialize_attribute_block(graph.graph_attributes, "graph");
  yield* serialize_attribute_block(graph.node_attributes, "node");
  yield* serialize_attribute_block(graph.edge_attributes, "edge");

  yield* serialize_statements(graph.statements, options);
  yield "}";
}

export const serialize_dot = (
  graph: Dot.Graph,
  options?: Dot.SerializeOptions
) =>
  Array.from(
    serialize_lines(graph, { directed: graph.directed, ...options })
  ).join("");
