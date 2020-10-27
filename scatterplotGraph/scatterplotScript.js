let url = "https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/cyclist-data.json"

let req = new XMLHttpRequest()

let data
let minX,minY,maxX,maxY

let radius = 5

let xScale, yScale, xAxisScale, yAxisScale

let width = 800
let height = 600
let padding = 40

let color = d3.scaleOrdinal([true,false],d3.schemeCategory10); 
let svg = d3.select('svg')

let drawCanvas = () =>{
    // console.log("draw canvas")
    svg.attr("width",width).attr("height",height)
    
}

let generateScales = () =>{
    xAxisScale = d3.scaleLinear().domain([minX,maxX]).range([padding,width-padding])

    yAxisScale = d3.scaleTime().domain([minY,maxY]).range([padding,height-padding])
}

let drawScatterplot = () =>{
    // let tooltip = d3.select('body').append('div').attr('id','legend').style('visibility','hidden')


    svg.selectAll('circle')
        .data(data)
        .enter()
        .append("circle")
        .attr("r",radius)
        .attr('cx',item => xAxisScale(item.Year))
        .attr('cy',item => yAxisScale(new Date(item.Seconds*1000)))
        .attr('class','dot')
        .attr('data-xvalue', item => item.Year)
        .attr('data-yvalue', item => new Date(item.Seconds*1000))
        .attr("fill",item => color(item.URL!==''))
}

let generateAxes = () =>{
    let xAxis = d3.axisBottom(xAxisScale).tickFormat(d3.format('d'))
    svg.append("g").attr("id","x-axis").call(xAxis).attr("transform","translate(0, "+ (height-padding)+ ")")

    let yAxis = d3.axisLeft(yAxisScale).tickFormat(d3.timeFormat('%M:%S'))
    svg.append("g").attr("id","y-axis").call(yAxis).attr("transform","translate("+ padding+ ",0)")
}


let generateLegend = () =>{
    //this is a scale that will map different color
    //d3.scaleOrdinal([[domain, ]range]) 
    

    let legendContainer = svg.append('g').attr('id', 'legend');
    let legend = legendContainer
    .selectAll("#legend")
    .data(color.domain())//the domain is empty because it did not set yet
    .enter()
    .append('g')
    .attr('class','lengend-label')
    .attr('transform', function(d,i){
        return "translate(0, "+ ((height+2*padding)/2-i*20) + ')'
    })

    legend
        .append('rect')
        .attr('width',18)
        .attr('height',18)
        .style('fill',color)
        .attr('x', width - 20)

    legend
        .append('text')
        .attr('x', width - 22)
        .attr('y',9)
        .style('text-anchor', 'end')
        .attr('dy','.35em')
        .text(d => {
            console.log("append text")
            if(d){
                return "Riders with doping allegations"
            }
            else {return "No doping allegations"}
        })

}


req.open('GET',url,true)
req.onload = () =>{
    data = JSON.parse(req.responseText)
    minX = d3.min(data, item => item.Year)-1
    maxX = d3.max(data, item => item.Year)+1
    minY = d3.min(data, item => new Date(item.Seconds*1000))
    maxY = d3.max(data, item => new Date(item.Seconds*1000))
    console.log(minX + " "+ maxX + ",  "+ minY+ " "+ maxY)
    // console.log(data)
    drawCanvas()
    generateScales()
    drawScatterplot()
    generateAxes()
    generateLegend()
}
req.send()