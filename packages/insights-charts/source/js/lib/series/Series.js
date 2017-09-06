import { UNHIGHLIGHTED_OPACITY } from '../../constants';
import CSS from '../../helpers/css';

class Series {
  constructor(data, dimensions, x, y, clipPathId, options, dispatchers, yAxisIndex, className = '', x1) {
    if (!this.render || typeof this.render !== 'function') {
      throw new Error('Any new series type requires a render method');
    }

    this.data = data;
    this.dimensions = dimensions;
    this.x = x;
    this.x1 = x1;
    this.y = y;
    this.clipPathId = clipPathId;
    this.options = options;
    this.dispatchers = dispatchers;
    this.yAxisIndex = yAxisIndex;
    this.className = className;

    this.selector = this.className.length ? this.className : 'series';
    this.selector = `${this.selector}-axis-y-${yAxisIndex}`;

    dispatchers.on(`highlightSeries.${this.selector}`, (seriesIndex) => {
      const sel = this.selection.selectAll(CSS.getClassSelector(this.selector));
      sel.attr('opacity', d => (d.seriesIndex === seriesIndex ? null : UNHIGHLIGHTED_OPACITY));
    });

    dispatchers.on(`unHighlightSeries.${this.selector}`, () => {
      const sel = this.selection.selectAll(CSS.getClassSelector(this.selector));
      sel.attr('opacity', null);
    });

    this.getHiddenClass = this.getHiddenClass.bind(this);
  }

  getHiddenClass(d) {
    const yMin = this.y.domain()[0];
    const yMax = this.y.domain()[1];
    const layout = this.options.layout;
    let hidden;

    if (layout === 'stacked') {
      hidden = (d.y + d.y0) < yMin || (d.y + d.y0) > yMax;
    } else {
      hidden = d.y < yMin || d.y > yMax;
    }

    return hidden;
  }

  update(data, dimensions, x, y, clipPathId, options, dispatchers, yAxisIndex, x1) {
    this.data = data;
    this.dimensions = dimensions;
    this.x = x;
    this.y = y;
    this.clipPathId = clipPathId;
    this.options = options;
    this.dispatchers = dispatchers;
    this.yAxisIndex = yAxisIndex;
    this.x1 = x1;

    this.render(this.selection);
  }
}

export default Series;
