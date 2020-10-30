console.log(d3)
console.log(topojson)

let countyUrl = "https://cdn.freecodecamp.org/testable-projects-fcc/data/choropleth_map/for_user_education.json"
let educationUrl = "https://cdn.freecodecamp.org/testable-projects-fcc/data/choropleth_map/counties.json"

let countyData, educationData

let canvas = d3.select('#canvas')

drawMap = ()=>{

}


//d3 json method returns a promise, it need a function to run once it has been completed and the promise has been resolved
d3.json(countyUrl).then(
    (data,error) =>{
        //d3 will change the string to json obj automatically
        if(error){
            console.log(error)
        }
        else{
            countyData = data
            console.log(countyData)

            d3.json(educationUrl).then(
                (data,error) =>{
                    if(error){
                        console.log(error)
                    }else{
                        educationData = data
                    }
                }
            )
        }
    }
)