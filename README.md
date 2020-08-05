# Uncertainty Visualization for Graph Reduction

---

This is the web-demo accompanying the paper *Uncertainty Visualization for Graph Reduction*. This demo is intended to allow the user to explore the algorithms discussed in the paper across a range of datasets. Here's the abstract from the paper: 

> INSERT ABSTRACT WHEN IT'S READY

## Installation

Access to the demo is currently available [here](https://fei0324.github.io/uncertainty-graph-vis).

To launch from own server:

```
$ cd path/to/uncertainty-graph-vis
# for python 2
$ python -m SimpleHTTPServer 8080
# for python 3
$ python -m http.server 8080
```

## Usage

**INSERT PICS WHEN VIS IS FINALIZED**

The demo presents various node and edge uncertainty encodings for multiple dataset and algorithm pairings to allow users to better understand the uncertainty in multi-run graph reduction scenarios. We use five datasets with sizes ranging from 77 to 3,800 nodes, five graph reduction algorithms, and three uncertainty measures.

The default pairing is the lesmis dataset with NJW spectral clustering and the adjusted rand index as an uncertainty measure. From a series of dropdown menus the user can select different combinations of dataset + algorithm + uncertainty measure. The user can also adjust how the node and link data is encoded via this toolbar. Additionally, there is a slider bar section to the top right that allows the user to adjust the parameters corresponding to each algorithm. 

The layout of this vis consists of two main parts:

- **The graph view:** The original, unaltered graph is located to the left, with the reduced graph located to the right. Upon highlight, the node and link data appears in a data panel located to the right of the reduced graph. Linked highlighting between the graphs allows the user to see which nodes from the original graph correspond to the "super" nodes of the reduced graph and vice versa.
- **The heatmap view:** Along the bottom of the vis is a "heatmap" along with another, smaller graph to visualize individual instances. The heatmap feature only applies to the graph coarsening algorithms. Each row of this heat map corresponds to a super node in the reduced graph, and each column corresponds to the run number of the clustering algorithm used. The cells of the heat map encode the uncertainty value of the cluster corresponding to a given run number. When the user clicks on one of the individual runs, the corresponding graph pops up in the bottom right. 

For more information about the visual interface and the algorithms explored, refer to the paper. **Insert link when available**.

## Acknowledgements

Demo made using [d3](https://d3js.org/) and [force-graph](https://github.com/vasturiano/force-graph).

