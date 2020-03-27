__clu_[num_clusters]__ is the clustered graph with uncertainty information on both the nodes and the edges.

Node:

+ id - an unique node id ranging from 0 to `num_clusters - 1`
+ weight - the aggregated node weight
+ cluster - always 0 in this case
+ uncertainty_mean - mean of row number [id] of the uncertainty matrix based on adjusted rand index (not related to node weight)
+ uncertainty_std - standard deviation of row number [id] of the uncertainty matrix based on adjusted rand index (not related to node weight)

Edge:

+ source - one end of an edge
+ target - the other end of an edge
+ weight - aggregated weight of the edge
+ mean - average weight of the corresponding edges from all uncertainty runs
+ std - standard deviation of the corresponding edges from all uncertainty runs

__original_[num_clusters]__ is the original graph with clustering information.

Node:

+ id - an unique id
+ weight - the initial weight of the node, all 1 in this case
+ cluster - the cluster id it is assigned to in the central clustering ranging from 0 to `num_cluster - 1`
+ uncertainty_mean - all 0
+ uncertainty_std - all 0

Edge:

+ source - one end of an edge
+ target - the other end of an edge
+ weight - the original weight of the edge
+ mean - all 0
+ std - all 0