Even after years of living in their neighborhoods, people might not be able to know all the secrets of them. As a consequence, this map which contains detailed information of New York City restaurants and nightlife spots data that scraped from Yelp is provided to help New Yorkers better explore their neighborhoods.

## Data

The restaurants and nightlife spots data were obtained through <a href="https://www.yelp.com/developers/documentation">Yelp API</a> in January 2015. For each one of the 26774 venues, information like *Name*, *ID*, *Review Number*, *Rating*, *Phone Number*, *Category* and *Subcategory* are preserved.

The neighborhood boundary is adapted from Neighborhood Tabulation Areas published by <a href="http://www.nyc.gov/html/dcp/html/bytes/applbyte.shtml#district_political">New York City Department of City Planning</a> in November 2014.

## Method

Through Yelp API, the information of venues under centain categories like restaurants and nightlife can be queried and collected. Then this information is aggregated by neighborhood boundary to give an overview of the venues distribution in New York City, and another underlying layer is also provided to show the details of each spot. The data processing steps are as follows:

1. Divide NYC into grids, then query all the restaurants and nightlife spots in each grid, and collect *Name*, *ID*, *Review Number*, *Rating*, *Phone Number*, *Category* and *Subcategory* data of each venue.

2. Import Yelp data into PostSQL, create point shapefile, count numbers of venues in each neighborhood and save them as the attributes of the neighborhood boundary.

3. Export neighborhood boundary and venues information shapefile, translate them to Geojson format.

4. Create a mapbox tilelayer on <a href="https://www.mapbox.com/">Mapbox</a>, and set up the map environment using mapbox.js.

5. Add Geojson files and customize styles.

## Discussion

The restaurants and nightlife spots are highly concentrated in Manhattan, particularly Midtown and Lower Manhattan, followed by Queens and Brooklyn. The top three neighborhoods are *Midtown Central*, *East Village* and *West Village*, with respective numbers of *1406*, *748* and *579*. The number of restaurants in each neighborhood is much higher than that of nightlife spots.

The top five subcategories of resturants and nightlife are *New American*, *Italian*, *Pizza*, *Delis* and *Chinese*, with respective numbers of *749*, *737*, *663*, *630* and *574*. They spread all over the city. Actually, the venues distributions of subcategories that having smaller numbers are more interesting, especially the patterns outside Manhattan. For example, the *Shanghainese*, one specific kind of *Chinese*, are in Flushing, and *African* ones are in Bedford–Stuyvesant, Jamaica and Morrisania, and these places are exactly where Chinese and African diaspora are mainly distributed in the city. 

Apparently, the resturants and nightlife spots are social sensors that can reveal social reality, and thus help to better understand and improve the city.


