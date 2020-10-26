let url = "https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/GDP-data.json"

let req = new XMLHttpRequest()

let data 
let values

let heightScale
let xScale
let xAxisScale
let yAxisScale

let width = 800
let height = 600
let padding = 40

let svg = d3.select('svg')

console.log(svg)
let drawCanvas = () =>{
    svg.attr("width",width).attr("height",height)    
}

let genetateScales = ()=>{
    heightScale = d3.scaleLinear().domain([0,d3.max(values,(item)=> item[1])]).range([0,height-2*padding])

    xScale = d3.scaleLinear().domain([0,values.length-1]).range([padding,width-2*padding])


    let datesArr = values.map(item => {
        return new Date(item[0])
    })

    xAxisScale = d3.scaleTime().domain([d3.min(datesArr),d3.max(datesArr)]).range([padding, width-padding])

    yAxisScale = d3.scaleLinear().domain([0,d3.max(values, item => item[1])]).range([height-padding,padding])
}

let drawBars = ()=>{
    let tooltip = d3.select('body').append("div").attr("id","tooltip").style("visibility","hidden")
   
    svg.selectAll("rect")
    .data(values)
    .enter()
    .append("rect")
    .attr('class', 'bar')
    .attr('width',(width-2*padding)/values.length)
    .attr('data-date',item=>item[0])
    .attr('data-gdp',item=>item[1])
    .attr('height', item => heightScale(item[1]))
    .attr('x',(item, i) =>xScale(i))
    .attr('y',item => height-padding - heightScale(item[1]))
    .on("mouseover", (item,i) => {
       
        // console.log(item ) //which outputs an MouseEvent 
        // console.log(i ) // which outputs and array contains two items like ["2015-01-01", 17649.3]
        console.log(item.pageX)
        tooltip.transition()
        .style("visibility","visible")
        .style("left",(item.pageX+10)+"px")
        .style("top",(item.pageY+10)+"px")
        .duration(200)

        tooltip.text("Year: "+i[0]+"\n"+ "GDP: "+ i[1])
        document.querySelector('#tooltip').setAttribute('data-date',i[0])
        
    })
    .on("mouseout", (d,i) =>{
        tooltip.transition().style("visibility","hidden")
    })
}

let generateAxes = ()=>{
    // console.log("executed")
    let xAxis = d3.axisBottom(xAxisScale)
     svg.append("g").attr("id","x-axis").attr("transform", 'translate(0,'+ (height-padding)+')').call(xAxis)

     let yAxis = d3.axisLeft(yAxisScale)
     svg.append("g").attr("id","y-axis").attr("transform", 'translate('+padding+ ',0)').call(yAxis)
}

req.open("GET", url, true)
req.onload = ()=>{
    
    data = JSON.parse(req.responseText)
    values = data.data
    // console.log(values)
    drawCanvas()
    genetateScales()
    drawBars()
    generateAxes()
}
req.send()