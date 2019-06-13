// representations are about the physical appearance
// but NOT the placement and orientation of a thing
//
// works at the level of individual resources and properties
//
// every FACT is represented as such
// every resource, too
// each has exactly ONE representation
// if you want to see “something” in more than one place,
// it's really two different things
//
// this is not about the DOM.  representation should be
// just data.  that way it can move between layers.
// in fact, it's not even data, but functions
//
// this is where hdom functions are composed
// but not applied
//
// the rule is that all things should have representations
// unless the model specifically dictates otherwise
//
// a representation is implemented by a subscription
// that transforms an object into hiccup

const render_properties = (_, properties) => [
  "div",
  tx.map(
    ([s, p, o]) => [
      "div.Property",
      {
        "data-subject": s.value,
        "data-property": p.value,
        "data-object": o.value
      },
      p
    ],
    properties
  )
];

// given a store and a list of resources, render those resources and their
// (non-node) properties.
const render_resource_nodes = (_, { store, resources }) => {
  const literal_props = tx.transduce(
    // Limit to literal (value) props, as nodes and links are displayed
    // independently.  Allows links to be on separate layer.
    tx.filter(([, , o]) => o.termType === "Literal"),
    tx.groupByMap({ key: ([s]) => s }),
    store.triples
  );

  return [
    "div",
    {},
    tx.map(
      resource => [
        "div",
        {
          "data-thing": resource.value,
          class: [
            "Resource",
            ...tx.map(
              type => type.value,
              all_values_for(store, resource, TYPE) || []
            )
          ].join("  ")
        },
        [
          "div.resource-content",
          {},
          !literal_props.has(resource)
            ? resource.value
            : tx.map(
                ([, p, o]) => [
                  "div",
                  { "data-property": p.value },
                  o.value && o.value.toString()
                ],
                literal_props.get(resource)
              )
        ]
      ],
      resources
    )
  ];
};

const REPRESENTATION_DRIVER = {
  claims: q(
    "Representation isa Class",
    "ResourceRepresentation subclassOf Representation"
  ),

  // EVERYBODY GETS A REPRESENTATION!
  rules: [
    {
      // yeah, kind of.  but what we mean to say is that
      // for all resources, there exists a representation
      // and a representation is a stream, and the stream listens to the resource
      // which in turn has to be provided as a stream
      when: q("?s ?p ?o"),
      then({}, system) {
        const stream = rs.stream();

        const sub = stream_for_resource_and_all_its_properties.transform(
          tx.map(renderer_for_resource)
        );
      }
    }
  ]
};