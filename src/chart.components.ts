import { AfterViewInit, ContentChildren, Directive, Input, OnDestroy, OnInit, QueryList, forwardRef } from '@angular/core';

declare require: any
const dc = require('dc')

export abstract class ChartComponent implements OnDestroy {
    @Input() parent: any = null
    @Input() group: string = undefined
    @Input() height: any = null
    @Input() width: any = null

    abstract get chart(): any

    ngOnDestroy() {
        if (this.chart) dc.deregisterChart(this.chart, this.group)
    }
}

export abstract class CoordinateChartComponent extends ChartComponent implements AfterViewInit {
    @Input() xScale: any
    @Input() yScale: any
    @Input() xLabel: string
    @Input() yLabel: string

    ngAfterViewInit() {
        // TODO how to make sure this gets called after chart is initialized? Promise?
        this.chart.x(this.xScale)
                  .y(this.yScale)
    }
}

@Directive({
    selector: 'line-chart',
    providers: [
        {provide: CoordinateChartComponent, useExisting: forwardRef(() => LineChartComponent) },
        {provide: ChartComponent, useExisting: forwardRef(() => LineChartComponent) }
    ]
})
export class LineChartComponent extends CoordinateChartComponent implements AfterViewInit {
    @Input() interpolate: string = 'monotone'
    @Input() dashStyle: Array<number> = []
    @Input() renderArea: boolean = false
    @Input() xyTipsOn: boolean = false

    private _chart: any = null

    get chart(): any {return this._chart}

    ngAfterViewInit() {
        this._chart = dc.lineChart(this.parent, this.group)
                        .interpolate(this.interpolate)
                        .dashStyle(this.dashStyle)
                        .renderArea(this.renderArea)
                        .xyTipsOn(this.xyTipsOn)
    }
}
