const tx = require("@thi.ng/transducers");
const { Graph, from_facts } = require("@def.codes/graphs");
const { has_items } = require("@def.codes/helpers");
const { display } = require("@def.codes/node-web-presentation");
const dot = require("@def.codes/graphviz-format");
const { pipeline } = require("./lib/pipeline");
const { prefix_keys } = require("./lib/clustering");
const { visit_all_factors, visit_prime_factors } = require("./lib/factorize");

const input = { something: ["non", "trivial"] };

const EMPTY_ARRAY = [];
const DEFAULT_MOVES_FROM = () => EMPTY_ARRAY;
const DEFAULT_VALUE_OF = () => {};

function* traverse1(starts, spec, state) {
  state = state || {};
  spec = spec || {};
  const queue = state.queue || (state.queue = []);
  const visited = state.visited || (state.visited = new Set());
  const moves_from = spec.moves_from || DEFAULT_MOVES_FROM;
  const value_of = spec.value_of || DEFAULT_VALUE_OF;
  for (const start of starts) queue.push(start);

  while (has_items(queue)) {
    const subject = queue.pop();
    // conditional yield?
    yield { subject, value: value_of(subject) };
    if (!visited.has(subject))
      for (const [object, data] of moves_from(subject)) {
        yield { subject, object, data };
        queue.push(object);
      }
    visited.add(subject);
  }
}

// this is a sequence you could iterate through
const N = 1184;

const traversal_spec = visit_all_factors;
const traversed = [...traverse1([N], traversal_spec)];
// const constructed = from_facts(tx.map(prefix_keys("NN"), traversed));
const constructed = from_facts(traversed);

const graph = dot.graph({
  directed: false,
  attributes: {
    rankdir: "LR",
    layout: "circo",
    // splines: false,
  },
  statements: [
    {
      type: "subgraph",
      node_attributes: { shape: "circle" },
      statements: [
        ...dot.statements_from_graph(constructed, {
          describe_edge: ([, , label]) => label && { label },
        }),
      ],
    },

    // {
    //   type: "subgraph",
    //   statements: [
    //     dot.object_graph_to_dot_subgraph([
    //       tx.map(prefix_keys("B"), traverse1([N], factor_spec)),
    //     ]),
    //   ],
    // },

    // ...pipeline(32, [all_factorize]),

    // ...pipeline(32, [
    //   // factorize,
    //   function traverse(n) {
    //     return [...traverse1([n], factor_spec)].filter(_ => _.object);
    //   },
    //   from_facts,
    //   function graphviz(graph) {
    //     return [...dot.statements_from_graph(graph)];
    //   },
    // ]),
  ],
});
const { inspect } = require("util");
//console.log(`graph`, inspect(graph, { depth: 8 }));

display(graph);

// from_facts,
// function box(value) {
//   return { value };
// },
// function enumerate(value) {
//   return Object.entries(value);
// },
// shallow_clone,
// deep_clone,
