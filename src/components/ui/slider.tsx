'use client'

import { Slider as ChakraSlider } from '@chakra-ui/react'
import { forwardRef } from 'react'

export interface SliderRootProps extends ChakraSlider.RootProps {}

export const SliderRoot = forwardRef<HTMLDivElement, SliderRootProps>((props, ref) => {
  return <ChakraSlider.Root ref={ref} {...props} />
})

SliderRoot.displayName = 'SliderRoot'

export const SliderLabel = ChakraSlider.Label
export const SliderValueText = ChakraSlider.ValueText
export const SliderControl = ChakraSlider.Control
export const SliderTrack = ChakraSlider.Track
export const SliderRange = ChakraSlider.Range
export const SliderThumb = ChakraSlider.Thumb
export const SliderMarkerGroup = ChakraSlider.MarkerGroup
export const SliderMarker = ChakraSlider.Marker
export const SliderHiddenInput = ChakraSlider.HiddenInput
