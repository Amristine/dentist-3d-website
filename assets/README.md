# Original Dentora image assets

The build script looks for the supplied source pack at:

`assets/dentora-original-image-assets.zip`

Add the ZIP at that path in this repository. Before `next dev` or `next build`, `scripts/prepare-original-images.mjs` extracts the original WebP/PNG files into `public/images/` byte-for-byte. It does not resize or recompress them.

The ZIP is intentionally kept as a source archive; this README documents its expected location.
