import React, { Component } from 'react';
import './App.css';
// import cytoscape from 'cytoscape';
// import edgehandles from 'cytoscape-edgehandles';
// import vis from './utils.js'
import vis from 'vis';

class App extends Component {

  App(component, props) {
    this.state = {
      network: null
    };
  }

  componentWillMount() {
    var nodes = [];
    var edges = [];

    var LENGTH_MAIN = 350,
      // LENGTH_SERVER = 500,
      // LENGTH_SUB = 50,
      WIDTH_SCALE = 4,
      // GREEN = 'green',
      // RED = '#C5000B',
      // ORANGE = 'orange',
      //GRAY = '#666666',
      GRAY = 'gray';
      // BLACK = '#2B1B17';



    // nodes

    nodes.push({
      id: 1,
      label: 'A',
      group: 'switch'
    });
    nodes.push({
      id: 2,
      label: 'B',
      group: 'switch'
    });
    nodes.push({
      id: 3,
      label: 'C',
      group: 'switch'
    });
    nodes.push({
      id: 4,
      label: 'D',
      group: 'switch'
    });
    nodes.push({
      id: 5,
      label: 'E',
      group: 'switch'
    });
    nodes.push({
      id: 6,
      label: 'F',
      group: 'switch'
    });
    nodes.push({
      id: 7,
      label: 'G',
      group: 'switch'
    });
    nodes.push({
      id: 8,
      label: 'H',
      group: 'switch'
    });
    nodes.push({
      id: 9,
      label: 'I',
      group: 'switch'
    });


    //edges

    edges.push({
      from: 1,
      to: 2,
      length: LENGTH_MAIN,
      width: WIDTH_SCALE,
      label: 5
    });
    edges.push({
      from: 1,
      to: 3,
      length: LENGTH_MAIN,
      width: WIDTH_SCALE,
      label: 17
    });
    edges.push({
      from: 2,
      to: 3,
      length: LENGTH_MAIN,
      width: WIDTH_SCALE,
      label: 7
    });
    edges.push({
      from: 4,
      to: 5,
      length: LENGTH_MAIN,
      width: WIDTH_SCALE,
      label: 4
    });
    edges.push({
      from: 1,
      to: 5,
      length: LENGTH_MAIN,
      width: WIDTH_SCALE,
      label: 12
    });
    edges.push({
      from: 3,
      to: 6,
      length: LENGTH_MAIN,
      width: WIDTH_SCALE,
      label: 30
    });
    edges.push({
      from: 7,
      to: 9,
      length: LENGTH_MAIN,
      width: WIDTH_SCALE,
      label: 25
    });
    edges.push({
      from: 4,
      to: 8,
      length: LENGTH_MAIN,
      width: WIDTH_SCALE,
      label: 16
    });
    edges.push({
      from: 1,
      to: 7,
      length: LENGTH_MAIN,
      width: WIDTH_SCALE,
      label: 14
    });
    edges.push({
      from: 1,
      to: 9,
      length: LENGTH_MAIN,
      width: WIDTH_SCALE,
      label: 5
    });
    edges.push({
      from: 2,
      to: 7,
      length: LENGTH_MAIN,
      width: WIDTH_SCALE,
      label: 8
    });
    edges.push({
      from: 5,
      to: 7,
      length: LENGTH_MAIN,
      width: WIDTH_SCALE,
      label: 20
    });
    edges.push({
      from: 5,
      to: 9,
      length: LENGTH_MAIN,
      width: WIDTH_SCALE,
      label: 19
    });
    edges.push({
      from: 6,
      to: 7,
      length: LENGTH_MAIN,
      width: WIDTH_SCALE,
      label: 7
    });
    edges.push({
      from: 7,
      to: 8,
      length: LENGTH_MAIN,
      width: WIDTH_SCALE,
      label: 4
    });


    // legend
    // var mynetwork = document.getElementById('root');
    // var x = -mynetwork.clientWidth / 2 + 50;
    // var y = -mynetwork.clientHeight / 2 + 50;
    // var step = 70;


    // create a network
    var container = document.getElementById('root');
    container.style.height = '1200px';
    container.style.width = '1200px';
    var data = {
      nodes: nodes,
      edges: edges
    };

    var options = {
      nodes: {
        shape: 'dot',
        size: 16,
        color: '#109618'
      },
      edges: {
        color: GRAY,
        smooth: false
      },
      physics: {
        barnesHut: {
          gravitationalConstant: -30000
        },
        stabilization: {
          iterations: 2500
        }
      }
    };

    this.setState({network: new vis.Network(container, data, options)});
    // console.log(data);
    this.primsAlgorithm(nodes, edges);
  }


  makeAdjacencyMatrix(edges) {
    let matrix = new Array(edges.length);
    for (let i = 0; i < edges.length; i++) {
      matrix[i] = new Array(edges.length);
    }

    for (let i = 0 ; i < edges.length; i++) {
      let fr = edges[i].from;
      let to = edges[i].to;
      let lab = edges[i].label;
      console.log(lab);
      matrix[fr][to] = lab;
    }

    for(let i = 0 ; i < edges.length; i++) {
      for(let j = 0; j < edges.length; j++) {
        if (matrix[i][j] === undefined) {
          matrix[i][j] = 0;
        }
      }
    }
    return matrix;
  }


  primsAlgorithm(nodes, edges) {
    let V = nodes.length;
    let parent = [];
    let key = [];
    let mstSet = [];

    let graph = this.makeAdjacencyMatrix(edges);

    for(let i = 0; i < V; i++) {
      key[i] = Number.MAX_SAFE_INTEGER;
      mstSet[i] = false;
    }

    key[0] = 0;
    parent[0] = -1;

    for(let i = 0; i < V - 1; i++) {
      let u = this.minKey(key, mstSet, V);
      mstSet[u] = true;

      for (let v = 0; v < V; v++) {
        if (graph[u][v] !== 0 && mstSet[v] === false && graph[u][v] < key[v]) {
          parent[v] = u;
          key[v] = graph[u][v];
        }
      }
    }

    this.printMST(parent, V, graph);
    // var queue = new Queue();
  }

  minKey(key, mstSet, V) {
    let min = Number.MAX_SAFE_INTEGER;
    let minIndex = -1;

    for(let i = 0 ; i < V; i++) {
      if (mstSet[i] === false && key[i] < min) {
        min = key[i];
        minIndex = i;
      }
    }
    return minIndex;
  }

  printMST(parent, V, graph) {
    console.log("Edge   Weight");
    for (let i = 1; i < V; i++)
      console.log(parent[i] + " - " + i + "    " + graph[i][parent[i]]);
  }

  // primsAlgorithm(nodes, edges) {
  //   var i, j, k, x, y;
  //   let reached = [];
  //   let predNode = [];

  //   reached[0] = true;

  //   for (i = 1; i < nodes.length; i++) {
  //     reached[i] = false;
  //   }

  //   predNode[0] = 0;

  //   for (k = 1; k < nodes.length; k++) {
  //     x = y = 0;

  //     for (i = 0 ; i < nodes.length; i++) {
  //       for (j = 0; j < nodes.length; j++) {
  //         if (reached[i] && !reached[j] && )
  //       }
  //     }
  //   }
  // }


  render() {
    return (
      <div className="App">
        <div className="App-header">
          <h2>Welcome to React</h2>
        </div>
        <p className="App-intro">
          To get started, edit <code>src/App.jsasdas</code> and save to reload.
        </p>
        <div className="network">
          {this.state.network}
        </div>
      </div>
    );
  }
}

export default App;
