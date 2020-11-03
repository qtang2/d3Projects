console.log(d3)


let movieDataUrl = "https://cdn.freecodecamp.org/testable-projects-fcc/data/tree_map/movie-data.json"
let movieData

let canvas = d3.select("#canvas")

drawMap = () =>{
    
    let hierarchy = d3.hierarchy(movieData, node =>{ // at each node , which field does its children stored
        return node.children

    }).sum(node =>{//sum method specify how to add value to each node
        return node.value
    }).sort((node1, node2)=>{
        return node2.value - node1.value
    })// sort method for any given node , how to sort it. it returns an intiger, if intiger>0, node1 before node2, if <0, node2 before node1
    

    let createTreeMap = d3.treemap().size([1000,600])
    createTreeMap(hierarchy)
    console.log(hierarchy.leaves())

    let tooltip = d3.select('body')
                    .append('div')
                    .attr('id','tooltip')
                    .style('visibility','hidden')

    let movieTiles = hierarchy.leaves()
    let block = canvas.selectAll('g')
                        .data(movieTiles)
                        .enter()
                        .append('g')
                        .attr('transform',movie => 'translate('+movie.x0+","+movie.y0+")")
    



    block.append('rect')
        .attr('class','tile')
        .attr('fill', movie =>{
            let category = movie.data.category
            switch(category){
                case 'Action':
                    return 'orange'
                case 'Drama':
                    return 'lightGreen'
                case 'Adventure':
                    return 'coral'
                case 'Family':
                    return 'lightBlue'
                case 'Animation':
                    return 'pink'
                case 'Comedy':
                    return 'khaki'
                case 'Biography':
                    return 'tan'
            }//data-name", "data-category", and "data-value
    }).attr('data-name', movie => movie.data.name)
    .attr('data-category', movie => movie.data.category)
    .attr('data-value', movie => movie.data.value)
    .attr('width', movie => movie.x1-movie.x0)
    .attr('height', movie => movie.y1-movie.y0)
    .on('mouseover',(evt,d)=>{
        tooltip.transition()
                .style('visibility','visible')
                .style('left',(evt.pageX)+"px")
                .style('top',evt.pageY+"px")
                .duration(200)
                .attr('data-value',d.data.value)
                
        
        tooltip.text("Name: "+d.data.name +"\n Category:"+d.data.category+"\nValue:" + d.data.value) 



    })
    .on('mouseout', ()=> tooltip.transition().style('visibility','hidden'))

    
        
    block.append("text")
        .text(movie => movie.data.name)
        .attr('x',5)
        .attr('y',20)

}

d3.json(movieDataUrl).then((data,error) =>{
    if(error){
        console.log(error)
    }
    else{
        movieData = data
        console.log(movieData)
        drawMap()
    }
})