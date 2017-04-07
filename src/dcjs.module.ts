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
    CandleChartComponent
} from './chart.components'
import { UtilsService } from './services/utils.service'
//import { QueryComponent } from './query.components'

@NgModule({
    declarations: [
        LineChartComponent,
        RowChartComponent,
        PieChartComponent,
        SandChartComponent,
        BarChartComponent,
        RangeChartComponent,
        BubbleChartComponent,
        CandleChartComponent
        //QueryComponent
    ],
    imports: [
        CommonModule
    ],
    providers: [
        UtilsService
    ],
    exports: [
        LineChartComponent,
        RowChartComponent,
        PieChartComponent,
        SandChartComponent,
        BarChartComponent,
        RangeChartComponent,
        BubbleChartComponent,
        CandleChartComponent
        //QueryComponent
    ]
})
export class DcjsModule {}