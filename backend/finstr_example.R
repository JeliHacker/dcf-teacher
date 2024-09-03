library(devtools)
install_github("bergant/finstr")

library(XBRL)
# parse XBRL (Apple 10-K report)
xbrl_url2014 <- "https://www.sec.gov/Archives/edgar/data/320193/000119312514383437/aapl-20140927.xml"
xbrl_url2013 <- 
  "https://www.sec.gov/Archives/edgar/data/320193/000119312513416534/aapl-20130928.xml"
old_o <- options(stringsAsFactors = FALSE)
xbrl_data_aapl2014 <- xbrlDoAll(xbrl_url2014)
xbrl_data_aapl2013 <- xbrlDoAll(xbrl_url2013)
options(old_o)