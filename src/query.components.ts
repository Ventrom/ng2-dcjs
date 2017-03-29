import { AfterViewInit, ContentChildren, Directive, Input, OnDestroy, OnInit, QueryList, forwardRef } from '@angular/core';

declare require: any
const dc = require('universe')

@Directive({
    selector: 'query'
})
export class QueryComponent {
    @Input() datasource: any // universe instance
    @Input() groupBy: any
    @Input() select: any
    @Input() filter: any
    @ContentChildren()
}