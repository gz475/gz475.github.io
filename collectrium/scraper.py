from selenium import webdriver
from bs4 import BeautifulSoup
import time
import pandas as pd
import math
import re

##scroll down the sale page to retrieve all the lots
def getSalepage(url):
    
    driver = webdriver.Firefox()
    driver.implicitly_wait(30)
    driver.get(url)
    html_source = driver.page_source
    data = html_source.encode('utf-8')
    
    sp = BeautifulSoup(data)
    for x in sp.find_all("option", "wp-filterselect wp-novalue"):
        num = re.sub("[^0-9]", "", x.text)
    
    for i in range(0, int(num)/2):
        driver.execute_script("window.scrollTo(0, document.body.scrollHeight);")
        time.sleep(1)

    html_source = driver.page_source
    data = html_source.encode('utf-8')
    driver.quit()
    return data
    
##go through all the lot pages in one sale    
def getLots(soup, name, num):
        
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
                break
            for x in range(0, num):
                term = 'p' + str(x)
                fieldDict[term].append(info[x])
            newdriver.quit()
              
    return fieldDict
        
##get lot data from one sale
def parseSale(url):
    
    page = getSalepage(url)
    soup = BeautifulSoup(page)

    attrClass = "M0200_Action_Panel btn btn-default btn-xs"
    fieldNum = 12
    data = getLots(soup, attrClass, fieldNum)
    
    df = pd.DataFrame()
    for x in data:
        df[x] = data[x]
    
    df.to_csv( url.split('/')[-1]+ '.csv', encoding='utf-8', index=False)
    

if __name__ == "__main__":    
    
    driver = webdriver.Firefox()
    driver.implicitly_wait(30)

    driver.get("https://www.kollerauktionen.ch/en/auctioncalendar-archive.htm")
    html_source = driver.page_source
    data = html_source.encode('utf-8')
    soup = BeautifulSoup(data)

    ##go throuth each sale
    for x in soup.find_all("a", "btn btn-default btn-xs"):
        if x.text == 'Online catalogue':
            parseSale("https://www.kollerauktionen.ch" + x['href'])
            
    driver.quit()