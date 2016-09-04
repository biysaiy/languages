// Generated by CoffeeScript 1.10.0
(function() {
  var compile, compiler, elements, graph, i, j, language, len, len1, name, ref, showElements, source, target, type, updateURL;

  this.LANGUAGES = new Set;

  elements = [];

  for (i = 0, len = COMPILERS.length; i < len; i++) {
    compiler = COMPILERS[i];
    name = compiler.name, source = compiler.source, target = compiler.target, type = compiler.type;
    ref = [source, target];
    for (j = 0, len1 = ref.length; j < len1; j++) {
      language = ref[j];
      if (LANGUAGES.has(language)) {
        continue;
      }
      elements.push({
        data: {
          id: language,
          color: COLORS[language] || '#ccc'
        }
      });
      LANGUAGES.add(language);
    }
    elements.push({
      data: {
        id: name,
        source: source,
        target: target,
        type: type,
        sourceColor: COLORS[source] || '#ccc',
        targetColor: COLORS[target] || '#ccc'
      }
    });
  }

  graph = null;

  window.onload = function() {
    var direct, form, k, key, len2, param, queryParams, ref1, ref2, ref3, value;
    graph = cytoscape({
      container: document.getElementById('graph'),
      elements: elements,
      style: [
        {
          selector: 'node',
          style: {
            'label': 'data(id)',
            'font-size': function(ele) {
              return Math.max(14, 9 + 0.25 * ele.incomers().length);
            },
            'width': 'label',
            'height': function(ele) {
              return Math.min(50, 10 + 2 * ele.incomers().length);
            },
            'color': 'white',
            'background-color': 'data(color)',
            'text-valign': 'center',
            'padding-left': 10,
            'padding-right': 10,
            'padding-top': 10,
            'padding-bottom': 10
          }
        }, {
          selector: 'edge',
          style: {
            'label': 'data(id)',
            'width': 3,
            'font-size': function(ele) {
              return Math.min(Math.max(22 - ele.style()['label'].length, 9), 12);
            },
            'color': 'black',
            'line-color': 'data(sourceColor)',
            'target-arrow-color': 'data(sourceColor)',
            'target-arrow-shape': 'triangle',
            'text-rotation': 'autorotate',
            'text-margin-y': -10,
            'text-opacity': 10,
            'opacity': 0.7,
            'curve-style': 'bezier'
          }
        }
      ]
    });
    queryParams = {};
    ref1 = location.search.slice(1).split('&');
    for (k = 0, len2 = ref1.length; k < len2; k++) {
      param = ref1[k];
      ref2 = param.split('='), key = ref2[0], value = ref2[1];
      queryParams[key] = decodeURIComponent(value);
    }
    source = queryParams.source, target = queryParams.target, direct = queryParams.direct;
    form = document.forms[0];
    ref3 = [source || '', target || '', direct], form.source.value = ref3[0], form.target.value = ref3[1], form.direct.checked = ref3[2];
    if (source || target) {
      compile(source, target, direct);
    }
    return graph.layout({
      name: 'cose-bilkent',
      idealEdgeLength: 100,
      nodeRepulsion: 100000,
      padding: 40,
      random: false
    });
  };

  this.filter = function(e) {
    var direct, form, ref1;
    e.preventDefault();
    form = e.currentTarget;
    ref1 = [form.source.value, form.target.value, form.direct.checked], source = ref1[0], target = ref1[1], direct = ref1[2];
    updateURL({
      source: source,
      target: target,
      direct: direct
    });
    return compile(source, target, direct);
  };

  this.show = function() {
    updateURL();
    return compile();
  };

  compile = function(source, target, direct) {
    var count, sourceNode, targetNode, text;
    info.innerText = 'Select a language from the list';
    if ((source && !LANGUAGES.has(source)) || (target && !LANGUAGES.has(target))) {
      return;
    }
    if (source) {
      sourceNode = graph.getElementById(source);
    }
    if (target) {
      targetNode = graph.getElementById(target);
    }
    if (sourceNode && targetNode) {
      elements = (direct ? sourceNode.edgesTo(targetNode) : sourceNode.successors().intersection(targetNode.predecessors())).add([sourceNode, targetNode]);
      showElements(elements);
      text = '';
    } else if (sourceNode) {
      elements = (direct ? sourceNode.outgoers() : sourceNode.successors()).add(sourceNode);
      showElements(elements);
      count = elements.nodes().length - 1;
      text = count === 1 ? source + " compiles to " + count + " language" : source + " compiles to " + count + " languages";
      if (direct) {
        text += " directly";
      }
    } else if (targetNode) {
      elements = (direct ? targetNode.incomers() : targetNode.predecessors()).add(targetNode);
      showElements(elements);
      count = elements.nodes().length - 1;
      text = count === 1 ? count + " language compiles to " + target : count + " languages compile to " + target;
      if (direct) {
        text += " directly";
      }
    } else {
      elements = graph.elements();
      elements.style({
        display: 'element'
      });
      text = LANGUAGES.size + " languages";
    }
    return info.innerText = text + "\n" + (elements.edges().length) + " compilers";
  };

  updateURL = function(params) {
    var key, queryParts, value;
    queryParts = [];
    for (key in params) {
      value = params[key];
      if (value) {
        queryParts.push(key + "=" + (encodeURIComponent(value)));
      }
    }
    return history.replaceState(params, '', queryParts.length ? "?" + (queryParts.join('&')) : location.pathname);
  };

  showElements = function(elements) {
    return graph.batch(function() {
      graph.elements().style({
        display: 'none'
      });
      return elements.style({
        display: 'element'
      });
    });
  };

}).call(this);

//# sourceMappingURL=main.js.map
