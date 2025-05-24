import encodeAvif, { init as initAvifEncode } from '@jsquash/avif/encode'
import decodeJpeg, { init as initJpegDecode } from '@jsquash/jpeg/decode'
import decodePng, { init as initPngDecode } from '@jsquash/png/decode'
import encodeWebp, { init as initWebpEncode } from '@jsquash/webp/encode'

// ================
// ! DEVELOPMENT
// ================
// // @ts-expect-error WASM not support directly yet
// import AVIF_ENC_WASM from '../../node_modules/@jsquash/avif/codec/enc/avif_enc.wasm'
// // @ts-expect-error WASM not support directly yet
// import JPEG_DEC_WASM from '../../node_modules/@jsquash/jpeg/codec/dec/mozjpeg_dec.wasm'
// // @ts-expect-error WASM not support directly yet
// import PNG_DEC_WASM from '../../node_modules/@jsquash/png/codec/pkg/squoosh_png_bg.wasm'
// // @ts-expect-error WASM not support directly yet
// import WEBP_ENC_WASM from '../../node_modules/@jsquash/webp/codec/enc/webp_enc_simd.wasm'
// ================
// ! PRODUCTION
// ================
// @ts-expect-error WASM not support directly yet
import AVIF_ENC_WASM from '/wasm/avif_enc.wasm'
// @ts-expect-error WASM not support directly yet
import JPEG_DEC_WASM from '/wasm/mozjpeg_dec.wasm'
// @ts-expect-error WASM not support directly yet
import PNG_DEC_WASM from '/wasm/squoosh_png_bg.wasm'
// @ts-expect-error WASM not support directly yet
import WEBP_ENC_WASM from '/wasm/webp_enc_simd.wasm'

interface ImageData {
  readonly width: number
  readonly height: number
  readonly data: Uint8ClampedArray
}

const supportedDecodeFormats = ['jpeg', 'jpg', 'png'] as const
type DecodeFormat = (typeof supportedDecodeFormats)[number]

const decodeImage = async (
  imageBuffer: ArrayBuffer,
  format: DecodeFormat,
): Promise<ImageData> => {
  if (format === 'jpeg' || format === 'jpg') {
    await initJpegDecode(JPEG_DEC_WASM)
    return decodeJpeg(imageBuffer) as Promise<ImageData>
  }
  // eslint-disable-next-line ts/no-unsafe-argument
  await initPngDecode(PNG_DEC_WASM)
  return decodePng(imageBuffer) as Promise<ImageData>
}

export const imgProcessor = async (
  imageBuffer: ArrayBuffer,
  sourceImageMime: string,
  acceptTypes: string[],
) => {
  const sourceImageFormat = sourceImageMime.split('/')[1]
  if (!supportedDecodeFormats.includes(sourceImageFormat as unknown as DecodeFormat)) {
    return { data: imageBuffer, mime: sourceImageMime }
  }

  const imageData = await decodeImage(imageBuffer, sourceImageFormat as DecodeFormat)

  if (acceptTypes.includes('image/avif')) {
    await initAvifEncode(AVIF_ENC_WASM)
    const avifBuffer = await encodeAvif(imageData, { quality: 65 })
    return { data: avifBuffer, mime: 'image/avif' }
  }

  if (acceptTypes.includes('image/webp')) {
    await initWebpEncode(WEBP_ENC_WASM)
    const webpBuffer = await encodeWebp(imageData, { quality: 85 })
    return { data: webpBuffer, mime: 'image/webp' }
  }

  return { data: imageBuffer, mime: sourceImageMime }
}
