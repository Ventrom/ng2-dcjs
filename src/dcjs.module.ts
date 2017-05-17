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
    FormatsComponent
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
        QueryComponent
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
        QueryComponent
    ]
})
export class DcjsModule {}