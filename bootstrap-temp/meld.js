// TODO: This should not have path, should be relative to this
require([
  "./bootstrap-temp/meld-system.js",
  "@def.codes/meld-core",
  "@thi.ng/rstream",
], ({ system }, { monotonic_system }, rs) => {
  const { dataset } = system;
  const { defaultGraph, factory } = dataset;

  const TYPE = factory.namedNode("rdf:type");
  const GRAPH = factory.namedNode("rdfg:Graph");

  // or make one, etc
  const root = document.querySelector("#named-graphs");

  const ensure_container = iri => {
    const selector = `[graph="${iri}"]`;
    const existing = root.querySelector(selector);
    if (existing) return existing;
    const container = document.createElement("div");
    container.setAttribute("graph", iri);
    root.appendChild(container);
    return container;
  };

  const p = new Map();
  const systems = new Map();
  const ensure_system = iri => {
    if (systems.has(iri)) return systems.get(iri);
    const dom_root = ensure_container(iri);
    const ports = {
      add_output(name, stream) {
        console.log("ADD_OUTPUT", { name, stream });
        if (stream && !p.has(name)) {
          p.set(name, stream.subscribe(rs.trace(`PORT ${name}`)));
        }
      },
      input_added: rs.stream(),
    };
    const store_name = factory.namedNode(iri);
    console.log(`store_name`, store_name);

    const store = dataset.namedGraph(store_name);
    console.log(`store`, store);

    const system = monotonic_system({ store, dom_root, ports });
    systems.set(iri, system);
    return system;
  };

  defaultGraph
    .addQueryFromSpec({ q: [{ where: [["?s", TYPE, GRAPH]] }] })
    .subscribe({
      next(results) {
        // Assume it's not a blank node
        const iris = Array.from(results, _ => _.s.value);
        for (const iri of iris) {
          const system = ensure_system(iri);
          console.log(`iri, system`, iri, system);
        }
      },
      error(error) {
        console.log(`SOMETHING WRONG in graph query results`, error);
      },
    });

  // Testing.  but where do the graphs init from?
  const some_graph = dataset.create();
  const { namedNode: n, blankNode: b, literal: l } = factory;
  // some_graph.add([n("Alice"), n("loves"), n("Bob")]);
  some_graph.add([n("Alice"), n("hostOutput"), l("Alice")]);
  some_graph.add([n("Bob"), n("hostOutput"), l("Bob")]);
  some_graph.add([n("Alice"), n("hasInterval"), l(5000)]);
  some_graph.add([n("Bob"), n("listensTo"), n("bar")]);
  some_graph.add([n("Bob"), n("transformsWith"), n("foo")]);
  some_graph.add([n("foo"), n("hasRoot"), n("home")]);
  some_graph.add([n("bar"), n("listensTo"), n("Alice")]);
  some_graph.add([
    n("bar"),
    n("mapsWith"),
    l(x => [
      "details",
      {},
      ["summary", {}, ["b", {}, "the state of Alice"]],
      ["p", {}, x, " ticks"],
    ]),
  ]);

  // Every model is a graph, but not every graph is a model
});
