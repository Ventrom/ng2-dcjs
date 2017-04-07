import { AfterViewInit, ContentChildren, Directive, Input, OnDestroy, OnInit, QueryList, forwardRef } from '@angular/core'
import { UtilsService } from './services/utils.service'

const d3 = require('d3')
const dc = require('dc')

export abstract class ChartComponent implements OnDestroy {
    @Input() parent: any = null
    @Input() group: string = undefined
    //TODO: remove
    @Input() dimension: any = null
    @Input() height: any = null
    @Input() width: any = null

    abstract get chart(): any

    ngOnDestroy() {
        if (this.chart) dc.deregisterChart(this.chart, this.group)
    }
}

//TODO: maybe add nested service call somehow?
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
    @Input() title: (d: any) => string
    @Input() ticks: number = 4

    private _chart: any = null

    get chart(): any {return this._chart}

    constructor(private utilsService: UtilsService) { super() }

    ngAfterViewInit() {
        this._chart = dc.lineChart(this.parent)
                        .x(this.xScale)
                        .interpolate(this.interpolate)
                        .dashStyle(this.dashStyle)
                        .renderArea(this.renderArea)
                        .xyTipsOn(this.xyTipsOn)
                        .dimension(this.dimension)
                        .group(this.group)
        if (this.ticks) this._chart.xAxis().ticks(this.ticks)

        this._chart.render()
    }
}

@Directive({
    selector: 'sand-chart',
    providers: [
        {provide: CoordinateChartComponent, useExisting: forwardRef(() => SandChartComponent) },
        {provide: ChartComponent, useExisting: forwardRef(() => SandChartComponent) }
    ]
})
export class SandChartComponent extends CoordinateChartComponent implements AfterViewInit {
    @Input() renderArea: boolean = true
    @Input() elasticY: boolean = true
    @Input() horizontalGridLines: boolean = true
    @Input() brushOn: boolean = false
    @Input() mouseZoomable: boolean = false
    @Input() ticks: number = 4

    private _chart: any = null

    get chart(): any {return this._chart}

    constructor(private utilsService: UtilsService) { super() }

    ngAfterViewInit() {
        this._chart = dc.lineChart(this.parent)
                        .x(this.xScale)
                        .renderArea(this.renderArea)
                        // These two are hardcoded for now
                        .transitionDuration(1000)
                        .margins({top: 30, right: 30, bottom: 25, left: 40})
                        .elasticY(this.elasticY)
                        .renderHorizontalGridLines(this.horizontalGridLines)
                        .brushOn(this.brushOn)
                        .mouseZoomable(this.mouseZoomable)
                        .dimension(this.dimension)
                        .group(this.group)
        if (this.ticks) this._chart.xAxis().ticks(this.ticks)

        this._chart.render()
    }
}

@Directive({
    selector: 'row-chart',
    providers: [
        {provide: CoordinateChartComponent, useExisting: forwardRef(() => RowChartComponent) },
        {provide: ChartComponent, useExisting: forwardRef(() => RowChartComponent) }
    ]
})
export class RowChartComponent extends CoordinateChartComponent implements AfterViewInit {
    @Input() colors: any = d3.scale.category10()
    @Input() label: (d: any) => string
    @Input() title: (d: any) => string
    @Input() elasticX: boolean = true
    @Input() ticks: number = 4

    private _chart: any = null

    get chart(): any {return this._chart}

    constructor(private utilsService: UtilsService) { super() }

    ngAfterViewInit() {
        this._chart = dc.rowChart(this.parent)
                        .margins({top: 0, left: 10, right: 10, bottom: 20})
                        .elasticX(this.elasticX)
                        .dimension(this.dimension)
                        .group(this.group)
        if (this.ticks) this._chart.xAxis().ticks(this.ticks)

        this._chart.render()
    }
}

@Directive({
    selector: 'bar-chart',
    providers: [
        {provide: CoordinateChartComponent, useExisting: forwardRef(() => BarChartComponent) },
        {provide: ChartComponent, useExisting: forwardRef(() => BarChartComponent) }
    ]
})
export class BarChartComponent extends CoordinateChartComponent implements AfterViewInit {
    @Input() elasticY: boolean = true
    @Input() brushOn: boolean = false
    @Input() gap: number = 1
    @Input() ticks: number = 4

    private _chart: any = null

    get chart(): any {return this._chart}

    constructor(private utilsService: UtilsService) { super() }

    ngAfterViewInit() {
        let self = this
        this._chart = dc.barChart(this.parent)
                        .dimension(this.dimension)
                        .group(this.group)
                        .x(this.xScale)

        this._chart.brushOn(this.brushOn)
                   .gap(this.gap)
                   .centerBar(true)
                   // These two are hardcoded for now
                   .transitionDuration(1000)
                   .margins({top: 10, left: 30, right: 10, bottom: 20})
                   .outerPadding(0.05)
                   .elasticY(this.elasticY)
                   .yAxis().tickFormat(function(v) {return self.utilsService.toNumberFormat(v)})

        this._chart.legend(dc.legend().x(50).y(10).itemHeight(13).gap(5))

        this._chart.render()
    }
}

@Directive({
    selector: 'range-chart',
    providers: [
        {provide: CoordinateChartComponent, useExisting: forwardRef(() => RangeChartComponent) },
        {provide: ChartComponent, useExisting: forwardRef(() => RangeChartComponent) }
    ]
})
export class RangeChartComponent extends CoordinateChartComponent implements AfterViewInit {
    @Input() elasticY: boolean = true
    @Input() useRounding: boolean = true
    @Input() brushOn: boolean = false
    @Input() gap: number = 1
    @Input() ticks: number = 0

    private _chart: any = null

    get chart(): any {return this._chart}

    constructor(private utilsService: UtilsService) { super() }

    ngAfterViewInit() {
        let self = this
        this._chart = dc.barChart(this.parent)
                        .dimension(this.dimension)
                        .group(this.group)
                        .x(this.xScale)

        this._chart.margins({top: 0, right: 0, bottom: 25, left: 40})
                   .gap(this.gap)
                   // These two are hardcoded for now
                   .transitionDuration(1000)
                   .margins({top: 10, left: 30, right: 10, bottom: 20})
                   .alwaysUseRounding(this.useRounding)
                   .elasticY(this.elasticY)
                   .yAxis().ticks(this.ticks)

        this._chart.render()
    }
}

@Directive({
    selector: 'bubble-chart',
    providers: [
        {provide: CoordinateChartComponent, useExisting: forwardRef(() => BubbleChartComponent) },
        {provide: ChartComponent, useExisting: forwardRef(() => BubbleChartComponent) }
    ]
})
export class BubbleChartComponent extends CoordinateChartComponent implements AfterViewInit {
    private _chart: any = null

    get chart(): any {return this._chart}

    constructor(private utilsService: UtilsService) { super() }

    ngAfterViewInit() {
        // Uses an existing svg
        this._chart = dc.bubbleOverlay(this.parent).svg(d3.select(this.parent).select('svg'))
                        .dimension(this.dimension)
                        .group(this.group)

        this._chart.render()
    }
}

@Directive({
    selector: 'candle-chart',
    providers: [
        {provide: CoordinateChartComponent, useExisting: forwardRef(() => CandleChartComponent) },
        {provide: ChartComponent, useExisting: forwardRef(() => CandleChartComponent) }
    ]
})
export class CandleChartComponent extends CoordinateChartComponent implements AfterViewInit {
    @Input() elasticY: boolean = true
    @Input() horizontalGridLines: boolean = true
    @Input() brushOn: boolean = false
    @Input() mouseZoomable: boolean = false

    private _chart: any = null

    get chart(): any {return this._chart}

    constructor(private utilsService: UtilsService) { super() }

    ngAfterViewInit() {
        let self = this
        // Uses an existing svg
        this._chart = dc.boxPlot(this.parent)
                        .dimension(this.dimension)
                        .group(this.group)

        this._chart.colorAccessor(function(){return 0})
                   .mouseZoomable(this.mouseZoomable)
                   // These two are hardcoded for now
                   .transitionDuration(1000)
                   .margins({top: 30, right: 0, bottom: 25, left: 40})
                   .elasticY(this.elasticY)
                   .renderHorizontalGridLines(this.horizontalGridLines)
                   .brushOn(this.brushOn)
                   .tickFormat(function(){})
                   .yAxis().tickFormat(function(v) {return self.utilsService.toNumberFormat(v)})

        this._chart.render()
    }
}

@Directive({
    selector: 'pie-chart',
    providers: [
        {provide: ChartComponent, useExisting: forwardRef(() => PieChartComponent) }
    ]
})
export class PieChartComponent extends ChartComponent implements AfterViewInit {
    @Input() radius: number = 0

    private _chart: any = null

    get chart(): any {return this._chart}

    constructor(private utilsService: UtilsService) { super() }

    ngAfterViewInit() {
        this._chart = dc.pieChart(this.parent)
        this._chart.cap(6)
                   .radius(this.radius ? this.radius : Math.min(this._chart.width(), this._chart.height())*0.35)
                   .dimension(this.dimension)
                   .group(this.group)

        this._chart.render()
    }
}
