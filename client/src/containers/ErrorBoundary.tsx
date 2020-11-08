 
import React,{Component, ErrorInfo, ReactNode} from 'react'
import styled from 'styled-components'
interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
}

class ErrorBoundary extends Component {
  constructor(props:Props,text:string){
    super(props)
    this.text =text
  }
  static defaultProps ={
    text:'Sorry.. there was an error'
  }
  public text :string
  public state: State = {
    hasError: false
  };
  
  public static getDerivedStateFromError(_: Error): State {
    // Update state so the next render will show the fallback UI.
    return { hasError: true };
  }
  
  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught error:", error, errorInfo);
  }
  
  public render() {
    if (this.state.hasError) {
      return <h1>{this.text||ErrorBoundary.defaultProps.text}</h1>;
    }
    
    return this.props.children

  } 
}
export default ErrorBoundary