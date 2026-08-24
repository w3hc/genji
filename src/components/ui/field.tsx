import { Field as ChakraField } from '@chakra-ui/react'
import * as React from 'react'

export interface FieldProps extends Omit<ChakraField.RootProps, 'label'> {
  label?: React.ReactNode
  children?: React.ReactNode
  helperText?: React.ReactNode
  errorText?: React.ReactNode
  optionalText?: React.ReactNode
}

export const FieldRoot = React.forwardRef<HTMLDivElement, FieldProps>(function Field(props, ref) {
  const { label, children, helperText, errorText, optionalText, ...rootProps } = props
  return (
    <ChakraField.Root ref={ref} {...rootProps}>
      {label && (
        <ChakraField.Label>
          {label}
          <ChakraField.RequiredIndicator fallback={optionalText} />
        </ChakraField.Label>
      )}
      {children}
      {helperText && <ChakraField.HelperText>{helperText}</ChakraField.HelperText>}
      {errorText && <ChakraField.ErrorText>{errorText}</ChakraField.ErrorText>}
    </ChakraField.Root>
  )
})

export const Field = Object.assign(FieldRoot, {
  ErrorText: ChakraField.ErrorText,
  Label: ChakraField.Label,
  HelperText: ChakraField.HelperText,
  RequiredIndicator: ChakraField.RequiredIndicator,
})
