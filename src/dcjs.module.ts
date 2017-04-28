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
    LegendComponent,
    TopoLayerComponent,
    LeafletIconComponent,
    FomatsComponent
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
        LegendComponent,
        TopoLayerComponent,
        LeafletIconComponent,
        FomatsComponent,
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
        LegendComponent,
        TopoLayerComponent,
        LeafletIconComponent,
        FomatsComponent,
        QueryComponent
    ]
})
export class DcjsModule {}