/*
  GOAL: Graph interpreter that maintains dom process feeds based on templates.
  
  This is probably two things:
  1. construct template-producing function from assertions
  2. map that content into a dom region/placeholder definition
 */
define([
  "@thi.ng/transducers",
  "@thi.ng/rstream",
  "@thi.ng/associative",
  "@def.codes/rstream-query-rdf",
  "@def.codes/meld-core",
  "./dom-fact-mapping.js",
  "./dom-operations.js",
], ({ map }, rs, { difference }, rdf, { q }, dom_fact, dom_ops) => {
  const { live_query } = rdf;
  const { facts_to_operations } = dom_fact;
  const { operations_to_template } = dom_ops;

  // construct templates from a graph containing representations
  const dom_process_interpreter = ({ representation_graph: graph }) => {
    // Dictionary of (live) template streams for each dom element.
    const streams = new Map();

    // Ensure that there's a template stream IFF there's an element now
    function update_streams(subjects_now) {
      // clean obsolete subs
      for (const [id, sub] of streams)
        if (!subjects_now.has(id)) sub.unsubscribe();

      // add new subs
      for (const id of subjects_now)
        if (!streams.has(id))
          streams.set(
            id,
            graph
              .subject(id)
              .transform(map(facts_to_operations), map(operations_to_template))
          );
    }

    // Stream a set of all the subjects described as dom elements.
    const elements = live_query(graph, q("?ele isa def:DomElement")).transform(
      map(results => new Set(map(_ => _.ele, results)))
    );

    // THIS is really an effect, but returning the streams as a way to convey to client
    const sources = elements.transform(
      map(terms => {
        update_streams(terms);
        return streams;
      })
    );

    // Stream a set of all the subjects described as having a direct container.
    const contained = live_query(graph, q("?x def:contains ?ele")).transform(
      map(results => new Set(map(_ => _.ele, results)))
    );

    const top_level = rs
      .sync({ src: { elements, contained }, mergeOnly: true })
      .transform(map(_ => difference(_.elements, _.contained || new Set())));

    return { sources, top_level };
  };

  return { dom_process_interpreter };
});
