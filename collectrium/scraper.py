from selenium import webdriver
from bs4 import BeautifulSoup
import time
import pandas as pd
import math

def getWholepage(url, times):
    
    driver = webdriver.Firefox()
    delay = 3
    driver.implicitly_wait(30)
    driver.get(url)
    
    for i in range(0, times):
        driver.execute_script("window.scrollTo(0, document.body.scrollHeight);")
        time.sleep(0.5)

    html_source = driver.page_source
    data = html_source.encode('utf-8')
    driver.quit()
    return data
    
def getPages(soup, name, num):
        
    fieldDict = {}
    for x in range(0, num):
        term = 'p' + str(x)
        fieldDict[term] = []
    fieldDict['img'] = []  
    
    for x in soup.find_all("a", name):
        if x['href'][:3] == '/en':
            
            pageURL = "https://www.kollerauktionen.ch" + x['href']
            newdriver = webdriver.Firefox()
            newdriver.implicitly_wait(30)
            newdriver.get(pageURL)
            html_source = newdriver.page_source
            data = html_source.encode('utf-8')
            sp = BeautifulSoup(data)
            
            info = []
            for x in sp.find_all('p'):
                info.append(x.text)         
            for x in sp.find_all('img', 'img-responsive'):
                fieldDict['img'].append("https://www.kollerauktionen.ch" + x['data-large-image'])
            for x in range(0, num):
                term = 'p' + str(x)
                fieldDict[term].append(info[x])
            newdriver.quit()
              
    return fieldDict
    
if __name__ == "__main__":
    
    currentURL = "https://www.kollerauktionen.ch/en/object-search.htm"
    scrollTime = int(math.ceil(float(1)/12))
    page = getWholepage(currentURL, scrollTime)
    soup = BeautifulSoup(page)

    attrClass = "M0200_Action_Panel btn btn-default btn-xs"
    fieldNum = 12
    data = getPages(soup, attrClass, fieldNum)

    df = pd.DataFrame()
    for x in data:
        df[x] = data[x]
        
    df = df.rename(columns = {'p0':'Lot_and_Timestamp', 'p4':'Size', 'p9':'Price_in_CHF', 'p3':'Description', 'img':'Large_Img_URL'})
    df.to_csv('current_auctions_example.csv', encoding='utf-8', index=False)