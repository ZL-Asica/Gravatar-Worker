import encodeAvif, { init as initAvifEncode } from '@jsquash/avif/encode'
import decodeJpeg, { init as initJpegDecode } from '@jsquash/jpeg/decode'
import decodePng, { init as initPngDecode } from '@jsquash/png/decode'
import encodeWebp, { init as initWebpEncode } from '@jsquash/webp/encode'

// ================
// @ts-expect-error WASM not support directly yet
import AVIF_ENC_WASM from '../../node_modules/@jsquash/avif/codec/enc/avif_enc.wasm'
// @ts-expect-error WASM not support directly yet
import JPEG_DEC_WASM from '../../node_modules/@jsquash/jpeg/codec/dec/mozjpeg_dec.wasm'
// @ts-expect-error WASM not support directly yet
import PNG_DEC_WASM from '../../node_modules/@jsquash/png/codec/pkg/squoosh_png_bg.wasm'
// @ts-expect-error WASM not support directly yet
import WEBP_ENC_WASM from '../../node_modules/@jsquash/webp/codec/enc/webp_enc_simd.wasm'
// ================

interface ImageData {
  readonly width: number
  readonly height: number
  readonly data: Uint8ClampedArray
}

const supportedDecodeFormats = ['jpeg', 'jpg', 'png'] as const
type DecodeFormat = (typeof supportedDecodeFormats)[number]

let jpegDecoderReady: ReturnType<typeof initJpegDecode> | undefined
let pngDecoderReady: ReturnType<typeof initPngDecode> | undefined
let avifEncoderReady: ReturnType<typeof initAvifEncode> | undefined
let webpEncoderReady: ReturnType<typeof initWebpEncode> | undefined

const decodeImage = async (
  imageBuffer: ArrayBuffer,
  format: DecodeFormat,
): Promise<ImageData> => {
  if (format === 'jpeg' || format === 'jpg') {
    jpegDecoderReady ??= initJpegDecode(JPEG_DEC_WASM)
    await jpegDecoderReady
    return decodeJpeg(imageBuffer) as Promise<ImageData>
  }
  // eslint-disable-next-line ts/no-unsafe-argument
  pngDecoderReady ??= initPngDecode(PNG_DEC_WASM)
  await pngDecoderReady
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

  const outputMime = acceptTypes.find(mime => mime === 'image/avif' || mime === 'image/webp')
  if (outputMime === 'image/avif') {
    avifEncoderReady ??= initAvifEncode(AVIF_ENC_WASM)
    await avifEncoderReady
    const avifBuffer = await encodeAvif(imageData, { quality: 65 })
    return { data: avifBuffer, mime: 'image/avif' }
  }

  if (outputMime === 'image/webp') {
    webpEncoderReady ??= initWebpEncode(WEBP_ENC_WASM)
    await webpEncoderReady
    const webpBuffer = await encodeWebp(imageData, { quality: 85 })
    return { data: webpBuffer, mime: 'image/webp' }
  }

  return { data: imageBuffer, mime: sourceImageMime }
}
