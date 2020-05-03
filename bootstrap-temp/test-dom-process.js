// Testing dom process usage
define(["./dom-process-new.js", "@thi.ng/rstream"], async (dp, rs) => {
  const timeout = ms => new Promise(resolve => setTimeout(resolve, ms));

  const root = document.querySelector("#dom-process-test");
  const dom_process = dp.make_dom_process(root);
  // dom_process.mounted.subscribe(rs.trace("MOUNTED"));
  // dom_process.content.subscribe(rs.trace("CONTENT"));
  dom_process.content.next({
    id: "def:root/never",
    content: {
      element: "p",
      children: ["Never seen because placeholder never placed"],
    },
  });
  rs.fromInterval(250).subscribe({
    next: value =>
      dom_process.content.next({
        id: "def:some-value",
        content: {
          element: "output",
          children: ["my value is", { element: "b", children: [value] }],
        },
      }),
  });

  dom_process.content.next({
    id: "",
    content: {
      element: "div",
      attributes: {},
      children: [
        {
          element: "header",
          children: [{ element: "h1", children: ["in the beginning"] }],
        },
        { element: "placeholder", attributes: { id: "def:some-value" } },
        { element: "placeholder", attributes: { id: "def:root/bananas" } },
        {
          element: "footer",
          children: [{ element: "q", children: ["and in the end"] }],
        },
      ],
    },
  });
  dom_process.content.next({
    id: "def:root/bananas",
    content: {
      element: "p",
      attributes: { resource: "http:brainstorms" },
      children: ["I ", { element: "i", children: ["loves"] }, " you, Porgy"],
    },
  });
  await timeout(7000);
  dom_process.content.next({
    id: "def:root/bananas",
    content: {
      element: "p",
      attributes: { resource: "http:brainstorms" },
      children: ["I ", { element: "i", children: ["loves"] }, " you, Bess"],
    },
  });
  await timeout(7000);
  dom_process.content.next({
    id: "def:root/bananas",
    content: {
      element: "p",
      attributes: { resource: "http:brainstorms" },
      children: ["I ", { element: "i", children: ["loves"] }, " you, Potato"],
    },
  });
});
