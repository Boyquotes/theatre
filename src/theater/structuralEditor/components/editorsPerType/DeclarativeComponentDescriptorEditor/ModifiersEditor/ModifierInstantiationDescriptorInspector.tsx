import React from 'react'
import connect from '$theater/handy/connect'
import {get} from 'lodash-es'
import {ITheaterStoreState} from '$theater/types'
import inspectorComponents, {
  ModifierIDsWithInspectorComponents,
} from '$theater/componentModel/coreModifierDescriptors/inspectorComponents'

interface IOwnProps {
  id: string
  // index: number
  pathToModifierInstantiationDescriptor: Array<string>
}

interface Props extends IOwnProps {
  modifierId: ModifierIDsWithInspectorComponents
}

type State = {}

export class ModifierInstantiationDescriptorInspector extends React.PureComponent<
  Props,
  State
> {
  constructor(props: Props) {
    super(props)
    this.state = {}
  }

  render() {
    const {modifierId} = this.props
    const InspectorComponent = inspectorComponents[modifierId]

    if (!InspectorComponent) {
      console.error(
        `ModifierId '${modifierId}' doesn't have an InspectorComponent`,
      )
      return 'No inspector comopnent'
    }
    return (
      <InspectorComponent
        // modifierId={modifierId}
        pathToModifierInstantiationDescriptor={
          this.props.pathToModifierInstantiationDescriptor
        }
      />
    )
  }
}

export default connect((s: ITheaterStoreState, op: IOwnProps) => {
  return {
    modifierId: get(s, [
      ...op.pathToModifierInstantiationDescriptor,
      'modifierId',
    ]),
  }
})(ModifierInstantiationDescriptorInspector)
