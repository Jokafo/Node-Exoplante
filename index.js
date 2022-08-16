// The CSV-Parser converts CSV text into arrays or objects
import { parse } from 'csv-parse'
import * as fs from 'fs'

const habitablePlanets = []

// Filter habitable planets
function isHabitablePlanet(planet) {
  return (
    // Confirm that the planet exists
    planet['koi_disposition'] === 'CONFIRMED' &&
    // The optimal light that the planet gets
    planet['koi_insol'] > 0.36 &&
    planet['koi_insol'] < 1.11 &&
    // The planet's optimal radius
    planet['koi_prad'] < 1.6
  )
}

// Read the data in the CSV file => 'RAW BUFFER OF BITES'
fs.createReadStream('kepler_data.csv')
  // Parse the RAW data into objects
  .pipe(
    parse({
      comment: '#',
      columns: true,
    })
  )
  // Save the planets to an array
  .on('data', (data) => {
    if (isHabitablePlanet(data)) {
      habitablePlanets.push(data)
    }
  })
  .on('error', (err) => {
    console.error(err)
  })
  .on('end', () => {
    // Map out the planets in an array of objects.
    console.log(
      habitablePlanets.map((planet) => {
        return planet['kepler_name']
      })
    )
    console.log(`${habitablePlanets.length} Habitable planets found!`)
  })
