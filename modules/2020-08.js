define([
  "d3-force",
  "@thi.ng/rstream",
  "@thi.ng/transducers",
  "@def.codes/dom-rules",
  "@def.codes/hdom-regions",
  "./examples/index.js",
], (d3, rs, tx, dom_rules, dp, examples) => {
  const { operations_to_template } = dom_rules;

  const has_type = (thing, type) =>
    thing.a === type || (Array.isArray(thing.a) && thing.a.includes(type));

  const trap_map = () => {
    const map = new Map();
    const has = key => map.has(key);
    const get = key => map.get(key);
    const set = (key, value) => map.set(key, value);
    return { has, get, set };
  };

  const random_point = () => ({
    x: Math.random() * 1000 - 500,
    y: Math.random() * 1000 - 500,
  });

  const datafy_mouse_event = _ => {
    return {
      type: "https://www.w3.org/TR/uievents/#mouseevent",
      timestamp: _.timeStamp,
      x: _.clientX,
      y: _.clientY,
      movementX: _.movementX,
      movementY: _.movementY,
      button: _.button,
      ctrlKey: _.ctrlKey,
      shiftKey: _.shiftKey,
      altKey: _.altKey,
      metaKey: _.metaKey,
    };
  };

  // see node-provenance.md
  const box_simulation_node = (node, id) => {
    // for hidden classes, ensure that objects have a uniform structure.
    const { x, y, vx, vy } = node;
    return Object.create(node, {
      id: { value: id },
      x: { writable: true, value: typeof x === "number" ? x : 0 },
      y: { writable: true, value: typeof y === "number" ? y : 0 },
      vx: { writable: true, value: typeof vx === "number" ? vx : 0 },
      vy: { writable: true, value: typeof vy === "number" ? vy : 0 },
    });
  };

  const make_space = spec => {
    const { id: space_id, sink } = spec;
    const sim = d3.forceSimulation().stop();
    const ticker = rs.subscription();
    const nodes = rs.subscription({ next: sim.nodes });
    const forces = rs.subscription();

    forces.transform(
      tx.sideEffect(force_specs => {
        for (const [force_name, force_spec] of Object.entries(force_specs)) {
          const force_type = force_spec.a.replace(/^d3:/, "");

          if (typeof d3[force_type] === "function") {
            const instance = d3[force_type]();
            sim.force(force_name, instance);
            for (const [param, value_expr] of Object.entries(force_spec)) {
              // skip type indicator
              if (param !== "a") {
                if (typeof instance[param] === "function") {
                  instance[param](value_expr);
                } else {
                  console.warn(
                    `skipping: no such param ${param} on ${force_type}`
                  );
                }
              }
            }
          } else {
            console.warn(`skipping: no such force type: ${force_type}`);
          }
        }
      })
    );

    ticker.transform(
      tx.sideEffect(() => sim.tick()),
      tx.map(() => sim.nodes())
      // tx.sideEffect(nodes => console.log("WUUT", ...nodes))
    );

    const styles_id = `${space_id}.xy-styles`;
    // What you really want is a css assert
    // But (very) non-monotonic
    // Update-in-place, "non-knowledge"
    sink(["dom-assert", space_id, { type: "contains", id: styles_id }]);
    sink(["dom-assert", styles_id, { type: "uses-element", name: "style" }]);

    ticker
      .transform(
        tx.map(nodes => {
          const css = sim
            .nodes()
            .map(_ => {
              const id = `${space_id}.${_.id}`;
              return `
[id="${id}"], [data-x-source="${id}"] { --x:${_.x.toFixed(1)}; }
[id="${id}"], [data-y-source="${id}"] { --y:${-_.y.toFixed(1)}; }
[id="${id}"], [data-vx-source="${id}"] { --vx:${_.vx.toFixed(1)}; }
[id="${id}"], [data-vy-source="${id}"] { --vy:${-_.vy.toFixed(1)}; }
`;
            })
            .join("\n");

          return css;
        }),
        tx.sideEffect(css => {
          sink(["dom-assert", styles_id, { type: "text-is", text: css }]);
        })
      )
      .subscribe({
        error(error) {
          console.error("ERROR IN SPACE STREAM", error);
        },
      });

    // Alpha updates on every frame.  This really should be a stream.  There's
    // no reason to create it if there aren't any subscribers.
    const alpha = ticker.transform(tx.map(() => sim.alpha()));

    const streams = { ticker, nodes, alpha, forces };

    return { streams, sim };
  };

  const TYPES = {
    Sequence: {
      comment:
        "runtime has `Iterable` protocol.  Turtle has list syntax; RDF otherwise strictly unordered",
    },
    Queue: {
      comment:
        "well-known interface.  can has transducer.  async, blocking read/write.",
    },
    "d3:forceManyBody": {},
    "d3:forceX": {},
    "d3:forceY": {},
    WindowingBuffer: {},
    FixedBuffer: { subclassOf: "WindowingBuffer" },
    SlidingBuffer: { subclassOf: "WindowingBuffer" },
    Panel: {},
    XAxis: { dom: [{ matches: '[data-axis="x"]' }] },
    YAxis: { dom: [{ matches: '[data-axis="y"]' }] },
    Person: {
      name: "",
    },
    Collection: {},
    Simulation: {},
    ForceManyBody: {},
    Map: {},
    Stream: {},
    Runner: { comment: "something that runs about" },
    Counter: { comment: "monotonic increment (source, sync, proc)" },
    Sink: {},
    Source: {},
    StreamSync: { subclassOf: "Stream" },
    Space: {
      styles: {},
      "x-axis": { a: "XAxis" },
      "y-axis": { a: "YAxis" },
    },
  };

  function* scan(spec, sink, path = []) {
    if (typeof spec !== "object") {
      // console.warn(`spec of type ${typeof spec} is not supported! ${spec}`);
      return;
    }

    if (Array.isArray(spec)) {
      let i = 0;
      for (const item of spec) yield* scan(item, sink, [...path, i++]);
      return;
    }

    const { a, ...props } = spec;

    const id = path.join(".");
    const name = path[path.length - 1];
    // Would rather something like
    // return { dom: { matches: `[id="${id}"]` } };
    // return { dom: { matches: `[name="${name}"]` } };
    yield* [
      ["dom-assert", id, { type: "attribute-equals", name: "id", value: id }],
      [
        "dom-assert",
        id,
        { type: "attribute-equals", name: "name", value: name },
      ],
    ];

    // Type is the first line of defense
    if (a) {
      if (Array.isArray(a))
        for (const type of a) yield ["assert-type", id, type];
      else yield ["assert-type", id, a];
    } else {
      console.warn("no type in:", ...path, spec);
    }

    for (const [name, child_spec] of Object.entries(props)) {
      const child_path = [...path, name].join(".");
      yield ["dom-assert", id, { type: "contains", id: child_path }];
      yield* scan(child_spec, sink, [...path, name]);
    }

    if (has_type(spec, "Counter")) {
      // well then
      const counter = rs.fromInterval(500);
      // where does the energy come from?
      // the counter can be pull (lazy, non-strict), this is not about time, right?
      const counter_id = [...path, "counter:Process"].join(".");
      yield ["dom-assert", id, { type: "contains", id: counter_id }];
      counter.subscribe({
        next(value) {
          sink([
            "dom-assert",
            counter_id,
            { type: "text-is", text: `${value}!` },
          ]);
        },
      });
      // What does the recipe say about when this thing dies?
    }

    // If it's a space, call Space's elaborate init routine
    if (has_type(spec, "Space")) {
      // This mapping creates a new object that uses the “real” object as its
      // prototype.  This way force (parameter) initializer
      // functions can still read the nodes' at-large properties.
      const nodes = Object.entries(props).map(([id, node]) =>
        box_simulation_node(node, id)
      );
      const space = make_space({ id, sink });
      yield ["new-space", id, space];
      const { streams } = space;
      streams.nodes.next(nodes);
      if (spec["d3:forces"]) streams.forces.next(spec["d3:forces"]);
    }
  }

  function main(recipe) {
    const root = document.getElementById("August-2020-space");

    const dom_process = dp.make_dom_process();
    dom_process.mounted.next({ id: "world", element: root });

    const dom_claims = {};
    const node_streams = {};
    const sims = {};

    const by_id = trap_map();
    const by_type = trap_map();

    function sink([tag, ...args]) {
      if (tag === "dom-assert") {
        const [id, claim] = args;
        if (claim.type === "is") {
          dom_claims[id] = [claim];
        } else {
          // FF actually runs this
          // (dom_claims[id] ??= []).push(claim);
          if (!dom_claims[id]) dom_claims[id] = [];
          dom_claims[id].push(claim);
        }
        // Could create a stream from this
        dom_process.define(id, operations_to_template(dom_claims[id]));
      } else if (tag === "css-assert") {
        try {
          const [claimant, selector, properties] = args;
          const css = `${selector} {
${Object.entries(properties)
  .map(([key, value]) => `${key}:${value};`)
  .join("\n")}
}`;
          // The first two of these don't need to be done each time on each assert
          const ass_id = `${claimant}.css-assertions`;
          sink(["dom-assert", claimant, { type: "contains", id: ass_id }]);
          sink(["dom-assert", ass_id, { type: "uses-element", name: "style" }]);
          sink(["dom-assert", ass_id, { type: "text-is", text: css }]);
        } catch (error) {
          console.log("Problem processing CSS assert");
        }
      } else if (tag === "assert-type") {
        const [id, type] = args;
        if (!type) throw new Error(`type assertion missing object`);

        // Special index by type
        // Again... this could be a subscriber
        // What do you do with this, anyway?
        // Maybe visit all instances when a prototype is updated
        if (!by_type.has(type)) by_type.set(type, new Set());
        by_type.get(type).add(id);

        const type_spec = TYPES[type];
        if (!type_spec) {
          console.warn("I don't know about this type of thing:", type);
        } else {
          // There should be multiple types, and types are live mixins
          // basically prototypes but with protocol composition
          // prototype_props = type_spec;
        }
        sink([
          "dom-assert",
          id,
          { type: "attribute-contains-word", name: "typeof", value: type },
        ]);
      } else if (tag === "new-space") {
        const [id, space] = args;
        const { streams, sim } = space;
        const { ticker, nodes, alpha } = streams;
        node_streams[id] = nodes;
        sims[id] = sim;
        // actually start the simulation
        const forcefield_energy_source = rs.fromRAF();
        forcefield_energy_source.subscribe(ticker);
        alpha.transform(
          // Remember, this threshold is itself a var, i.e. this is a sync node
          // so yeah you can't have any constant, you really need to understand these exprs
          // but how do you do arbitrary, stateful, side-effecting lambdas?
          // yeah and why??
          tx.filter(a => a < 0.1),
          tx.sideEffect(() => forcefield_energy_source.done())
        );
        alpha.subscribe({
          done(value) {
            // Yep, it stops when reaching alpha target
            // console.log("DONE", id, value);
            // What is the disposition of a dead process?  disposal
          },
          next(value) {
            sink([
              "css-assert",
              id,
              `[id="${id}"], [data-simulation-alpha-source="${id}"]`,
              { "--simulation-alpha": value.toFixed(2) },
            ]);
          },
        });
        // remember all this
      } else {
        console.warn("no handler for", tag);
      }
    }

    for (const claim of scan(recipe, sink, ["world"])) sink(claim);

    const mouse_moves = rs.fromEvent(document.body, "mousemove");
    mouse_moves.transform(
      tx.map(datafy_mouse_event),
      tx.sideEffect(record => {
        // assert this record into the graph
        // console.log("yeay", record);
      })
    );
  }

  // TODO: loader should get this at relative path.
  require(["./modules/recipe.js"], ({ RECIPE }) => {
    main(RECIPE);
  });
});
