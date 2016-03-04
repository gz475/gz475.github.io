## Method

The basic idea is to utilize the page of <a href="https://www.kollerauktionen.ch/en/auctioncalendar-archive.htm">Results & Catalogues past sales</a>, go to "Online catalogue" of each sale and mimic scroll down in browser to retrieve all the lots, then redirect to each lot page to scrape the detailed information. Selenium is used to mimic the scroll behavior here. All the detailed information of the lots are preserved, and can be further parsed into more data columns based on requirement. Here just use data from sales of "19th-century-paintings-8" and "wine-2" for demonstration.
