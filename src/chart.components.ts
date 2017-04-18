import { AfterViewInit, ContentChildren, Directive, ContentChild, Input, OnDestroy, OnInit, QueryList, forwardRef } from '@angular/core'

const d3 = require('d3')
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
export class LegendComponent {
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
export class LeafletIconComponent {
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
export class TopoLayerComponent {
    @Input() world: any
    @Input() fillColor: string
    @Input() fillOpacity: number
    @Input() color: string
    @Input() weight: number
    @Input() opacity: number
    layer: (map: any) => void

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
        }
    }
}

// Main chart components
export abstract class ChartComponent implements OnDestroy {
    @Input() parent: any = null
    @Input() group: string = undefined
    //TODO: remove
    @Input() dimension: any = null
    @Input() height: any = null
    @Input() width: any = null
    @Input() margins: {left?: number, right?: number, top?: number, bottom?: number} = null

    abstract get chart(): any

    ngOnDestroy() {
        if (this.chart) dc.deregisterChart(this.chart, this.group)
    }
}

//TODO: maybe add nested service call somehow?
export abstract class CoordinateChartComponent extends ChartComponent implements AfterViewInit {
    @Input() xScale: any
    @Input() yScale: any
    @Input() xTicks: number
    @Input() yTicks: number
    //TODO: add pipe for these three
    @Input() xLabel: string
    @Input() yLabel: string
    @Input() title: (d: any) => string
    @Input() transitionDuration: number = 1000

    // Using the lifecycle to make this be called after initialization
    ngAfterViewInit() {
        if (this.xScale) this.chart.x(this.xScale)
        if (this.yScale) this.chart.y(this.yScale)
        if (this.xTicks) this.chart.xAxis().ticks(this.xTicks)
        if (this.yTicks) this.chart.yAxis().ticks(this.yTicks)
        if (this.margins) this.chart.margins(this.margins)
        if (this.title) this.chart.title(this.title)
        this.chart.transitionDuration(this.transitionDuration)

        // Add the group and dimension for last
        this.chart.dimension(this.dimension)
                  .group(this.group)

        this.chart.render()
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

    ngOnInit() {
        this._chart = dc.lineChart(this.parent)
                        .interpolate(this.interpolate)
                        .dashStyle(this.dashStyle)
                        .renderArea(this.renderArea)
                        .xyTipsOn(this.xyTipsOn)
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

    private _chart: any = null

    get chart(): any {return this._chart}

    ngOnInit() {
        this._chart = dc.lineChart(this.parent)
                        .renderArea(this.renderArea)
                        .elasticY(this.elasticY)
                        .renderHorizontalGridLines(this.horizontalGridLines)
                        .brushOn(this.brushOn)
                        .mouseZoomable(this.mouseZoomable)
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
    @Input() elasticX: boolean = true
    @Input() label: (d: any) => string

    private _chart: any = null

    get chart(): any {return this._chart}

    ngOnInit() {
        this._chart = dc.rowChart(this.parent)
                        .elasticX(this.elasticX)
                        .label(this.label)
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
    @Input() centerBar: boolean = true
    @Input() outerPadding: number = 0.05

    @ContentChild(LegendComponent) legendComponent: LegendComponent
    @ContentChild(FomatsComponent) formatsComponent: FomatsComponent

    private _chart: any = null

    get chart(): any {return this._chart}

    ngOnInit() {
        let self = this
        this._chart = dc.barChart(this.parent)
        this._chart.brushOn(this.brushOn)
                   .gap(this.gap)
                   .centerBar(this.centerBar)
                   .outerPadding(this.outerPadding)
                   .elasticY(this.elasticY)
                   .yAxis().tickFormat(function(v) {return self.formatsComponent.numberFormat(v)})

        this._chart.legend(this.legendComponent.legend)
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

    private _chart: any = null

    get chart(): any {return this._chart}

    ngOnInit() {
        let self = this
        this._chart = dc.barChart(this.parent)
        this._chart.gap(this.gap)
                   .alwaysUseRounding(this.useRounding)
                   .elasticY(this.elasticY)
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
    @Input() boxWidth: number = 3.0
    @Input() yAxisPadding: string = '3%'
    @Input() colorAccessor: () => number
    @Input() tickFormat: () => void = function() {}

    @ContentChild(FomatsComponent) formatsComponent: FomatsComponent

    private _chart: any = null

    get chart(): any {return this._chart}

    ngOnInit() {
        let self = this
        // Separate these calls for now
        this._chart = dc.boxPlot(this.parent)
        this._chart.mouseZoomable(this.mouseZoomable)
                   .elasticY(this.elasticY)
                   .renderHorizontalGridLines(this.horizontalGridLines)
                   .brushOn(this.brushOn)
                   .boxWidth(this.boxWidth)
                   .tickFormat(this.tickFormat)
                   .yAxisPadding(this.yAxisPadding)
                   .yAxis().tickFormat(function(v) {return self.formatsComponent.numberFormat(v)})

        if (this.colorAccessor) this._chart.colorAccessor(this.colorAccessor)
    }
}

// The last three directives do not extend the CoordinateChartComponent, so they
// use a ngAfterViewInit instead of a ngOnInit
@Directive({
    selector: 'bubble-chart',
    providers: [
        {provide: CoordinateChartComponent, useExisting: forwardRef(() => BubbleChartComponent) },
        {provide: ChartComponent, useExisting: forwardRef(() => BubbleChartComponent) }
    ]
})
export class BubbleChartComponent extends ChartComponent implements AfterViewInit {
    private _chart: any = null

    get chart(): any {return this._chart}

    ngAfterViewInit() {
        // Uses an existing svg
        this._chart = dc.bubbleOverlay(this.parent).svg(d3.select(this.parent).select('svg'))
                        .dimension(this.dimension)
                        .group(this.group)

        this._chart.render()
    }
}

@Directive({
    selector: 'leaflet-marker-chart',
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

    get chart(): any {return this._chart}

    ngAfterViewInit() {
        let self = this

        // Add this property after it has been passed
        this.clusterOptions.iconCreateFunction = self.leafletIcon.icon

        this._chart = dc.leafletMarkerChart(this.parent)
            .dimension(this.dimension)
            .group(this.group)
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
    @Input() radius: number
    @Input() cap: number

    private _chart: any = null

    get chart(): any {return this._chart}

    ngAfterViewInit() {
        this._chart = dc.pieChart(this.parent)
        this._chart.cap(this.cap)
                   .radius(this.radius ? this.radius : Math.min(this._chart.width(), this._chart.height())*0.35)
                   .dimension(this.dimension)
                   .group(this.group)

        this._chart.render()
    }
}
