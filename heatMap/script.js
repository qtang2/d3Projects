let url = "https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/global-temperature.json"

let req = new XMLHttpRequest()

let monthlyVariance,baseTemp

let xScale, yScale, xAxisScale, yAxisScale

let width =  1200
let height = 600
let padding = 60

let minYear,maxYear,numOfYears
let months=[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]

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

    yAxisScale = d3.scaleOrdinal()
                    .rangeRoundBands([padding,height-padding])
                    .domain(months)
    
}

let generateAxes = ()=>{

    let xAxis = d3.axisBottom(xAxisScale).tickFormat(d3.format('d'))

    svg.append('g').attr('id','x-axis').call(xAxis).attr('transform',"translate(0,"+ (height-padding)+")")

    let yAxis = d3.axisLeft(yAxisScale)

    svg.append('g').attr('id','y-axis').call(yAxis).attr('transform',"translate("+ padding+",0)")

}

let drawCells = ()=>{
    
}

let generateLegend = ()=>{
    

}


req.open('GET',url, true)
//once have response then run the function
req.onload = () =>{
    let data = JSON.parse(req.responseText)
    //-1 because JS month value starts from 0 ends 11
    data.monthlyVariance.forEach(item =>item.month-=1)
    monthlyVariance = data.monthlyVariance
    baseTemp = data.baseTemperature
    console.log(data)
    drawCanvas()
    generateScales()
    drawCells()
    generateAxes()
    generateLegend()
}

req.send()