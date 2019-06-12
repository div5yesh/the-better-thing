// support system for simple, rule-based drivers of resource implementations.

// assume this all happens before any userland code
const drivers = [];
const register_driver = driver => drivers.push(driver);

// Helper function for TripleStore to get results of a query immediately.
const sync_query = (store, where) => {
  let results;
  const query = store
    .addQueryFromSpec({
      q: [{ where: where.map(_ => _.map(rstream_variables)) }]
    })
    .subscribe({ next: result_set => (results = result_set) });
  // This is tricky, I think because of cached queries
  // if (query.getState() >= 2 /*DONE*/) query.unsubscribe();
  return results;
};

const rstream_variables = term =>
  term.termType === "Variable" ? `?${term.value}` : term;

const apply_system = store => {
  const registry = new Map();

  const system = {
    assert: fact => store.add(fact),
    query_all: where => sync_query(store, where),
    find: subject => registry.get(subject),
    register(subject, thunk) {
      if (!registry.has(subject)) registry.set(subject, thunk());
    }
  };

  for (const { claims, rules } of drivers) {
    store.into(claims);
    for (const { when, then } of rules) {
      //const where = when.map(_ => _.map(rstream_variables));
      try {
        const results = sync_query(store, when);
        if (results) for (const result of results) then(result, system);
      } catch (error) {
        console.error("problem appying rule: ", error);
      }
    }
    console.log(`done with rules for driver`);
  }
  console.log(`done with drivers`);

  // TRANSITIONAL: I don't really want resources exposed as such
  return { find: system.find };
};

var meld = { apply_system, register_driver };