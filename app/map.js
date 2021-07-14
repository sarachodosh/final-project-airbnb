    var layerTypes = {
        'fill': ['fill-opacity'],
        'line': ['line-opacity'],
        'circle': ['circle-opacity', 'circle-stroke-opacity'],
        'symbol': ['icon-opacity', 'text-opacity'],
        'raster': ['raster-opacity'],
        'fill-extrusion': ['fill-extrusion-opacity']
    }
    
    var alignments = {
        'left': 'lefty',
        'center': 'centered',
        'right': 'righty'
    }
    
    function getLayerPaintType(layer) {
        var layerType = map.getLayer(layer).type;
        return layerTypes[layerType];
    }
    
    function setLayerOpacity(layer) {
        var paintProps = getLayerPaintType(layer.layer);
        paintProps.forEach(function(prop) {
            map.setPaintProperty(layer.layer, prop, layer.opacity);
        });
    }
    
    var story = document.getElementById('story');
    var features = document.createElement('div');
    features.classList.add(alignments[config.alignment]);
    features.setAttribute('id', 'features');
    
    var header = document.createElement('div');
    
    if (config.title) {
        var titleText = document.createElement('h1');
        titleText.innerText = config.title;
        header.appendChild(titleText);
    }
    
    if (config.subtitle) {
        var subtitleText = document.createElement('h2');
        subtitleText.innerText = config.subtitle;
        header.appendChild(subtitleText);
    }
    
    if (config.byline) {
        var bylineText = document.createElement('p');
        bylineText.innerText = config.byline;
        header.appendChild(bylineText);
    }
    
    if (header.innerText.length > 0) {
        header.classList.add(config.theme);
        header.setAttribute('id', 'header');
        story.appendChild(header);
    }
    
    config.chapters.forEach((record, idx) => {
        var container = document.createElement('div');
        var chapter = document.createElement('div');
        
        if (record.title) {
            var title = document.createElement('h3');
            title.innerText = record.title;
            chapter.appendChild(title);
        }
        
        if (record.image) {
            var image = new Image();  
            image.src = record.image;  
            chapter.appendChild(image);
        }
        
        if (record.description) {
            var story = document.createElement('p');
            story.innerHTML = record.description;
            chapter.appendChild(story);
        }
    
        container.setAttribute('id', record.id);
        container.classList.add('step');
        if (idx === 0) {
            container.classList.add('active');
        }
    
        chapter.classList.add(config.theme);
        container.appendChild(chapter);
        features.appendChild(container);
    });
    
    story.appendChild(features);
    
    var footer = document.createElement('div');
    
    if (config.footer) {
        var footerText = document.createElement('p');
        footerText.innerHTML = config.footer;
        footer.appendChild(footerText);
    }
    
    if (footer.innerText.length > 0) {
        footer.classList.add(config.theme);
        footer.setAttribute('id', 'footer');
        story.appendChild(footer);
    }
    
    mapboxgl.accessToken = config.accessToken;
    
    const transformRequest = (url) => {
        const hasQuery = url.indexOf("?") !== -1;	  
        const suffix = hasQuery ? "&pluginName=journalismScrollytelling" : "?pluginName=journalismScrollytelling";	  
        return {
          url: url + suffix
        }	  
    }
    
    var map = new mapboxgl.Map({
        container: 'map',
        style: config.style,
        center: config.chapters[0].location.center,
        zoom: config.chapters[0].location.zoom,
        bearing: config.chapters[0].location.bearing,
        pitch: config.chapters[0].location.pitch,
        scrollZoom: false,
        attributionControl: true,
        transformRequest: transformRequest
    });
    
    var marker = new mapboxgl.Marker();
    if (config.showMarkers) {
        marker.setLngLat(config.chapters[0].location.center).addTo(map);
    }
    
    // instantiate the scrollama
    var scroller = scrollama();
    
    map.on("load", function() {
        map.addSource("airbnb", {
        type: 'vector',
        url: 'mapbox://laurarago.2plwqw2z',
        });
    
        map.addSource("Municipalities", {
        type: 'vector',
        url: 'mapbox://laurarago.8vqorl0k',
        });
    
    
    
    
    var hoveredStateId =  null;
    var searched_lngLat = null;
    
        map.addLayer({
            'id': 'airbnb-fill',
            'type': 'circle',
            'source': 'airbnb',
            'source-layer': 'AirbnbData',
            'paint': {
            // make circles larger as the user zooms from z12 to z22
            'circle-radius': {
                'base': 1.75,
                'stops': [
                    [9, 2],
                    [10, 4],
                    [15, 7]
                ]
                },
            'circle-color': '#29DDC7',
            'circle-opacity': 0.7,
            'circle-stroke-color': ["case", ["boolean", ["feature-state", "hover"], false], "black", "white"],
            'circle-stroke-width': ["case", ["boolean", ["feature-state", "hover"], false], 2, 0]}
        }, "settlement-subdivision-label");
    
        map.addLayer({
            'id': 'airbnb-brand',
            'type': 'circle',
            'source': 'airbnb',
            'source-layer': 'AirbnbData',
            'paint': {
                // make circles larger as the user zooms from z12 to z22
                'circle-radius': {
                    'base': 1.75,
                    'stops': [
                        [9, 2],
                        [10, 4],
                        [15, 7]
                    ]
                },
            'circle-color': ["match", ["get","RealData_brand"], "Costa Brava", "#FFD208", "#29DDC7"],
            'circle-opacity': 0,
            'circle-stroke-color': ["case", ["boolean", ["feature-state", "hover"], false], "black", "white"],
            'circle-stroke-width': ["case", ["boolean", ["feature-state", "hover"], false], 2, 0]}
        }, "settlement-subdivision-label");
    
        map.addLayer({
            'id': 'Roses',
            'type': 'line',
            'renderingMode': '2d',
            'source': 'Municipalities',
            'source-layer': 'Municipalities',
            'filter': ['in', "cap_muni", "Roses"],
            'paint': {
            "line-color": "#333333",
            "line-width": 4,
            "line-opacity": 0
            
            }
                }, "settlement-subdivision-label");
    
                map.addLayer({
            'id': 'Begur',
            'type': 'line',
            'renderingMode': '2d',
            'source': 'Municipalities',
            'source-layer': 'Municipalities',
            'filter': ['in', "cap_muni", "Begur"],
            'paint': {
            "line-color": "#333333",
            "line-width": 4,
            "line-opacity": 0
            
            }
                }, "settlement-subdivision-label");
    
    
    map.addControl(new mapboxgl.Minimap({
        id: "mapboxgl-minimap",
        width: "25vh",
        height: "25vh",
        style: "mapbox://styles/laurarago/ckq1iuxap0wkk17p96m3vsgkj",
        lineColor: "#29DDC7",
        lineWidth: 1,
        lineOpacity: 1,
        fillColor: "#29DDC7",
        fillOpacity: 0.25,
        center: { lon: 1.61177, lat: 41.70028 },
            zoom: 4.7,
                zoomLevels: []
            }), 'bottom-right');
    
        // setup the instance, pass callback functions
        scroller
        .setup({
            step: '.step',
            offset: 0.5,
            progress: true
        })
        .onStepEnter(response => {
            var chapter = config.chapters.find(chap => chap.id === response.element.id);
            response.element.classList.add('active');
            map.flyTo(chapter.location);
            if (config.showMarkers) {
                marker.setLngLat(chapter.location.center);
            }
            if (chapter.onChapterEnter.length > 0) {
                chapter.onChapterEnter.forEach(setLayerOpacity);
            }
        })
        .onStepExit(response => {
            var chapter = config.chapters.find(chap => chap.id === response.element.id);
            response.element.classList.remove('active');
            if (chapter.onChapterExit.length > 0) {
                chapter.onChapterExit.forEach(setLayerOpacity);
            }
        });
    });
    
    // setup resize event
    window.addEventListener('resize', scroller.resize);

    