// @flow
import * as React from 'react'
import {type ComponentInstantiationDescriptor, type ComponentDescriptor} from '$studio/componentModel/types'
import * as D from '$shared/DataVerse'
import {makeReactiveComponent} from '$studio/handy'
import ElementifyHardCodedComponent from './ElementifyHardCodedComponent'
import ElementifyDeclarativeComponent from './ElementifyDeclarativeComponent'
import type {Studio} from '$studio/handy'
import stringStartsWith from 'lodash/startsWith'

const identity = (a) => a

type Props = {
  instantiationDescriptor: ComponentInstantiationDescriptor,
}

const getComponentDescriptorById = (id: D.Derivation<string>, studio: D.Derivation<Studio>): D.Derivation<?D.AtomifyDeepType<ComponentDescriptor>> =>
  D.derive({id, studio}, identity).flatMap(({id, studio}): $FixMe => {
    const idString = id.getValue()
    return stringStartsWith(idString, 'TheaterJS/Core/')
      ? studio.getValue().atom.pointer().prop('coreComponentDescriptorsById').prop(idString)
      : studio.getValue().atom.pointer().prop('state').prop('componentModel').prop('componentDescriptorsById').prop(idString)
  })

const getAliasLessComponentDescriptor = (initialComponentId: D.Derivation<string>, studio: D.Derivation<Studio>): Derivation<?D.AtomifyDeepType<ComponentDescriptor>> => {
  return getComponentDescriptorById(initialComponentId, studio).flatMap((des): $FixMe => {
    if (!des) return

    return des.pointer().prop('type').flatMap((type) => {
      if (type === 'Alias') {
        return des.pointer().prop('aliasedComponentID').flatMap((aliasedComponentID) => getAliasLessComponentDescriptor(new D.ConstantDerivation(aliasedComponentID), studio))
      } else {
        return des
      }
    })
  })
}

export default makeReactiveComponent({
  displayName: 'Elementify',
  modifyBaseDerivation: (d) => d.extend({
    render(d) {
      const instantiationDescriptorPointer = d.pointer().prop('props').prop('instantiationDescriptor')
      const componentIDPointer = instantiationDescriptorPointer.prop('componentID')
      return getAliasLessComponentDescriptor(
        componentIDPointer, d.pointer().prop('studio')
      ).flatMap((componentDescriptor) => {
        if (!componentDescriptor) return D.autoDerive(() => {

          return <div>Cannot find component {componentIDPointer.getValue()}</div>
        })

        const componentDescriptorPointer = componentDescriptor.pointer()
        const componentDescriptorTypePointer = componentDescriptorPointer.prop('type')
        const keyPointer = d.pointer().prop('key')
        const innerProps = new D.MapAtom({
          componentDescriptor: componentDescriptorPointer,
          props: instantiationDescriptorPointer.prop('props'),
        })

        return D.autoDerive(() => {
          if (componentDescriptorTypePointer.getValue() === 'HardCoded') {
            return <ElementifyHardCodedComponent key={keyPointer.getValue()} props={innerProps} />
          } else {
            return <ElementifyDeclarativeComponent key={keyPointer.getValue()} props={innerProps} />
          }
        })
      })
    },
  }),
})