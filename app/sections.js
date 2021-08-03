let svg, grid, finalData, finalData_noBCN
let popAxis, popAxis_noBCN, airbnbAxis, airbnbAxis_noBCN, airbnbPerAxis
let airbnbScale, airbnbPerScale, popScale, popScale_noBCN
let blue, yellow, teal, orange, newblue, pink
let simulation, nodes
let bar_start_points, start_x

const margin = {left: 100, top: 100, bottom: 100, right: 100}
const width = 1000
const height = 1000

const brandCodes = {
    'Pirineus': 1,
    'Costa Barcelona': 2,
    'Terres de Lleida': 3,
    'Paisatges de Barcelona': 4,
    'Costa Brava': 5,
    'Costa Daurada': 6,
    "Terres de l'Ebre": 7,
    "Val d'Aran": 8,
    'Barcelona': 9
}

// ************************** LOADING DATA **************************//

d3.csv('data/RealData.csv', function(d){
    return {
        Perc_Tourist: +d.Perc_TuristicHouseholds_INE,
        mapX: +d.x, // this can't be called 'x' or the force layout grid won't work!
        mapY: +d.y, // this can't be called 'y' or the force layout grid won't work!
        INECode: d.INECode,
        IdescatCode: d.IdescatCode,
        municipality: d.Municipality,
        brand: d.brand,
        province: d.province,
        population: +d.Population,
        perc_Airbnb: +d.perc_AirbnbOk,
        airbnb: +d.airbnb,
        brandCode: brandCodes[d.brand],
        chunk: d.airbnb > 0 ? 0 : 1
    };
}).then(data => {
    finalData = data
    createScales()
    setTimeout(drawInitial(), 100)
})

// ************************** END LOADING DATA ************************** //



// ************************** LEGENDS AND SCALES ************************** //


function createScales(){
    map_0_xScale = d3.scaleLinear(d3.extent(finalData, d => d.mapX), [margin.left, width - margin.right])
    map_0_yScale = d3.scaleLinear(d3.extent(finalData, d => d.mapY), [height - margin.bottom, margin.top])

    finalData_noBCN = finalData.filter(d => d.municipality !== 'Barcelona')

    popScale = d3.scaleLinear() // this is an x axis
        .domain(d3.extent(finalData, d => d.population)).nice()
        .range([margin.left, width - margin.right])

    popScale_noBCN = d3.scaleLinear() // this is an x axis
        .domain(d3.extent(finalData_noBCN, d => d.population)).nice()
        .range([margin.left, width - margin.right])

    airbnbScale = d3.scaleLinear() // this is a y axis
        .domain(d3.extent(finalData, d => d.airbnb)).nice()
        .range([height - margin.bottom, margin.top])

    airbnbScale_noBCN = d3.scaleLinear() // this is a y axis
        .domain(d3.extent(finalData_noBCN, d => d.airbnb)).nice()
        .range([height - margin.bottom, margin.top])

    airbnbPerScale = d3.scaleLinear() // this is a y axis
        .domain(d3.extent(finalData, d => d.perc_Airbnb)).nice()
        .range([height - margin.bottom, margin.top])
    
    // airbnbScale_r = d3.scaleSqrt()
    //     .domain([0, d3.max(finalData, d => d.perc_Airbnb)])
    //     .range([1, 20])

    // COLORS
    blue = '#7bd2ed'
    yellow = '#ffd208'
    teal = '#29DDC7'
    orange = '#FF852F'
    newblue = '#3B78E0'
    pink = '#FF047D'

    // fillScale = d3.scaleSequential(d3.interpolatePuBu)
    //fillScale = d3.scaleSequential(d3.interpolateGnBu)
    //fillScale = d3.scaleLinear().domain([1,10]).range(["#ffffff", "#3da2a4"])
    // fillScale = d3.scaleSequential(chroma.scale(['#fff', teal, newblue]))

    
}

  
// **************************  END LEGENDS AND SCALES **************************//

// **************************  SET UP OTHER VARIABLES **************************//

// FOR 'BAR CHART'
function setupGrid(grid_cols, bar_group, bar_label) {    
        const GRID_SIZE = 15; // controls how much space there is between each square
        let GRID_COLS = grid_cols;
        
        let data_structure = {
            bars : [...new Set(finalData.map(d => d[bar_group]))],
            bar_names: [...new Set(finalData.map(d => d[bar_label]))],
            bar_counts : [],
            bar_rows : []
        }
        
        for (var i = 0; i < data_structure.bars.length; i++) {
            data_structure.bar_counts[i] = finalData.map(d => d[bar_group]).reduce(function(n, val) {
                return n + (val === data_structure.bars[i]);
            }, 0);
            data_structure.bar_rows[i] = Math.ceil(data_structure.bar_counts[i] / GRID_COLS);
        }
        
        const sorted = data_structure.bars.map((d,i) => { return {
            bar: d,
            bar_names: data_structure.bar_names[i],
            bar_counts: data_structure.bar_counts[i],
            bar_rows: data_structure.bar_rows[i]
            }}).sort(function(a,b) {
            return b.bar_counts - a.bar_counts;
        })
        
        data_structure = {
            bars: sorted.map(d => d.bar),
            bar_names: sorted.map(d => d.bar_names),
            bar_counts: sorted.map(d => d.bar_counts),
            bar_rows: sorted.map(d => d.bar_rows)
        }

        bar_start_points = []

        const GRID_ROWS = Math.ceil(finalData.length / GRID_COLS);    
            
        grid = {
            cells : [],
            
            init : function() {
            this.cells = {};
            
            for (var bar = 0; bar < data_structure.bars.length; bar++) {
                // let curr_g = 
                this.cells[bar] = [];
                // let bar_cells = [];
                let cells_count = data_structure.bar_counts[bar];
                  
                start_x = bar * (GRID_COLS+1) * GRID_SIZE;
                bar_start_points.push(start_x)
                    
                for(var r = 0; r < GRID_ROWS; r++) {
                    for(var c = 0; c < GRID_COLS; c++) {
                        if (cells_count <= 0) continue;

                        var cell;
                        cell = {
                        x : start_x + c * GRID_SIZE,
                        y : height - r * GRID_SIZE,
                        occupied : false
                        };
                        
                        this.cells[bar].push(cell);
                        cells_count--;
                    };
                };
            }
            
            },
            
            sqdist : function(a, b) {
            return Math.pow(a.x - b.x, 2) + Math.pow(a.y - b.y, 2);
            },

            occupyNearest : function(p) {
            let bar_i = data_structure.bars.indexOf(p[bar_group]);
            var minDist = 1000000;
            var d;
            var candidate = null;
            
            for(var i = 0; i < this.cells[bar_i].length; i++) {
                if(!this.cells[bar_i][i].occupied && ( d = this.sqdist(p, this.cells[bar_i][i])) < minDist) {
                minDist = d;
                candidate = this.cells[bar_i][i];
                }
            }
            if(candidate)
                candidate.occupied = true;
            return candidate;
            }
        }

}
 

// **************************  END SET UP OTHER VARIABLES **************************//



// ************************** DRAW INITIAL FUNCTION **************************//

function drawInitial(){

    let svg = d3.select("#vis")
                .append('svg')
                .attr('viewBox', `0 0 ${width} ${height}`)
                .attr('opacity', 1)



    // SIMULATION FORCES
    // creates simulation sans forces — those are added and removed by later functions
    simulation = d3.forceSimulation(finalData)

    simulation.on('tick', () => {

        grid.init();
            
        nodes
            .each(function(d) { 
                let gridpoint = grid.occupyNearest(d);
                if (gridpoint) {            
                    // smooth motions
                                d.x += (gridpoint.x - d.x) * 0.08;
                                d.y += (gridpoint.y - d.y) * 0.08;
                
                    // to jump directly to final position  
                    // d.x = gridpoint.x;
                    // d.y = gridpoint.y
                            }
                })
            .attr("cx", d => d.x)
            .attr("cy", d => d.y)
    });

    simulation.stop()

    // CATALONIA MAP    
    nodes = svg
        .selectAll('circle')
        .data(finalData)
        .join('circle')
            .attr('opacity', 0)
            .attr('fill', d => d.airbnb > 0 ? teal : 'none')
            .attr('stroke', d => d.airbnb > 0 ? 'none' : teal)
            .attr('r', 4)
            .attr('cx', d => map_0_xScale(d.mapX))
            .attr('cy', d => map_0_yScale(d.mapY))


    // CREATE ALL AXES — SET OPACITY TO 0

    // NUMBER OF AIRBNBS
    let airbnbAxis = d3.axisLeft(airbnbScale)
    
    svg.append('g')
        .call(airbnbAxis)
            .attr('class', 'airbnbAxis')
            .attr('opacity', 0)
            .attr("transform", `translate(${margin.left},0)`)
        .call(g => g.select(".domain"))
        .call(g => g.selectAll('.tick line'))
            .attr('stroke-opacity', 0.2)
            .attr('stroke-color', '#d6d6d6')
            .attr("text-anchor", "end")
            .attr('font-size', '0.8rem')
            .attr('font-color', '#333333')
            .attr('font-family', 'Roboto Condensed')
        .call(g => g.select(".tick:last-of-type text").clone()
            .attr("x", 5)
            .attr("text-anchor", "start")
            .attr('font-weight', 'bold')
            .text('Number of AirBnBs'))
        
    
    // NUMBER OF AIRBNBS WITHOUT BARCELONA
    let airbnbAxis_noBCN = d3.axisLeft(airbnbScale_noBCN)
    
    svg.append('g')
        .call(airbnbAxis_noBCN)
            .attr('class', 'airbnbAxis_noBCN')
            .attr('opacity', 0)
            .attr('transform', `translate(${margin.left}, 0)`)
            .attr('font-size', '0.8rem')
            .attr('font-color', '#333333')
            .attr('font-family', 'Roboto Condensed')
        .call(g => g.select('.domain'))
        .call(g => g.selectAll('.tick line'))
            .attr('stroke-opacity', 0.2)
            .attr('stroke-color', '#d6d6d6')
            .attr("text-anchor", "end")
        .call(g => g.select(".tick:last-of-type text").clone()
            .attr("x", 5)
            .attr("text-anchor", "start")
            .attr('font-weight', 'bold')
            .text('Number of AirBnBs'))


    // PERCENT AIRBNBS
    let airbnbPerAxis = d3.axisLeft(airbnbPerScale)
    
    svg.append('g')
        .call(airbnbPerAxis)
            .attr('class', 'airbnbPerAxis')
            .attr('opacity', 0)
            .attr('transform', `translate(${margin.left}, 0)`)
            .attr('font-size', '0.8rem')
            .attr('font-color', '#333333')
            .attr('font-family', 'Roboto Condensed')
        .call(g => g.select('.domain'))
        .call(g => g.selectAll('.tick line'))
            .attr('stroke-opacity', 0.2)
            .attr('stroke-color', '#d6d6d6')
            .attr("text-anchor", "end")
        .call(g => g.select(".tick:last-of-type text").clone()
            .attr("x", 5)
            .attr("text-anchor", "start")
            .attr('font-weight', 'bold')
            .text('% of apartments that are Airbnbs'))

        
    // POPULATION
    let popAxis = d3.axisBottom(popScale)
    
    svg.append('g')
        .call(popAxis)
            .attr('class', 'popAxis')
            .attr('opacity', 0)
            .attr("transform", `translate(0,${height - margin.bottom})`)
            .attr('font-size', '0.8rem')
            .attr('font-color', '#333333')
            .attr('font-family', 'Roboto Condensed')
        .call(g => g.select('.domain'))
        .call(g => g.selectAll('.tick line'))
            .attr('stroke-opacity', 0.2)
            .attr('stroke-color', '#d6d6d6')
            .attr('font-size', '0.8rem')
            .attr('font-color', '#333333')
            .attr('font-family', 'Roboto Condensed')
        .call(g => g.select(".tick:last-of-type text").clone()
            .attr("x", -22)
            .attr('y', 25)
            .attr("text-anchor", "start")
            .attr('font-weight', 'bold')
            .attr('font-size', '0.8rem')
            .attr('font-color', '#333333')
            .attr('font-family', 'Roboto Condensed')
            .text('Population'))
    
    // POPULATION WITHOUT BARCELONA
    let popAxis_noBCN = d3.axisBottom(popScale_noBCN)

    svg.append('g')
        .call(popAxis_noBCN)
            .attr('class', 'popAxis_noBCN')
            .attr('opacity', 0)
            .attr("transform", `translate(0,${height - margin.bottom})`)
            .attr('font-size', '0.8rem')
            .attr('font-color', '#333333')
            .attr('font-family', 'Roboto Condensed')
        .call(g => g.select('.domain'))
        .call(g => g.selectAll('.tick line'))
            .attr('stroke-opacity', 0.2)
            .attr('stroke-color', '#d6d6d6')
        .call(g => g.select(".tick:last-of-type text").clone()
            .attr("x", -22)
            .attr('y', 25)
            .attr("text-anchor", "start")
            .attr('font-weight', 'bold')
            .text('Population')) 

    // LABELS FOR FORCE BAR GRAPHS
    const chunk_label_data = [
        {'name': 'with airbnb', 'startx': 90, 'starty': 30},
        {'name': 'without airbnb', 'startx': 405, 'starty': 20}
    ]
    const chunk_label_data1 = [
        {'name': 'Municipalities', 'start': 90},
        {'name': 'Municipalities', 'start': 405}
    ]
    const chunk_label_data2 = [
        {'name': '828', 'start': 90},
        {'name': '119', 'start': 405}
    ]

    const brand_label_data = [
        {'name': 'Costa Brava', 'start': 0},
        {'name': 'Costa', 'start': 105}, // Barcelona
        {'name': 'Pirineus', 'start': 210},
        {'name': 'Terres de', 'start': 315}, // Lleida
        {'name': 'Costa Daurada', 'start': 420},
        {'name': 'Paisatges de', 'start': 525}, // Barcelona
        {'name': "Terres de", 'start': 630}, // l'Ebre
        {'name': "Val d'Aran", 'start': 735},
        {'name': "Barcelona", 'start': 840}
    ]

    const brand_label_data2 = [ // cheating on text wrapping — fix this later!
        {'name': 'Barcelona', 'start': 105},
        {'name': 'Lleida', 'start': 315},
        {'name': 'Barcelona', 'start': 525},
        {'name': "l'Ebre", 'start': 630}
    ]

    svg.append('g')
        .attr('opacity', 0)
        .attr('class', 'chunkLabels')
        .selectAll('text')
            .data(chunk_label_data)
            .join('text')
            .attr('x', d => d.startx + 200)
            .attr('y', height - margin.bottom - 40)
            .text(d => d.name)
            .attr('font-family', 'Roboto Condensed')

     svg.append('g')
        .attr('opacity', 0)
        .attr('class', 'chunkLabels')
        .selectAll('text')
            .data(chunk_label_data1)
            .join('text')
            .attr('x', d => d.start + 200)
            .attr('y', height - margin.bottom - 60)
            .text(d => d.name)
            .attr('font-family', 'Roboto Condensed')
            .attr('font-weight', 200)


    svg.append('g')
        .attr('opacity', 0)
        .attr('class', 'chunkLabels')
        .selectAll('text')
            .data(chunk_label_data2)
            .join('text')
            .attr('x', d => d.start + 200)
            .attr('y', height - margin.bottom - 80)
            .text(d => d.name)
            .attr('font-family', 'Roboto Condensed')
            .attr('font-weight', 800)
            .attr('text-decoration','underline')

    svg.append('g')
        .attr('class', 'brandLabels')
        .attr('opacity', 0)
        .selectAll('text')
            .data(brand_label_data)
            .join('text')
            .attr('x', d => d.start + 75)
            .attr('y', height - margin.bottom - 170)
            .attr('font-family', 'Roboto Condensed')
            .text(d => d.name)

    svg.append('g')
        .attr('class', 'brandLabels')
        .attr('opacity', 0)
        .selectAll('text')
            .data(brand_label_data2)
            .join('text')
            .attr('x', d => d.start + 75)
            .attr('y', height - margin.bottom - 150)
            .attr('font-family', 'Roboto Condensed')
            .text(d => d.name)
    

    // ANNOTATIONS
    // points to annotate
    // first map
    const jonq = finalData.filter(d => d.municipality == 'Jonquera, La')
    const jonq_x = map_0_xScale(jonq[0].mapX)
    const jonq_y = map_0_yScale(jonq[0].mapY)

    const vilassar = finalData.filter(d => d.municipality == 'Vilassar de Mar')
    const vilassar_x = map_0_xScale(vilassar[0].mapX)
    const vilassar_y = map_0_yScale(vilassar[0].mapY)

    // barcelona outlier graph
    const bcn = finalData.filter(d => d.municipality == 'Barcelona')
    const bcn_pop = popScale(bcn[0].population)
    const bcn_air = airbnbScale(bcn[0].airbnb)

    // airbnbs graph
    const salou = finalData.filter(d => d.municipality == 'Salou')
    const salou_pop = popScale_noBCN(salou[0].population)
    const salou_air = airbnbScale_noBCN(salou[0].airbnb)

    const roses = finalData.filter(d => d.municipality == 'Roses')
    const roses_pop = popScale_noBCN(roses[0].population)
    const roses_air = airbnbScale_noBCN(roses[0].airbnb)

    const lloret = finalData.filter(d => d.municipality == 'Lloret de Mar')
    const lloret_pop = popScale_noBCN(lloret[0].population)
    const lloret_air = airbnbScale_noBCN(lloret[0].airbnb)

    // percent graph
    const begur = finalData.filter(d => d.municipality == 'Begur')
    const begur_pop = popScale_noBCN(begur[0].population)
    const begur_perAir = airbnbPerScale(begur[0].perc_Airbnb)

    const pals = finalData.filter(d => d.municipality == 'Pals')
    const pals_pop = popScale_noBCN(pals[0].population)
    const pals_perAir = airbnbPerScale(pals[0].perc_Airbnb)


    // create annotation details
    const ann_radius = 10
    const ann_padding = 3

    annotation_without = [{
        note: {
            label: 'Municipalities without Airbnbs'
        },
        x: jonq_x + 5,
        y: jonq_y - 5,
        dy: -40,
        dx: 40,
        color: ["#323232"],
        subject: { radius: ann_radius, radiusPadding: ann_padding }
    }]

    annotation_with = [{
        note: {
            label: 'Municipalities with Airbnbs'
        },
        x: vilassar_x + 5,
        y: vilassar_y + 5,
        dy: 40,
        dx: 40,
        color: ["#323232"],
        subject: { radius: ann_radius, radiusPadding: ann_padding }
    }]

    annotation_bcn = [{
        note: {
            title: 'Barcelona',
            label: 'With more than 1.5 million inhabitants and almost 30,000 Airbnb apartments, Barcelona is a unique case in Catalonia'
        },
        x: bcn_pop,
        y: bcn_air,
        dy: 80,
        dx: -60,
        color: ["#323232"],
        subject: { radius: ann_radius, radiusPadding: ann_padding }
    }]

    annotation_salou = [{
        note: {
            title: 'Salou'
        },
        x: salou_pop,
        y: salou_air,
        dy: -25,
        dx: 40,
        color: ["#323232"],
        subject: { radius: ann_radius, radiusPadding: ann_padding }
    }]

    annotation_roses = [{
        note: {
            title: 'Roses'
        },
        x: roses_pop,
        y: roses_air,
        dy: 40,
        dx: 40,
        color: ["#323232"],
        subject: { radius: ann_radius, radiusPadding: ann_padding }
    }]

    annotation_lloret = [{
        note: {
            title: 'Lloret de Mar'
        },
        x: lloret_pop,
        y: lloret_air,
        dy: -25,
        dx: 40,
        color: ["#323232"],
        subject: { radius: ann_radius, radiusPadding: ann_padding }
    }]

    annotation_begur = [{
        note: {
            title: 'Begur'
        },
        x: begur_pop,
        y: begur_perAir,
        dy: 30,
        dx: 45,
        color: ["#323232"],
        subject: { radius: ann_radius, radiusPadding: ann_padding }
    }]

    annotation_pals = [{
        note: {
            title: 'Pals'
        },
        x: pals_pop,
        y: pals_perAir,
        dy: 40,
        dx: 40,
        color: ["#323232"],
        subject: { radius: ann_radius, radiusPadding: ann_padding }
    }]

    // make the annotations
    // map
    makeAnnotation_without = d3.annotation()
                             .annotations(annotation_without)
                             .type(d3.annotationCalloutElbow)

    svg.append('g')
        .attr('opacity', 0)
        .attr('class', 'annotation_map')
        .attr("font-family", "Roboto Condensed")
        .call(makeAnnotation_without)

    makeAnnotation_with = d3.annotation()
                                .annotations(annotation_with)
                                .type(d3.annotationCalloutElbow)

    svg.append('g')
        .attr('opacity', 0)
        .attr('class', 'annotation_map')
        .attr("font-family", "Roboto Condensed")
        .call(makeAnnotation_with)


    // scatterplots
    makeAnnotation_bcn = d3.annotation()
                             .annotations(annotation_bcn)
                             .textWrap(200)
                             .type(d3.annotationCalloutCircle)

    svg.append('g')
        .attr('opacity', 0)
        .attr('class', 'annotation_bcn')
        .attr("font-family", "Roboto Condensed")
        .call(makeAnnotation_bcn)

    // airbnbs
    // salou
    makeAnnotation_salou = d3.annotation()
                             .annotations(annotation_salou)
                             .type(d3.annotationCalloutCircle)

    svg.append('g')
        .attr('opacity', 0)
        .attr('class', 'annotation_airbnbs')
        .attr("font-family", "Roboto Condensed")
        .call(makeAnnotation_salou)
    // roses
    makeAnnotation_roses = d3.annotation()
                             .annotations(annotation_roses)
                             .type(d3.annotationCalloutCircle)

    svg.append('g')
        .attr('opacity', 0)
        .attr('class', 'annotation_airbnbs')
        .attr("font-family", "Roboto Condensed")
        .call(makeAnnotation_roses)
    //loret
    makeAnnotation_lloret = d3.annotation()
                             .annotations(annotation_lloret)
                             .type(d3.annotationCalloutCircle)

    svg.append('g')
        .attr('opacity', 0)
        .attr('class', 'annotation_airbnbs')
        .attr("font-family", "Roboto Condensed")
        .call(makeAnnotation_lloret)

    // percent graph
    // begur
    makeAnnotation_begur = d3.annotation()
                             .annotations(annotation_begur)
                             .type(d3.annotationCalloutCircle)

    svg.append('g')
        .attr('opacity', 0)
        .attr('class', 'annotation_perc')
        .attr("font-family", "Roboto Condensed")
        .call(makeAnnotation_begur)

    // pals
    makeAnnotation_pals = d3.annotation()
                            .annotations(annotation_pals)
                            .type(d3.annotationCalloutCircle)

    svg.append('g')
        .attr('opacity', 0)
        .attr('class', 'annotation_perc')
        .attr("font-family", "Roboto Condensed")
        .call(makeAnnotation_pals)
   

}

// ************************** END DRAW INITIAL FUNCTION **************************//



// ************************** CLEAN FUNCTION **************************//

// will hide all the elements that aren't needed 

function clean(chartType){
    let svg = d3.select('#vis').select('svg')

    if (chartType !== 'isDraw0') { 
        svg.selectAll('.annotation_map').transition().attr('opacity', 0)
    }
    if (chartType !== 'isDraw05') {
        svg.selectAll('.chunkLabels').transition().attr('opacity', 0)
    }
    if (chartType !== 'isDraw1') {
        svg.selectAll('.brandLabels').transition().attr('opacity', 0)
    }
    if (chartType !== 'isDraw2') {
        // need popAxis and airbnbAxis
        svg.select('.airbnbAxis').transition().attr('opacity', 0)
        svg.select('.popAxis').transition().attr('opacity', 0)
        svg.selectAll('.annotation_bcn').transition().attr('opacity', 0)
    }
    if (chartType !== 'isDraw3') {
        // need popScale_noBCN and airbnbScale_noBCN
        svg.select('.airbnbAxis_noBCN').transition().attr('opacity', 0)
        svg.select('.popAxis').transition().attr('opacity', 0)
        svg.selectAll('.annotation_airbnbs').transition().attr('opacity', 0)
    }
    if (chartType !== 'isDraw4') {
        // need popScale_noBCN, airbnbPerScale
        svg.select('.airbnbPerAxis').transition().attr('opacity', 0)
        svg.select('.popAxis_noBCN').transition().attr('opacity', 0)
        svg.selectAll('.annotation_perc').transition().attr('opacity', 0)
    }
    if (chartType !== 'isDraw5') {
        // need popAxis_noBCN, airbnbPerAxis
        svg.select('.airbnbPerAxis').transition().attr('opacity', 0)
        svg.select('.popAxis_noBCN').transition().attr('opacity', 0)
    }
    if (chartType !== 'isDraw6') {
    }

}

// ************************** END CLEAN FUNCTION **************************//


// ************************** ALL DRAW FUNCTIONS **************************//

// first two draw functions are empty — just needed to make html steps align properly

function drawCover(){

}

function drawIntro(){

}

function draw0(){
    clean('isDraw0')
    simulation.stop()
    
    // scatterplot map of catalonia
    let svg = d3.select("#vis")
                    .select('svg')
                    .attr('width', 1000)
                    .attr('height', 950)

    svg.selectAll('.annotation_map').transition().attr('opacity', 1)
    
    svg.selectAll('circle')
        .attr('opacity', 1)
        .transition().duration(500).delay(100)
        .attr('fill', d => d.airbnb > 0 ? teal : 'none')
        .attr('stroke', d => d.airbnb > 0 ? 'none' : teal)
        .attr('stroke-width', 1)
        .attr('r', 5)
        .attr('cx', d => map_0_xScale(d.mapX))
        .attr('cy', d => map_0_yScale(d.mapY))

}

function draw05(){
    let svg = d3.select("#vis").select('svg')
    clean('isDraw05')

    // force grid 'bar' chart — with or without airbnbs
    setupGrid(grid_cols = 20, bar_group = 'chunk', bar_label = 'chunk')

    simulation
        .force("center", d3.forceCenter(width / 2, height / 2))
    
    simulation.alpha(1).restart()

    svg.selectAll('circle')
        .transition().duration(100).ease(d3.easeExpInOut)
        .attr('r', 4)
        .attr('fill', d => d.airbnb > 0 ? teal : 'none')
        .attr('stroke', d => d.airbnb > 0 ? 'none' : teal)
    
    svg.selectAll('.chunkLabels').transition().attr('opacity', 1)
}

function draw1(){
    let svg = d3.select("#vis").select('svg')
    clean('isDraw1')

    // revised force bar — tourist brands
    setupGrid(grid_cols = 6, bar_group = 'brandCode', bar_label = 'brand')

    simulation
        .force("center", d3.forceCenter(width / 2.5, height / 2))
    
    simulation.alpha(1).restart()

    svg.selectAll('circle')
        .transition().duration(100).delay(1000)
        .attr('fill', d => {
            if(d.brand == 'Costa Brava' && d.airbnb > 0){ return yellow } 
            if(d.brand !== 'Costa Brava' && d.airbnb > 0){ return teal } 
            if(d.airbnb == 0){ return 'none' }
        })
        .attr('stroke', d => {
            if(d.brand == 'Costa Brava' && d.airbnb == 0){ return yellow }
            if(d.brand !== 'Costa Brava' && d.airbnb == 0){ return teal }
            if(d.airbnb > 0){ return 'none' }
        })
    
    svg.selectAll('.brandLabels')
        .transition()
        .attr('opacity', 1)
    
}

function draw2(){
    simulation.stop()

    let svg = d3.select("#vis").select('svg')
    clean('isDraw2')

    // population versus airbnbs — all of catalonia
    svg.selectAll('.popAxis').transition().attr('opacity', 0.7).selectAll('.domain').attr('opacity', 1)
    svg.selectAll('.airbnbAxis').transition().attr('opacity', 0.7).selectAll('.domain').attr('opacity', 1)
    svg.selectAll('.annotation_bcn').transition().attr('opacity', 1).delay(800)
    
    svg.selectAll('circle')
        .transition().duration(800).ease(d3.easeExpInOut)
        .attr('cx', d => popScale(d.population))
        .attr('cy', d => airbnbScale(d.airbnb))
        // .attr('r', 4)
        .attr('fill', teal)
        .attr('opacity', 0.7)
        
}

function draw3(){
    let svg = d3.select("#vis").select('svg')
    clean('isDraw3')

    // population vs airbnbs — without barcelona
    svg.selectAll('.popAxis_noBCN').transition().attr('opacity', 0.7).selectAll('.domain').attr('opacity', 1)
    svg.selectAll('.airbnbAxis_noBCN').transition().attr('opacity', 0.7).selectAll('.domain').attr('opacity', 1)
    svg.selectAll('.annotation_airbnbs').transition().attr('opacity', 1).delay(800)

    svg.selectAll('circle')
        .transition().duration(800).ease(d3.easeExpInOut)
        .attr('cx', d => popScale_noBCN(d.population))
        .attr('cy', d => airbnbScale_noBCN(d.airbnb))
        // .attr('r', 4)
        .attr('fill', d => d.municipality == 'Barcelona' ? 'none' : teal)
        .attr('opacity', 0.7)
}

function draw4(){
    
    let svg = d3.select('#vis').select('svg')
    clean('isDraw4')

    // population vs percent airbnbs — without barcelona
    svg.selectAll('.popAxis_noBCN').transition().attr('opacity', 0.7).selectAll('.domain').attr('opacity', 1)
    svg.selectAll('.airbnbPerAxis').transition().attr('opacity', 0.7).selectAll('.domain').attr('opacity', 1)
    svg.selectAll('.annotation_perc').transition().attr('opacity', 1).delay(800)

    svg.selectAll('circle')
        .transition().duration(800).ease(d3.easeExpInOut)
        .attr('cx', d => popScale_noBCN(d.population))
        .attr('cy', d => airbnbPerScale(d.perc_Airbnb))
        // .attr('r', 4)
        .attr('fill', d => d.perc_Airbnb ? teal : 'none')
        .attr('stroke', 'none')
        .attr('opacity', 0.7)
}

function draw5(){    
    let svg = d3.select("#vis").select("svg")
    clean('isDraw5')

    // population vs percent airbnbs — without barcelona, highlight costa brava
    svg.selectAll('.popAxis_noBCN').transition().attr('opacity', 0.7).selectAll('.domain').attr('opacity', 1)
    svg.selectAll('.airbnbPerAxis').transition().attr('opacity', 0.7).selectAll('.domain').attr('opacity', 1)

    svg.selectAll('circle')
        .transition().duration(800).ease(d3.easeExpInOut)
        .attr('cx', d => popScale_noBCN(d.population))
        .attr('cy', d => airbnbPerScale(d.perc_Airbnb))
        // .attr('r', 4)
        .attr('fill', d => {
            if (d.brand == 'Costa Brava' && d.perc_Airbnb){ return yellow } 
            if (d.municipality == 'Barcelona'){ return 'none' } 
            if (d.perc_Airbnb){ return teal }
            else { return 'none' }})
        .attr('stroke', 'none')
        .attr('opacity', 0.7)
}

function draw6(){
    let svg = d3.select('#vis').select('svg')
    clean('isDraw6')

    // delete circles
    svg.selectAll('circle')
        .transition().duration(800)
        .attr('fill', 'none')
        .attr('stroke', 'none')
}


// ************************** END ALL DRAW FUNCTIONS **************************//



// ************************** SCROLLYTELLING LOGIC **************************//

let activationFunctions = [
    drawCover,
    drawIntro,
    draw0,
    draw05,
    draw1,
    draw2,
    draw3,
    draw4,
    draw5,
    draw6
]


let scroll = scroller()
    .container(d3.select('#graphic'))

scroll()

let lastIndex, activeIndex = 0

scroll.on('active', function(index){

    activeIndex = index
    let sign = (activeIndex - lastIndex) < 0 ? -1 : 1; 
    let scrolledSections = d3.range(lastIndex + sign, activeIndex + sign, sign);
    scrolledSections.forEach(i => {
        activationFunctions[i]();
    })
    lastIndex = activeIndex;

})

scroll.on('progress', function(index, progress){
    if (index == 2 & progress > 0.7){

    }
})

// ************************** END SCROLLYTELLING LOGIC ************************* //
