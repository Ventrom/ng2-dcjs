import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import {
    LineChartComponent,
    RowChartComponent,
    PieChartComponent,
    SandChartComponent,
    BarChartComponent,
    RangeChartComponent,
    BubbleChartComponent,
    CandleChartComponent,
    LeafletMarkerChartComponent,
    ChoroplethChartComponent,
    LegendComponent,
    TopoLayerComponent,
    LeafletIconComponent,
    FormatsComponent,
    ColorComponent
} from './chart.components'
import { QueryComponent } from './query.components'

@NgModule({
    declarations: [
        LineChartComponent,
        RowChartComponent,
        PieChartComponent,
        SandChartComponent,
        BarChartComponent,
        RangeChartComponent,
        BubbleChartComponent,
        CandleChartComponent,
        LeafletMarkerChartComponent,
        ChoroplethChartComponent,
        LegendComponent,
        TopoLayerComponent,
        LeafletIconComponent,
        FormatsComponent,
        QueryComponent,
        ColorComponent
    ],
    imports: [
        CommonModule
    ],
    exports: [
        LineChartComponent,
        RowChartComponent,
        PieChartComponent,
        SandChartComponent,
        BarChartComponent,
        RangeChartComponent,
        BubbleChartComponent,
        CandleChartComponent,
        LeafletMarkerChartComponent,
        ChoroplethChartComponent,
        LegendComponent,
        TopoLayerComponent,
        LeafletIconComponent,
        FormatsComponent,
        QueryComponent,
        ColorComponent
    ]
})
export class DcjsModule {}