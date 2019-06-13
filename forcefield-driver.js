(function() {
  function create_forcefield_dataflow({
    // for scoping of created style rules
    // instead, provide a place to contribute style rules directly?
    // even as objects?
    layer_id,
    // id if the forcefield resource with the associated siulation
    forcefield_id,
    // needed (indirectly) for getting at the created simulation
    // there's got to be a way to avoid this
    model_system,
    // which resources to include in the forcefield
    resources,
    // which properties for which to update positioning rules
    properties,
    // style elements that are targets the the bespoke rule updates
    nodes_style,
    properties_style
  }) {
    // simulation driving a/the FORCEFIELD
    const force_simulation = model_system.transform(
      tx.map(system => system.find(rdf.namedNode(forcefield_id))),
      tx.keep()
    );

    // set the (d3) nodes ARRAY for a/the FORCEFIELD from the identified resources
    // AND broadcast it
    const model_forcefield_nodes = rs
      .sync({ src: { resources, sim: force_simulation } })
      .transform(
        tx.map(({ resources, sim }) => ({
          sim,
          nodes: [...tx.map(({ value }) => ({ id: value }), resources)]
        })),
        tx.sideEffect(({ sim, nodes }) => sim.nodes(nodes)),
        tx.pluck("nodes")
      );

    // const tick_driver = rs.fromRAF();
    const tick_driver = rs.fromInterval(100);
    const ticks = rs.subscription();
    tick_driver.subscribe(ticks);

    // advance FORCEFIELD simulation PROCESS
    rs.sync({ src: { ticks, sim: force_simulation } }).transform(
      tx.sideEffect(({ sim }) => sim.tick())
    );

    // update FORCEFIELD node positions on every tick
    rs.sync({ src: { ticks, nodes: model_forcefield_nodes } }).subscribe({
      next: ({ nodes }) => position_things(nodes_style, layer_id, nodes)
    });

    // index SIMULATION nodes by resource identifier, for property positioning
    const nodes_by_id = model_forcefield_nodes.transform(
      tx.map(nodes =>
        tx.transduce(tx.map(node => [node.id, node]), tx.assocObj(), nodes)
      )
    );

    // passively place link representations from a FORCEFIELD/SIMULATION
    rs.sync({ src: { ticks, nodes_by_id, properties } }).transform(
      tx.map(({ nodes_by_id, properties }) =>
        [
          ...tx.iterator(
            tx.comp(
              tx.map(triple => ({
                layer_id,
                triple,
                source: nodes_by_id[triple[0].value],
                target: nodes_by_id[triple[2].value]
              })),
              tx.filter(_ => _.source && _.target),
              tx.map(property_placement_css)
            ),
            properties
          )
        ].join("\n")
      ),
      tx.sideEffect(css => (properties_style.innerHTML = css))
    );
  }

  // Helper.  Both forces and forcefields use this pattern for setting properties.
  const setter = ({ x, p, v }, { find }) => {
    const instance = find(x);
    const property_name = p.value;
    const value = v.value;
    if (!instance) {
      console.warn(`No such ${x} to assign ${p} = ${v}`);
      return;
    }
    if (typeof instance[property_name] === "function")
      instance[property_name](v.value);
    else console.warn(`No such property ${property_name}`);
  };
  const FORCEFIELD_DRIVER = {
    claims: q(
      "Force isa Class",
      "forceX subclassOf Force",
      "forceY subclassOf Force",
      "hasForce domain Forcefield",
      "hasForce range Force ",
      "hasBodies domain Forcefield ",
      // range is a set of resources
      "forceCenter subclassOf Force",
      "forceManyBody subclassOf Force",
      "forceLink subclassOf Force",
      "forceRadial subclassOf Force",
      "forceCollide subclassOf Force"
    ),
    rules: [
      {
        when: q("?x isa ?type", "?type subclassOf Force"),
        then: ({ x, type }, system) => {
          if (typeof d3[type] === "function")
            system.register(x, () => d3[type]());
          else console.warn(`No such d3 force ${type}`);
        }
      },
      {
        when: q("?x isa Forcefield"),
        then({ x }, _) {
          _.register(x, () => d3.forceSimulation().stop());
        }
      },
      {
        // OR, you could use this to imply that
        // OR... you could actually do both.  that's a different kind of rule
        when: q("?field isa Forcefield", "?field hasForce ?force"),
        then({ field, force }, system) {
          const simulation = system.find(field);
          const force_instance = system.find(force);

          if (!simulation) console.warn(`No such forcefield`, field);
          else if (!simulation.force)
            console.warn(`No force method on`, simulation, "for", field);
          else if (!force_instance)
            console.warn(`No such force`, force, "for", field);
          // assume force is an RDF term so value is its key.  or toString
          else simulation.force(force.value, force_instance);
        }
      },
      {
        // assume bodies is a stream
        when: q("?field hasBodies ?bodies", "?source implements ?bodies"),
        then: ({ field, bodies, source }, system) => {
          const field_instance = system.find(field);
          const bodies_instance = system.find(source);
          bodies_instance.transform(
            tx.map(bodies => Array.from(bodies, body => ({ id: body.value }))),
            tx.sideEffect(nodes => {
              field_instance.nodes(nodes);
            }),
            tx.trace("NODES!!!")
          );
        }
      },
      /* Special “connects” property */
      {
        // let the type be implicit
        // when: q("?force connects ?property"),
        when: q("?force isa forceLink", "?force connects ?property"),
        then({ force, property }, system) {
          const force_instance = system.find(force);

          // Hardcode id accessor.  Userland has no need to get at this, as the id
          // is always tied to the resource name.
          force_instance.id(node => node.id);

          const results = system.query_all(q(`?s ${property.value} ?o`));
          if (results) {
            const links = Array.from(results, ({ s, o }) => ({
              source: s.value,
              target: o.value
            }));
            // TODO: This should not be an issue now
            // HACK: nodes may not be set yet.
            setTimeout(() => force_instance.links(links), 17);
          }
        }
      },

      // TEMP avoid need for logic driver
      // { when: q("?x isa Force", "?x ?p ?v"), then: setter },
      {
        when: q("?x isa ?type", "?type subclassOf Force", "?x ?p ?v"),
        then: setter
      },
      { when: q("?x isa Forcefield", "?x ?p ?v"), then: setter }
    ]
  };

  if (meld) meld.register_driver(FORCEFIELD_DRIVER);
  else console.warn("No meld system found!");
})();
