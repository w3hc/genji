import React, { ErrorInfo, ReactNode } from 'react'
import { mobileModel, mobileVendor } from 'react-device-detect'

interface Props {
  children: ReactNode
}

interface State {
  hasError: boolean
  deviceInfo: string
}

class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false, deviceInfo: '' }
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, deviceInfo: '' }
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Error caught by ErrorBoundary:', error, errorInfo)
  }

  componentDidMount() {
    const deviceInfo = `${mobileVendor} ${mobileModel}`
    this.setState({ deviceInfo })
  }

  render() {
    if (this.state.hasError) {
      return (
        <>
          <h3>All apologies, the app is not yet available on this type of device.</h3>
          <br />
          <p>{this.state.deviceInfo}</p>
          <br />
          <p>Thank you for using the app from another device.</p>
          <br />
          <p>
            Feel free to report this to Julien via <a href="https://matrix.to/#/@julienbrg:matrix.org">Element</a>,{' '}
            <a href="https://warpcast.com/julien-">Farcaster</a>, <a href="https://t.me/julienbrg">Telegram</a>,{' '}
            <a href="https://twitter.com/julienbrg">Twitter</a>, <a href="https://discordapp.com/users/julienbrg">Discord</a> or{' '}
            <a href="https://www.linkedin.com/in/julienberanger/">LinkedIn</a>.
          </p>
        </>
      )
    }

    return this.props.children
  }
}

export default ErrorBoundary
