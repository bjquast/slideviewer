# slideviewer
javascript and OpenSeadragon scripts to make electron and light microscopical microscopy images available via web browsers
see examples here:

- zoom in with Ctrl-mousewheel or Alt-mousewheel, next image with mousewheel, translate view with left mousebutton

http://www.q-terra.de/tagebau/ (german)

http://131.220.138.195/slides/ (resize browser window if no images are available)

usage:

- prepare files as deepzoom images with vips-program:
- single file: vips dzsave filename filename.dzi --suffix .jpg[Q=100]
- directory of files: for i in *.tif; do vips dzsave $i $i.dzi --suffix .jpg[Q=90]; done
- put dzi directories into directory series_img
- edit imagelist.json in this directory to reference the files
- open slideviewer.html in browser

A similar project is available as API for webservices at https://github.com/hbz/DeepZoomService


BUGS:

 - Image loading is slow when using to high jpg quality (parameter .jpg[Q=100]) in vips command especially when images are more than 100MB in size
 - when srolling through an image series by mousewheel all images of a series will be requested, until user stops scrolling at the desired image. A skip of requests is needed for images just passed by when scrolling through an image series, otherwise loading of the desired image becomes slow



