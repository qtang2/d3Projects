// console.log(d3)
// console.log(topojson)

let countyUrl = "https://cdn.freecodecamp.org/testable-projects-fcc/data/choropleth_map/counties.json"
let educationUrl = "https://cdn.freecodecamp.org/testable-projects-fcc/data/choropleth_map/for_user_education.json"

let countyData, educationData

let canvas = d3.select('#canvas')

findCounty = (id) =>{
    let county = educationData.find(eduItem=>{
        return eduItem.fips === id
    })
    
    return county 
}

drawMap = ()=>{
    let tooltip = d3.select('body')
                    .append('div')
                    .attr('id','tooltip')
                    .style('visibility','hidden')

    canvas.selectAll('path')
            .data(countyData) //it is a geojson objects
            .enter()
            .append('path')
            .attr('d',d3.geoPath())//converts the geometry feature in data to a string that can be given to svg d attribute
            .attr('class','county')
            .attr('fill', countyItem=>{
                let percentage = findCounty(countyItem.id).bachelorsOrHigher
                if(percentage <=15){return 'tomato'}
                else if(percentage<=30 ){return 'orange'}
                else if(percentage<=45){return 'lightGreen'}
                else{return 'limeGreen'}
            })
            .attr('data-fips',countyItem => countyItem.id)
            .attr('data-education', countyItem =>{
                return findCounty(countyItem.id).bachelorsOrHigher
            })
            .on('mouseover',(evt,d)=>{
                tooltip.transition()
                        .style('visibility','visible')
                        .style('left',(evt.pageX)+"px")
                        .style('top',evt.pageY+"px")
                        .duration(200)
                        
                let county = findCounty(d.id)
    
                tooltip.text(county.fips + "-"+ county.area_name+",\n"+county.state+":" + county.bachelorsOrHigher )

                tooltip.attr('data-education',county.bachelorsOrHigher)
            })
            .on('mouseout', ()=> tooltip.transition().style('visibility','hidden'))
}


//d3 json method returns a promise, it need a function to run once it has been completed and the promise has been resolved
d3.json(countyUrl).then(
    (data,error) =>{
        //d3 will change the string to json obj automatically
        if(error){
            console.log(error)
        }
        else{
            //the data is in topojson format but d3 requires geojson format, so topojson.feature method help change it to geojson format. this method takes two args, first one is the original data, the second one is what sub-data we want
            countyData = topojson.feature(data,data.objects.counties).features //

            console.log("KKKKKKKKK")
            console.log(countyData)

            d3.json(educationUrl).then(
                (data,error) =>{
                    if(error){
                        console.log(error)
                    }else{
                        //education fibs maps to the id in the counties object
                        educationData = data
                        console.log(educationData)
                        drawMap()
                    }
                }
            )
        }
    }
)