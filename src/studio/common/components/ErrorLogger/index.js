// @flow
import * as React from 'react'
import css from './index.css'

type Props = {
  children: string,
  closeHandler: Function,
}

const ErrorLogger = (props: Props) => {
  return (
    <div className={css.container}>
      <div className={css.message}>Error: {props.children}</div>
      <button className={css.close} onClick={props.closeHandler}>close</button>
    </div>
  )
}

export default ErrorLogger