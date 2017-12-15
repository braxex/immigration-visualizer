
export let genNotes = {
  'lprNote': 'Immigrant data not shown for those with unknown country of birth and for countries where total immigrant population in a given year was less than 10.',
  'niNote': 'Data not shown for those with unknown or nonexistent country of citizenship and for countries where total immigrant population in currently selected year was less than 10.',
  'dwNote': 'dw = Data withheld to limit disclosure.',
}

export function csvHandler (csvData,lprni) {
  if (lprni === 'LPR') {
    csvData.forEach(function(d) {
      d.immediateRelative = +d.immediateRelative;
      d.familySponsored = +d.familySponsored;
      d.employmentBased = +d.employmentBased;
      d.refugeeAsylee = +d.refugeeAsylee;
      d.diversityLottery = +d.diversityLottery;
      d.adoptedOrphans = +d.adoptedOrphans;
      d.other = +d.other;
      d.total = +d.total;
    });
  }
  if (lprni === 'NI') {
    csvData.forEach(function(d) {
      d.temporaryVisitor = +d.temporaryVisitor;
      d.studentExchange = +d.studentExchange;
      d.temporaryWorker = +d.temporaryWorker;
      d.diplomatRep = +d.diplomatRep;
      d.other = +d.other;
      d.total = +d.total;
    });
  }
}

export function combinator () {


}

// the three buckets
// var worldMap = worldMap.features
// var countries = csvData
// var flags = [['name', 'href']]

/*var countryFlags = countries.map(country => {...country, href: flags.find(flag => flag[0] === country.birthCountry)[1]  })

countryFlagsWorldMap = worldMap.features.map(f => ({
  name: f.properties.NAME,
  population: f.properties.POP_EST,
  id: f.properties.ISO_A3,
  geometry: f.geometry,
  formalName: f.FORMAL_EN,
  immigrationData: countryFlags.find(countryFlag => countryFlag.id === f.properties.ISO_A3) //AFG
})
//.filter (x => x.immigrationData !== null)
)
.sort(
  (a,b) => {
    if (a.name < b.name) return -1;
    if (a.name > b.name) return 1;
    return 0;
  }
)*/
