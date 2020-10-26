let url = "https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/cyclist-data.json"

let req = new XMLHttpRequest()

let data
let minX,minY,maxX,maxY

let radius = 5

let xScale, yScale, xAxisScale, yAxisScale

let width = 800
let height = 600
let padding = 40

let svg = d3.select('svg')

let drawCanvas = () =>{
    console.log("draw canvas")
    svg.attr("width",width).attr("height",height)
    
}

let generateScales = () =>{
    xAxisScale = d3.scaleLinear().domain([minX,maxX]).range([padding,width-padding])

    yAxisScale = d3.scaleLinear().domain([minY,maxY]).range([height-padding,padding])
}

let drawScatterplot = () =>{
    svg.selectAll('circle')
        .data(data)
        .enter()
        .append("circle")
        .attr("r",radius)
        .attr('cx',item => xAxisScale(item.Year))
        .attr('cy',item => yAxisScale(item.Seconds))
        .attr('class','dot')
}

let generateAxes = () =>{
    let xAxis = d3.axisBottom(xAxisScale)
    svg.append("g").attr("id","x-axis").call(xAxis).attr("transform","translate(0, "+ (height-padding)+ ")")

    let yAxis = d3.axisLeft(yAxisScale)
    svg.append("g").attr("id","y-axis").call(yAxis).attr("transform","translate("+ padding+ ",0)")
}



req.open('GET',url,true)
req.onload = () =>{
    data = JSON.parse(req.responseText)
    minX = d3.min(data, item => item.Year)
    maxX = d3.max(data, item => item.Year)
    minY = d3.min(data, item => item.Seconds)
    maxY = d3.max(data, item => item.Seconds)
    console.log(minX + " "+ maxX + ",  "+ minY+ " "+ maxY)
    console.log(data)
    drawCanvas()
    generateScales()
    drawScatterplot()
    generateAxes()

}
req.send()