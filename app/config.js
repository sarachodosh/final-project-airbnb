var config = {
  style: 'mapbox://styles/laurarago/ckq1iuxap0wkk17p96m3vsgkj',
  accessToken: 'pk.eyJ1IjoibGF1cmFyYWdvIiwiYSI6ImNrbW42Nm1tYjFydHIydms1MmR2OWxsY3cifQ.TGWXqKIR57SVIHtUeBCbog',
  showMarkers: false,
  theme: 'light',
  alignment: 'center',
  subtitle: '',
  byline: '',
  footer: '',
  chapters: [
    {
      id: 'Start',
      title: 'A journey through Catalonia conquered by Airbnb',
      image: '',
      description: 'The Airbnb tourist rental platform has roughly <span style="background-color: #29DDC7">73,800 apartments</span> across Catalonia. Swipe down to see how they are distributed and learn more about the stress tourism puts on some Catalan towns.'
    ,
      location: {
        center: { lon: 1.35692, lat: 42.13644 },
        zoom: 6.98,
        pitch: 53.00,
        bearing: -20.80
      },
      onChapterEnter: [                 {
             layer: 'airbnb-fill',
             opacity: 0.7
         }],
      onChapterExit: [                 {
             layer: 'airbnb-fill',
             opacity: 0

        }]
    },
    {
      id: 'CostaBrava',
      title: 'Costa Brava has the highest concentration of Airbnbs',
      image: '',
      description: '<span style="background-color: #FFD208"><b>Costa Brava</b> is the tourist brand</span> with the greatest number of tourist rentals. Around 98% of the municipalities have at least one apartment listed, and nine of the 10 locations with the highest percentage of Airbnbs are in this region.',
      location: {
        center: { lon: 2.97687, lat: 42.02785 },
        zoom: 9.53,
        pitch: 59.00,
        bearing: -44.00
      },
      onChapterEnter: [ {
        layer: 'airbnb-brand',
        opacity: 0.7,

   }],
      onChapterExit: [{
        layer: 'airbnb-brand',
        opacity: 0,

   }]
    },
    {
      id: 'Roses',
      title: `Roses: the Airbnb paradise in L'Empordà`,
      image: '',
      description: 'Of all the municipalities, Roses is the one with the largest total number of Airbnb listings. Most are concentrated in the old town and in the Santa Margarida area, as well as near the Almadrava beach.',
      location: {
        center: { lon: 3.18551, lat: 42.28491 },
        zoom: 12.05,
        pitch: 60.00,
        bearing: 24.00
      },
      onChapterEnter: [ {
        layer: 'airbnb-brand',
        opacity: 0.7,

      },{
        layer: 'Roses',
        opacity: 0.5,
      }],
      onChapterExit: [{
        layer: 'airbnb-brand',
        opacity: 0
      },,{
        layer: 'Roses',
        opacity: 0,
      }]
    },
    {
      id: 'Roses',
      title: '',
      image: 'https://imagenes.cosasdebarcos.com/amarres/8/1/8/2/amarre-venta-65711060180969535353505449484569x.jpg',
      description: 'While Santa Margarida (picture above) is known for its tall towers of tourist apartments, the Canyelles and Almadrava areas are characterized by houses with swimming pools and summer chalets.'
      ,
      location: {
        center: { lon: 3.18551, lat: 42.28491 },
        zoom: 12.05,
        pitch: 60.00,
        bearing: 24.00
      },
      onChapterEnter: [ {
        layer: 'airbnb-brand',
        opacity: 0.7,

      },{
        layer: 'Roses',
        opacity: 0.5,
      }],
      onChapterExit: [{
        layer: 'airbnb-brand',
        opacity: 0
      },,{
        layer: 'Roses',
        opacity: 0,
      }]
    },
    {
      id: 'Begur',
      title: 'Begur, the empire of Airbnb in Costa Brava',
      image: '',
      description: 'This beautiful town, famous for its coves, has 935 Airbnb apartments: that’s <b>55.5% of all the houses</b>, according to Idescat data. Although it is very likely that this mismatch is due to the fact that some listings are for rooms inside apartments or houses, this statistic is still a good indicator of how much tourism dominates this area.      ',
      location: {
        center: { lon: 3.16966, lat: 41.95200 },
        zoom: 11.40,
        pitch: 8.00,
        bearing: -92.00
      },
      onChapterEnter: [ {
        layer: 'airbnb-brand',
        opacity: 0.7
      },{
        layer: 'Begur',
        opacity: 0.5
      } ],
      onChapterExit: [{
        layer: 'airbnb-brand',
        opacity: 0,
      },{
        layer: 'Begur',
        opacity: 0
      }]
    },
    {
      id: 'Costa Daurada',
      title: 'Costa Daurada, the second area stressed by tourism',
      image: '',
      description: 'Sun, large beaches, and fine sand attract a lot of tourists. Salou (2,419 listings), Cambrils (1,470) and Mont-Roig del Camp (1,190) take the top three spots in the region. The density of these tourist apartments is high as well, but a bit less than Costa Brava.',
      location: {
        center: { lon: 1.11232, lat: 41.10637 },
        zoom: 9.96,
        pitch: 26.00,
        bearing: -8.00
      },
      onChapterEnter: [ {
        layer: 'airbnb-fill',
        opacity: 0.7,

   }],
      onChapterExit: [{
        layer: 'airbnb-fill',
        opacity: 0,

   }]
  },
  {
    id: 'Naut Aran',
    title: 'Naut Aran, the Pyrenees Gaulish',
    image: '',
    description: 'Beaches aren’t the only attraction in Catalonia. For skiing or trekking, Val d’Aran is a paradise for those who prefer a backpack to a swimsuit. Naut Aran, a group of towns made up of Arties, Bagergue, Baqueira, Garòs, Gessa, Montgarri, Salardú, Tredòs and Unha, accounts for the <b>highest percentage of Airbnb</b> in all of Catalonia: 66%',
    location: {
      center: { lon: 0.90358, lat: 42.71372 },
      zoom: 10.27,
      pitch: 18.50,
      bearing: 0.00
    },
    onChapterEnter: [ {
      layer: 'airbnb-fill',
      opacity: 0.7,

    },{
      layer: 'NautAran',
      opacity: 0.5
    }],
    onChapterExit: [{
      layer: 'airbnb-fill',
      opacity: 0
    },{
  layer: 'NautAran',
  opacity: 0}
]
  },
  {
    id: 'Barcelona',
    title: 'Barcelona, crowded with touristic aparments',
    image: '',
    description: `Airbnb has been a source of complaints and legal discussions in Barcelona, where the City Council's attempts to legalize tourist accommodation have not been fully realized. The platform is accused of promoting gentrification and raising the price of rents, as well as being a nightmare for some residents. In Barcelona, Airbnb apartments are concentrated in the districts of Ciutat Vella, l’Eixample and Gràcia.`,
    location: {
      center: { lon: 2.12195, lat: 41.41609 },
zoom: 11.06,
pitch: 57.50,
bearing: -46.40
    },
    onChapterEnter: [ {
      layer: 'airbnb-fill',
      opacity: 0.7,

 }],
    onChapterExit: [{
      layer: 'airbnb-fill',
      opacity: 0,

 }]
  },
  {
    id: 'Lleida',
    title: 'No Airbnb and no tourism',
    image: '',
    description: 'Terres de Lleida, the second brand according to the area, is a tourism desert. Here, most municipalities don’t have any Airbnb listings. The Els Alamús website encapsulates this perfectly: its tourism section is empty.',
    location: {
      center: { lon: 0.80473, lat: 41.84571 },
zoom: 9.26,
pitch: 56.00,
bearing: -14.35
    },
    onChapterEnter: [ {
      layer: 'airbnb-fill',
      opacity: 0.7,

 }],
    onChapterExit: [{
      layer: 'airbnb-fill',
      opacity: 0,

 }]
  },
  {
    id: 'Alamús',
    title: 'Els Alamús: the land of no tourism',
    image: '',
    description: 'With no tourist claims and with less than a thousand inhabitants (and 21% of its population over 65), this town in the Segrià region summarizes the main characteristics of Catalonia without visitors.',
    location: {
      center: { lon: 0.73569, lat: 41.61954 },
zoom: 12.55,
pitch: 56.00,
bearing: 0.00
    },
    onChapterEnter: [ {
      layer: 'airbnb-fill',
      opacity: 0.7,

 },{
  layer: 'Alamus',
  opacity: 0.5}],
    onChapterExit: [{
      layer: 'airbnb-fill',
      opacity: 0,

 },{
  layer: 'Alamus',
  opacity: 0}]
  }
  ]
};