# njw_spectral_clustering

This directory contains all datasets using NJW spectral clustering. The structure is as follows:

+ __rec_100__ - dataset name
  + __cluster_[number of clusters]__
    + __local_adjusted_rand_index __- the similarity measure name
      + __individual_instances__ - contains all 99 instances of clustered graphs
      + ori_graph_with_cluster - original graph with cluster information on the nodes
      + uncertainty_graph - the representative graph with uncertainty information on the nodes and edges
      + uncertain_mat - the uncertainty matrix with header from 1 - 99
      + correspondences.npy - not needed for vis
    + __local_jaccard_index__
      + (same as __local_adjusted_rand_index__)
    + __local_mutual_information__
      + (same as __local_adjusted_rand_index__)
    + original_cluster_centers.npy - not needed for vis
    + original_clustering.npy - not needed for vis
+ __celegans_453__
  + (same as __rec_100__)
+ __lesmis_77__
  + (same as __rec_100__)

