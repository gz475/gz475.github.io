Two years after WNYC's <a href="http://project.wnyc.org/dogs-of-nyc/">Dogs of NYC</a> mapping, we've revisited the topic to provide the most up-to-date visual of dog data that's available to the public. Information depicted as part of this interactive map related to all currently active licensed dogs living in New York City.

## Data

Dog data presented in this map is courtesy of the <a href="http://www.nyc.gov/html/doh/html/home/home.shtml">New York City Department of Health and Mental Hygiene</a> and details all licensing data for dogs throughout New York City between January 2007 and January 2015. Information included as part of this dataset are dog license status, sex, vaccination status, neutered status, name, breed type and coloration. 

311 service requests information was obtained via <a href="https://nycopendata.socrata.com/">NYC OpenData</a> in February 2015, and total 57873 records of dog related complains, like Barking Dog, Canine Violation, Unleased Dog and Dog Waste, were extracted and parsed based on Zip Code. The time span of 311 data is also from January 2007 to January 2015.

The Zip Code boundary was available from the <a href="http://www.nyc.gov/html/doitt/html/home/home.shtml">New York City Department of Information Technology & Telecommunications</a>. Dog images were collected by searching on <a href="https://en.wikipedia.org/wiki/Main_Page">Wikipedia</a>.

## Method

The dog licensing and 311 data are already in good format, and both of them have Zip Code information embraced, so we just need to parse the data on Zip Code scale. The detailed steps are as follows:

1. Extract all the records of currently active dogs, and aggregate the data based on their Zip Codes, find out the sex, vaccination and neutered ratios, as well as top three names, breeds and colors in each Zip Code.

2. Export 311 entries with 'Noise, Barking Dog (NR5)', 'E8 Canine Violation', 'Unleashed Dog in Public', 'Dog Off Leash' and 'Dog' in 'Descriptor' column, combine complain types into *Noise from Dog*, *Canine Violation*, *Unleased Dog* and *Dog Waste*, and also aggregate the data by Zip Code.

3. Set up Mapbox environment, load Zip Code Geojson file and style it based on dog and 311 data.

4. Collect dog imagines, add Zip Code information and popup windows.

## Discussion

Compared to the mapping two years ago, several changes are noticed. Firstly, less dogs are registered in New York City, and the total number is around *70,000* at present compared to almost 100,000 two years ago. Secondly, the most popular dog name in our city is occupied by *Bella* instead of *Max* now, and this might be caused by the drop in documented male dog number. Thirdly, *Shih Tzu*, *Yorkshire Terrier* and *Chihuahua* are the current top three breeds in the city.

After coloring the Zip Codes by total dog numbers, it's obvious that Zip Code *10025* has the largest number of dogs, followed by *10024* and *10023*, with respective numbers of *1,897*, *1,514* and *1,443*. What's interesting is that the top breed in each of these three Zip Codes is Labrador Retriever, and all of them have much higher vaccination and neutered ratios than the average ratios in the city. In terms of dog name distributions, Zip Code *10314* has the largest number of dogs named *Bella*, and Zip Code *10312* has the largest number of dogs named *Coco*.

The numbers of 311 complains is not highly linear correlated with numbers of dogs on Zip Code scale. In the light of all 311 requests, the top three Zip Codes are *11385*, *10314* and *11209*, with respective numbers of *947*, *943* and *857*. As for different complain types, the top Zip Codes for *Noise from Dog*, *Canine Violation*, *Unleased Dog* and *Dog Waste* are *10314*, *10466*, *11215* and *10465* respectively. What need reminds is, the 311 complains recorded in one Zip Code are not necessarily related to the dogs licensed in that area.


<!-- 

## Appendix

Boroughs and Zip Codes mentioned above:  
**Manhattan**          *10025, 10024, 10023*  
**Brooklyn**           *11209, 11215*  
**Queens**             *11385*  
**Bronx**              *10466*, *10465*  
**Staten Island**      *10314*, *10312*   -->
