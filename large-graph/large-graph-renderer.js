
// This is still really slow - theory is that it is really densely connected, which may account for the slugishness...
// Confirmed, if I turn off link visibility, it speeds up exponentially, maybe see if I can turn them back on at some point?
Promise.all([
    d3.json(`data/njw_spectral_clustering/email_1005/cluster_20/local_adjusted_rand_index/ori_graph_with_cluster.json`)
]).then(function(files){

    let data = files[0]
    const elem = document.getElementById('graph');

    // Medium size
    // const Graph = ForceGraph()(elem)
    //     .backgroundColor('#101020')
    //     .nodeRelSize(6)
    //     .nodeAutoColorBy('user')
    //     .linkColor(() => 'rgba(255,255,255,0.2)')
    //     .linkDirectionalParticles(1)
    //     .onNodeHover(node => elem.style.cursor = node ? 'pointer' : null)
    //     .graphData(data);

    // large size
    const Graph = ForceGraph()
    (document.getElementById('graph'))
        .graphData(data)
        .d3AlphaDecay(0)
        .d3VelocityDecay(0.08)
        .cooldownTime(60000)
        .linkColor(() => 'rgba(0,0,0,0.05)')
        .linkVisibility('hidden')
        .zoom(0.05)
        .enablePointerInteraction(false);


});
  
// Maybe I need to load the data differently? 
// No, this is still really slow.
// fetch('data/njw_spectral_clustering/email_1005/cluster_20/local_adjusted_rand_index/ori_graph_with_cluster.json').then(res => res.json()).then(data => {
//     const elem = document.getElementById('graph');

//     const Graph = ForceGraph()(elem)
//       .backgroundColor('#101020')
//       .nodeRelSize(6)
//       .nodeAutoColorBy('user')
//       .linkColor(() => 'rgba(255,255,255,0.2)')
//     //   .linkDirectionalParticles(1)
//       .onNodeHover(node => elem.style.cursor = node ? 'pointer' : null)
//       .graphData(data);
//     });