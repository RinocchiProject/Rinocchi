import GifEncoder from 'gifencoder';
import _ from 'lodash';
import Canvas from 'canvas';
import path from 'path';

/*
 * [Pet-Pet]: https://github.com/aDu/pet-pet-gif
 *
 */

interface PetOptions {
    resolution?: number;
    delay?: number;
    backgroundColor?: string | null;
}

let PetOptionsDefault: PetOptions = {
        resolution: 128,
        delay: 20,
        backgroundColor: null,
    },
    Frames = 10,
    FrameCache = [];

class ImageUtils {
    public async GifPetPet(
        source: string,
        options: PetOptions = PetOptionsDefault
    ) {
        options = _.defaults(options, PetOptionsDefault);
        const encoder = new GifEncoder(options.resolution, options.resolution);
        encoder.start();
        encoder.setRepeat(0);
        encoder.setDelay(options.delay);
        encoder.setTransparent();

        const canvas = Canvas.createCanvas(
                options.resolution,
                options.resolution
            ),
            ctx = canvas.getContext('2d'),
            avatar = await Canvas.loadImage(source);

        for (let i = 0; i < Frames; i++) {
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            if (options.backgroundColor) {
                ctx.fillStyle = options.backgroundColor;
                ctx.fillRect(0, 0, canvas.width, canvas.height);
            }

            const j = i < Frames / 2 ? i : Frames - i,
                width = 0.8 + j * 0.02,
                height = 0.8 - j * 0.05,
                offsetX = (1 - width) * 0.5 + 0.1,
                offsetY = 1 - height - 0.08;

            if (i == FrameCache.length)
                FrameCache.push(
                    await Canvas.loadImage(
                        path.resolve(process.cwd(), `assets/petpet/pet${i}.gif`)
                    )
                );

            ctx.drawImage(
                avatar,
                options.resolution * offsetX,
                options.resolution * offsetY,
                options.resolution * width,
                options.resolution * height
            );
            ctx.drawImage(
                FrameCache[i],
                0,
                0,
                options.resolution,
                options.resolution
            );

            encoder.addFrame(ctx);
        }

        encoder.finish();
        FrameCache = [];
        return encoder.out.getData();
    }
}

export default ImageUtils;
