import * as t from '$shared/ioTypes'

const $PropState = t.type({
  expanded: t.boolean,
  heightWhenExpanded: t.number,
})

const $ObjectState = t.type(
  {
    activePropsList: t.array(t.string),
    props: t.record(t.string, $PropState),
  },
  'ObjectStateInUI',
)

const $TimelineState = t.type({
  selectedTimelineInstance: t.union([t.null, t.string]),
  objects: t.record(t.string, $ObjectState),
  collapsedNodesByPath: t.record(t.string, t.literal(1)),
  temporaryPlaybackRangeLimit: t.union([
    t.undefined,
    t.type({
      from: t.number,
      to: t.number,
    }),
  ]),
})

const $ProjectState = t.type(
  {
    selectedTimeline: t.union([t.null, t.string]),
    timelines: t.record(t.string, $TimelineState),
  },
  'UIProjectState',
)

/**
 * Historic state is both persisted and is undoable
 */
export const $UIHistoricState = t.type({
  allInOnePanel: t.type({
    // height: t.number,
    selectedProject: t.union([t.null, t.string]),
    projects: t.record(t.string, $ProjectState),
    leftWidthFraction: t.number,
    margins: t.type({
      left: t.number,
      top: t.number,
      right: t.number,
      bottom: t.number,
    }),
  }),
})

export type UIHistoricState = t.StaticTypeOf<typeof $UIHistoricState>
