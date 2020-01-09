library(raster)
library(sp)
library(classInt)
library(rgdal)
library(geojson)
library(geojsonio)

z = shapefile('/Users/hamishgibbs/Downloads/gadm36_ZWE_shp/gadm36_ZWE_2.shp')

for(i in 1:length(z)){
  poly = z[i,]
  points = spsample(poly, runif(1, 1, 10), 'random')
  if (i == 1){
    all_points = points
  }else(all_points = rbind(all_points, points))
}

plot(z)
plot(all_points, add=T)

points = SpatialPointsDataFrame(all_points, data=data.frame('CASES'=runif(length(all_points), 100, 1000),
                                                            'DEATHS'=runif(length(all_points), 2, 10),
                                                            'INFECTION_RATE'=runif(length(all_points))))

classes = classIntervals(as.numeric(points$CASES), n = 10, style = 'kmeans')

points$CASES_COUNT_CLASS = NA

for(i in seq_along(points$CASES)){
  points$CASES_COUNT_CLASS[i] = findInterval(points$CASES[i], classes$brks)
}

shapefile(points, '/Users/hamishgibbs/Documents/LSHTM/Interactive_Dashboard_Data/Z_Points.shp')

points@data

geojson_write(points, file='H:/Projects/Interactive_Dashboards/Javascript_HTML/Example_Map/Zimbabwe_Synthetic_Data.geojson')

as.geojson(points)

writeOGR(as.geojson(points), "H:/Projects/Interactive_Dashboards/Javascript_HTML/Example_Map", layer="Zimbabwe_Synthetic_Data.geojson", driver="GeoJSON")

points@coords
