import { select, selectAll, create } from 'd3-selection';

import {
  scaleLinear,
  scaleOrdinal,
  schemeCategory10,
} from 'd3-scale'

import { axisBottom } from 'd3-axis';

import { area, stack, stackOffsetWiggle, stackOrderNone } from 'd3-shape';

import { min, max, extent, histogram, ticks } from 'd3-array';

import { transition } from 'd3-transition';

export default {
  scaleOrdinal,
  extent,
  ticks,
  histogram,
  stack,
  stackOffsetWiggle,
  stackOrderNone,
  scaleLinear,
  min,
  max,
  axisBottom,
  area,
  create,
  transition,
  selectAll
}
