const { transducers: tx, rstream: rs, hdom } = thi.ng;
const { updateDOM } = thi.ng.transducersHdom;
console.log(`thi.ng`, thi.ng);

const nextID = (function() {
  let id = 0;
  return () => id++;
})();

// const array_as_object = a => tx.reduce(tx.assocObj(), Object.entries(a));
// const ensure_object = x => (Array.isArray(x) ? array_as_object(x) : x);

const FACES = Array.from(
  "aaaaaaaabbbccccdddddeeeeeeeeeeeeffffgggghhhhiiiiiiiijjkklllllllllmmmmmnnnnnnooooooooooppppprrrrrrrsssssssssstttttttuuuuuuuvvwwwxyyyyz"
).concat(["qu", "th", "in", "he"]);

const BOARD_SIZE = { rows: 10, cols: 10 };
const MIN_WORD_LENGTH = 8;
const MAX_WORD_LENGTH = 100;

function* combinations(as, bs) {
  for (let a of as) for (let b of bs) yield [a, b];
}

// this is basically a state machine where each node is a state.
function make_trie() {
  const trie = {};

  return {
    data: trie, // for debug
    add(word) {
      let target = trie;
      for (const letter of word) {
        if (!(letter in target)) target[letter] = { count: 0 };
        target = target[letter];
      }
      target.count++;
    },
    get(word) {
      let target = trie;
      for (const letter of word)
        if (letter in target) target = target[letter];
        else return false;
      return target.count;
    },
    scan: function*(sequence) {
      let target = trie;
      for (const token of sequence) {
        if (target && token in target) target = target[token];
        else target = undefined;
        yield [token, target];
      }
    }
  };
}

const NEIGHBOR_DELTAS = [...combinations([-1, 0, 1], [-1, 0, 1])].filter(
  ([a, b]) => !(a === 0 && b === 0)
);

const between = (x, min, max) => x >= min && x <= max;

const row_of = (size, index) => Math.floor(index / size.cols);
const col_of = (size, index) => index % size.cols;
const index_of = (size, row, col) => row * size.cols + col;

const neighbors_of = (size, row, col) =>
  NEIGHBOR_DELTAS.map(([dr, dc]) => [row + dr, col + dc]).filter(
    ([row, col]) =>
      between(row, 0, size.rows - 1) && between(col, 0, size.cols - 1)
  );
const neighbors_of_index = (size, index) =>
  neighbors_of(size, row_of(size, index), col_of(size, index)).map(
    ([row, col]) => index_of(size, row, col)
  );

function path_search_step(state) {}

function* iterate_paths(graph, queue, should_stop, get_moves) {
  while (queue.length > 0) {
    const path = queue.pop();
    yield path;
    if (!should_stop(path))
      queue.push(...tx.map(next => [...path, next], get_moves(path)));
  }
}

function* iterate_solutions(graph, is_solution, should_stop) {
  const gen = iterate_paths(
    graph,
    Object.keys(graph.nodes).map(n => [n]),
    // graph.nodes.map((_, n) => [n]),
    should_stop,
    path => graph.edges[path[path.length - 1]].filter(id => !path.includes(id))
  );

  for (const path of gen) if (is_solution(path)) yield path;
}

/* display */
/*
function text_display(board) {
  const cubes = board.cubes.slice();
  const parts = [];
  while (cubes.length) parts.push(cubes.splice(0, board.size.cols).join(" "));
  return parts.join("\n");
}
*/

/* board generator */

const random_integer_less_than = n => Math.floor(Math.random() * n);
const random_item_from = array => array[random_integer_less_than(array.length)];

const random_face = () => random_item_from(FACES);
const random_board = size => ({
  nodes: tx.transduce(
    tx.mapIndexed((idx, val) => [idx, val]),
    tx.assocObj(),
    tx.repeatedly(random_face, size.rows * size.cols)
  ),
  edges: tx.transduce(
    tx.map(n => [n, neighbors_of_index(size, n)]),
    tx.assocObj(),
    tx.range(size.rows * size.cols)
  )
});

async function do_it() {
  const words = await fetch("./words.json");
  const WORD_LIST = await words.json();
  const trie = make_trie();
  for (let word of WORD_LIST) trie.add(word);

  const graph = random_board(BOARD_SIZE);
  const uniques = new Set();
  const solutions = [];

  const and = (a, b) => !!(a && b);
  const or = (a, b) => !!(a || b);
  const and_all = (...args) => args.reduce(and);

  const lookup = i => graph.nodes[i];
  const make_word = path => path.map(lookup).join("");
  const is_word = path => trie.get(make_word(path)) > 0;
  // But this is *path* length, not *word* length
  const not_too_long = path => path.length <= MAX_WORD_LENGTH;
  const not_too_short = path => path.length >= MIN_WORD_LENGTH;
  const solution_clauses = [is_word, not_too_long, not_too_short];
  const is_solution = path => and_all(...solution_clauses.map(fn => fn(path)));
  // const is_solution = path => clauses.every(fn => fn(path));

  const is_not_prefix = path => trie.get(make_word(path)) === false;
  const is_max_length = path => path.length >= MAX_WORD_LENGTH;
  // Doesn't short circuit... computes both always
  const should_stop = path => or(is_max_length(path), is_not_prefix(path));

  const all_solutions = [...iterate_solutions(graph, is_solution, should_stop)];

  for (let path of all_solutions) {
    const word = make_word(path);
    if (!uniques.has(word)) {
      uniques.add(word);
      solutions.push([path, word]);
    }
  }

  return { trie, graph, solutions };
}

//=================

const SVGNS = "http://www.w3.org/2000/svg";

function force(container, svg_container, node_view, graph, paths) {
  const sim = d3.forceSimulation().stop();

  const node_dict = graph.nodes;
  const edge_dict = graph.edges;

  const nodes = Object.entries(node_dict).map(([id, value]) => ({ id, value }));

  // I don't like this....
  const by_id = tx.transduce(
    tx.map(node => [node.id, node]),
    tx.assocObj(),
    nodes
  );

  const path_data = ids =>
    ids
      .map((id, i) => `${i > 0 ? "L" : "M"} ${by_id[id].x},${by_id[id].y}`)
      .join(" ");

  const links = [
    ...tx.mapcat(
      ({ id }) =>
        tx.map(
          // I'd rather not use by_id here, but I started getting a "missing: 1"
          // apparently having to do with a mix of string and number indices
          to => ({ source: by_id[id], target: by_id[to] }),
          edge_dict[id] || []
        ),
      nodes
    )
  ];

  sim.nodes(nodes);
  sim.force("center", d3.forceCenter());
  sim.force(
    "charge",
    d3.forceManyBody().strength(node => (node.dragging ? -500 : -200))
    //.distanceMax(250)
    //.theta(0.98)
  );
  // sim.force("x", d3.forceX());
  // sim.force("y", d3.forceY());
  sim.force(
    "grid",
    d3
      .forceLink(links)
      .id(_ => _.id)
      .strength(0.5)
      .iterations(2)
  );

  hdom.renderOnce(
    () => [
      "div",
      tx.map(
        node => ["div.node", { "data-node": node.id }, [node_view, node.value]],
        nodes
      )
    ],
    { root: container }
  );

  const elements = new Map(
    Array.from(nodes, node => [
      node,
      container.querySelector(`[data-node="${node.id}"]`)
    ])
  );

  let search_path = [];
  // const hic2 = ["path.search", {}];
  const search_path_ele = svg_container.appendChild(
    document.createElementNS(SVGNS, "path")
  );
  search_path_ele.classList.add("search", "graph-path");

  const path_eles = new Map();
  for (const path of paths) {
    // const hic = ["path.solution", { d: "" }];
    const path_ele = document.createElementNS(SVGNS, "path");
    path_ele.classList.add("graph-path");
    path_eles.set(path, path_ele);
    svg_container.appendChild(path_ele);
  }

  const link_eles = new Map();
  for (const link of links) {
    const line = document.createElementNS(SVGNS, "line");
    line.classList.add("graph-edge");
    link_eles.set(link, line);
    svg_container.appendChild(line);
  }

  function update_positions(n) {
    for (const [{ source, target }, line] of link_eles.entries()) {
      line.setAttribute("x1", source.x);
      line.setAttribute("y1", source.y);
      line.setAttribute("x2", target.x);
      line.setAttribute("y2", target.y);
    }

    for (const [{ x, y }, ele] of elements.entries()) {
      ele.style.top = `${y}px`;
      ele.style.left = `${x}px`;
    }

    for (const [ids, path] of path_eles.entries())
      path.setAttribute("d", path_data(ids));

    search_path_ele.setAttribute("d", path_data(search_path));
  }

  // const tick_driver = rs.fromRAF();
  const tick_driver = rs.fromInterval(100);
  const ticks = rs.subscription();
  ticks.transform(tx.sideEffect(() => sim.tick()));
  tick_driver.subscribe(ticks);
  ticks.subscribe({ next: update_positions });

  const queue_length_ele = document.getElementById("queue-length");

  const search_queue = Object.keys(graph.nodes).map(v => [v]);
  const paths_sub = rs.fromIterable(
    iterate_paths(
      graph,
      search_queue,
      path => path.length > 3,
      // () => false,
      path => edge_dict[path[path.length - 1]].filter(id => !path.includes(id))
    ),
    1
  );

  let dragging = null;
  rs.fromEvent(container, "mousedown").transform(
    tx.sideEffect(event => {
      event.preventDefault();
      dragging = null;
      const { target } = event;
      const id = target.getAttribute("data-node");
      if (!id) return;
      const node = nodes[id];
      if (!node) return;
      node.dragging = true;
      dragging = {
        node,
        box: event.currentTarget.getBoundingClientRect()
      };
    })
  );
  rs.fromEvent(container, "mousemove").transform(
    tx.sideEffect(event => {
      event.preventDefault();
      if (!dragging) return;
      dragging.node.x = event.x - dragging.box.x;
      dragging.node.y = event.y - dragging.box.y;
      sim.restart();
      tick_driver.next();
    })
  );
  rs.fromEvent(container, "mouseup").transform(
    tx.sideEffect(event => {
      if (dragging) delete dragging.node.dragging;
      dragging = null;
      event.preventDefault();
    })
  );
  rs.fromEvent(container, "mouseleave").transform(
    tx.sideEffect(event => {
      if (dragging) delete dragging.node.dragging;
      dragging = null;
    })
  );

  paths_sub.transform(
    tx.sideEffect(path => {
      search_path = path;
      update_positions();
    }),
    tx.map(() => ["b", {}, search_queue.length.toString()]),
    updateDOM({ root: "queue-length" })
  );
}

(async function() {
  const { trie, graph, solutions } = await do_it();
  console.log(`solutions`, solutions);

  const solution_paths = solutions.map(_ => _[0]);

  const union_graphs = (a, b) => ({
    nodes: { ...a.nodes, ...b.nodes },
    // assumes the graphs have distinct key spaces
    edges: { ...a.edges, ...b.edges }
  });

  const sequence_as_graph_cycle = seq => {
    const nodes = [...seq];
    const ids = nodes.map(nextID);
    return {
      nodes: tx.transduce(
        tx.mapIndexed((index, node) => [ids[index], node]),
        tx.assocObj(),
        nodes
      ),
      edges: tx.transduce(
        tx.map(n => [ids[n], [ids[n < nodes.length - 1 ? n + 1 : 0]]]),
        tx.assocObj(),
        tx.range(nodes.length)
      )
    };
  };

  const sequence_as_graph = seq => {
    const nodes = [...seq];
    const ids = nodes.map(nextID);
    return {
      nodes: tx.transduce(
        tx.mapIndexed((index, node) => [ids[index], node]),
        tx.assocObj(),
        nodes
      ),
      edges: tx.transduce(
        tx.map(n => [ids[n], [ids[n + 1]]]),
        tx.assocObj(),
        tx.range(nodes.length - 1)
      )
    };
  };

  const names = ["Alice", "Bob", "Carol", "Dave", "Elon", "Fran"];
  const node_view = (_, x) => x;

  const examples = [
    {
      name: "boggle",
      label: "boggle with solutions",
      comment: `the full boggle example, with path search`,
      node_view,
      graph,
      paths: solution_paths
    },
    {
      name: "trie-view-level-1",
      label: "trie level one",
      comment: `show the first node of a trie`,
      node_view,
      graph: {
        nodes: {
          root: "root",
          ...tx.transduce(
            tx.map(k => [k, k]),
            tx.assocObj(),
            Object.keys(trie.data)
          )
        },
        edges: { root: Object.keys(trie.data) }
      },
      paths: []
    },
    {
      name: "trie-view-level-2",
      label: "trie level two",
      comment: `show the first two levels of a trie`,
      node_view,
      graph: {
        nodes: {
          root: "root",
          ...tx.transduce(
            tx.map(k => [k, k]),
            tx.assocObj(),
            Object.keys(trie.data).filter(k => k.length === 1)
          ),
          ...tx.transduce(
            tx.map(k => [k, k]),
            tx.assocObj(),
            tx.mapcat(
              k =>
                Object.keys(trie.data[k])
                  .filter(k => k.length === 1)
                  .map(k2 => k + k2),
              Object.keys(trie.data).filter(k => k.length === 1)
            )
          )
        },
        edges: {
          root: Object.keys(trie.data),
          ...tx.transduce(
            tx.map(k => [
              k,
              Object.keys(trie.data[k])
                .filter(k => k.length === 1)
                .map(k2 => k + k2)
            ]),
            tx.assocObj(),
            Object.keys(trie.data).filter(k => k.length === 1)
          )
        }
      },
      paths: []
    },
    {
      name: "trie-prefix-1",
      label: "trie match 1",
      comment: `matching a term against trie`,
      node_view: (_, [token, t]) => [
        "span.trie-node",
        {
          "data-count": t ? t.count : 0,
          "data-is-match": t ? "yes" : "no",
          "data-is-terminal": t && t.count > 0 ? "yes" : "no"
        },
        ["span.token", token],
        " ",
        ["span.count", t ? t.count : ""]
      ],
      graph: union_graphs(
        sequence_as_graph(trie.scan("hello")),
        sequence_as_graph(trie.scan("world"))
      ),
      paths: []
    },
    {
      name: "graph2",
      label: "testing another graph",
      comment: `an example graph`,
      node_view,
      graph: {
        nodes: { a: "Alice", b: "Bob", c: "Carol", d: "Dave" },
        edges: { a: ["b", "c"], b: ["d"] }
      },
      paths: [["a", "d"], ["b", "c", "d"]]
    },
    {
      name: "graph3",
      label: "sequence as graph",
      comment: `turn a sequence into a graph`,
      node_view,
      graph: sequence_as_graph(names),
      paths: []
    },
    {
      name: "graph4",
      label: "sequence as graph cycle",
      comment: `turn a sequence into a loop in a graph`,
      node_view: (_, x) => `#${x}`,
      graph: sequence_as_graph_cycle(tx.range(10)),
      paths: []
    },
    {
      name: "graph5",
      label: "two separate structures on a graph",
      comment: `union of two independent generated sequences`,
      node_view,
      graph: union_graphs(
        // aka graph4
        sequence_as_graph_cycle(tx.range(10)),
        sequence_as_graph(tx.range(20, 25))
      ),
      paths: []
    }
  ];

  const dom_svg_space = (_, { id }) => [
    "div.space",
    { id },
    ["div.html"],
    // is preserveAspectRatio needed?
    //
    // you can use "everything" to apply transforms that wouldn't work (the same
    // way) on svg element itself.  But see .css file.
    ["svg", { preserveAspectRatio: "none" }, ["g.everything"]]
  ];

  const render_example = example => [
    "div.example",
    { id: example.name },
    [
      "div.panes",
      ["div.description", ["h3", example.label], ["p", example.comment]],
      ["figure.representation", {}, [dom_svg_space, { id: example.name }]]
    ]
  ];
  const examples_root = document.getElementById("examples");
  for (const example of examples) {
    const root = examples_root.appendChild(document.createElement("article"));
    hdom.renderOnce(render_example(example), { root });
    const space = root.querySelector(".space");

    const container = root.querySelector(".html");
    const svg_container = space.querySelector(".everything");

    force(
      container,
      svg_container,
      example.node_view,
      example.graph,
      example.paths
    );
  }
})();
