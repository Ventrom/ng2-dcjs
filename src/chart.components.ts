import { AfterContentInit, AfterViewInit, ContentChildren, Directive, ElementRef,
         ContentChild, EventEmitter, Input, Output, OnDestroy, OnInit, QueryList, forwardRef } from '@angular/core'
import { QueryComponent } from './query.components';
import * as d3 from 'd3';

declare var require;
const pluck = require('pluck')
let dc = require('dc')
require('./dc-addons.js')
const L = require('leaflet')
L.Icon.Default.imagePath = './images/'

// Directives used by the chart components
@Directive({selector: 'd3-formats'})
export class FomatsComponent {
    @Input() customFormat: any = d3.time.format("%a %e %b %H:%M")
    isoDateFormat: any = d3.time.format('%Y-%m-%dT%H:%M:%S')
    dayHourFormat: any = d3.time.format("%H:00 %d-%B-%Y")
    dayWeekNameFormat: any = d3.time.format("%d-%B-%Y")
    monthNameFormat: any = d3.time.format("%B-%Y")
    yearNameFormat: any = d3.time.format("%Y")
    numberFormat: any = d3.format('.2s')
    intFormat: any = d3.format('f')
}

@Directive({selector: 'dc-legend'})
export class LegendComponent implements OnInit {
    @Input() x: number
    @Input() y: number
    @Input() itemHeight: number
    @Input() gap: number
    legend: any = dc.legend()

    ngOnInit() {
        if (this.x) this.legend.x(this.x)
        if (this.y) this.legend.y(this.y)
        if (this.itemHeight) this.legend.itemHeight(this.itemHeight)
        if (this.gap) this.legend.gap(this.gap)
    }
}

@Directive({selector: 'leaflet-icon'})
export class LeafletIconComponent implements OnInit {
    @Input() icon: (d: any) => any
    @Input() iconSize: number[] = [20, 30]

    ngOnInit() {
        let self = this

        this.icon = function(d) {
            // Default color for now
            let styleString = 'color : #00336c'
            let htmlString = '<div><i class="big map pin icon" style="'+styleString+'"></i></div>'
            let divIcon = L.divIcon({
                className: "geo-marker-icon",
                html: htmlString,
                iconSize: self.iconSize
            })

            return divIcon
        }
    }
}

@Directive({selector: 'topo-layer'})
export class TopoLayerComponent implements OnInit {
    @Input() world: any
    @Input() fillColor: string
    @Input() fillOpacity: number
    @Input() color: string
    @Input() weight: number
    @Input() opacity: number
    layer: (map: any) => void
    map: any

    ngOnInit() {
        let self = this

        this.layer = function(map: any) {
            var topoLayer = new L.TopoJSON()
            topoLayer.addData(self.world)
            topoLayer.addTo(map)
            topoLayer.eachLayer(function handleLayer(layer) {
                layer.setStyle({
                    fillColor : self.fillColor,
                    fillOpacity: self.fillOpacity,
                    color: self.color,
                    weight: self.weight,
                    opacity: self.opacity
                })
            })

            self.map = map
        }
    }
}

// Main chart components
export abstract class ChartComponent implements AfterContentInit, OnDestroy {
    @Input() chartGroup: string = undefined
    @Input() height: any = null
    @Input() width: any = null
    @Input() margins: {left?: number, right?: number, top?: number, bottom?: number} = null
    @Input() key: string = 'key'
    @Input() value: string = 'value'
    @ContentChild(QueryComponent) query: QueryComponent
    destroyed: boolean = false

    abstract get chart(): Promise<any>

    ngAfterContentInit() {
        if (this.query) {
            this.query.result.subscribe(result => {
                this.chart.then((chart) => {
                    chart.dimension(result.column.dimension)
                         .group(result.group)
                         .keyAccessor(pluck(this.key))
                         .valueAccessor(pluck(this.value))
                    chart.render()
                })
            })
        }
    }

    ngOnDestroy() {
        this.chart.then((chart) => dc.deregisterChart(this.chart, this.chartGroup))
        this.destroyed = true
    }
}

//TODO: maybe add nested service call somehow?
export abstract class CoordinateChartComponent extends ChartComponent {
    @Input() xScale: any
    @Input() yScale: any
    @Input() xTicks: number
    @Input() yTicks: number
    //TODO: add pipe for these three
    @Input() xLabel: string
    @Input() yLabel: string
    @Input() title: (d: any) => string
    @Input() transitionDuration: number = 1000

    initialize(chart): any {
        if (this.xScale) chart.x(this.xScale)
        if (this.yScale) chart.y(this.yScale)
        if (this.xTicks) chart.xAxis().ticks(this.xTicks)
        if (this.yTicks) chart.yAxis().ticks(this.yTicks)
        if (this.margins) chart.margins(this.margins)
        if (this.title) chart.title(this.title)
        chart.transitionDuration(this.transitionDuration)
        return chart
    }
}

@Directive({
    selector: 'line-chart',
    host: {
       '[style.display]': "'block'",
       '[style.height]': "'100%'",
       '[style.width]': "'100%'"
    },
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

    constructor(private elementRef: ElementRef) {
        super()
    }

    get chart(): Promise<any> {
        return new Promise<any>((resolve, reject) => {
            d3.timer(() => {
                if (this.destroyed) {
                    reject(null)
                    return true
                }
                if (this._chart) {
                    resolve(this._chart)
                    return true
                }
                return false
            }, 0)
        })
    }

    ngAfterViewInit() {
        let chart = dc.lineChart(this.elementRef.nativeElement)
                        .interpolate(this.interpolate)
                        .dashStyle(this.dashStyle)
                        .renderArea(this.renderArea)
                        .xyTipsOn(this.xyTipsOn)
        this._chart = this.initialize(chart)
    }
}

@Directive({
    selector: 'sand-chart',
    host: {
       '[style.display]': "'block'",
       '[style.height]': "'100%'",
       '[style.width]': "'100%'"
    },
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

    private _chart: any = null

    constructor(private elementRef: ElementRef) {
        super()
    }

    get chart(): Promise<any> {
        return new Promise<any>((resolve, reject) => {
            d3.timer(() => {
                if (this.destroyed) {
                    reject(null)
                    return true
                }
                if (this._chart) {
                    resolve(this._chart)
                    return true
                }
                return false
            }, 0)
        })
    }

    ngAfterViewInit() {
        this._chart = dc.lineChart(this.elementRef.nativeElement)
                        .renderArea(this.renderArea)
                        .elasticY(this.elasticY)
                        .renderHorizontalGridLines(this.horizontalGridLines)
                        .brushOn(this.brushOn)
                        .mouseZoomable(this.mouseZoomable)
        this.initialize(this._chart)
    }
}

@Directive({
    selector: 'row-chart',
    host: {
       '[style.display]': "'block'",
       '[style.height]': "'100%'",
       '[style.width]': "'100%'"
    },
    providers: [
        {provide: CoordinateChartComponent, useExisting: forwardRef(() => RowChartComponent) },
        {provide: ChartComponent, useExisting: forwardRef(() => RowChartComponent) }
    ]
})
export class RowChartComponent extends CoordinateChartComponent implements AfterViewInit {
    @Input() colors: any = d3.scale.category10()
    @Input() elasticX: boolean = true
    @Input() label: (d: any) => string

    private _chart: any = null

    constructor(private elementRef: ElementRef) {
        super()
    }

    get chart(): Promise<any> {
        return new Promise<any>((resolve, reject) => {
            d3.timer(() => {
                if (this.destroyed) {
                    reject(null)
                    return true
                }
                if (this._chart) {
                    resolve(this._chart)
                    return true
                }
                return false
            }, 0)
        })
    }

    ngAfterViewInit() {
        this._chart = dc.rowChart(this.elementRef.nativeElement)
                        .elasticX(this.elasticX)
                        .label(this.label)
        this.initialize(this._chart)
    }
}

@Directive({
    selector: 'bar-chart',
    host: {
       '[style.display]': "'block'",
       '[style.height]': "'100%'",
       '[style.width]': "'100%'"
    },
    providers: [
        {provide: CoordinateChartComponent, useExisting: forwardRef(() => BarChartComponent) },
        {provide: ChartComponent, useExisting: forwardRef(() => BarChartComponent) }
    ]
})
export class BarChartComponent extends CoordinateChartComponent implements AfterViewInit {
    @Input() elasticY: boolean = true
    @Input() brushOn: boolean = false
    @Input() gap: number = 1
    @Input() centerBar: boolean = true
    @Input() outerPadding: number = 0.05

    @ContentChild(LegendComponent) legendComponent: LegendComponent
    @ContentChild(FomatsComponent) formatsComponent: FomatsComponent

    private _chart: any = null

    constructor(private elementRef: ElementRef) {
        super()
    }

    get chart(): Promise<any> {
        return new Promise<any>((resolve, reject) => {
            d3.timer(() => {
                if (this.destroyed) {
                    reject(null)
                    return true
                }
                if (this._chart) {
                    resolve(this._chart)
                    return true
                }
                return false
            }, 0)
        })
    }

    ngAfterViewInit() {
        let self = this
        this._chart = dc.barChart(this.elementRef.nativeElement)
        this._chart.brushOn(this.brushOn)
                   .gap(this.gap)
                   .centerBar(this.centerBar)
                   .outerPadding(this.outerPadding)
                   .elasticY(this.elasticY)
                   .yAxis().tickFormat(function(v) {return self.formatsComponent.numberFormat(v)})

        this._chart.legend(this.legendComponent.legend)
        this.initialize(this._chart)
    }
}

@Directive({
    selector: 'range-chart',
    host: {
       '[style.display]': "'block'",
       '[style.height]': "'100%'",
       '[style.width]': "'100%'"
    },
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

    private _chart: any = null

    constructor(private elementRef: ElementRef) {
        super()
    }

    get chart(): Promise<any> {
        return new Promise<any>((resolve, reject) => {
            d3.timer(() => {
                if (this.destroyed) {
                    reject(null)
                    return true
                }
                if (this._chart) {
                    resolve(this._chart)
                    return true
                }
                return false
            }, 0)
        })
    }

    ngAfterViewInit() {
        this._chart = dc.barChart(this.elementRef.nativeElement)
        this._chart.gap(this.gap)
                   .alwaysUseRounding(this.useRounding)
                   .elasticY(this.elasticY)
        this.initialize(this._chart)
    }
}

@Directive({
    selector: 'candle-chart',
    host: {
       '[style.display]': "'block'",
       '[style.height]': "'100%'",
       '[style.width]': "'100%'"
    },
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
    @Input() boxWidth: number = 3.0
    @Input() yAxisPadding: string = '3%'
    @Input() colorAccessor: () => number
    @Input() tickFormat: () => void = function() {}

    @ContentChild(FomatsComponent) formatsComponent: FomatsComponent

    private _chart: any = null

    constructor(private elementRef: ElementRef) {
        super()
    }

    get chart(): Promise<any> {
        return new Promise<any>((resolve, reject) => {
            d3.timer(() => {
                if (this.destroyed) {
                    reject(null)
                    return true
                }
                if (this._chart) {
                    resolve(this._chart)
                    return true
                }
                return false
            }, 0)
        })
    }

    ngAfterViewInit() {
        let self = this
        // Separate these calls for now
        this._chart = dc.boxPlot(this.elementRef.nativeElement)
        this._chart.mouseZoomable(this.mouseZoomable)
                   .elasticY(this.elasticY)
                   .renderHorizontalGridLines(this.horizontalGridLines)
                   .brushOn(this.brushOn)
                   .boxWidth(this.boxWidth)
                   .tickFormat(this.tickFormat)
                   .yAxisPadding(this.yAxisPadding)
                   .yAxis().tickFormat(function(v) {return self.formatsComponent.numberFormat(v)})

        if (this.colorAccessor) this._chart.colorAccessor(this.colorAccessor)
        this.initialize(this._chart)
    }
}

// The last three directives do not extend the CoordinateChartComponent
@Directive({
    selector: 'bubble-chart',
    providers: [
        {provide: CoordinateChartComponent, useExisting: forwardRef(() => BubbleChartComponent) },
        {provide: ChartComponent, useExisting: forwardRef(() => BubbleChartComponent) }
    ]
})
export class BubbleChartComponent extends ChartComponent implements AfterViewInit {
    private _chart: any = null

    constructor(private elementRef: ElementRef) {
        super()
    }

    get chart(): Promise<any> {
        return new Promise<any>((resolve, reject) => {
            d3.timer(() => {
                if (this.destroyed) {
                    reject(null)
                    return true
                }
                if (this._chart) {
                    resolve(this._chart)
                    return true
                }
                return false
            }, 0)
        })
    }

    ngAfterViewInit() {
        // Uses an existing svg
        this._chart = dc.bubbleOverlay(this.elementRef.nativeElement).svg(d3.select(this.elementRef.nativeElement).select('svg'))
    }
}

@Directive({
    selector: 'leaflet-marker-chart',
    host: {
       '[style.display]': "'block'",
       '[style.height]': "'100%'",
       '[style.width]': "'100%'"
    },
    providers: [
        {provide: CoordinateChartComponent, useExisting: forwardRef(() => LeafletMarkerChartComponent) },
        {provide: ChartComponent, useExisting: forwardRef(() => LeafletMarkerChartComponent) }
    ]
})
export class LeafletMarkerChartComponent extends ChartComponent implements AfterViewInit {
    @Input() elasticY: boolean = true
    @Input() horizontalGridLines: boolean = true
    @Input() brushOn: boolean = false
    @Input() mouseZoomable: boolean = false
    @Input() center: number[]
    @Input() zoom: number
    @Input() maxZoom: number = 10
    @Input() fitOnRender: boolean = false
    @Input() fitOnRedraw: boolean = false
    @Input() cluster: boolean = false
    @Input() filterByArea: boolean = true
    @Input() rebuildMarkers: boolean = true
    @Input() locationAccessor: (d: any) => number[]
    @Input() clusterOptions: any = {
        maxClusterRadius: 30,
        spiderfyOnMaxZoom: false, showCoverageOnHover: false,
        zoomToBoundsOnClick: false
    }
    @ContentChild(LeafletIconComponent) leafletIcon: LeafletIconComponent
    @ContentChild(TopoLayerComponent) topoLayer: TopoLayerComponent

    private _chart: any = null

    constructor(private elementRef: ElementRef) {
        super()
    }

    get chart(): Promise<any> {
        return new Promise<any>((resolve, reject) => {
            d3.timer(() => {
                if (this.destroyed) {
                    reject(null)
                    return true
                }
                if (this._chart) {
                    resolve(this._chart)
                    return true
                }
                return false
            }, 0)
        })
    }

    ngAfterViewInit() {
        // Add this property after it has been passed
        this.clusterOptions.iconCreateFunction = this.leafletIcon.icon

        this._chart = dc.leafletMarkerChart(this.elementRef.nativeElement)
                        .fitOnRender(this.fitOnRender)
                        .fitOnRedraw(this.fitOnRedraw)
                        .center(this.center)
                        .zoom(this.zoom)
                        // Map options is needed in case we set cluster to true
                        .mapOptions({center: this.center, zoom: this.zoom, maxZoom: this.maxZoom})
                        .clusterOptions(this.clusterOptions)
                        .cluster(this.cluster)
                        .filterByArea(this.filterByArea)
                        .rebuildMarkers(this.rebuildMarkers)
                        .icon(this.leafletIcon.icon)
                        .locationAccessor(this.locationAccessor)
                        .tiles(this.topoLayer.layer)
    }
}

@Directive({
    selector: 'pie-chart',
    host: {
       '[style.display]': "'block'",
       '[style.height]': "'100%'",
       '[style.width]': "'100%'"
    },
    providers: [
        {provide: ChartComponent, useExisting: forwardRef(() => PieChartComponent) }
    ]
})
export class PieChartComponent extends ChartComponent implements AfterViewInit {
    @Input() radius: number
    @Input() cap: number

    private _chart: any = null

    constructor(private elementRef: ElementRef) {
        super()
    }

    get chart(): Promise<any> {
        return new Promise<any>((resolve, reject) => {
            d3.timer(() => {
                if (this.destroyed) {
                    reject(null)
                    return true
                }
                if (this._chart) {
                    resolve(this._chart)
                    return true
                }
                return false
            }, 0)
        })
    }

    ngAfterViewInit() {
        this._chart = dc.pieChart(this.elementRef.nativeElement)
        this._chart.cap(this.cap)
                   .radius(this.radius ? this.radius : Math.min(this._chart.width(), this._chart.height())*0.35)
    }
}
