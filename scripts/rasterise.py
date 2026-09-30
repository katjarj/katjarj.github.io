#!/usr/bin/env python3
"""Rasterise every page of a PDF to PNG, so the site can show a document
without a PDF viewer in the way.

    python3 scripts/rasterise.py public/resume.pdf public/resume 1240 resume

Argument 4 is the file-name stem: the output is `<stem>-1.png`, `<stem>-2.png`,
one per page, each `<width>` px wide with the page's own aspect ratio.

Uses CoreGraphics through PyObjC, which ships with macOS python3. Note that
`CGImageDestination*` lives in `Quartz.ImageIO`, NOT in `CoreGraphics` — that
is the one thing this got wrong first time.

PNG beats JPEG here by a wide margin: a resume is white paper with dark text,
which PNG's filters compress far better than a lossy codec (368KB against 396KB
for the same page at quality 70, and downscaling with sips makes it *larger*,
because resampling introduces more distinct colours).
"""
import sys
import CoreFoundation
from Quartz import CoreGraphics as CG
from Quartz import ImageIO as IO


def main():
    if len(sys.argv) != 5:
        sys.exit(__doc__)
    src, outdir, width, name = sys.argv[1], sys.argv[2], int(sys.argv[3]), sys.argv[4]

    url = CoreFoundation.CFURLCreateFromFileSystemRepresentation(
        None, src.encode(), len(src.encode()), False
    )
    doc = CG.CGPDFDocumentCreateWithURL(url)
    if not doc:
        sys.exit('could not open ' + src)
    pages = CG.CGPDFDocumentGetNumberOfPages(doc)
    print('pages:', pages)

    for i in range(1, pages + 1):
        page = CG.CGPDFDocumentGetPage(doc, i)
        box = CG.CGPDFPageGetBoxRect(page, CG.kCGPDFMediaBox)
        scale = width / box.size.width
        w = int(round(box.size.width * scale))
        h = int(round(box.size.height * scale))
        space = CG.CGColorSpaceCreateDeviceRGB()
        ctx = CG.CGBitmapContextCreate(
            None, w, h, 8, 0, space,
            CG.kCGImageAlphaPremultipliedFirst | CG.kCGBitmapByteOrder32Host,
        )
        # a PDF page has no background of its own — it would be transparent
        CG.CGContextSetRGBFillColor(ctx, 1, 1, 1, 1)
        CG.CGContextFillRect(ctx, CG.CGRectMake(0, 0, w, h))
        CG.CGContextScaleCTM(ctx, scale, scale)
        CG.CGContextTranslateCTM(ctx, -box.origin.x, -box.origin.y)
        CG.CGContextDrawPDFPage(ctx, page)
        image = CG.CGBitmapContextCreateImage(ctx)

        out = '%s/%s-%d.png' % (outdir, name, i)
        ourl = CoreFoundation.CFURLCreateFromFileSystemRepresentation(
            None, out.encode(), len(out.encode()), False
        )
        dest = IO.CGImageDestinationCreateWithURL(ourl, 'public.png', 1, None)
        IO.CGImageDestinationAddImage(dest, image, None)
        if not IO.CGImageDestinationFinalize(dest):
            sys.exit('failed to write ' + out)
        print('  page %d -> %s  %dx%d' % (i, out, w, h))


if __name__ == '__main__':
    main()