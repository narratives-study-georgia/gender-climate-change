var step = false
var basis = false

var graphData, allValues

var color = (d, i) => {
    var radios = document.getElementsByName('coloryze')[0];
    var selected = radios.value;
    
    if(!selected || selected == 'None' ) return '#747474';
    
    colurs = {};

    [...drowDropdowns[selected].dom.getElementsByClassName('select-option')].forEach(opt => colurs[opt.innerText] = window.getComputedStyle(opt).color )
    
    if(!d.data)  return '#747474';
    
    if (d.data[selected]) return colurs[d.data[selected]] //| '#747474'
    //multi select 
    return colurs[Object.keys(colurs).filter(option => d.data[selected + '_' + option] == "1" )[0]]
    
    return "rgb(148, 103, 189)"
}

var drowDots = (__data) => {
    var line1 = document.getElementsByClassName('line-1')[0];
    var line2 = document.getElementsByClassName('line-2')[0];
    line1.innerHtml = '';
    line2.innerHtml = '';
    __data.forEach(row => {
        if(row.data["In this situation you…-Did not get personally involved"]){
            var dotOnLine = document.createElement('i')
            dotOnLine.setAttribute('nar-id', row.data.FragmentID)
            dotOnLine.setAttribute('class', 'dot-on-line')
            dotOnLine.setAttribute('style', 'left: ' + (+row.data["In this situation you…-Did not get personally involved"] * 4)+ 'px; border-color: ' + color(row))
            line1.appendChild(dotOnLine)
            // console.log(row.data["In this situation you…-Did not get personally involved"])
        }
        if(row.data["In this situation you…-Acted gradually"]){
            var dotOnLine = document.createElement('i')
            dotOnLine.setAttribute('style', 'left: ' + (+row.data["In this situation you…-Acted gradually"] * 4)+ 'px; border-color: ' + color(row))
            dotOnLine.setAttribute('class', 'dot-on-line')
            dotOnLine.setAttribute('nar-id', row.data.FragmentID)
            line2.appendChild(dotOnLine)
            // console.log(row.data["In this situation you…-Did not get personally involved"])
        }
    })
}

var drow = (data_, linetype) => {
    // if(!data) return;
    // drowDots(data_) 
    var data = data_
    graphData = data_
    d3.select("svg").remove();
    var width = window.innerWidth - 100;
    var height = 350//window.innerHeight / 2;
    document.getElementById('count').innerText = data_.length
   /* Scale */
    var xScale = d3.scaleTime()
        .domain([0, 12])
        .range([0, (width)]);

    var yScale = d3.scaleLinear()
        .domain([100, 0])
        .range([0, height]);
    
    /* Add SVG */
    var svg = d3.select("#chart").append("svg")
        .attr("width", (width)+"px")
        .attr("height", (height + 10)+"px")
        .attr('style', 'margin-left: ' + (step ? 0 : 3) + '%;')
        .append('g')
    
        // /* Add sieverts into SVG */
        
    var line = d3.line()
        .curve(step ? d3.curveStepBefore : basis ? d3.curveBasis : d3.curveLinear )
        .x((d, i) => xScale(i))
        .y((d, i) => yScale(d));
        
    
    
    let lines = svg.append('g').attr('class', 'liness');
    
    lines.selectAll('.line-group')
        .data(data).enter()
        .append('path')
            .attr('class', 'line')
            .attr('stroke', (d, i) => color(d, i))
            .attr('d', d => line(d.lineData))
            .style('opacity', .7)
            .style('stroke-width', .7)

    
    let linesHov = svg.append('g').attr('class', 'lines-hov');
            
    linesHov.selectAll('.line-hov-group')
        .data(data).enter()
        // .append('g')
        // .attr('class', 'line-group')  
        .append('path')
        // .attr('class', 'line-hov')  
        .attr('d', d => line(d.lineData))
        .style('opacity', 0)
            .style('stroke-width', 6)
            .style('fill', "none")
            .style('stroke', (d, i) => color(i))
            .on("mouseover", (d) => hover(d))
            .on("mouseout", (d) => out(d))
            .on("click", (d) => { show(d);});
            
}

document.getElementById('pop-close').addEventListener('click', () => {
    document.getElementById('pop-cont').style.display = "none"
    out()
})

const alert_ = (msg) => {
    document.getElementById('pop-inner').innerHTML = msg

    document.getElementById('pop-cont').style.display = "flex" 
}

var show = (d) => {
    // alert(d.data.Experience)
    var msg = '';
    ["1.2 Title", "Experience"]//,"FragmentID","NarrID","Are you related to/do you know either the victim or the perpetrator?","How is the victim related to the perpetrator?","What is the age category of the victim?","2.5 What is the gender of the perpetrator?","2.6 Where did this situation happen?","2.6 Other","2.8 Where did this situation happen?","3.1 Did you act/do something about this situation?","3.5 Have you contacted any services about this situation?","3.5 Other","4.1 The outcome of this situation for the victim was…","4.2 Situations like these…","5.1 If you were to witness a similar situation in the future you would…","6.5 Education","6.1 Gender","6.2 Age","6.6 Marital status","6.3 Ethnicity","6.3 Other","6.7 Monthly income","6.4 Attendance of religious services","6.8 Region of residence","6.11 Region originally from","6.11 Other","6.9 Residence","6.10 How long have you lived here for?"]
        .forEach(m => {
        msg += m + ': ' + d.data[m] + '<br>'
    })
    alert_(msg)
    // console.log(d)
}
     
var hover = (d) => {
    d3.selectAll('.line').filter(line => line.data.FragmentID != d.data.FragmentID)
                    .style('opacity', .01);
    d3.selectAll('.line').filter(line => line.data.FragmentID == d.data.FragmentID)
                    .style('stroke-width', 2);
    var dotsOnLine = document.getElementsByClassName('dot-on-line')
    for(var dotIndex; dotIndex < dotsOnLine.length; dotIndex++){
        if(dotsOnLine[dotIndex].getAttribute('nar-id') == d.data.FragmentID){
            dotsOnLine[dotIndex].classList.remove('hide')
        } else {
            dotsOnLine[dotIndex].classList.add('hide')
        }
    }
    Object.keys(d.data).forEach(key => {
        if(drowDropdowns[key.split('-')[0].split('_')[0]] && d.data[key] == 1){
            opts = drowDropdowns[key.split('-')[0].split('_')[0]].dom.getElementsByClassName('select-option')
            for(var optIndex = 0; optIndex < opts.length; optIndex++){
                opts[optIndex].classList.remove('higlight')
            }
        }
    })
    Object.keys(d.data).forEach(key => {
        if(drowDropdowns[key]){
            opts = drowDropdowns[key].dom.getElementsByClassName('select-option')
            for(var optIndex = 0; optIndex < opts.length; optIndex++){
                if(opts[optIndex].innerHTML == d.data[key]){
                    opts[optIndex].classList.add('higlight')
                } else {
                    opts[optIndex].classList.remove('higlight')
                }
            }
        } else if(drowDropdowns[key.split('-')[0].split('_')[0]] && d.data[key] == 1){
            val = key.split('_')[1]
            // key.split('-')[0].split('_')[0]
            opts = drowDropdowns[key.split('-')[0].split('_')[0]].dom.getElementsByClassName('select-option')
            // console.log(key , val)
            for(var optIndex = 0; optIndex < opts.length; optIndex++){
                if(opts[optIndex].innerHTML == val){
                    // console.log('+++')
                    opts[optIndex].classList.add('higlight')
                }
            }
        }
        // debugger
    })
                    
}
var out = (d) => {
    if(document.getElementById('pop-cont').style.display == 'flex') return;
    d3.selectAll(".line").style('opacity', .9).style('stroke-width', .7);
    opts = document.getElementsByClassName('select-option')
    for(var optIndex = 0; optIndex < opts.length; optIndex++){
        opts[optIndex].classList.remove('higlight')
    }
    var dotsOnLine = document.getElementsByClassName('dot-on-line')
    for(var dotIndex; dotIndex < dotsOnLine.length; dotIndex++){
        dotsOnLine[dotIndex].classList.remove('hide')
    }
}

const fieldsForVis =  ["3.2 To deal with this situation you-Secured new resources",
"3.2 To deal with this situation you-Used resources you have in a different way",
"3.2 To deal with this situation you-Connected to others (e.g. for information, exchange of experience)",

"3.4 What made it difficult for you to deal with this situation-Lack of access to resources",
"3.4 What made it difficult for you to deal with this situation-Lack of knowledge/skills",
"3.4 What made it difficult for you to deal with this situation-Lack of opportunities",

"3.5 What influenced the way you dealt with this situation?-Formal training",
"3.5 What influenced the way you dealt with this situation?-Own experience",
"3.5 What influenced the way you dealt with this situation?-Online resources",

"3.6 What helped you to deal with this situation?-Financial support",
"3.6 What helped you to deal with this situation?-Rules and procedures",
"3.6 What helped you to deal with this situation?-Infrastructure/technology",]

const mapToChartData = row => ({ lineData: step ? 
    [fieldsForVis[0], ...fieldsForVis].map(a => +row[a]): 
    fieldsForVis.map(a => +row[a]),
    data: row})

let globalData

d3.csv('./undp_ccg_15Dec2020_cleaned.csv')
    .then(csv => {
        csv_nonum = []
        csv.forEach(row => {
            now_nonum = {}
            Object.keys(row).forEach(colname => {
                // now_nonum[colname.replace(/^\d+\.\d+ /gi , '')] = row[colname] 
                now_nonum[colname] = row[colname] 
            })
            csv_nonum.push(now_nonum)
        }) 
        globalData = csv_nonum
        drowFilters(globalData)
        // globalData = csv
        buildDropdowns(csv_nonum)
        drow(csv_nonum.map(mapToChartData))
    })


const buildDropdowns = (data) => {
    
    var colorizer = document.getElementsByName('coloryze')[0]
    colorizeColumns.forEach(opt => {
        var option = document.createElement('option')    
        option.setAttribute("value", opt)
        option.innerHTML = opt
        colorizer.appendChild(option)
    })
    colorizer.addEventListener('change', () => {
        var sss =  document.getElementsByClassName('col-codes')[0]
        sss.innerHTML = ''
        var coloryzess = document.getElementsByName('coloryze')[0].value
        if(coloryzess && coloryzess != 'None' && drowDropdowns[coloryzess]){
            document.getElementsByClassName('col-codes')[0].classList.remove('col-codes')
            drowDropdowns[coloryzess].dom.classList.add('col-codes')// .getElementsByClassName('selected-option')
            // for(var i = 0; i < ppppt.length; i++){
            //     let li = document.createElement("li")
            //     li.innerText = ppppt[i].innerText
            //     sss.appendChild(li)
            // }
        }
        
        filter()
    })
    
    document.getElementsByName('line')[0].addEventListener('change', (e) => {
        step  = !1
        basis = !1
        if(e.target.value == "Step"){
            step  = !0
            basis = !1
        }
        if(e.target.value == "Basis"){
            step  = !1
            basis = !0
        }
        filter();
    })
    


    var sels = document.getElementsByClassName('select-title')
    for(var kk = 0; kk < sels.length; kk++){
        drowDropdowns[sels[kk].innerText] = { dom: sels[kk].parentNode, values: [] }
        var opts = sels[kk].parentNode.getElementsByClassName('select-option');
        for(var optIndex = 0; optIndex < opts.length; optIndex++){
            opts[optIndex].addEventListener('click', e => {
                var drpd = drowDropdowns[e.target.parentNode.getElementsByClassName('select-title')[0].innerText]
                if(drpd.values.indexOf(e.target.innerText) === -1){
                    drpd.values.push(e.target.innerText)
                    e.target.classList.add('option-selected')
                } else {
                    drpd.values.splice(drpd.values.indexOf(e.target.innerText), 1)
                    e.target.classList.remove('option-selected')
                }
                filter()
            })

        }
    }
    
}

// const drowDropdownDoms = {}
const drowDropdowns = {}

document.getElementById("clear").addEventListener('click', () => {
    var opts = document.getElementsByClassName('select-option');
    for(var optIndex = 0; optIndex < opts.length; optIndex++){
        opts[optIndex].classList.remove('option-selected')
    }
    Object.keys(drowDropdowns).forEach(dn => {
        drowDropdowns[dn].values = []; 
    })    
    filter();
})


const filter = () => {
    let filteredData = Object.keys(drowDropdowns)
        .reduce((globalDataReduced, drowDropdownName) => {
            // console.log(globalDataReduced, drowDropdowns, drowDropdownName) 
            if(drowDropdowns[drowDropdownName].values.length == 0) return globalDataReduced

            if (globalData[0][drowDropdownName] ){
                return globalDataReduced
                    .filter(row => drowDropdowns[drowDropdownName].values.length == 0 
                        || drowDropdowns[drowDropdownName].values.indexOf(row[drowDropdownName]) !== -1)
            } else {
                let filteredDataFromMulti = []
                drowDropdowns[drowDropdownName].values
                    .map(val => drowDropdownName + '_' + val)
                    .forEach(colName => {
                        filteredDataFromMulti = [...filteredDataFromMulti, ...globalDataReduced.filter(row => row[colName] == "1")]
                    })
                
                // console.log(drowDropdownName, filteredDataFromMulti)
                return filteredDataFromMulti
            }
        }
        , globalData)
        .map(mapToChartData)
    // console.log(2222, filteredData)
    drow(filteredData)
}

const uniqueValues = {}
const colorizeColumns = []
const drowFilters = (dataRows) => {
    cols = Object.keys(dataRows[0])
    cols.forEach(col => {
        let questionName = col.split('_')[0]
        uniqueValues[questionName] = uniqueValues[questionName] || []
        if(col.indexOf('_') !== -1) uniqueValues[questionName].push(col.split('_')[1])
    })
    
    dataRows.forEach(row => cols
            .filter(col => col.indexOf('_') === -1)
            .filter(col => uniqueValues[col].indexOf(row[col]) === -1)
            .forEach(col => uniqueValues[col].push(row[col])))
    
    s1r = new RegExp(["2.1", "2.2", "2.3", "2.4"].map(a => '^'+a).join("|"))
    s2r = new RegExp(["3.1", "3.3", "3.7"].map(a => '^'+a).join("|"))
    s3r = new RegExp(["4.1", "4.2"].map(a => '^'+a).join("|"))
    // s4r = new RegExp(["6.1","6.2","6.3","6.4","6.5","6.6","6.7","6.8","6.9","6.10","6.11"].map(a => '^'+a).join("|"))
    s4r = new RegExp(["5.1"].map(a => '^'+a).join("|"))
    s5r = new RegExp(["6.1","6.2","6.4","6.5","6.6","6.7","6.9","6.10","6.11"].map(a => '^'+a).join("|"))

    let uniqueCols = [...new Set(cols.map(col => col.split('_')[0]))]
    
    uniqueCols.forEach(col => {
            if (col.indexOf('Other') !== -1) return
            let sec = s1r.test(col) ? 1 
                : s2r.test(col) ? 2
                : s3r.test(col) ? 3
                : s4r.test(col) ? 4
                : s5r.test(col) ? 5
                : !1
            if(!sec) return
            col = col.split('_')[0]
            colorizeColumns.push(col)
            let cont = document.createElement('div')
            cont.setAttribute('class', "select-group")
            let titl = document.createElement('div')
            titl.setAttribute('class', "select-title")
            titl.innerText = col
            cont.appendChild(titl)
            // console.log(col)
            uniqueValues[col].forEach(val => {
                let opt = document.createElement('div')
                opt.setAttribute('class', "select-option")
                opt.innerText = val
                cont.appendChild(opt)
            })
            document.getElementById("sec-" + sec).appendChild(cont)
    })
    

}