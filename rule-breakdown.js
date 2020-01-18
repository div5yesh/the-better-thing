// see the stages in the application of rules
const show = require("./lib/thing-to-dot-statements");
const { bind } = require("./lib/graph-templates");
const { dot_notate } = require("./lib/dot-notate");
const { clusters_from } = require("./lib/clustering");

///////////////// DESCRIPTION OF WORK
// name: apply rule once
//
// description: (non-exhaustively?) compute the results of a production rule for
//   a given set of facts.
//
// input:
//   - S: a source RDF graph
//   - R: a production rule (antecedent: graph template, consequent, function)
//
// output: an RDF graph store containing the facts produced by rule R against S
//   (derived from input, so using same bnode space?)
//   OR is the output graph one of the inputs?
//
// invariants:
//
//   - every fact in the resulting graph can be traced to some set of facts that
//     produces it by R.
//
//   - outputs no more new bnodes than necessary
//
// intermediate results:
//   - matches: (records) results of querying antecedent of R against S

//////////////////////////////////// STEP 1: apply antecedent

const { q } = require("@def.codes/meld-core");
const { sync_query, RDFTripleStore } = require("@def.codes/rstream-query-rdf");

const examples = require("./lib/example-graph-pairs");
/// const { target } = examples["The author of Symposium is a student of Socrates"];
const target = q(
  "Bob loves Alice",
  "Alice loves Carol",
  "Carol loves Bob",
  "_:xyz age 31",
  `_:xyz commonName "Fela"`
  // works but shouldn't be in graph generally
  // "?who loves me"
);

const antecedent = q("?s ?p ?o");
// const antecedent = q("?lover loves ?lovee", "?lovee loves ?third");
// const antecedent = q("?lover loves ?lovee");
const source_store = new RDFTripleStore(target);
const matched = sync_query(source_store, antecedent);
console.log(`matched`, matched);

const zipped = Array.from(matched, match => ({ match, template: antecedent }));

const reduced = zipped.reduce((store, { match, template }) => {
  store.import(bind(template, match));
  return store;
}, new RDFTripleStore());

const dot_statements = clusters_from({
  source: dot_notate(source_store.triples).dot_statements,
  source_triples: show.things(source_store.triples).dot_statements,
  antecedent: dot_notate(antecedent).dot_statements,
  matched: show.thing(matched || []).dot_statements,
  zipped: show.thing(zipped || []).dot_statements,
  reduced: dot_notate(reduced.triples).dot_statements,
  reduced_triples: show.thing(reduced.triples || []).dot_statements,
}).map(_ => ({ ..._, attributes: { label: _.id.slice("cluster ".length) } }));

exports.display = { dot_statements };