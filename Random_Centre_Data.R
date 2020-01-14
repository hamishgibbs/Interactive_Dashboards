library(raster)
library(sp)
library(classInt)
library(rgdal)

data = read.csv('/Users/hamishgibbs/Documents/Interactive_Dashboard_Data/Copy of Grants for website map - draft 18.12.19.csv')
countries = shapefile('/Users/hamishgibbs/Sites/Interactive_Dashboards/Countries_WGS84/Countries_WGS84.shp')

for(i in 1:length(countries)){
  poly = countries[i,]
  points = spsample(poly, 4, 'random')
  if (i == 1){
    all_points = points
  }else(all_points = rbind(all_points, points))
}

points = all_points[round(runif(length(data$Grant.code), 1, length(all_points)), 0),]
points = SpatialPointsDataFrame(points, data)
points@data

colnames(points@data) = c('GRANT_CODE', 'OVERALL_PI', 'TEG_INVESTIGATOR', 'SHORT_NAME', 'PROJECT_NAME', 'START_DATE', 'END_DATE', 'PROJECT_FUNDER', 'PROJECT_WEBSITE', 'PROJECT_LOCATION')

plot(countries)
plot(points, add=T)

shapefile(points, '/Users/hamishgibbs/Documents/Interactive_Dashboard_Data/Centre_Points.shp', overwrite=T)











