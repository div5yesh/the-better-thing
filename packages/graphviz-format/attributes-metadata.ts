// Transformed from http://graphviz.org/doc/info/attrs.html
// This is a literally-typed value that is used to compute special types.
// This can also be (but is not currently) used to refine serialization.
export const ATTRIBUTES_METADATA = {
  Damping: {
    used_by: ["G"],
    types: ["double"],
    default: "0.99",
    minimum: "0.0",
    notes: "neato only",
  },
  K: {
    used_by: ["G", "C"],
    types: ["double"],
    default: "0.3",
    minimum: "0",
    notes: "sfdp, fdp only",
  },
  URL: {
    used_by: ["E", "N", "G", "C"],
    types: ["escString"],
    default: "<none>",
    minimum: "",
    notes: "svg, postscript, map only",
  },
  _background: {
    used_by: ["G"],
    types: ["string"],
    default: "<none>",
    minimum: "",
    notes: "",
  },
  area: {
    used_by: ["N", "C"],
    types: ["double"],
    default: "1.0",
    minimum: ">0",
    notes: "patchwork only",
  },
  arrowhead: {
    used_by: ["E"],
    types: ["arrowType"],
    default: "normal",
    minimum: "",
    notes: "",
  },
  arrowsize: {
    used_by: ["E"],
    types: ["double"],
    default: "1.0",
    minimum: "0.0",
    notes: "",
  },
  arrowtail: {
    used_by: ["E"],
    types: ["arrowType"],
    default: "normal",
    minimum: "",
    notes: "",
  },
  bb: {
    used_by: ["G"],
    types: ["rect"],
    default: "",
    minimum: "",
    notes: "write only",
  },
  bgcolor: {
    used_by: ["G", "C"],
    types: ["color", "colorList"],
    default: "<none>",
    minimum: "",
    notes: "",
  },
  center: {
    used_by: ["G"],
    types: ["bool"],
    default: "false",
    minimum: "",
    notes: "",
  },
  charset: {
    used_by: ["G"],
    types: ["string"],
    default: '"UTF-8"',
    minimum: "",
    notes: "",
  },
  clusterrank: {
    used_by: ["G"],
    types: ["clusterMode"],
    default: "local",
    minimum: "",
    notes: "dot only",
  },
  color: {
    used_by: ["E", "N", "C"],
    types: ["color", "colorList"],
    default: "black",
    minimum: "",
    notes: "",
  },
  colorscheme: {
    used_by: ["E", "N", "C", "G"],
    types: ["string"],
    default: '""',
    minimum: "",
    notes: "",
  },
  comment: {
    used_by: ["E", "N", "G"],
    types: ["string"],
    default: '""',
    minimum: "",
    notes: "",
  },
  compound: {
    used_by: ["G"],
    types: ["bool"],
    default: "false",
    minimum: "",
    notes: "dot only",
  },
  concentrate: {
    used_by: ["G"],
    types: ["bool"],
    default: "false",
    minimum: "",
    notes: "",
  },
  constraint: {
    used_by: ["E"],
    types: ["bool"],
    default: "true",
    minimum: "",
    notes: "dot only",
  },
  decorate: {
    used_by: ["E"],
    types: ["bool"],
    default: "false",
    minimum: "",
    notes: "",
  },
  defaultdist: {
    used_by: ["G"],
    types: ["double"],
    default: "1+(avg. len)*sqrt(|V|)",
    minimum: "epsilon",
    notes: "neato only",
  },
  dim: {
    used_by: ["G"],
    types: ["int"],
    default: "2",
    minimum: "2",
    notes: "sfdp, fdp, neato only",
  },
  dimen: {
    used_by: ["G"],
    types: ["int"],
    default: "2",
    minimum: "2",
    notes: "sfdp, fdp, neato only",
  },
  dir: {
    used_by: ["E"],
    types: ["dirType"],
    default: "forward(directed) none(undirected)",
    minimum: "",
    notes: "",
  },
  diredgeconstraints: {
    used_by: ["G"],
    types: ["string", "bool"],
    default: "false",
    minimum: "",
    notes: "neato only",
  },
  distortion: {
    used_by: ["N"],
    types: ["double"],
    default: "0.0",
    minimum: "-100.0",
    notes: "",
  },
  dpi: {
    used_by: ["G"],
    types: ["double"],
    default: "96.0 0.0",
    minimum: "",
    notes: "svg, bitmap output only",
  },
  edgeURL: {
    used_by: ["E"],
    types: ["escString"],
    default: '""',
    minimum: "",
    notes: "svg, map only",
  },
  edgehref: {
    used_by: ["E"],
    types: ["escString"],
    default: '""',
    minimum: "",
    notes: "svg, map only",
  },
  edgetarget: {
    used_by: ["E"],
    types: ["escString"],
    default: "<none>",
    minimum: "",
    notes: "svg, map only",
  },
  edgetooltip: {
    used_by: ["E"],
    types: ["escString"],
    default: '""',
    minimum: "",
    notes: "svg, cmap only",
  },
  epsilon: {
    used_by: ["G"],
    types: ["double"],
    default: ".0001 * # nodes(mode == KK) .0001(mode == major)",
    minimum: "",
    notes: "neato only",
  },
  esep: {
    used_by: ["G"],
    types: ["addDouble", "addPoint"],
    default: "+3",
    minimum: "",
    notes: "not dot",
  },
  fillcolor: {
    used_by: ["N", "E", "C"],
    types: ["color", "colorList"],
    default: "lightgrey(nodes) black(clusters)",
    minimum: "",
    notes: "",
  },
  fixedsize: {
    used_by: ["N"],
    types: ["bool", "string"],
    default: "false",
    minimum: "",
    notes: "",
  },
  fontcolor: {
    used_by: ["E", "N", "G", "C"],
    types: ["color"],
    default: "black",
    minimum: "",
    notes: "",
  },
  fontname: {
    used_by: ["E", "N", "G", "C"],
    types: ["string"],
    default: '"Times-Roman"',
    minimum: "",
    notes: "",
  },
  fontnames: {
    used_by: ["G"],
    types: ["string"],
    default: '""',
    minimum: "",
    notes: "svg only",
  },
  fontpath: {
    used_by: ["G"],
    types: ["string"],
    default: "system-dependent",
    minimum: "",
    notes: "",
  },
  fontsize: {
    used_by: ["E", "N", "G", "C"],
    types: ["double"],
    default: "14.0",
    minimum: "1.0",
    notes: "",
  },
  forcelabels: {
    used_by: ["G"],
    types: ["bool"],
    default: "true",
    minimum: "",
    notes: "",
  },
  gradientangle: {
    used_by: ["N", "C", "G"],
    types: ["int"],
    default: '""',
    minimum: "",
    notes: "",
  },
  group: {
    used_by: ["N"],
    types: ["string"],
    default: '""',
    minimum: "",
    notes: "dot only",
  },
  headURL: {
    used_by: ["E"],
    types: ["escString"],
    default: '""',
    minimum: "",
    notes: "svg, map only",
  },
  head_lp: {
    used_by: ["E"],
    types: ["point"],
    default: "",
    minimum: "",
    notes: "write only",
  },
  headclip: {
    used_by: ["E"],
    types: ["bool"],
    default: "true",
    minimum: "",
    notes: "",
  },
  headhref: {
    used_by: ["E"],
    types: ["escString"],
    default: '""',
    minimum: "",
    notes: "svg, map only",
  },
  headlabel: {
    used_by: ["E"],
    types: ["lblString"],
    default: '""',
    minimum: "",
    notes: "",
  },
  headport: {
    used_by: ["E"],
    types: ["portPos"],
    default: "center",
    minimum: "",
    notes: "",
  },
  headtarget: {
    used_by: ["E"],
    types: ["escString"],
    default: "<none>",
    minimum: "",
    notes: "svg, map only",
  },
  headtooltip: {
    used_by: ["E"],
    types: ["escString"],
    default: '""',
    minimum: "",
    notes: "svg, cmap only",
  },
  height: {
    used_by: ["N"],
    types: ["double"],
    default: "0.5",
    minimum: "0.02",
    notes: "",
  },
  href: {
    used_by: ["G", "C", "N", "E"],
    types: ["escString"],
    default: '""',
    minimum: "",
    notes: "svg, postscript, map only",
  },
  id: {
    used_by: ["G", "C", "N", "E"],
    types: ["escString"],
    default: '""',
    minimum: "",
    notes: "svg, postscript, map only",
  },
  image: {
    used_by: ["N"],
    types: ["string"],
    default: '""',
    minimum: "",
    notes: "",
  },
  imagepath: {
    used_by: ["G"],
    types: ["string"],
    default: '""',
    minimum: "",
    notes: "",
  },
  imagepos: {
    used_by: ["N"],
    types: ["string"],
    default: '"mc"',
    minimum: "",
    notes: "",
  },
  imagescale: {
    used_by: ["N"],
    types: ["bool", "string"],
    default: "false",
    minimum: "",
    notes: "",
  },
  inputscale: {
    used_by: ["G"],
    types: ["double"],
    default: "<none>",
    minimum: "",
    notes: "fdp, neato only",
  },
  label: {
    used_by: ["E", "N", "G", "C"],
    types: ["lblString"],
    default: '"N" (nodes) "" (otherwise)',
    minimum: "",
    notes: "",
  },
  labelURL: {
    used_by: ["E"],
    types: ["escString"],
    default: '""',
    minimum: "",
    notes: "svg, map only",
  },
  label_scheme: {
    used_by: ["G"],
    types: ["int"],
    default: "0",
    minimum: "0",
    notes: "sfdp only",
  },
  labelangle: {
    used_by: ["E"],
    types: ["double"],
    default: "-25.0",
    minimum: "-180.0",
    notes: "",
  },
  labeldistance: {
    used_by: ["E"],
    types: ["double"],
    default: "1.0",
    minimum: "0.0",
    notes: "",
  },
  labelfloat: {
    used_by: ["E"],
    types: ["bool"],
    default: "false",
    minimum: "",
    notes: "",
  },
  labelfontcolor: {
    used_by: ["E"],
    types: ["color"],
    default: "black",
    minimum: "",
    notes: "",
  },
  labelfontname: {
    used_by: ["E"],
    types: ["string"],
    default: '"Times-Roman"',
    minimum: "",
    notes: "",
  },
  labelfontsize: {
    used_by: ["E"],
    types: ["double"],
    default: "14.0",
    minimum: "1.0",
    notes: "",
  },
  labelhref: {
    used_by: ["E"],
    types: ["escString"],
    default: '""',
    minimum: "",
    notes: "svg, map only",
  },
  labeljust: {
    used_by: ["G", "C"],
    types: ["string"],
    default: '"c"',
    minimum: "",
    notes: "",
  },
  labelloc: {
    used_by: ["N", "G", "C"],
    types: ["string"],
    default: '"t"(clusters) "b"(root graphs) "c"(nodes)',
    minimum: "",
    notes: "",
  },
  labeltarget: {
    used_by: ["E"],
    types: ["escString"],
    default: "<none>",
    minimum: "",
    notes: "svg, map only",
  },
  labeltooltip: {
    used_by: ["E"],
    types: ["escString"],
    default: '""',
    minimum: "",
    notes: "svg, cmap only",
  },
  landscape: {
    used_by: ["G"],
    types: ["bool"],
    default: "false",
    minimum: "",
    notes: "",
  },
  layer: {
    used_by: ["E", "N", "C"],
    types: ["layerRange"],
    default: '""',
    minimum: "",
    notes: "",
  },
  layerlistsep: {
    used_by: ["G"],
    types: ["string"],
    default: '","',
    minimum: "",
    notes: "",
  },
  layers: {
    used_by: ["G"],
    types: ["layerList"],
    default: '""',
    minimum: "",
    notes: "",
  },
  layerselect: {
    used_by: ["G"],
    types: ["layerRange"],
    default: '""',
    minimum: "",
    notes: "",
  },
  layersep: {
    used_by: ["G"],
    types: ["string"],
    default: '" :\t"',
    minimum: "",
    notes: "",
  },
  layout: {
    used_by: ["G"],
    types: ["string"],
    default: '""',
    minimum: "",
    notes: "",
  },
  len: {
    used_by: ["E"],
    types: ["double"],
    default: "1.0(neato) 0.3(fdp)",
    minimum: "",
    notes: "fdp, neato only",
  },
  levels: {
    used_by: ["G"],
    types: ["int"],
    default: "MAXINT",
    minimum: "0.0",
    notes: "sfdp only",
  },
  levelsgap: {
    used_by: ["G"],
    types: ["double"],
    default: "0.0",
    minimum: "",
    notes: "neato only",
  },
  lhead: {
    used_by: ["E"],
    types: ["string"],
    default: '""',
    minimum: "",
    notes: "dot only",
  },
  lheight: {
    used_by: ["G", "C"],
    types: ["double"],
    default: "",
    minimum: "",
    notes: "write only",
  },
  lp: {
    used_by: ["E", "G", "C"],
    types: ["point"],
    default: "",
    minimum: "",
    notes: "write only",
  },
  ltail: {
    used_by: ["E"],
    types: ["string"],
    default: '""',
    minimum: "",
    notes: "dot only",
  },
  lwidth: {
    used_by: ["G", "C"],
    types: ["double"],
    default: "",
    minimum: "",
    notes: "write only",
  },
  margin: {
    used_by: ["N", "C", "G"],
    types: ["double", "point"],
    default: "<device-dependent>",
    minimum: "",
    notes: "",
  },
  maxiter: {
    used_by: ["G"],
    types: ["int"],
    default: "100 * # nodes(mode == KK) 200(mode == major) 600(fdp)",
    minimum: "",
    notes: "fdp, neato only",
  },
  mclimit: {
    used_by: ["G"],
    types: ["double"],
    default: "1.0",
    minimum: "",
    notes: "dot only",
  },
  mindist: {
    used_by: ["G"],
    types: ["double"],
    default: "1.0",
    minimum: "0.0",
    notes: "circo only",
  },
  minlen: {
    used_by: ["E"],
    types: ["int"],
    default: "1",
    minimum: "0",
    notes: "dot only",
  },
  mode: {
    used_by: ["G"],
    types: ["string"],
    default: "major",
    minimum: "",
    notes: "neato only",
  },
  model: {
    used_by: ["G"],
    types: ["string"],
    default: "shortpath",
    minimum: "",
    notes: "neato only",
  },
  mosek: {
    used_by: ["G"],
    types: ["bool"],
    default: "false",
    minimum: "",
    notes: "neato only",
  },
  newrank: {
    used_by: ["G"],
    types: ["bool"],
    default: "false",
    minimum: "",
    notes: "dot only",
  },
  nodesep: {
    used_by: ["G"],
    types: ["double"],
    default: "0.25",
    minimum: "0.02",
    notes: "",
  },
  nojustify: {
    used_by: ["G", "C", "N", "E"],
    types: ["bool"],
    default: "false",
    minimum: "",
    notes: "",
  },
  normalize: {
    used_by: ["G"],
    types: ["double", "bool"],
    default: "false",
    minimum: "",
    notes: "not dot",
  },
  notranslate: {
    used_by: ["G"],
    types: ["bool"],
    default: "false",
    minimum: "",
    notes: "neato only",
  },
  "nslimit nslimit1": {
    used_by: ["G"],
    types: ["double"],
    default: "",
    minimum: "",
    notes: "dot only",
  },
  ordering: {
    used_by: ["G", "N"],
    types: ["string"],
    default: '""',
    minimum: "",
    notes: "dot only",
  },
  orientation: {
    used_by: ["G"],
    types: ["string"],
    default: '""',
    minimum: "",
    notes: "",
  },
  outputorder: {
    used_by: ["G"],
    types: ["outputMode"],
    default: "breadthfirst",
    minimum: "",
    notes: "",
  },
  overlap: {
    used_by: ["G"],
    types: ["string", "bool"],
    default: "true",
    minimum: "",
    notes: "not dot",
  },
  overlap_scaling: {
    used_by: ["G"],
    types: ["double"],
    default: "-4",
    minimum: "-1.0e10",
    notes: "prism only",
  },
  overlap_shrink: {
    used_by: ["G"],
    types: ["bool"],
    default: "true",
    minimum: "",
    notes: "prism only",
  },
  pack: {
    used_by: ["G"],
    types: ["bool", "int"],
    default: "false",
    minimum: "",
    notes: "",
  },
  packmode: {
    used_by: ["G"],
    types: ["packMode"],
    default: "node",
    minimum: "",
    notes: "",
  },
  pad: {
    used_by: ["G"],
    types: ["double", "point"],
    default: "0.0555 (4 points)",
    minimum: "",
    notes: "",
  },
  page: {
    used_by: ["G"],
    types: ["double", "point"],
    default: "",
    minimum: "",
    notes: "",
  },
  pagedir: {
    used_by: ["G"],
    types: ["pagedir"],
    default: "BL",
    minimum: "",
    notes: "",
  },
  pencolor: {
    used_by: ["C"],
    types: ["color"],
    default: "black",
    minimum: "",
    notes: "",
  },
  penwidth: {
    used_by: ["C", "N", "E"],
    types: ["double"],
    default: "1.0",
    minimum: "0.0",
    notes: "",
  },
  peripheries: {
    used_by: ["N", "C"],
    types: ["int"],
    default: "shape default(nodes) 1(clusters)",
    minimum: "0",
    notes: "",
  },
  pin: {
    used_by: ["N"],
    types: ["bool"],
    default: "false",
    minimum: "",
    notes: "fdp, neato only",
  },
  pos: {
    used_by: ["E", "N"],
    types: ["point", "splineType"],
    default: "",
    minimum: "",
    notes: "",
  },
  quadtree: {
    used_by: ["G"],
    types: ["quadType", "bool"],
    default: "normal",
    minimum: "",
    notes: "sfdp only",
  },
  quantum: {
    used_by: ["G"],
    types: ["double"],
    default: "0.0",
    minimum: "0.0",
    notes: "",
  },
  rank: {
    used_by: ["S"],
    types: ["rankType"],
    default: "",
    minimum: "",
    notes: "dot only",
  },
  rankdir: {
    used_by: ["G"],
    types: ["rankdir"],
    default: "TB",
    minimum: "",
    notes: "dot only",
  },
  ranksep: {
    used_by: ["G"],
    types: ["double", "doubleList"],
    default: "0.5(dot) 1.0(twopi)",
    minimum: "0.02",
    notes: "twopi, dot only",
  },
  ratio: {
    used_by: ["G"],
    types: ["double", "string"],
    default: "",
    minimum: "",
    notes: "",
  },
  rects: {
    used_by: ["N"],
    types: ["rect"],
    default: "",
    minimum: "",
    notes: "write only",
  },
  regular: {
    used_by: ["N"],
    types: ["bool"],
    default: "false",
    minimum: "",
    notes: "",
  },
  remincross: {
    used_by: ["G"],
    types: ["bool"],
    default: "true",
    minimum: "",
    notes: "dot only",
  },
  repulsiveforce: {
    used_by: ["G"],
    types: ["double"],
    default: "1.0",
    minimum: "0.0",
    notes: "sfdp only",
  },
  resolution: {
    used_by: ["G"],
    types: ["double"],
    default: "96.0 0.0",
    minimum: "",
    notes: "svg, bitmap output only",
  },
  root: {
    used_by: ["G", "N"],
    types: ["string", "bool"],
    default: "<none>(graphs) false(nodes)",
    minimum: "",
    notes: "circo, twopi only",
  },
  rotate: {
    used_by: ["G"],
    types: ["int"],
    default: "0",
    minimum: "",
    notes: "",
  },
  rotation: {
    used_by: ["G"],
    types: ["double"],
    default: "0",
    minimum: "",
    notes: "sfdp only",
  },
  samehead: {
    used_by: ["E"],
    types: ["string"],
    default: '""',
    minimum: "",
    notes: "dot only",
  },
  sametail: {
    used_by: ["E"],
    types: ["string"],
    default: '""',
    minimum: "",
    notes: "dot only",
  },
  samplepoints: {
    used_by: ["N"],
    types: ["int"],
    default: "8(output) 20(overlap and image maps)",
    minimum: "",
    notes: "",
  },
  scale: {
    used_by: ["G"],
    types: ["double", "point"],
    default: "",
    minimum: "",
    notes: "not dot",
  },
  searchsize: {
    used_by: ["G"],
    types: ["int"],
    default: "30",
    minimum: "",
    notes: "dot only",
  },
  sep: {
    used_by: ["G"],
    types: ["addDouble", "addPoint"],
    default: "+4",
    minimum: "",
    notes: "not dot",
  },
  shape: {
    used_by: ["N"],
    types: ["shape"],
    default: "ellipse",
    minimum: "",
    notes: "",
  },
  shapefile: {
    used_by: ["N"],
    types: ["string"],
    default: '""',
    minimum: "",
    notes: "",
  },
  showboxes: {
    used_by: ["E", "N", "G"],
    types: ["int"],
    default: "0",
    minimum: "0",
    notes: "dot only",
  },
  sides: {
    used_by: ["N"],
    types: ["int"],
    default: "4",
    minimum: "0",
    notes: "",
  },
  size: {
    used_by: ["G"],
    types: ["double", "point"],
    default: "",
    minimum: "",
    notes: "",
  },
  skew: {
    used_by: ["N"],
    types: ["double"],
    default: "0.0",
    minimum: "-100.0",
    notes: "",
  },
  smoothing: {
    used_by: ["G"],
    types: ["smoothType"],
    default: '"none"',
    minimum: "",
    notes: "sfdp only",
  },
  sortv: {
    used_by: ["G", "C", "N"],
    types: ["int"],
    default: "0",
    minimum: "0",
    notes: "",
  },
  splines: {
    used_by: ["G"],
    types: ["bool", "string"],
    default: "",
    minimum: "",
    notes: "",
  },
  start: {
    used_by: ["G"],
    types: ["startType"],
    default: '""',
    minimum: "",
    notes: "fdp, neato only",
  },
  style: {
    used_by: ["E", "N", "C", "G"],
    types: ["style"],
    default: '""',
    minimum: "",
    notes: "",
  },
  stylesheet: {
    used_by: ["G"],
    types: ["string"],
    default: '""',
    minimum: "",
    notes: "svg only",
  },
  tailURL: {
    used_by: ["E"],
    types: ["escString"],
    default: '""',
    minimum: "",
    notes: "svg, map only",
  },
  tail_lp: {
    used_by: ["E"],
    types: ["point"],
    default: "",
    minimum: "",
    notes: "write only",
  },
  tailclip: {
    used_by: ["E"],
    types: ["bool"],
    default: "true",
    minimum: "",
    notes: "",
  },
  tailhref: {
    used_by: ["E"],
    types: ["escString"],
    default: '""',
    minimum: "",
    notes: "svg, map only",
  },
  taillabel: {
    used_by: ["E"],
    types: ["lblString"],
    default: '""',
    minimum: "",
    notes: "",
  },
  tailport: {
    used_by: ["E"],
    types: ["portPos"],
    default: "center",
    minimum: "",
    notes: "",
  },
  tailtarget: {
    used_by: ["E"],
    types: ["escString"],
    default: "<none>",
    minimum: "",
    notes: "svg, map only",
  },
  tailtooltip: {
    used_by: ["E"],
    types: ["escString"],
    default: '""',
    minimum: "",
    notes: "svg, cmap only",
  },
  target: {
    used_by: ["E", "N", "G", "C"],
    types: ["escString", "string"],
    default: "<none>",
    minimum: "",
    notes: "svg, map only",
  },
  tooltip: {
    used_by: ["N", "E", "C"],
    types: ["escString"],
    default: '""',
    minimum: "",
    notes: "svg, cmap only",
  },
  truecolor: {
    used_by: ["G"],
    types: ["bool"],
    default: "",
    minimum: "",
    notes: "bitmap output only",
  },
  vertices: {
    used_by: ["N"],
    types: ["pointList"],
    default: "",
    minimum: "",
    notes: "write only",
  },
  viewport: {
    used_by: ["G"],
    types: ["viewPort"],
    default: '""',
    minimum: "",
    notes: "",
  },
  voro_margin: {
    used_by: ["G"],
    types: ["double"],
    default: "0.05",
    minimum: "0.0",
    notes: "not dot",
  },
  weight: {
    used_by: ["E"],
    types: ["int", "double"],
    default: "1",
    minimum: "0(dot,twopi) 1(neato,fdp)",
    notes: "",
  },
  width: {
    used_by: ["N"],
    types: ["double"],
    default: "0.75",
    minimum: "0.01",
    notes: "",
  },
  xdotversion: {
    used_by: ["G"],
    types: ["string"],
    default: "",
    minimum: "",
    notes: "xdot only",
  },
  xlabel: {
    used_by: ["E", "N"],
    types: ["lblString"],
    default: '""',
    minimum: "",
    notes: "",
  },
  xlp: {
    used_by: ["N", "E"],
    types: ["point"],
    default: "",
    minimum: "",
    notes: "write only",
  },
  z: {
    used_by: ["N"],
    types: ["double"],
    default: "0.0",
    minimum: "-MAXFLOAT -1000",
    notes: "",
  },
} as const;
