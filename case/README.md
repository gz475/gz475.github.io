A real estate bubble can produce significant effects in the economy of the United States. In order to identify bubbles before they burst, economists has developed a huge number of financial and economic indicators to evaluate housing market. The data of three indicators, including *Prices*, *Prices to Rents* and *Prices to Income*, are collected and visualized here to investigate the US 20 cities housing market and bubbles from 2000 to 2014.

## Data

For *Prices* indicator, Case-Shiller Home Price index is adopted, and the monthly reported data of the whole *US* and 20 major US cities, including *Atlanta*, *Boston*, *Charlotte*, *Chicago*, *Cleveland*, *Dallas*, *Denver*, *Detroit*, *Las Vegas*, *Los Angeles*, *Miami*, *Minneapolis*, *New York*, *Phoenix*, *Portland*, *San Diego*, *San Francisco*, *Seattle*, *Tampa* and *Washington DC*, were obtained through <a href="https://us.spindices.com/">S&P Dow Jones Indices</a>.

For *Prices to Rents* indicator, Fair Market Rents (hereafter FMR) servered as the rent information, and it's collected from <a href="http://www.huduser.org/portal/home.html">U.S. Department of Housing and Urban development</a>. Quarterly wages data (hereafter QCEW), which available from <a href="http://www.bls.gov/cew/data.htm">Bureau of Labor Statistics</a>, were used as income to calculate the *Prices to Income* incicator.

## Method

FMR data is averaged across all the bedroom types to represent the rent values of cities, and then also averaged across the cities to get *US* values. Since FMR is yearly reported, so linear regression is applied between years to get the rent values of each city in every month. For *Dallas*, the FMR data are not available on MSA scale since 2011, so the data is calculated by taking average of FMR of all the Zip Codes in *Dallas*.

QCEW data is quarterly reported, so the same as FMR data, linear regression is applied between quarters to get the income values of each city in every month, and then the data is de-seasonalized to eliminate seasonality patterns.

Case-Shiller index data is divided by rent and income data of every city in each month to get *Prices to Rents* and *Prices to Income* values, and then these data are also normalized to the base month January 2000.

## Discussion

In terms of *Prices*, the peak of *US* appears in July 2006, and experienced a long term depression until April 2009 with only 67% of the highest value. In the end of 2014, it finally achieved 84% of the peak value. It's observed that the financial crisis happens exactly during the housing price decline, iconic events including *Lehman Brothers files for bankruptcy protection* in September 2008 and *Dow Jones hits lowest point in twelve years* in March 2009. Among the cities, *Miami* has the hightest value in December 2006, 5 months after *US* reaches its peak. The lowest price is from *Detroit* in April 2011.

For *Prices to Rents*, the *US* peak happens in April 2006 with 80% more than the lowest point appears in February 2012. The greatest value is also from *Miami* in February 2006, and the lowest point is April 2011 of *Denver*. What's interesting is, the peaks of cities in *Prices to Rent* happens before they reach peaks in *Prices*, and the change ranges of cities in *Prices to Rent* are much smaller than those of cities in *Prices*.

For *Prices to Income*, there are more dramatic changes compared to *Prices* and *Prices to Rent*, and this might be caused by the lack of accurately monthly data. The *US* peaks in Novemeber 2005, and having the lowest value in February 2006. For the 20 cities, *Miami* reaches its peak in July 2006, and *Denver* gets the lowest point in April 2011. 





