// console.log(d3)

let url = "https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/global-temperature.json"

let req = new XMLHttpRequest()

let monthlyVariance,baseTemp

let xScale, yScale, xAxisScale, yAxisScale

let width =  1200
let height = 600
let padding = 60

let minYear,maxYear,numOfYears

//Need specify the domain , length>=4 at least
let threshhold = [
    [2.8,3.9],
    [3.9,5.0],
    [5.0,6.1],
    [6.1,7.2],
    [7.2,8.3],
    [8.3,9.5],
    [9.5,10.6],
    [10.6,11.7],
    [11.7,12.8]]

let colors = d3.scaleOrdinal(d3.schemeCategory10)
colors.domain(threshhold)

let svg = d3.select('#canvas')
let legend = d3.select("#legend")

let drawCanvas = () =>{
    svg.attr('width',width).attr('height',height)
}

let generateScales = ()=>{
    minYear = d3.min(monthlyVariance, item =>item.year)
    maxYear = d3.max(monthlyVariance, item =>item.year)
    numOfYears = maxYear-minYear

    xAxisScale = d3.scaleLinear()
                    .range([padding,width-padding])
                    .domain([minYear,maxYear+1])
    yAxisScale = d3.scaleTime()
                    .range([padding,height-padding])
                    .domain([new Date(0,0,0,0,0,0,0), new Date(0,12,0,0,0,0,0)])
}

let generateAxes = ()=>{
    let xAxis = d3.axisBottom(xAxisScale).tickFormat(d3.format('d'))

    svg.append('g').attr('id','x-axis').call(xAxis).attr('transform',"translate(0,"+ (height-padding)+")")

    let yAxis = d3.axisLeft(yAxisScale).tickFormat(d3.timeFormat('%B'))

    svg.append('g').attr('id','y-axis').call(yAxis).attr('transform',"translate("+ padding+",0)")


}

let drawCells = ()=>{

    let tooltip = d3.select('body')
                    .append('div')
                    .attr('id','tooltip')
                    .style('visibility','hidden')

    svg.selectAll('rect')
        .data(monthlyVariance)
        .enter()
        .append('rect')
        .attr('class','cell')
        .attr('fill', item =>{
            if(item.variance<=-1) {return "steelBlue"}
            else if(item.variance<=0) {return "lightSteelBlue"}
            else if(item.variance<=1) {return "orange"}
            else {return "crimson"}

        })
        .attr('data-year', item => item.year)
        .attr('data-month', item => item.month-1)
        .attr('data-temp', item => baseTemp+item.variance)
        .attr('height',(height-2*padding)/12)
        .attr('y', item => yAxisScale(new Date(0,item.month-1,0,0,0,0,0)))
        .attr('width',item =>{
            return (width-2*padding)/numOfYears
        })
        .attr('x', item => xAxisScale(item.year))
        .on('mouseover',(evt,d)=>{
            tooltip.transition()
                    .style('visibility','visible')
                    .style('left',(evt.pageX)+"px")
                    .style('top',evt.pageY+"px")
                    .duration(200)
                    .attr('data-year',d.year)

            tooltip.text(d.year + "/"+d.month+ "\n  "+ (d.variance+baseTemp)+"°C" )
        })
        .on('mouseout', ()=> tooltip.transition().style('visibility','hidden'))
}

let generateLegend = ()=>{
    
    
}

req.open('GET',url, true)
//once have response then run the function
req.onload = () =>{
    let data = JSON.parse(req.responseText)
    monthlyVariance = data.monthlyVariance
    baseTemp = data.baseTemperature
    console.log(baseTemp)
    drawCanvas()
    generateScales()
    drawCells()
    generateAxes()
    
}

req.send()
