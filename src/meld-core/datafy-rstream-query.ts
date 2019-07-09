// Implement datafy/nav for `TripleStore` class from `@thi.ng/rstream-query`
// Assumes that the triples are using RDF/JS terms with reference identity.
// This is quasi-RDF/JS in that rstream-query does not (and may never) implement
// the recommended interfaces for Datastore, etc.
import { datafy_protocol, nav_protocol } from "@def.codes/datafy-nav";
import { TripleStore } from "@thi.ng/rstream-query";
import rdf from "@def.codes/rdf-data-model";
import { RDF, Term } from "@def.codes/rdf-data-model";
import { triples_to_object } from "./json-ld-helpers";

// TEMP: hack to mimic Clojure's “protocol extension by metadata”.  To make this
// generic, I'd need to export this symbol with the protocol or otherwise
// uniquely identify it.
const NAV = Symbol.for("nav");

// Collections ontology
const co = "http://purl.org/co/";

// Interestingly, `rstream` at this site redirects to rstream on Github.
const TRIPLESTORE_IRI = "http://thi.ng/rstream-query/TripleStore";

type PseudoTriple = [Term, Term, Term];

const triples_about = (store: TripleStore, subject: Term) =>
  Array.from(store.indexS.get(subject) || [], index => store.triples[index]);

const datafy_subject = (store: TripleStore, subject: Term) =>
  triples_to_object(triples_about(store, subject));

const navize_store = (store: TripleStore) =>
  Object.assign(store, { [NAV]: () => {} });

// Navigate to the selected term.
const navize_terms = (store: TripleStore, terms: Iterable<Term>) =>
  // Assumes this is an ad-hoc collection that we can write metadata to.
  // Doesn't include (or check for) other properties like collection size.
  Object.assign(terms, {
    [NAV]: (_, __, term: Term) => navize_term(store, term)
  });

// Navigate to the selected triple.
const navize_triples = (store: TripleStore) =>
  // This array will always belong to this store, so writing metadata is okay.
  Object.assign(store.triples, {
    [NAV]: (_, __, triple: PseudoTriple) => navize_triple(store, triple)
  });

// Navigate to the selected term as a subject.
const navize_triple = (store: TripleStore, triple: PseudoTriple) =>
  Object.assign([...triple], {
    [NAV]: (_, __, term: Term) => datafy_subject(store, term)
  });

// The term's `value` property navigates to the term as a subject in the store.
const navize_term = (store: TripleStore, term: Term) =>
  // Dilemma.  You can't write metadata to term that is tied to this store,
  // because the term could be used in more than one store.  But you can't clone
  // it, either, because that would break reference identity.
  Object.assign(term /* or {...term} */, {
    [NAV]: (_coll: unknown, key: unknown, value: unknown) =>
      key === "value" && typeof value === "string"
        ? datafy_subject(store, term)
        : value
  });

const datafy_TripleStore = (store: TripleStore) => ({
  "@type": TRIPLESTORE_IRI,
  [`${co}size`]: store.triples.length,
  [`${co}item`]: navize_triples(store),
  [`${RDF}about`]: navize_terms(store, store.indexS.keys())
});

// In Clojure this default implementation is built-in at the top of the
// hierarchy, so implementers can count on it as a fallback.
const default_nav = (_coll, _k, v) => v;

export const extend_TripleStore = {
  datafy() {
    datafy_protocol.extend(TripleStore, datafy_TripleStore);
    datafy_protocol.extend(TRIPLESTORE_IRI, datafy_TripleStore);
  },

  // The child collections of the datafied store are themselves navized, and
  // `nav` should not be called on the plain (non-datafied) object.  See note
  // above.  This can be removed if the default implementation is built in,
  // which I think it should be.
  nav() {
    nav_protocol.extend(TripleStore, default_nav);
    nav_protocol.extend(TRIPLESTORE_IRI, default_nav);
  }
};

// TESTING
export const test = (store: TripleStore, id: string) => {
  return datafy_subject(store, rdf.namedNode(id));
};
