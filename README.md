# slideviewer
javascript and OpenSeadragon scripts to make electron and light microscopical microscopy images available via web browsers
see examples here:

- zoom in with Ctrl-mousewheel or Alt-mousewheel, next image with mousewheel, translate view with left mousebutton

http://www.q-terra.de/tagebau/ (german)

http://131.220.138.195/slides/ (resize browser window if no images are available)

prepare files as deepzoom images with vips-program:

single file: vips dzsave filename filename.dzi --suffix .jpg[Q=100]

directory of files: for i in *.tif; do vips dzsave $i $i.dzi --suffix .jpg[Q=90]; done
