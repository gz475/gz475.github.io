Migration flows of the Metropolitan Statistical Areas (hereafter MSAs) are essential in understanding their demographics, economic, social and political statuses and how they evolve over time. In order to examine the data in a more intuitional way and thus facilitate studies related to MSAs migration in future, the 2012 flows data between top 50 MSAs are captured and visualized here.

## Data

The county-to-county migration flows data, which derived from 2008-2012 5-year ACS, are available from <a href="https://www.census.gov/hhes/migration/data/acs/county_to_county_mig_2008_to_2012.html">United States Census Bureau</a>. This release consists of *Inflow*, *Outflow* and *Netflow* data, as well as *Employment*, *Work Status* and *Occupation* breakdowns. For more details, please check the 2008-2012 ACS County-to-County <a href="https://www.census.gov/hhes/migration/files/acs/county-to-county/2008-2012/2008-2012%20Migration%20Flows%20Documentation.pdf">Migration Files Documentation</a>. 

To aggregate the county-to-county flows data on MSA scale, the boundaries of counties and MSAs are also obtained from <a href="https://www.census.gov/geo/maps-data/data/tiger-line.html">TIGER/Line Shapefiles</a>. The 2012 MSAs population data are downloaded from <a href="http://factfinder.census.gov/faces/nav/jsf/pages/index.xhtml">American FactFinder</a>.

## Method

County-to-County flows data are first parsed to MSA-to-MSA flows data based on their boundaries from TIGER/Line Shapefiles with the help of PostSQL, then the *Inflow*, *Outflow*, *Netflow*, all the *Employment*, *Work Status* and *Occupation* breakdowns data of MSAs and paths between MSAs are calculated separately. The detailed steps are as follows:

1. Import 2012 County and MSA shapefiles into PostSQL, and query the list of counties of each MSA.

2. Calculate *Inflow*, *Outflow*, *Netflow*, as well as all the *Employment*, *Work Status* and *Occupation* breakdowns *Number* and *Rate* of each MSA.

3. Calculate *Inflow*, *Outflow*, *Netflow*, as well as all the *Employment*, *Work Status* and *Occupation* breakdowns *Number* and *Rate* of each path between MSAs.

4. Set up projection in D3.js, and plot MSAs points and arcs between them.

5. Add bar chart and make animation works.

## Discussion

This visualization can serve as a great tool to expose secrets of migration flows between MSAs. 

*Los Angeles-Long Beach-Santa Ana* is the most popular MSA that having both the largest number of immigration and emigration. For *Inflow*, more than 176,000 people moved there in 2012, and *Riverside-San Bernardino-Ontario* is the MSA who contributes most. Among most of the subcategories of *Employment*, *Work Status* and *Occupation*, *Los Angeles-Long Beach-Santa Ana* maintains its NO.1 position, except *Last worked 1 to 5 years ago*, *Natural resources, construction, and maintenance occupations* and *Production, transportation, and material moving occupations* that are replaced by *Riverside-San Bernardino-Ontario*, and *In larbor force, in Armed Forces* and *Military specific occupations* that are substituded by *San Diego-Carlsbad-San Marcos*. For *Outflow*, nearly 240,000 people moved out of there, and most of them went to *Riverside-San Bernardino-Ontario*. In terms of subcategories, its NO.1 position is only replaced by *San Diego-Carlsbad-San Marcos* in *In larbor force, in Armed Forces* and *Military specific occupations*. *Riverside-San Bernardino-Ontario* has the greatest number of net immigration due to a huge number of people from *Los Angeles-Long Beach-Santa Ana*, and *New York-Newark-Edison* loses more than 81,000 people in 2012, which makes it the last with *Netflow*. 

In terms of *Rate*, *San Antonio* has the largest rate of immigration among MSAs, and nearly 7‰ people lived in *Houston-Baytown-Sugar Land* went there, followed by *Austin-Round Rock* with more than 6‰. What's interesting is  *San Antonio* is not in the NO.1 position of any subcategories with *Employment*, *Work Status* and *Occupation*, which means that the *Inflow* data are not completely divided by subcategories in the census data. *San Diego-Carlsbad-San Marcos* has the greatest rate of emigration, and the people went to *Riverside-San Bernardino-Ontario* made up more than 8‰ of the population there, followed by *Los Angeles-Long Beach-Santa Ana* with 7.5‰. Among all the subcategories, *San Diego-Carlsbad-San Marcos* maintained its NO.1 position. For *Netflow*, the top position is occupied by *Austin-Round Rock*, and also *Houston-Baytown-Sugar Land* and *Dallas-Fort Worth-Arlington* contributed the largest population rate. *Los Angeles-Long Beach-Santa Ana* loses the greatest rate of population followed by *Detroit-Warren-Livonia* and *New York-Newark-Edison*, with respective numbers of 4.87‰, 4.83‰ and 4.32‰ in 2012.






