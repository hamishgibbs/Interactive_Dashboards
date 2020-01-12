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

points = SpatialPointsDataFrame(all_points, data=data.frame('id'=1:length(all_points),
                                                            'CASES'=rnorm(length(all_points), 100, 20),
                                                            'DEATHS'=rnorm(length(all_points), 2, 1),
                                                            'INFECTION_RATE'=rnorm(length(all_points))))

plot(points@data$CASES, points@data$DEATHS)

classes = classIntervals(as.numeric(points$CASES), n = 10, style = 'kmeans')

points$CASES_COUNT_CLASS = NA

for(i in seq_along(points$CASES)){
  points$CASES_COUNT_CLASS[i] = findInterval(points$CASES[i], classes$brks)
}

shapefile(points, '/Users/hamishgibbs/Documents/LSHTM/Interactive_Dashboard_Data/Z_Points.shp', overwrite=T)

