Nowadays, 3D graphics can be rendered within most of web browsers without the use of any plug-in thanks to the rapid development of programmable Graphics Processing Units. The idea here is to create a 3D interactive model to better demonstrate and understand <a href="http://www.nyc.gov/html/dcp/html/bytes/applbyte.shtml">Primary Land Use Tax Lot Output</a> (hereafter PLUTO) and other geographic data of Manhattan in WebGL.

## Data

The PLUTO data used were published in December 2014 by <a href="http://www.nyc.gov/html/dcp/home.html">New York City Department of City Planning</a>. The data contain seventy data fields came from various datasets maintained by different Departments. Six data fields, including *Number of Floors*, *Built Floor Area Rate*, *Year Built*, *Year Altered 1*, *Residential and Non-Residential Units*, and *Residential Units*, are chosen from building characteristics data. For more information about these data fields, please check <a href="http://www.nyc.gov/html/dcp/pdf/bytes/pluto_datadictionary.pdf?r=1">PLUTO Data Dictionary</a>. 

<a href="http://www.nyc.gov/html/dcp/home.html">Census Blocks 2010</a> boundary is utilized to aggregate PLUTO data on a higher spatial scale, as well as to facilitate incorporating other data like census data in future. 

## Method

Building information is derived from PLUTO data in term of Census Blocks boundary in PostSQL, and then transformed to Geojson format. Creating SVG by importing Geojson files in D3.js, then render them in Three.js with the help of d3-threeD.js. The detailed technical procedures are as follows: 

1. Translate PLUTO and Census Blocks shapefiles to latitude and longitude format, then import these two files into PostSQL.

2. Create Manhattan Census Blocks table by querying intercetions of the two files, then query the average of <I>Number of Floors</I>, <I>Built Floor Area Rate</I>, <I>Year Built</I>, <I>Year Altered 1</I>, and sum of <I>Residential and Non-Residential Units</I>, and <I>Residential Units</I> of all the bulidings in each block and assign these values to the blocks.

3. Export Manhattan Census Blocks shapefile, and translate it to Geojson format.

4. Set up Three.js environment.

5. Import Geojson file using D3.js, and then create Three.js object by d3-threeD.js.

6. Make data transition smooth by Tween.js.

7. Add legend and controls.

## Discussion

From this 3D Model, it's observed that Manhattan skyscrapers are mainly concentrated in Midtown and Lower Manhattan, and the tallest building is One World Trade Center which has 104 floors. 

Same story happens with bulit Floor Area Rate (hereafter FAR), and the block with highest FAR is Times Square Tower. Since the floor number and FAR of Times Square Tower are both 48, it means that the covered area of each floor in this tower is the same as the area of the plot. 

More than half of the buildings in Manhattan were built between 1900s to 1940s, which explains why almost every building went through at least one alteration after 1950, and the new built ones trend to lie along the riverside. 

Residential units are concentrated in Roosevelt Island as well as Peter Cooper Village Stuyvesant Town, and all units data seems very similar to residential units data, which might caused by missing data as mentioned in the PLUTO Data Dictonary.



















